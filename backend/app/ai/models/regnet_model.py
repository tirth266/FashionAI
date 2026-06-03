import torch
import torch.nn as nn
from torchvision import models

class RegNetFeatureExtractor(nn.Module):
    def __init__(self):
        super(RegNetFeatureExtractor, self).__init__()
        # Load lightweight pretrained RegNetY-400MF (~16MB vs ~300MB for 16GF)
        self.model = models.regnet_y_400mf(weights=models.RegNet_Y_400MF_Weights.IMAGENET1K_V2)
        
        # Remove the classification head (fc layer)
        self.model.fc = nn.Identity()

    def forward(self, x):
        # Output will be the 3024-dimensional feature vector for RegNetY-16GF
        return self.model(x)

def get_model():
    model = RegNetFeatureExtractor()
    model.eval()
    return model
