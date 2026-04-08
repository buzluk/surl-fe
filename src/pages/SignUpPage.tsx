import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postUser, checkEmailExists, checkUsernameExists } from '../services/userService';
import { useForm } from '../hooks/useForm';
import type { ISignUpRequest } from '../types/account';
import AuthLayout from '../components/layout/AuthLayout';

interface ICreateAccountFormData extends ISignUpRequest {
  confirmPassword: string;
}

function getStrength(pwd: string): { level: number; label: string } {
  if (pwd.length === 0) return { level: 0, label: '' };
  if (pwd.length < 6)   return { level: 1, label: 'Too short' };
  if (pwd.length < 8)   return { level: 2, label: 'Fair' };
  const hasUpper  = /[A-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
  const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (score >= 2 && pwd.length >= 10) return { level: 4, label: 'Strong' };
  if (score >= 1) return { level: 3, label: 'Good' };
  return { level: 2, label: 'Fair' };
}

const barClasses = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError]         = useState<string | null>(null);
  const [emailChecking, setEmailChecking]   = useState(false);
  const [usernameError, setUsernameError]   = useState<string | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const { formData, handleChange } = useForm<ICreateAccountFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const strength = getStrength(formData.password);

  const handleEmailBlur = async () => {
    const email = formData.email.trim();
    if (!email) return;
    setEmailError(null);
    setEmailChecking(true);
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailError('This email is already registered. Please sign in or use a different email.');
      }
    } catch {
      // Sessizce geç — submit sırasında sunucu zaten hata verecek
    } finally {
      setEmailChecking(false);
    }
  };

  const handleUsernameBlur = async () => {
    const username = formData.username.trim();
    if (!username) return;
    setUsernameError(null);
    setUsernameChecking(true);
    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        setUsernameError('This username is already taken. Please choose a different one.');
      }
    } catch {
      // Sessizce geç
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (emailError || usernameError) {
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      void confirmPassword;
      await postUser(registerData);
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || success || !!emailError || emailChecking || !!usernameError || usernameChecking;

  return (
    <AuthLayout title="Create account" subtitle="Get started for free">
      <form onSubmit={handleSubmit} className="form" id="create-account-form">

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status">
            <span>✓</span> Account created! Redirecting to sign in…
          </div>
        )}

        {/* Username */}
        <div className="form-field">
          <label className="form-label" htmlFor="create-username">Username</label>
          <div style={{ position: 'relative' }}>
            <input
              id="create-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => { setUsernameError(null); handleChange(e); }}
              onBlur={handleUsernameBlur}
              className={`input${usernameError ? ' input-error' : ''}`}
              placeholder="your_username"
              required
              disabled={loading}
              autoComplete="username"
            />
            {usernameChecking && (
              <span
                className="spinner"
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            )}
          </div>
          {usernameError && (
            <span className="field-error">{usernameError}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-field">
          <label className="form-label" htmlFor="create-email">Email</label>
          <div style={{ position: 'relative' }}>
            <input
              id="create-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => { setEmailError(null); handleChange(e); }}
              onBlur={handleEmailBlur}
              className={`input${emailError ? ' input-error' : ''}`}
              placeholder="you@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
            {emailChecking && (
              <span
                className="spinner"
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            )}
          </div>
          {emailError && (
            <span className="field-error">{emailError}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-field">
          <label className="form-label" htmlFor="create-password">Password</label>
          <input
            id="create-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            placeholder="Min. 6 characters"
            required
            disabled={loading}
            autoComplete="new-password"
          />
          {formData.password.length > 0 && (
            <>
              <div className="password-strength">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`strength-bar ${strength.level >= bar ? barClasses[strength.level] : ''}`}
                  />
                ))}
              </div>
              <span className="strength-label">{strength.label}</span>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-field">
          <label className="form-label" htmlFor="create-confirm">Confirm Password</label>
          <input
            id="create-confirm"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <button
          id="create-account-submit-btn"
          type="submit"
          disabled={isSubmitDisabled}
          className="btn btn-primary btn-full"
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Creating account…
            </>
          ) : (
            'Sign Up'
          )}
        </button>

      </form>

      <p className="auth-footer">
        Already have an account?
        <Link to="/signin">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
