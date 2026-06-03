import { sendSuccess, sendError } from '../utils/response.js';
import { getImageUrl } from '../services/imageService.js';

export const uploadImage = (req, res) => {
  if (!req.file) {
    return sendError(res, 'Please upload an image', 400);
  }

  const imageUrl = getImageUrl(req, req.file.filename);

  sendSuccess(res, 'Image uploaded successfully', {
    imageUrl,
    filename: req.file.filename,
    path: req.file.path
  });
};
