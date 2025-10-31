import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-card" role="alert">
      <h2 style={{ marginTop: 0 }}>Page not found</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        The page you are looking for doesn't exist.
      </p>
      <Link className="link" to="/">Go home</Link>
    </div>
  );
}
