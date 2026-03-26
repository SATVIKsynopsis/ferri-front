'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/theme-toggle';
import { getMe } from '@/lib/api';

interface MeResponse {
  id: string;
  name: string;
  username: string;
  email: string;
}

function AmbientOrbs() {
  return (
    <div className="pf-orbs" aria-hidden>
      <div className="pf-orb pf-orb-1" />
      <div className="pf-orb pf-orb-2" />
      <div className="pf-orb pf-orb-3" />
    </div>
  );
}

function Avatar({ name, size = 60 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="pf-avatar" style={{ width: size, height: size }}>
      <div className="pf-avatar-ring" />
      <div className="pf-avatar-inner">{initials}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(false);
        const data = await getMe();
        setMe(data.user);
      } catch {
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { height: 100% !important; }
          .pf-loading {
            position: fixed; inset: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #07070e; color: #e8e8f0;
            display: flex; align-items: center; justify-content: center;
          }
        `}</style>
        <div className="pf-loading">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100% !important; overflow: hidden !important; }

        .pf-shell {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #07070e;
          color: #e8e8f0;
          overflow: hidden;
        }

        /* AMBIENT ORBS */
        .pf-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .pf-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.15; animation: orbFloat 14s ease-in-out infinite; }
        .pf-orb-1 { width: 560px; height: 560px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -180px; right: -80px; animation-delay: 0s; }
        .pf-orb-2 { width: 420px; height: 420px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 80px; left: -100px; animation-delay: -5s; }
        .pf-orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #0891b2, transparent 70%); top: 45%; left: 35%; animation-delay: -9s; }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-28px) scale(1.04); }
          70% { transform: translateY(18px) scale(0.97); }
        }

        /* HEADER */
        .pf-header {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
          height: 64px;
          flex-shrink: 0;
          background: rgba(9,9,15,0.88);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .pf-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 35%, rgba(139,92,246,0.5) 65%, transparent 100%);
        }
        .pf-header-left { display: flex; align-items: center; gap: 12px; }
        .pf-back {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(232,232,240,0.6);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; flex-shrink: 0;
        }
        .pf-back:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #e8e8f0; }
        .pf-title { font-size: 16px; font-weight: 700; color: #f2f2fa; letter-spacing: -0.015em; }

        /* CONTENT */
        .pf-content {
          position: relative; z-index: 1;
          flex: 1; min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          padding: 24px 20px;
          display: flex; flex-direction: column;
        }
        .pf-content::-webkit-scrollbar { width: 3px; }
        .pf-content::-webkit-scrollbar-track { background: transparent; }
        .pf-content::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }

        /* CARD */
        .pf-card {
          background: rgba(20,20,32,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          animation: cardSlide 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cardSlide { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .pf-card-section { margin-bottom: 24px; }
        .pf-card-section:last-child { margin-bottom: 0; }

        .pf-section-title {
          font-size: 18px; font-weight: 700; color: #f2f2fa;
          margin-bottom: 16px; letter-spacing: -0.01em;
        }

        /* AVATAR SECTION */
        .pf-avatar-section {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 24px;
        }
        .pf-avatar { position: relative; flex-shrink: 0; }
        .pf-avatar-ring {
          position: absolute; inset: -3px; border-radius: 20px;
          background: conic-gradient(from 0deg, #6366f1, #8b5cf6, #06b6d4, #6366f1);
          animation: spin 5s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 3px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pf-avatar-inner {
          position: absolute; inset: 3px; border-radius: 17px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: #a5b4fc; letter-spacing: 0.04em;
        }
        .pf-user-name { font-size: 20px; font-weight: 700; color: #e8e8f0; }
        .pf-user-handle { font-size: 13px; color: rgba(232,232,240,0.4); }

        /* FIELD */
        .pf-field {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          animation: fieldSlide 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes fieldSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        .pf-field:hover { background: rgba(255,255,255,0.03); border-color: rgba(99,102,241,0.2); }
        .pf-field-icon { width: 20px; height: 20px; color: rgba(232,232,240,0.3); flex-shrink: 0; }
        .pf-field-content { flex: 1; }
        .pf-field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(232,232,240,0.3); margin-bottom: 3px; }
        .pf-field-value { font-size: 14px; color: #e8e8f0; word-break: break-all; }

        /* ERROR */
        .pf-error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 12px;
          padding: 12px;
          font-size: 13px; color: #f87171;
          animation: slideIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        [data-radix-popper-content-wrapper] { z-index: 999 !important; }
      `}</style>

      <div className="pf-shell">
        <AmbientOrbs />

        {/* HEADER */}
        <header className="pf-header">
          <div className="pf-header-left">
            <Link href="/chat" className="pf-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="pf-title">My Profile</div>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </header>

        {/* CONTENT */}
        <div className="pf-content">
          <div className="pf-card">
            {/* Avatar Section */}
            {me && (
              <div className="pf-avatar-section">
                <Avatar name={me.name} size={80} />
                <div>
                  <div className="pf-user-name">{me.name}</div>
                  <div className="pf-user-handle">@{me.username}</div>
                </div>
              </div>
            )}

            {error ? (
              <div className="pf-error">{error}</div>
            ) : (
              <div className="pf-card-section">
                {me && (
                  <>
                    {/* Name Field */}
                    <div className="pf-field" style={{ animationDelay: '0.05s' }}>
                      <svg className="pf-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <div className="pf-field-content">
                        <div className="pf-field-label">Name</div>
                        <div className="pf-field-value">{me.name}</div>
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="pf-field" style={{ animationDelay: '0.1s', marginTop: '12px' }}>
                      <svg className="pf-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                      </svg>
                      <div className="pf-field-content">
                        <div className="pf-field-label">Username</div>
                        <div className="pf-field-value">@{me.username}</div>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="pf-field" style={{ animationDelay: '0.15s', marginTop: '12px' }}>
                      <svg className="pf-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
                      </svg>
                      <div className="pf-field-content">
                        <div className="pf-field-label">Email</div>
                        <div className="pf-field-value">{me.email}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
