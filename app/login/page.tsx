'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormInput } from '@/components/form-input';
import { login } from '@/lib/api';
import ThemeToggle from '@/components/theme-toggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      router.push('/chat');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100% !important; }

        .login-shell {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #07070e;
          color: #e8e8f0;
          overflow: auto;
          padding: 20px;
        }

        /* AMBIENT ORBS */
        .login-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .login-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.15; animation: orbFloat 14s ease-in-out infinite; }
        .login-orb-1 { width: 560px; height: 560px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -180px; right: -80px; animation-delay: 0s; }
        .login-orb-2 { width: 420px; height: 420px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 80px; left: -100px; animation-delay: -5s; }
        .login-orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #0891b2, transparent 70%); top: 45%; left: 35%; animation-delay: -9s; }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-28px) scale(1.04); }
          70% { transform: translateY(18px) scale(0.97); }
        }

        /* CARD */
        .login-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: rgba(20,20,32,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: cardSlide 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cardSlide { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .login-header { text-align: center; margin-bottom: 28px; }
        .login-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-size: 24px;
        }
        .login-title { font-size: 20px; font-weight: 700; color: #e8e8f0; margin-bottom: 6px; }
        .login-subtitle { font-size: 13px; color: rgba(232,232,240,0.4); }

        /* FORM */
        .login-form { display: flex; flex-direction: column; gap: 16px; }

        /* ERROR */
        .login-error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 12px;
          padding: 11px 13px;
          font-size: 12.5px; color: #f87171;
          animation: slideIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        /* INPUT WRAPPER */
        .login-input-wrap {
          display: flex; flex-direction: column; gap: 6px;
        }

        .login-label {
          font-size: 12px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(232,232,240,0.5);
        }

        .login-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 13px;
          color: #e8e8f0;
          font-size: 13.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.25s, box-shadow 0.25s;
          outline: none;
        }

        .login-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 0 16px rgba(99,102,241,0.08);
        }

        .login-input::placeholder { color: rgba(232,232,240,0.3); }

        /* BUTTON */
        .login-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13.5px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
          margin-top: 8px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.4);
        }

        .login-btn:active:not(:disabled) { transform: translateY(0); }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* FOOTER */
        .login-footer {
          text-align: center; font-size: 13px; color: rgba(232,232,240,0.6);
          margin-top: 20px;
        }

        .login-footer a {
          color: #a5b4fc;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-footer a:hover { color: #e0e7ff; }

        /* THEME TOGGLE */
        .login-theme { position: fixed; top: 16px; right: 16px; z-index: 50; }
      `}</style>

      <div className="login-shell">
        <div className="login-orbs">
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="login-orb login-orb-3" />
        </div>

        <div className="login-theme">
          <ThemeToggle />
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <div className="login-title">Welcome Back</div>
            <div className="login-subtitle">Sign in to your chat account</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <div className="login-input-wrap">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-wrap">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account? <Link href="/register" style={{ textDecoration: 'none' }}>
              <span style={{ color: '#a5b4fc', fontWeight: 600, cursor: 'pointer' }}>
                Create one
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
