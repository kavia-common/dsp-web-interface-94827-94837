import axios from 'axios';
import * as storage from '../utils/storage';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Axios instance configured for DSP backend
 */
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach bearer token if present
api.interceptors.request.use((config) => {
  const token = storage.get('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const backend = err?.response?.data;
    // Prefer backend "message", fall back to typical error message
    const msg = (backend && (backend.message || backend.error)) || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export default api;
