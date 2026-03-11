import axios from 'axios';

const api = axios.create({
  // Same-origin: Next.js rewrites /api/v1/* → backend localhost:5000/api/v1/*
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('arwapark_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('arwapark_token');
      localStorage.removeItem('arwapark_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
