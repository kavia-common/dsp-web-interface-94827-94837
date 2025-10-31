import React from 'react';

/**
 * ErrorBanner shows an inline error message
 */
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="error-banner" role="alert">{message}</div>;
}
