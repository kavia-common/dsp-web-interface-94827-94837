import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ensure a default theme attribute on mount; ThemeProvider will manage later
if (!document.documentElement.getAttribute('data-theme')) {
  document.documentElement.setAttribute('data-theme', 'light');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
