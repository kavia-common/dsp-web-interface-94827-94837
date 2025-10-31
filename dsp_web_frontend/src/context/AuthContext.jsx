import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as storage from '../utils/storage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth returns auth state and actions.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages tokens and user data with persistence.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.get('auth_token'));
  const [user, setUser] = useState(() => {
    const u = storage.get('auth_user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) storage.set('auth_token', token);
    else storage.remove('auth_token');
  }, [token]);

  useEffect(() => {
    if (user) storage.set('auth_user', JSON.stringify(user));
    else storage.remove('auth_user');
  }, [user]);

  const isAuthenticated = !!token;

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      // TODO: Confirm response shape: expecting { token, user }
      setToken(res.token);
      setUser(res.user || { email });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const signup = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.signup(email, password);
      // Optionally auto-login on signup if API returns token
      if (res.token) {
        setToken(res.token);
        setUser(res.user || { email });
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken(null);
    setUser(null);
    authService.logout(); // best-effort; might be no-op
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, signup, logout, loading }),
    [token, user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
