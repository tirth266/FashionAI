import api from './api';

/**
 * Uploads a fashion image to get similar product recommendations.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise} - The API response with recommendations.
 */
export const uploadFashionImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/recommendations/similar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading fashion image:', error);
    throw error.response?.data || { error: 'Failed to connect to the server' };
  }
};

export default {
  uploadFashionImage,
};
