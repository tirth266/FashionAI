import axios from 'axios'

/**
 * PRODUCTION SETUP:
 * VITE_API_BASE_URL should be set in Vercel to: https://your-backend.onrender.com/api
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Global error handler for axios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Prevent the browser from trying to navigate to the failed URL
    if (error.response && error.response.status === 404) {
      console.error('API Endpoint not found:', error.config.url);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
