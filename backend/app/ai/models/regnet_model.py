import torch
import torch.nn as nn
from torchvision import models

class RegNetFeatureExtractor(nn.Module):
    def __init__(self):
        super(RegNetFeatureExtractor, self).__init__()
        # Load pretrained RegNetY-16GF
        self.model = models.regnet_y_16gf(weights=models.RegNet_Y_16GF_Weights.IMAGENET1K_V2)
        
        # Remove the classification head (fc layer)
        # RegNet has a 'fc' attribute for classification
        self.model.fc = nn.Identity()

    def forward(self, x):
        # Output will be the 3024-dimensional feature vector for RegNetY-16GF
        return self.model(x)

def get_model():
    model = RegNetFeatureExtractor()
    model.eval()
    return model
