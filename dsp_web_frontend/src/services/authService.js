import api from './apiClient';

/**
 * Expected backend interface:
 * - POST /auth/signup with body { name, email, password }
 * - POST /auth/login with body { email, password }
 * Returns shape: { success: boolean, token?: string, data?: object, message?: string }
 * Diagnostics: apiClient logs [API] Request URL for /auth/* endpoints.
 */

/**
 * PUBLIC_INTERFACE
 * login calls backend to authenticate user.
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  // Normalize to always return { success, token, data, message }
  return {
    success: !!data?.success,
    token: data?.token,
    data: data?.data,
    message: data?.message,
  };
}

/**
 * PUBLIC_INTERFACE
 * signup registers a new user account.
 */
export async function signup(name, email, password) {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return {
    success: !!data?.success,
    token: data?.token,
    data: data?.data,
    message: data?.message,
  };
}

/**
 * PUBLIC_INTERFACE
 * logout (best-effort); backend may or may not have a logout endpoint.
 */
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore
  }
}
