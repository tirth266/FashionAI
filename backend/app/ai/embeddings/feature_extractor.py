import torch
import numpy as np
from app.ai.models.regnet_model import get_model
from app.ai.preprocessing.image_preprocessor import ImagePreprocessor

class FeatureExtractor:
    def __init__(self):
        self.model = None
        self.preprocessor = ImagePreprocessor()
        self.device = torch.device("cpu") # Force CPU for memory efficiency on Render

    def _load_model(self):
        if self.model is None:
            self.model = get_model()
            self.model.to(self.device)

    def extract(self, image_path):
        self._load_model()
        tensor = self.preprocessor.preprocess(image_path).to(self.device)
        with torch.no_grad():
            embedding = self.model(tensor)
        
        # Convert to numpy and normalize
        embedding = embedding.cpu().numpy().flatten()
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
            
        return embedding.tolist()
