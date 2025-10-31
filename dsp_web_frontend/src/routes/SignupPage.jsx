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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!isStrongPassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const res = await signup(email, password);
    if (res.ok) {
      navigate('/login');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ marginTop: 0 }}>Create your account</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>Sign up to get started</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <ErrorBanner message={error} />
        <label>
          <div className="visually-hidden">Email</div>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
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
