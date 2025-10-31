import axios from 'axios';
import * as storage from '../utils/storage';

// Determine base URL:
// 1) Use explicit env var if provided.
// 2) If not provided, and running in browser, default to http://localhost:3010 to avoid mixed-host CORS issues.
const envBase = process.env.REACT_APP_API_BASE_URL;
let resolvedBaseURL = envBase && envBase.trim() ? envBase.trim() : '';

if (!resolvedBaseURL && typeof window !== 'undefined' && window?.location) {
  // Prefer HTTPS backend when the page is loaded over HTTPS to avoid mixed-content blocks.
  // Otherwise default to HTTP.
  const isPageHttps = window.location.protocol === 'https:';
  const defaultProtocol = isPageHttps ? 'https:' : 'http:';
  const defaultHost = 'localhost';
  // Use 3011 for HTTPS backend, 3010 for HTTP backend by convention in this project.
  const defaultPort = isPageHttps ? 3011 : 3010;
  resolvedBaseURL = `${defaultProtocol}//${defaultHost}:${defaultPort}`;
}

// Development-time diagnostic log to help identify baseURL issues
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[API] Base URL resolved to:', resolvedBaseURL || '(empty)');
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
  // Extra diagnostics: log full URL for auth endpoints
  try {
    const base = config.baseURL || resolvedBaseURL || '';
    const fullUrl = base ? new URL(config.url, base).toString() : config.url;
    if (config?.url?.startsWith('/auth/')) {
      // eslint-disable-next-line no-console
      console.log('[API] Request URL:', fullUrl);
    }
  } catch {
    // ignore URL construction issues
  }
  return config;
});

// Enhance error handling to better surface network vs backend errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Network error (no response)
    if (err?.request && !err?.response) {
      const isCORSNetworkErr =
        String(err?.message || '').toLowerCase().includes('network error') ||
        (err?.code === 'ERR_NETWORK' && !err?.response);
      const details = {
        message: err?.message,
        code: err?.code,
        name: err?.name,
      };
      const httpsHint = (typeof window !== 'undefined' && window.location?.protocol === 'https:') ?
        ' Note: Your page is loaded over HTTPS. Calls to an HTTP backend may be blocked (Mixed Content). Use an HTTPS backend URL or load the frontend over HTTP for local dev.' : '';
      const hint = isCORSNetworkErr
        ? `Network error. Check backend URL (${resolvedBaseURL}), that the server is running on port 3010, and that CORS/preflight allows your origin.${httpsHint} Details: ${JSON.stringify(details)}`
        : `Network error. Unable to reach the server.${httpsHint} Details: ${JSON.stringify(details)}`;
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
