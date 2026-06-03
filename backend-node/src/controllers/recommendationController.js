import { sendSuccess, sendError } from '../utils/response.js';
import { createRecommendation, getUserRecommendations } from '../services/recommendationService.js';
import User from '../models/User.js';
import FashionItem from '../models/FashionItem.js';
import { getImageUrl } from '../services/imageService.js';

export const getRecommendations = async (req, res) => {
  let { imageUrl, imagePath } = req.body;

  // Handle direct file upload if present
  if (req.file) {
    imagePath = req.file.path;
    if (!imageUrl) {
      imageUrl = getImageUrl(req, req.file.filename);
    }
  }

  if (!imagePath) {
    return sendError(res, 'Image path or uploaded file is required', 400);
  }

  try {
    const recommendation = await createRecommendation(req.user._id, imageUrl, imagePath);
    sendSuccess(res, 'Recommendations generated successfully', recommendation);
  } catch (error) {
    sendError(res, error.message);
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getUserRecommendations(req.user._id);
    sendSuccess(res, 'Recommendation history fetched', history);
  } catch (error) {
    sendError(res, error.message);
  }
};

export const toggleFavorite = async (req, res) => {
  const { itemId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const item = await FashionItem.findById(itemId);

    if (!item) {
      return sendError(res, 'Fashion item not found', 404);
    }

    const isFavorite = user.favorites.includes(itemId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== itemId);
    } else {
      user.favorites.push(itemId);
    }

    await user.save();
    sendSuccess(res, isFavorite ? 'Removed from favorites' : 'Added to favorites', user.favorites);
  } catch (error) {
    sendError(res, error.message);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    sendSuccess(res, 'Favorite items fetched', user.favorites);
  } catch (error) {
    sendError(res, error.message);
  }
};
