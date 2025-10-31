import api from './apiClient';

// TODO: Confirm final backend endpoints and response shapes.
// Assumptions below:
// POST /auth/login { email, password } -> { token, user }
// POST /auth/signup { email, password } -> { token?, user? }
// POST /auth/logout -> 204

/**
 * PUBLIC_INTERFACE
 * login calls backend to authenticate user.
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

/**
 * PUBLIC_INTERFACE
 * signup registers a new user account.
 */
export async function signup(email, password) {
  const { data } = await api.post('/auth/signup', { email, password });
  return data;
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
