import axios from 'axios';
import * as storage from '../utils/storage';

// Determine base URL:
// 1) Use explicit env var if provided.
// 2) If not provided, and running in browser, default to same-origin root.
const envBase = process.env.REACT_APP_API_BASE_URL;
let resolvedBaseURL = envBase && envBase.trim() ? envBase.trim() : '';

if (!resolvedBaseURL && typeof window !== 'undefined' && window?.location) {
  const { protocol, hostname } = window.location;
  // Common local backend port default is 3010 as per backend config.
  // If the frontend is on 3000 and backend on 3010, default to 3010.
  const defaultPort = 3010;
  resolvedBaseURL = `${protocol}//${hostname}:${defaultPort}`;
}

/**
 * Axios instance configured for DSP backend
 */
const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // withCredentials can be toggled via env if needed for cookie auth
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

// Enhance error handling to better surface network vs backend errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Network error (no response)
    if (err?.request && !err?.response) {
      const isCORS = String(err?.message || '').toLowerCase().includes('network error');
      const hint = isCORS
        ? 'Network error. Check backend URL, server running, and CORS settings.'
        : 'Network error. Unable to reach the server.';
      return Promise.reject(new Error(hint));
    }
    const status = err?.response?.status;
    const backend = err?.response?.data;
    const msg =
      (backend && (backend.message || backend.error)) ||
      (status ? `Request failed with status ${status}` : err.message || 'Request failed');

    return Promise.reject(new Error(msg));
  }
);

export default api;
