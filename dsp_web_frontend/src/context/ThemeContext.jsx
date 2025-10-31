import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as storage from '../utils/storage';

const ThemeContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useTheme provides theme state and toggler.
 */
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * PUBLIC_INTERFACE
 * ThemeProvider controls light/dark mode via data-theme attribute.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
