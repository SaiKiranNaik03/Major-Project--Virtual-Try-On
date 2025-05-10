import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Function to read and parse JSON files from a directory
const readJsonFiles = (directory: string): any[] => {
  try {
    const files = fs.readdirSync(directory);
    const products: any[] = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(directory, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const product = JSON.parse(fileContent);
          if (product.data) {
            // Extract only the necessary fields
            const productData = {
              id: product.data.id,
              price: product.data.price,
              discountedPrice: product.data.discountedPrice,
              productDisplayName: product.data.productDisplayName,
              brandName: product.data.brandName,
              baseColour: product.data.baseColour,
              gender: product.data.gender,
              usage: product.data.usage,
              styleImages: product.data.styleImages,
              articleType: product.data.articleType,
              masterCategory: product.data.masterCategory,
              subCategory: product.data.subCategory,
              myntraRating: product.data.myntraRating,
              articleNumber: product.data.articleNumber,
              displayCategories: product.data.displayCategories,
              season: product.data.season,
              size_representation: product.data.size_representation,
              productDescriptors: product.data.productDescriptors,
              articleAttributes: product.data.articleAttributes,
              styleOptions: product.data.styleOptions,
              brandUserProfile: product.data.brandUserProfile
            };
            products.push(productData);
          }
        } catch (error) {
          console.error(`Error parsing ${file}:`, error);
        }
      }
    });

    return products;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
};

// Get all men's products
router.get('/men', (req, res) => {
  try {
    // Update the path to point to the correct location
    const menProductsDir = path.join(__dirname, '../../../Dataset/Men');
    console.log('Reading from directory:', menProductsDir); // Debug log
    
    if (!fs.existsSync(menProductsDir)) {
      console.error('Directory does not exist:', menProductsDir);
      return res.status(500).json({ 
        success: false, 
        error: 'Dataset directory not found' 
      });
    }

    let products = readJsonFiles(menProductsDir);

    // Optional: Shuffle for variety
    products = products.sort(() => Math.random() - 0.5);

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      data: paginatedProducts,
      total: products.length,
      totalPages: Math.ceil(products.length / limit)
    });
  } catch (error) {
    console.error('Error fetching men\'s products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all women's products
router.get('/women', (req, res) => {
  try {
    // Update the path to point to the correct location
    const womenProductsDir = path.join(__dirname, '../../../Dataset/Women');
    console.log('Reading from directory:', womenProductsDir); // Debug log
    
    if (!fs.existsSync(womenProductsDir)) {
      console.error('Directory does not exist:', womenProductsDir);
      return res.status(500).json({ 
        success: false, 
        error: 'Dataset directory not found' 
      });
    }

    const products = readJsonFiles(womenProductsDir);
    
    // Group products by articleType
    const productsByType = products.reduce((acc, product) => {
      const type = product.articleType.typeName;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(product);
      return acc;
    }, {});

    // Get a diverse selection of products
    const diverseProducts = [];
    const types = Object.keys(productsByType);
    
    // For each type, take a few products
    types.forEach(type => {
      const typeProducts = productsByType[type];
      // Take up to 3 products from each type
      const selectedProducts = typeProducts.slice(0, 3);
      diverseProducts.push(...selectedProducts);
    });

    // Shuffle the products to mix different types
    const shuffledProducts = diverseProducts.sort(() => Math.random() - 0.5);

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = shuffledProducts.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      data: paginatedProducts,
      total: shuffledProducts.length,
      totalPages: Math.ceil(shuffledProducts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching women\'s products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Latest Collections
router.get('/latest', (req, res) => {
  try {
    // Update the path to point to the correct location
    const latestProductsDir = path.join(__dirname, '../../../Dataset/Latest Collections');
    console.log('Reading from directory:', latestProductsDir); // Debug log
    
    if (!fs.existsSync(latestProductsDir)) {
      console.error('Directory does not exist:', latestProductsDir);
      return res.status(500).json({ 
        success: false, 
        error: 'Dataset directory not found' 
      });
    }

    let products = readJsonFiles(latestProductsDir);

    // Optional: Shuffle for variety
    products = products.sort(() => Math.random() - 0.5);

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      data: paginatedProducts,
      total: products.length,
      totalPages: Math.ceil(products.length / limit)
    });
  } catch (error) {
    console.error('Error fetching latest products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const productId = req.params.id;
    const datasetDir = path.join(__dirname, '../../../Dataset');
    
    // Search in all subdirectories
    const searchInDirectory = (dir: string): any => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          // Recursively search in subdirectories
          const result = searchInDirectory(filePath);
          if (result) return result;
        } else if (file.endsWith('.json')) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const product = JSON.parse(fileContent);
          if (product.data && product.data.id.toString() === productId) {
            return product.data;
          }
        }
      }
      return null;
    };

    const product = searchInDirectory(datasetDir);
    
    if (product) {
      res.json({ 
        success: true, 
        data: {
          id: product.id,
          price: product.price,
          discountedPrice: product.discountedPrice,
          productDisplayName: product.productDisplayName,
          brandName: product.brandName,
          baseColour: product.baseColour,
          gender: product.gender,
          usage: product.usage,
          styleImages: product.styleImages,
          articleType: product.articleType,
          masterCategory: product.masterCategory,
          subCategory: product.subCategory,
          myntraRating: product.myntraRating,
          articleNumber: product.articleNumber,
          displayCategories: product.displayCategories,
          season: product.season,
          size_representation: product.size_representation,
          productDescriptors: product.productDescriptors,
          articleAttributes: product.articleAttributes,
          styleOptions: product.styleOptions,
          brandUserProfile: product.brandUserProfile
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 