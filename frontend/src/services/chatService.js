import api from './api';

/**
 * Sends a message to the AI Stylist chatbot
 * @param {string} message - The user's message
 * @param {Array} history - Chat history in format [{role: 'user', content: '...'}, {role: 'model', content: '...'}]
 * @returns {Promise<Object>} - The backend response
 */
export const sendMessage = async (message, history = []) => {
  try {
    const response = await api.post('/chat/', { message, history });
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI Stylist:', error);
    // Standardize error message for UI
    const errorMessage = error.response?.data?.error || error.message || 'The stylist is currently unavailable. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Checks the health of the chat backend
 * @returns {Promise<Object>}
 */
export const checkChatHealth = async () => {
  try {
    const response = await api.get('/chat/health');
    return response.data;
  } catch (error) {
    console.error('Chat health check failed:', error);
    return { status: 'error', gemini: 'disconnected' };
  }
};
