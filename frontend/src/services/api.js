import axios from 'axios'

/**
 * CENTRALIZED API CONFIGURATION
 * 
 * Ensures all requests target the correct backend (Local vs Render)
 * based on the VITE_API_BASE_URL environment variable.
 */

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debugging log (Visible in browser console)
console.log("DEBUG: Initializing API with VITE_API_BASE_URL =", VITE_API_BASE_URL);

if (!VITE_API_BASE_URL && import.meta.env.PROD) {
  console.error("FATAL ERROR: VITE_API_BASE_URL is not configured in Vercel.");
}

const baseURL = VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    console.error(`API ERROR [${originalRequest.method.toUpperCase()}] ${originalRequest.url}:`, error.message);
    
    // Standardize error format for the application
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({ ...error, message });
  }
);

// Add global request interceptor for JWT authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
