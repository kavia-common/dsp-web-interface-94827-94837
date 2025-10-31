import React from 'react';

/**
 * Fullscreen loading overlay
 */
export default function LoadingOverlay({ text = 'Processing…' }) {
  return (
    <div className="loading-overlay">
      <div className="loading-box">{text}</div>
    </div>
  );
}
