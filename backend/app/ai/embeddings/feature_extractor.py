import torch
import numpy as np
from app.ai.models.regnet_model import get_model
from app.ai.preprocessing.image_preprocessor import ImagePreprocessor

class FeatureExtractor:
    def __init__(self):
        self.model = get_model()
        self.preprocessor = ImagePreprocessor()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def extract(self, image_path):
        tensor = self.preprocessor.preprocess(image_path).to(self.device)
        with torch.no_grad():
            embedding = self.model(tensor)
        
        # Convert to numpy and normalize
        embedding = embedding.cpu().numpy().flatten()
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
            
        return embedding.tolist()
