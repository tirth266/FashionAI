import os
import torch
from app.ai.embeddings.feature_extractor import FeatureExtractor
from app.models.fashion_item_model import FashionItem
from PIL import Image

def seed_database(dataset_path):
    """
    Scans a folder of images, extracts embeddings using RegNet,
    and stores them in MongoDB.
    """
    extractor = FeatureExtractor()
    
    if not os.path.exists(dataset_path):
        print(f"Dataset path {dataset_path} not found.")
        return

    for category in os.listdir(dataset_path):
        category_path = os.path.join(dataset_path, category)
        if not os.path.isdir(category_path):
            continue
            
        print(f"Processing category: {category}")
        for image_name in os.listdir(category_path):
            if not image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
                
            image_path = os.path.join(category_path, image_name)
            
            try:
                # 1. Extract Embedding
                embedding = extractor.extract(image_path)
                
                # 2. Create DB Entry
                item_data = {
                    "name": image_name.split('.')[0],
                    "category": category,
                    "brand": "Generic",
                    "price": 49.99,
                    "image_url": f"/static/dataset/{category}/{image_name}",
                    "embedding": embedding
                }
                
                FashionItem.create(item_data)
                print(f"  Indexed: {image_name}")
                
            except Exception as e:
                print(f"  Error processing {image_name}: {e}")

if __name__ == "__main__":
    # Example usage: python -m app.ai.training.train
    # Assuming images are in backend/dataset/tops/, backend/dataset/bottoms/, etc.
    seed_database("dataset")
