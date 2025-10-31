import React from 'react';

/**
 * ChatTranscript renders a basic list of exchanges
 */
export default function ChatTranscript({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="card" style={{ padding: 16 }}>
      {items.map((it, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>You</div>
          <div style={{ marginBottom: 8 }}>{it.prompt}</div>
          <div style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>DSP</div>
          <div>{it.response}</div>
        </div>
      ))}
    </div>
  );
}
