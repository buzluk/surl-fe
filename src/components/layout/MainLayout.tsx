import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="main-layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-text">Surl</span>
          </Link>

          <div className="navbar-right">
            <div className="user-badge">
              <div className="user-avatar">{initials}</div>
              <span className="user-name">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              title="Logout"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;