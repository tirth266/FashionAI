import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import logging
import os
import gc
import threading

# Optimize PyTorch CPU memory usage
torch.set_num_threads(1)

logger = logging.getLogger(__name__)

class FashionSimilarityService:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FashionSimilarityService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._model = None
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        self._initialized = True

    def _load_model(self):
        try:
            logger.info("Loading MobileNet_V3_Large model into memory...")
            model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.IMAGENET1K_V2)
            # Remove the classification head (classifier)
            model.classifier = nn.Identity()
            model.to(self.device)
            model.eval()
            self._model = model
            logger.info(f"Model loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise

    def extract_features(self, image_file):
        """
        Extract normalized embedding vector from an image file.
        Uses a threading lock to prevent concurrent memory spikes on 512MB instances.
        """
        with self._lock:
            try:
                # 1. Load model right before extraction
                if self._model is None:
                    self._load_model()
                    
                # 2. Process image
                image = Image.open(image_file).convert('RGB')
                img_tensor = self.transform(image).unsqueeze(0).to(self.device)
                
                # 3. Extract features
                with torch.no_grad():
                    features = self._model(img_tensor)
                
                # 4. Normalize
                embedding = features.cpu().numpy().flatten()
                norm = np.linalg.norm(embedding)
                if norm > 0:
                    embedding = embedding / norm
                    
                # 5. MEMORY OPTIMIZATION: Unload model to prevent Render OOM on 512MB instances
                logger.info("Unloading PyTorch model from memory to save RAM...")
                del self._model
                self._model = None
                gc.collect()
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                    
                return embedding
            except Exception as e:
                logger.error(f"Feature extraction failed: {str(e)}", exc_info=True)
                # Ensure model is cleaned up even if extraction fails
                if self._model is not None:
                    del self._model
                    self._model = None
                    gc.collect()
                raise

fashion_similarity_service = FashionSimilarityService()
