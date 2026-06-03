import Recommendation from '../models/Recommendation.js';
import { getAiRecommendations } from './aiService.js';

export const createRecommendation = async (userId, imageUrl, imagePath) => {
  const recommendations = await getAiRecommendations(imagePath);
  
  // Extract IDs to save in the database
  const recommendedItemIds = recommendations.map(item => item.id);

  const recommendation = await Recommendation.create({
    userId,
    originalImage: imageUrl,
    recommendedItems: recommendedItemIds,
  });

  // Populate the recommendedItems to get full details from our DB
  const populated = await recommendation.populate('recommendedItems');
  
  // Return the populated recommendation along with similarity scores from AI service
  const result = populated.toObject();
  result.recommendations = recommendations; // Include the AI service's formatted response
  
  return result;
};

export const getUserRecommendations = async (userId) => {
  return await Recommendation.find({ userId })
    .populate('recommendedItems')
    .sort({ createdAt: -1 });
};
