'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Login successful!');

      // Role-based redirect — 'user' role goes straight to appointments
      if (data.user.role === 'user') {
        router.push('/dashboard/appointments/new');
      } else {
        router.push('/dashboard');
      }
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
        .auth-card {
          width: 100%;
          max-width: 400px;
        }
        .auth-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #6b7685;
          text-decoration: none;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: color 0.15s;
          background: none;
          border: none;
          padding: 0;
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
        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0 0;
        }
        .auth-divider-line { flex: 1; height: 1px; background: rgba(26,32,40,0.1); }
        .auth-divider-text { font-size: 0.8125rem; color: #6b7685; white-space: nowrap; }
        .auth-register-link {
          display: block;
          text-align: center;
          margin-top: 1rem;
          padding: 0.75rem;
          border: 1.5px solid rgba(26,32,40,0.12);
          border-radius: 10px;
          font-size: 0.875rem;
          color: #1a2028;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          background: none;
          width: 100%;
          font-weight: 400;
        }
        .auth-register-link:hover { border-color: #0f7b6c; color: #0f7b6c; }
        .auth-register-link span { color: #0f7b6c; font-weight: 500; }
        /* Image panel */
        .auth-image {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(160deg, rgba(15,123,108,0.8) 0%, rgba(10,92,81,0.92) 100%),
            url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&fit=crop') center/cover no-repeat;
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
              <div className="auth-logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="auth-logo-name">Nacare Clinic</span>
            </div>

            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-sub">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Don't have an account?</span>
              <div className="auth-divider-line" />
            </div>

            <button
              className="auth-register-link"
              onClick={() => router.push('/register')}
            >
              Create a new account <span>→</span>
            </button>
          </div>
        </div>

        {/* Image panel */}
        <div className="auth-image">
          <p className="auth-image-quote">
            "The good physician treats the disease; the great physician treats
            the patient who has the disease."
          </p>
          <p className="auth-image-attr">— William Osler</p>
        </div>
      </div>
    </>
  );
}
