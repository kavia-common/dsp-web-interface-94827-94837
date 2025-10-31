import React from 'react';

/**
 * Button with primary style
 */
export default function Button({ children, loading, ...props }) {
  return (
    <button className="btn-primary" disabled={loading || props.disabled} {...props}>
      {loading ? 'Loading…' : children}
    </button>
  );
}
