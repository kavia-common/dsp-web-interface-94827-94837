import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar component with brand, theme toggle, and logout control.
 */
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const appName = process.env.REACT_APP_APP_NAME || 'DSP Web UI';

  const handleLogout = () => {
    // Clear auth state and go to login
    logout();
    navigate('/login');
  };

  const showAuthLinks = !isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-accent">●</span> {appName}
        </Link>
        <div className="nav-spacer" />
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {isAuthenticated && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
        {showAuthLinks && (
          <Link className="link" to={location.pathname === '/login' ? '/signup' : '/login'}>
            {location.pathname === '/login' ? 'Sign up' : 'Log in'}
          </Link>
        )}
      </div>
    </nav>
  );
}
