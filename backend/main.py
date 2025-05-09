from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import sys
import os
import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
import tempfile
from PIL import Image
import io
import cv2

# Add ML directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ML'))

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directories
app.mount("/ML", StaticFiles(directory=os.path.join(os.path.dirname(__file__), '..', 'ML')), name="ML")
app.mount("/test", StaticFiles(directory=os.path.dirname(__file__)), name="test")

# Initialize variables
model = None
Image_features = None
filenames = None
neighbors = None

def extract_features_from_image(img_array, model):
    try:
        img_expand_dim = np.expand_dims(img_array, axis=0)
        img_preprocess = preprocess_input(img_expand_dim)
        result = model.predict(img_preprocess).flatten()
        norm_result = result/norm(result)
        return norm_result
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        raise

def load_ml_model():
    global model, Image_features, filenames, neighbors
    try:
        print("Loading ML model and features...")
        # Initialize ResNet50 model
        model = ResNet50(weights='imagenet', include_top=False, input_shape=(224,224,3))
        model.trainable = False
        model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])

        # Load pre-computed features and filenames from ML folder
        ml_dir = os.path.join(os.path.dirname(__file__), '..', 'ML')
        features_path = os.path.join(ml_dir, 'Images_features.pkl')
        filenames_path = os.path.join(ml_dir, 'filenames.pkl')

        if os.path.exists(features_path) and os.path.exists(filenames_path):
            print("Loading features and filenames...")
            Image_features = pkl.load(open(features_path, 'rb'))
            filenames = pkl.load(open(filenames_path, 'rb'))
            
            print("Initializing KNN model...")
            neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
            neighbors.fit(Image_features)
            print("ML model loaded successfully!")
            return True
        else:
            print(f"ML files not found at {features_path} or {filenames_path}")
            return False
    except Exception as e:
        print(f"Error loading ML model: {str(e)}")
        return False

def get_fallback_recommendations(product_id: int):
    """Get fallback recommendations when ML model is not available"""
    try:
        # Get all product IDs from the Dataset/styles directory
        styles_dir = os.path.join('..', 'Dataset', 'styles')
        all_products = [f.split('.')[0] for f in os.listdir(styles_dir) if f.endswith('.json')]
        
        # Remove the current product ID from the list
        all_products = [p for p in all_products if p != str(product_id)]
        
        # Randomly select 5 products
        recommended_ids = random.sample(all_products, min(5, len(all_products)))
        
        # Convert to integers
        return [int(id) for id in recommended_ids]
    except Exception as e:
        print(f"Error getting fallback recommendations: {str(e)}")
        return []

@app.post("/api/recommend")
async def get_recommendations(file: UploadFile = File(...)):
    try:
        print(f"Received image for recommendations: {file.filename}")
        
        if not model or Image_features is None or filenames is None:
            print("ML model not loaded, attempting to load...")
            if not load_ml_model():
                raise HTTPException(status_code=500, detail="ML model not available")

        # Read and process the uploaded image
        contents = await file.read()
        try:
            img = Image.open(io.BytesIO(contents))
            img = img.resize((224, 224))  # Resize to match model input
            img_array = np.array(img)
            
            # Ensure image has 3 channels (RGB)
            if len(img_array.shape) == 2:  # If grayscale
                img_array = np.stack((img_array,) * 3, axis=-1)
            elif img_array.shape[2] == 4:  # If RGBA
                img_array = img_array[:, :, :3]
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Extract features from the input image
        try:
            input_features = extract_features_from_image(img_array, model)
        except Exception as e:
            print(f"Error extracting features: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing image features")
        
        # Get recommendations using KNN
        try:
            distance, indices = neighbors.kneighbors([input_features])
        except Exception as e:
            print(f"Error getting KNN recommendations: {str(e)}")
            raise HTTPException(status_code=500, detail="Error getting recommendations")
        
        # Get recommended product IDs (excluding the input image)
        recommended_ids = []
        for i in range(1, 6):  # Skip first one as it's the input image
            try:
                filename = filenames[indices[0][i]]
                # Extract the product ID from the filename
                product_id = int(os.path.splitext(os.path.basename(filename))[0])
                recommended_ids.append(product_id)
            except (ValueError, IndexError) as e:
                print(f"Error processing filename {filename}: {str(e)}")
                continue
        
        if not recommended_ids:
            raise HTTPException(status_code=500, detail="No valid recommendations found")
            
        print(f"Recommended product IDs: {recommended_ids}")
        return recommended_ids
        
    except Exception as e:
        print(f"Error processing recommendation request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Try to load ML model on startup
load_ml_model()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 