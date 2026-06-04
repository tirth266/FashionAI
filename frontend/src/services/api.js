import axios from 'axios'

// In production (Vercel), VITE_API_BASE_URL should be set to your Render URL + /api
// e.g., https://fashion-ai-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Log outgoing requests in development to help debug 404s
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('Starting Request', request.method.toUpperCase(), request.baseURL + request.url)
    return request
  })
}

export default api
