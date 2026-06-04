import axios from 'axios'

/**
 * API SERVICE CONFIGURATION
 * 
 * In Production (Vercel):
 * VITE_API_BASE_URL must be set to your Render URL + /api
 * Example: https://fashionai-backend-yzqb.onrender.com/api
 */

let baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Safety: Clean up URL if it ends with a slash to prevent double slashes in paths
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.status, error.config?.url);
    }

    // Standardize error object
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({ ...error, message });
  }
);

// Global request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
