import os
import json
import shutil
from pathlib import Path

def is_clothing_product(product_data):
    # List of categories that are considered clothing
    clothing_categories = {
        'tops', 't-shirts', 'shirts', 'blouses', 'sweaters', 'hoodies', 'jackets', 'coats',
        'dresses', 'skirts', 'pants', 'jeans', 'shorts', 'leggings', 'jumpsuits', 'rompers',
        'suits', 'formal wear', 'casual wear', 'activewear', 'swimwear', 'sleepwear',
        'underwear', 'lingerie', 'socks', 'stockings', 'tights'
    }
    
    # Check if the product has a category field
    if 'category' in product_data:
        category = product_data['category'].lower()
        return any(clothing_type in category for clothing_type in clothing_categories)
    
    # Check if the product has a type field
    if 'type' in product_data:
        product_type = product_data['type'].lower()
        return any(clothing_type in product_type for clothing_type in clothing_categories)
    
    # Check if the product has a name/title field
    name_fields = ['name', 'title', 'product_name', 'product_title']
    for field in name_fields:
        if field in product_data:
            name = product_data[field].lower()
            return any(clothing_type in name for clothing_type in clothing_categories)
    
    return False

def is_accessory(product_data):
    # List of categories that are considered accessories
    accessory_categories = {
        'accessories', 'jewelry', 'watches', 'bags', 'wallets', 'belts', 'scarves',
        'gloves', 'hats', 'caps', 'sunglasses', 'eyewear', 'hair accessories',
        'hair clips', 'hair bands', 'hair ties', 'necklaces', 'bracelets', 'earrings',
        'rings', 'anklets', 'brooches', 'pins', 'ties', 'bow ties', 'cufflinks',
        'gloves', 'mittens', 'socks', 'stockings', 'tights', 'shoes', 'sandals',
        'boots', 'sneakers', 'heels', 'flats', 'loafers', 'mules', 'pumps'
    }
    
    # Check if the product has a category field
    if 'category' in product_data:
        category = product_data['category'].lower()
        return any(accessory_type in category for accessory_type in accessory_categories)
    
    # Check if the product has a type field
    if 'type' in product_data:
        product_type = product_data['type'].lower()
        return any(accessory_type in product_type for accessory_type in accessory_categories)
    
    # Check if the product has a name/title field
    name_fields = ['name', 'title', 'product_name', 'product_title']
    for field in name_fields:
        if field in product_data:
            name = product_data[field].lower()
            return any(accessory_type in name for accessory_type in accessory_categories)
    
    return False

def remove_accessories():
    # Path to the Latest Collections folder
    latest_collections_dir = Path('Dataset/Latest Collections')
    
    # Create a backup directory for accessories
    backup_dir = latest_collections_dir / 'accessories_backup'
    backup_dir.mkdir(exist_ok=True)
    
    # Process each JSON file in the Latest Collections directory
    for json_file in latest_collections_dir.glob('*.json'):
        try:
            # Read the JSON file
            with open(json_file, 'r', encoding='utf-8') as f:
                product_data = json.load(f)
            
            # Check if it's an accessory
            if is_accessory(product_data):
                # Move the file to the backup directory
                shutil.move(str(json_file), str(backup_dir / json_file.name))
                print(f"Moved {json_file.name} to accessories backup - It's an accessory")
            
        except json.JSONDecodeError:
            print(f"Error: {json_file.name} is not a valid JSON file")
        except Exception as e:
            print(f"Error processing {json_file.name}: {str(e)}")

def organize_products():
    # Get the current directory
    current_dir = Path.cwd()
    
    # Create a directory for organized products if it doesn't exist
    organized_dir = current_dir / 'organized_products'
    organized_dir.mkdir(exist_ok=True)
    
    # Process each JSON file in the current directory
    for json_file in current_dir.glob('*.json'):
        try:
            # Read the JSON file
            with open(json_file, 'r', encoding='utf-8') as f:
                product_data = json.load(f)
            
            # Skip if it's not a clothing product
            if not is_clothing_product(product_data):
                print(f"Skipping {json_file.name} - Not a clothing product")
                continue
            
            # Determine the category
            category = 'uncategorized'
            if 'category' in product_data:
                category = product_data['category'].lower()
            elif 'type' in product_data:
                category = product_data['type'].lower()
            
            # Create category directory
            category_dir = organized_dir / category
            category_dir.mkdir(exist_ok=True)
            
            # Copy the file to the appropriate category directory
            shutil.copy2(json_file, category_dir / json_file.name)
            print(f"Organized {json_file.name} into {category} category")
            
        except json.JSONDecodeError:
            print(f"Error: {json_file.name} is not a valid JSON file")
        except Exception as e:
            print(f"Error processing {json_file.name}: {str(e)}")

if __name__ == "__main__":
    remove_accessories()
    organize_products() 