import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import logging
import os

logger = logging.getLogger(__name__)

class FashionSimilarityService:
    _instance = None

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

    @property
    def model(self):
        """Lazy load the model when first needed to save startup memory."""
        if self._model is None:
            self._load_model()
        return self._model

    def _load_model(self):
        try:
            logger.info("Lazy loading RegNet-Y-16GF model...")
            # Load pretrained RegNet-Y-16GF
            model = models.regnet_y_16gf(weights=models.RegNet_Y_16GF_Weights.IMAGENET1K_V2)
            # Remove the classification head
            model.fc = nn.Identity()
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
        """
        try:
            image = Image.open(image_file).convert('RGB')
            img_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                features = self.model(img_tensor) # Uses the lazy-loading property
            
            # Convert to numpy and normalize
            embedding = features.cpu().numpy().flatten()
            norm = np.linalg.norm(embedding)
            if norm > 0:
                embedding = embedding / norm
                
            return embedding
        except Exception as e:
            logger.error(f"Feature extraction failed: {str(e)}")
            raise

fashion_similarity_service = FashionSimilarityService()
