import os
import json
import shutil
import csv
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('organize_products.log'),
        logging.StreamHandler()
    ]
)

def get_product_categories(row):
    """Determine which categories the product belongs to based on CSV data."""
    categories = set()
    
    try:
        # Get product details from CSV row
        gender = row['gender'].lower()
        usage = row['usage'].lower()
        
        # Add gender-based category
        # if gender == 'men':
        #     categories.add('men')
        # elif gender == 'women':
        #     categories.add('women')
            
        # Check if it belongs in latest_collection
        if 'ethnic' in usage.lower() or 'formal' in usage.lower():
            categories.add('latest_collection')
            
    except Exception as e:
        logging.error(f"Error in get_product_categories: {str(e)}")
        
    return categories

def organize_products():
    try:
        # Create necessary directories
        base_dir = Path('Dataset')
        styles_dir = base_dir / 'styles'
        organized_dir = base_dir / 'organized_products'
        csv_file = base_dir / 'latestColl.csv'
        
        # Check if required files exist
        if not styles_dir.exists():
            logging.error(f"Styles directory not found at: {styles_dir}")
            return
        if not csv_file.exists():
            logging.error(f"CSV file not found at: {csv_file}")
            return
            
        logging.info(f"Found styles directory at: {styles_dir}")
        logging.info(f"Found CSV file at: {csv_file}")
        
        # Create category directories
        categories = ['men', 'women', 'latest_collection']

        for category in categories:
            category_dir = organized_dir / category
            category_dir.mkdir(parents=True, exist_ok=True)
            logging.info(f"Created directory: {category_dir}")
        
        # Read CSV file
        product_data = {}
        with open(csv_file, 'r', encoding='utf-8') as f:
            csv_reader = csv.DictReader(f)
            for row in csv_reader:
                product_data[row['id']] = row
        
        # Process each JSON file
        json_files = list(styles_dir.glob('*.json'))
        total_files = len(json_files)
        logging.info(f"Found {total_files} JSON files to process")
        
        for index, json_file in enumerate(json_files, 1):
            try:
                file_id = json_file.stem  # Get filename without extension
                logging.info(f"Processing file {index}/{total_files}: {json_file.name}")
                
                if file_id in product_data:
                    # Get categories for the product
                    categories = get_product_categories(product_data[file_id])
                    
                    # Copy file to each relevant category folder
                    for category in categories:
                        dest_path = organized_dir / category / json_file.name
                        shutil.copy2(json_file, dest_path)
                        logging.info(f"Copied {json_file.name} to {category} category")
                else:
                    logging.warning(f"Product ID {file_id} not found in CSV file")
                    
            except Exception as e:
                logging.error(f"Error processing {json_file.name}: {str(e)}")
                
    except Exception as e:
        logging.error(f"Error in organize_products: {str(e)}")

if __name__ == "__main__":
    try:
        logging.info("Starting product organization...")
        organize_products()
        logging.info("Product organization completed!")
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}") 