'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getChats, logout } from '@/lib/api';

interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  participant_id: string;
  participant_name: string;
  participant_username: string;
}

// ─────────────────────────────────────────────
// Aceternity: BackgroundBeams (SVG paths)
// ─────────────────────────────────────────────
function BackgroundBeams() {
  return (
    <div className="cl-beams" aria-hidden>
      <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="rg1" cx="70%" cy="20%" r="55%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="rg2" cx="10%" cy="80%" r="45%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="rg3" cx="50%" cy="50%" r="35%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0"/>
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0"/>
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#rg1)"/>
        <rect width="1440" height="900" fill="url(#rg2)"/>
        <rect width="1440" height="900" fill="url(#rg3)"/>
        {/* diagonal beam lines */}
        <line x1="-100" y1="300" x2="1600" y2="100" stroke="url(#beam1)" strokeWidth="1.5"/>
        <line x1="-100" y1="500" x2="1600" y2="300" stroke="url(#beam1)" strokeWidth="0.8"/>
        <line x1="1600" y1="200" x2="-100" y2="700" stroke="url(#beam2)" strokeWidth="1.2"/>
        <line x1="1600" y1="400" x2="-100" y2="900" stroke="url(#beam2)" strokeWidth="0.6"/>
        {/* dot grid pattern */}
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.8" fill="rgba(99,102,241,0.25)"/>
        </pattern>
        <rect width="1440" height="900" fill="url(#dots)"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Aceternity: SpotlightCard — tracks mouse and casts radial light
// ─────────────────────────────────────────────
function SpotlightCard({
  children,
  className = '',
  href,
  onClick,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPos(p => ({ ...p, opacity: 0 }));
  }, []);

  const inner = (
    <div
      ref={ref}
      className={`cl-spotlight-card ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* spotlight radial */}
      <div
        className="cl-spotlight"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.13), transparent 70%)`,
        }}
      />
      {/* shimmer border */}
      <div className="cl-card-border" />
      {/* content */}
      <div className="cl-card-content">{children}</div>
    </div>
  );

  if (href) {
    return <Link href={href} style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link>;
  }
  return inner;
}

// ─────────────────────────────────────────────
// Aceternity: ShimmerButton
// ─────────────────────────────────────────────
function ShimmerButton({
  children,
  onClick,
  variant = 'primary',
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  icon?: React.ReactNode;
}) {
  return (
    <button className={`cl-shim-btn cl-shim-btn--${variant}`} onClick={onClick}>
      {variant === 'primary' && <div className="cl-shim-sweep" />}
      {icon && <span className="cl-shim-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Aceternity: MovingBorderInput
// ─────────────────────────────────────────────
function MovingBorderInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`cl-mbi-wrap ${focused ? 'focused' : ''}`}>
      <div className="cl-mbi-border" />
      <svg className="cl-mbi-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      <input
        className="cl-mbi-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="cl-mbi-clear" onClick={() => onChange('')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Avatar initials
// ─────────────────────────────────────────────
function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) || 0) * 13) % 360;
  return (
    <div className="cl-avatar" style={{ width: size, height: size }}>
      <div className="cl-avatar-ring" style={{ '--hue': hue } as React.CSSProperties} />
      <div className="cl-avatar-inner" style={{ background: `hsl(${hue},45%,18%)`, color: `hsl(${hue},70%,72%)` }}>
        {initials}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="cl-skeleton">
      {[0,1,2,3,4].map(i => (
        <div key={i} className="cl-skel-row" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="cl-skel-avatar" />
          <div className="cl-skel-lines">
            <div className="cl-skel-line cl-skel-line--name" style={{ width: `${120 + i * 18}px` }} />
            <div className="cl-skel-line cl-skel-line--sub" style={{ width: `${70 + i * 12}px` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { router.push('/login'); return; }
    fetchChats(t);
  }, []);

  const fetchChats = async (t: string) => {
    try {
      setLoading(true);
      const data = await getChats(t);
      setChats(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredChats = chats.filter(c =>
    c.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant_username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #07070e; }

        .cl-root {
          min-height: 100vh;
          background: #07070e;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #e8e8f0;
          position: relative;
          overflow-x: hidden;
        }

        /* ── BEAMS ── */
        .cl-beams {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          overflow: hidden;
        }
        .cl-beams svg {
          width: 100%; height: 100%;
          position: absolute; inset: 0;
        }

        /* ── HEADER ── */
        .cl-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(7,7,14,0.82);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cl-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.55), rgba(139,92,246,0.55), transparent);
        }
        .cl-header-inner {
          max-width: 680px; margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .cl-brand {
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0;
        }
        .cl-brand-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 18px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .cl-brand-text { display: flex; flex-direction: column; }
        .cl-brand-title { font-size: 16px; font-weight: 800; color: #f0f0f8; letter-spacing: -0.02em; }
        .cl-brand-sub {
          font-size: 11px; font-weight: 500;
          color: rgba(232,232,240,0.35);
          font-family: 'JetBrains Mono', monospace;
        }
        .cl-header-actions { display: flex; align-items: center; gap: 6px; }

        /* ── SHIMMER BUTTON ── */
        .cl-shim-btn {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cl-shim-btn--primary {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }
        .cl-shim-btn--primary:hover { box-shadow: 0 4px 24px rgba(99,102,241,0.5); transform: translateY(-1px); }
        .cl-shim-btn--primary:active { transform: translateY(0) scale(0.97); }
        .cl-shim-btn--ghost {
          background: rgba(255,255,255,0.04);
          color: rgba(232,232,240,0.65);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .cl-shim-btn--ghost:hover { background: rgba(255,255,255,0.08); color: #e8e8f0; }
        .cl-shim-btn--outline {
          background: transparent;
          color: rgba(232,232,240,0.7);
          border: 1px solid rgba(99,102,241,0.35);
        }
        .cl-shim-btn--outline:hover { background: rgba(99,102,241,0.1); color: #e8e8f0; border-color: rgba(99,102,241,0.6); }
        .cl-shim-sweep {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          transform: translateX(-100%);
          animation: shimmerSweep 3s ease-in-out infinite;
        }
        @keyframes shimmerSweep {
          0%,100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        .cl-shim-icon { display: flex; align-items: center; }

        /* ── MAIN ── */
        .cl-main {
          position: relative; z-index: 1;
          max-width: 680px; margin: 0 auto;
          padding: 32px 20px 48px;
        }

        /* ── SECTION HEADING ── */
        .cl-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
          animation: fadeUp 0.4s ease both;
        }
        .cl-section-title {
          font-size: 22px; font-weight: 800;
          color: #f0f0f8; letter-spacing: -0.025em;
        }
        .cl-section-count {
          font-size: 12px; font-weight: 600;
          color: rgba(232,232,240,0.35);
          font-family: 'JetBrains Mono', monospace;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 3px 9px; border-radius: 20px;
        }

        /* ── SEARCH ── */
        .cl-search-wrap {
          margin-bottom: 24px;
          animation: fadeUp 0.4s 0.05s ease both;
        }
        .cl-mbi-wrap {
          position: relative;
          display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0 14px;
          transition: border-color 0.25s, box-shadow 0.25s;
          overflow: hidden;
        }
        .cl-mbi-wrap.focused {
          border-color: rgba(99,102,241,0.45);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 0 24px rgba(99,102,241,0.07);
        }
        /* moving border top line */
        .cl-mbi-border {
          position: absolute; top: 0; left: -100%; right: -100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent);
          animation: borderSlide 3s linear infinite;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cl-mbi-wrap.focused .cl-mbi-border { opacity: 1; }
        @keyframes borderSlide {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        .cl-mbi-icon { color: rgba(232,232,240,0.3); flex-shrink: 0; }
        .cl-mbi-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #e8e8f0; font-size: 14.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 13px 10px; min-width: 0;
        }
        .cl-mbi-input::placeholder { color: rgba(232,232,240,0.28); }
        .cl-mbi-clear {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; flex-shrink: 0;
          background: rgba(255,255,255,0.06); border: none; border-radius: 6px;
          color: rgba(232,232,240,0.45); cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .cl-mbi-clear:hover { background: rgba(255,255,255,0.12); color: #e8e8f0; }

        /* ── SPOTLIGHT CARD ── */
        .cl-spotlight-card {
          position: relative;
          border-radius: 16px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          animation: fadeUp 0.35s ease both;
        }
        .cl-spotlight-card:hover { transform: translateY(-2px); }
        .cl-spotlight-card:active { transform: translateY(0) scale(0.99); }
        .cl-spotlight { position: absolute; inset: 0; pointer-events: none; transition: opacity 0.3s; border-radius: inherit; }
        .cl-card-border {
          position: absolute; inset: 0; border-radius: inherit;
          border: 1px solid rgba(255,255,255,0.07);
          pointer-events: none; transition: border-color 0.25s;
        }
        .cl-spotlight-card:hover .cl-card-border { border-color: rgba(99,102,241,0.3); }
        .cl-card-content {
          position: relative; z-index: 1;
          background: rgba(14,14,22,0.75);
          backdrop-filter: blur(12px);
          border-radius: inherit;
          padding: 14px 16px;
          display: flex; align-items: center; gap: 14px;
        }

        /* chat card inner */
        .cl-chat-info { flex: 1; min-width: 0; }
        .cl-chat-name {
          font-size: 15px; font-weight: 700;
          color: #f0f0f8; letter-spacing: -0.01em;
          transition: color 0.2s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cl-spotlight-card:hover .cl-chat-name { color: #a5b4fc; }
        .cl-chat-username {
          font-size: 12.5px; color: rgba(232,232,240,0.38);
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cl-chat-arrow {
          flex-shrink: 0;
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(99,102,241,0.0);
          display: flex; align-items: center; justify-content: center;
          color: rgba(232,232,240,0.2);
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .cl-spotlight-card:hover .cl-chat-arrow {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          transform: translateX(2px);
        }

        /* ── LIST ── */
        .cl-list { display: flex; flex-direction: column; gap: 8px; }

        /* ── AVATAR ── */
        .cl-avatar { position: relative; flex-shrink: 0; }
        .cl-avatar-ring {
          position: absolute; inset: -2px; border-radius: 13px;
          background: conic-gradient(from 0deg, hsl(calc(var(--hue, 250)),70%,60%), hsl(calc(var(--hue, 250) + 60),70%,70%), hsl(calc(var(--hue, 250)),70%,60%));
          animation: spin 6s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 2px; opacity: 0.7;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cl-avatar-inner {
          position: absolute; inset: 2px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
        }

        /* ── EMPTY ── */
        .cl-empty {
          animation: fadeUp 0.35s ease both;
        }
        .cl-empty-card {
          border-radius: 20px;
          border: 1px dashed rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.03);
          padding: 52px 24px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          text-align: center;
        }
        .cl-empty-icon {
          width: 60px; height: 60px; border-radius: 18px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 4px;
        }
        .cl-empty-title { font-size: 16px; font-weight: 700; color: rgba(232,232,240,0.5); }
        .cl-empty-sub { font-size: 13px; color: rgba(232,232,240,0.25); margin-bottom: 8px; }

        /* ── SKELETON ── */
        .cl-skeleton { display: flex; flex-direction: column; gap: 8px; }
        .cl-skel-row {
          display: flex; align-items: center; gap: 14px;
          background: rgba(14,14,22,0.75);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 14px 16px;
          animation: fadeUp 0.35s ease both;
        }
        .cl-skel-avatar {
          width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .cl-skel-lines { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .cl-skel-line {
          height: 10px; border-radius: 6px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .cl-skel-line--sub { height: 8px; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="cl-root">
        <BackgroundBeams />

        {/* HEADER */}
        <header className="cl-header">
          <div className="cl-header-inner">
            <div className="cl-brand">
              <div className="cl-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="cl-brand-text">
                <span className="cl-brand-title">FerrumChat</span>
                <span className="cl-brand-sub">
                  {loading ? '...' : `${chats.length} chats`}
                </span>
              </div>
            </div>

            <div className="cl-header-actions">
              <ShimmerButton
                variant="ghost"
                onClick={() => router.push('/profile')}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2.2"/>
                  </svg>
                }
              >
                Profile
              </ShimmerButton>

              <ShimmerButton
                variant="primary"
                onClick={() => router.push('/chat/new')}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                }
              >
                New Chat
              </ShimmerButton>

              <ShimmerButton
                variant="ghost"
                onClick={handleLogout}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Logout
              </ShimmerButton>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="cl-main">
          {/* Section head */}
          <div className="cl-section-head">
            <h1 className="cl-section-title">Messages</h1>
            {!loading && (
              <span className="cl-section-count">
                {filteredChats.length}/{chats.length}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="cl-search-wrap">
            <MovingBorderInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search conversations…"
            />
          </div>

          {/* List */}
          {loading ? (
            <Skeleton />
          ) : filteredChats.length === 0 ? (
            <div className="cl-empty">
              <div className="cl-empty-card">
                <div className="cl-empty-icon">
                  {searchQuery ? '🔍' : '💬'}
                </div>
                <p className="cl-empty-title">
                  {searchQuery ? 'No results found' : 'No conversations yet'}
                </p>
                <p className="cl-empty-sub">
                  {searchQuery
                    ? `Nothing matched "${searchQuery}"`
                    : 'Start your first conversation below'}
                </p>
                {!searchQuery && (
                  <ShimmerButton
                    variant="primary"
                    onClick={() => router.push('/chat/new')}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    }
                  >
                    Start a conversation
                  </ShimmerButton>
                )}
              </div>
            </div>
          ) : (
            <div className="cl-list">
              {filteredChats.map((chat, i) => (
                <SpotlightCard
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  delay={i * 40}
                >
                  <Avatar name={chat.participant_name} size={44} />
                  <div className="cl-chat-info">
                    <p className="cl-chat-name">{chat.participant_name}</p>
                    <p className="cl-chat-username">@{chat.participant_username}</p>
                  </div>
                  <div className="cl-chat-arrow">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}