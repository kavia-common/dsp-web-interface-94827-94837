const prefix = 'dsp_ui:';

/**
 * PUBLIC_INTERFACE
 * set persists a key to localStorage.
 */
export function set(key, value) {
  try {
    localStorage.setItem(prefix + key, value);
  } catch {
    // no-op
  }
}

/**
 * PUBLIC_INTERFACE
 * get fetches a key from localStorage.
 */
export function get(key) {
  try {
    return localStorage.getItem(prefix + key);
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * remove deletes a key from localStorage.
 */
export function remove(key) {
  try {
    localStorage.removeItem(prefix + key);
  } catch {
    // no-op
  }
}
