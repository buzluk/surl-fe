import React from 'react';

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">Surl</span>
        </div>

        {(title || subtitle) && (
          <div style={{ marginBottom: '1.75rem' }}>
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;