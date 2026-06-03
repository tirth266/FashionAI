import express from 'express';
import { 
  getRecommendations, 
  getFavorites, 
  getHistory,
  toggleFavorite
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All recommendation routes are protected
router.use(protect);

router.post('/recommend', upload.single('image'), getRecommendations);
router.get('/history', getHistory);
router.get('/favorites', getFavorites);
router.post('/favorites/toggle', toggleFavorite);

export default router;
