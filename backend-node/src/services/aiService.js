import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/index.js';

/**
 * Calls the external Python AI service to get recommendations based on an image.
 */
export const getAiRecommendations = async (imagePath) => {
  if (!config.aiServiceUrl) {
    throw new Error("AI_SERVICE_URL is not configured");
  }

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(`${config.aiServiceUrl}/api/recommend`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.data.success) {
      // The Python service returns full item objects, 
      // but the rest of the Node.js backend might expect just IDs or the full objects.
      // Looking at recommendationService.js, it expects IDs and then populates them.
      // However, the Python service is already returning the top 5 with all details.
      // If we want to store it in Recommendation model, we might need IDs.
      return response.data.recommendations;
    } else {
      throw new Error(response.data.error || 'AI service failed');
    }
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    throw error;
  }
};
