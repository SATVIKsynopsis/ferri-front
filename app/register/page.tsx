'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import ThemeToggle from '@/components/theme-toggle';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(formData);
      router.push('/login');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100% !important; }

        .register-shell {
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
        .register-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .register-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.15; animation: orbFloat 14s ease-in-out infinite; }
        .register-orb-1 { width: 560px; height: 560px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -180px; right: -80px; animation-delay: 0s; }
        .register-orb-2 { width: 420px; height: 420px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 80px; left: -100px; animation-delay: -5s; }
        .register-orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #0891b2, transparent 70%); top: 45%; left: 35%; animation-delay: -9s; }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-28px) scale(1.04); }
          70% { transform: translateY(18px) scale(0.97); }
        }

        /* CARD */
        .register-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: rgba(20,20,32,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(24px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: cardSlide 0.5s cubic-bezier(0.34,1.56,0.64,1);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes cardSlide { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .register-header { text-align: center; margin-bottom: 24px; }
        .register-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-size: 24px;
        }
        .register-title { font-size: 20px; font-weight: 700; color: #e8e8f0; margin-bottom: 6px; }
        .register-subtitle { font-size: 13px; color: rgba(232,232,240,0.4); }

        /* FORM */
        .register-form { display: flex; flex-direction: column; gap: 14px; }

        /* ERROR */
        .register-error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 12px;
          padding: 11px 13px;
          font-size: 12.5px; color: #f87171;
          animation: slideIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        .register-field-error {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
          padding: 4px 6px;
          font-size: 11px; color: #f87171;
          margin-top: 2px;
        }

        /* INPUT WRAPPER */
        .register-input-wrap {
          display: flex; flex-direction: column; gap: 4px;
        }

        .register-label {
          font-size: 11.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(232,232,240,0.5);
        }

        .register-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 11px;
          color: #e8e8f0;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.25s, box-shadow 0.25s;
          outline: none;
        }

        .register-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 0 16px rgba(99,102,241,0.08);
        }

        .register-input.error {
          border-color: rgba(248,113,113,0.3);
        }

        .register-input.error:focus {
          box-shadow: 0 0 0 3px rgba(248,113,113,0.1), 0 0 16px rgba(248,113,113,0.05);
        }

        .register-input::placeholder { color: rgba(232,232,240,0.3); }

        /* BUTTON */
        .register-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
          margin-top: 6px;
        }

        .register-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.4);
        }

        .register-btn:active:not(:disabled) { transform: translateY(0); }

        .register-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* FOOTER */
        .register-footer {
          text-align: center; font-size: 13px; color: rgba(232,232,240,0.6);
          margin-top: 16px;
        }

        .register-footer a {
          color: #a5b4fc;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .register-footer a:hover { color: #e0e7ff; }

        /* THEME TOGGLE */
        .register-theme { position: fixed; top: 16px; right: 16px; z-index: 50; }

        .register-card::-webkit-scrollbar { width: 3px; }
        .register-card::-webkit-scrollbar-track { background: transparent; }
        .register-card::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }
      `}</style>

      <div className="register-shell">
        <div className="register-orbs">
          <div className="register-orb register-orb-1" />
          <div className="register-orb register-orb-2" />
          <div className="register-orb register-orb-3" />
        </div>

        <div className="register-theme">
          <ThemeToggle />
        </div>

        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">✨</div>
            <div className="register-title">Create Account</div>
            <div className="register-subtitle">Join the conversation today</div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {errors.submit && <div className="register-error">{errors.submit}</div>}

            <div className="register-input-wrap">
              <label className="register-label">Name</label>
              <input
                className={`register-input ${errors.name ? 'error' : ''}`}
                type="text"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="register-field-error">{errors.name}</div>}
            </div>

            <div className="register-input-wrap">
              <label className="register-label">Username</label>
              <input
                className={`register-input ${errors.username ? 'error' : ''}`}
                type="text"
                placeholder="johndoe"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <div className="register-field-error">{errors.username}</div>}
            </div>

            <div className="register-input-wrap">
              <label className="register-label">Email</label>
              <input
                className={`register-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="register-field-error">{errors.email}</div>}
            </div>

            <div className="register-input-wrap">
              <label className="register-label">Password</label>
              <input
                className={`register-input ${errors.password ? 'error' : ''}`}
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="register-field-error">{errors.password}</div>}
              {!errors.password && <div style={{ fontSize: '11px', color: 'rgba(232,232,240,0.35)', marginTop: '2px' }}>Minimum 8 characters</div>}
            </div>

            <div className="register-input-wrap">
              <label className="register-label">Confirm Password</label>
              <input
                className={`register-input ${errors.password_confirm ? 'error' : ''}`}
                type="password"
                placeholder="••••••••"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
              />
              {errors.password_confirm && <div className="register-field-error">{errors.password_confirm}</div>}
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            Already have an account? <Link href="/login" style={{ textDecoration: 'none' }}>
              <span style={{ color: '#a5b4fc', fontWeight: 600, cursor: 'pointer' }}>
                Sign in
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
    