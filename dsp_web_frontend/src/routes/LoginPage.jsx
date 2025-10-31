import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

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
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    const res = await login(email, password);
    if (res.ok) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ marginTop: 0 }}>Welcome back</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>Log in to continue</p>
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
          <Button type="submit" loading={loading}>Log in</Button>
          <Link className="link" to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  );
}
