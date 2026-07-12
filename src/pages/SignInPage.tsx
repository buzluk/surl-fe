import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { useForm } from '../hooks/useForm';
import type { ISignInRequest } from '../types/account';

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { formData, handleChange } = useForm<ISignInRequest>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="form" id="login-form">

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="form-field">
          <label className="form-label" htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input"
            placeholder="your_username"
            required
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-full"
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>

      </form>

      <p className="auth-footer">
        Don't have an account?
        <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default SignInPage;
