'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import NacareLogo from '../../components/NacareLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #faf8f4;
        }
        .auth-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
        }
        .auth-card { width: 100%; max-width: 420px; }
        .auth-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #6b7685;
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: color 0.15s;
          font-family: inherit;
        }
        .auth-back:hover { color: #0f7b6c; }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .auth-logo-icon {
          width: 44px; height: 44px;
          background: #0f7b6c;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .auth-logo-icon svg { width: 22px; height: 22px; color: white; }
        .auth-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #1a2028;
        }
        .auth-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: #1a2028;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }
        .auth-sub {
          font-size: 0.875rem;
          color: #6b7685;
          font-weight: 300;
          margin-bottom: 2.25rem;
        }
        .auth-role-notice {
          background: rgba(15,123,108,0.07);
          border: 1px solid rgba(15,123,108,0.15);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          font-size: 0.8125rem;
          color: #0a5c51;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .auth-role-notice strong { font-weight: 500; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0 0;
        }
        .auth-divider-line { flex: 1; height: 1px; background: rgba(26,32,40,0.1); }
        .auth-divider-text { font-size: 0.8125rem; color: #6b7685; white-space: nowrap; }
        .auth-login-link {
          display: block;
          text-align: center;
          margin-top: 1rem;
          padding: 0.75rem;
          border: 1.5px solid rgba(26,32,40,0.12);
          border-radius: 10px;
          font-size: 0.875rem;
          color: #1a2028;
          background: none;
          border-color: rgba(26,32,40,0.12);
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          width: 100%;
        }
        .auth-login-link:hover { border-color: #0f7b6c; color: #0f7b6c; }
        .auth-login-link span { color: #0f7b6c; font-weight: 500; }
        .auth-image {
          position: relative;
          overflow: hidden;
          background:
          linear-gradient(
    160deg,
    rgba(124, 92, 214, 0.85) 0%,
    rgba(91, 61, 161, 0.9) 100%
  ),
            url('https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80&fit=crop') center/cover no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
        }
        .auth-image-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 300;
          font-style: italic;
          color: white;
          line-height: 1.35;
          margin-bottom: 1rem;
        }
        .auth-image-attr {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
        }
        @media (max-width: 768px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-image { display: none; }
          .auth-panel { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="auth-root">
        {/* Form panel */}
        <div className="auth-panel">
          <div className="auth-card">
            <button className="auth-back" onClick={() => router.push('/')}>
              ← Back to home
            </button>

            <div className="auth-logo">
              <NacareLogo />
              {/* <div className="auth-logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="auth-logo-name">Nacare Clinic</span> */}
            </div>

            <h1 className="auth-heading">Create account</h1>
            <p className="auth-sub">Join the Nacare Clinic management system</p>

            <div className="auth-role-notice">
              <strong>Note:</strong> New accounts are created with a{' '}
              <strong>user</strong> role. Contact an administrator to request
              elevated access.
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                autoComplete="username"
              />
              <Input
                label="Email (optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">
                Already have an account?
              </span>
              <div className="auth-divider-line" />
            </div>

            <button
              className="auth-login-link"
              onClick={() => router.push('/login')}
            >
              Sign in instead <span>→</span>
            </button>
          </div>
        </div>

        {/* Image panel */}
        <div className="auth-image">
          <p className="auth-image-quote">
            "To know what to do, to do it, and to record it faithfully — that is
            the whole art of medicine."
          </p>
          <p className="auth-image-attr">— Attributed to Hippocrates</p>
        </div>
      </div>
    </>
  );
}
