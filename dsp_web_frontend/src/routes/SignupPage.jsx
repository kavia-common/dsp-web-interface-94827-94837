import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';
import { isStrongPassword, isValidEmail } from '../utils/validators';

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!isStrongPassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      const res = await signup(name.trim(), email, password);
      if (res.ok) {
        // Requirement: On signup success, redirect to /login
        navigate('/login');
      } else {
        setError(res.error);
        // eslint-disable-next-line no-console
        console.warn('[Signup] Backend responded with error:', res.error);
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
      // eslint-disable-next-line no-console
      console.error('[Signup] Network/axios error:', err);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ marginTop: 0 }}>Create your account</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>Sign up to get started</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <ErrorBanner message={error} />
        <label>
          <div className="visually-hidden">Name</div>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>
        <label>
          <div className="visually-hidden">Email</div>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <div className="visually-hidden">Password</div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="auth-actions">
          <Button type="submit" loading={loading}>Sign up</Button>
          <Link className="link" to="/login">Have an account? Log in</Link>
        </div>
      </form>
    </div>
  );
}
