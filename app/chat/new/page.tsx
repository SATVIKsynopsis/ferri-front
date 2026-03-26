'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { searchUsers, createChat } from '@/lib/api';

interface User {
  id: string;
  name: string;
  username: string;
}

function AmbientOrbs() {
  return (
    <div className="nc-orbs" aria-hidden>
      <div className="nc-orb nc-orb-1" />
      <div className="nc-orb nc-orb-2" />
      <div className="nc-orb nc-orb-3" />
    </div>
  );
}

export default function NewChatPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setError('');

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const data = await searchUsers(value);
      setResults(data);
    } catch {
      setError('Search failed');
    }
  };

  const handleSelect = async (userId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const chat = await createChat(token, userId);
      router.push(`/chat/${chat.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100% !important; overflow: hidden !important; }

        .nc-shell {
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
        .nc-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .nc-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.15; animation: orbFloat 14s ease-in-out infinite; }
        .nc-orb-1 { width: 560px; height: 560px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -180px; right: -80px; animation-delay: 0s; }
        .nc-orb-2 { width: 420px; height: 420px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 80px; left: -100px; animation-delay: -5s; }
        .nc-orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #0891b2, transparent 70%); top: 45%; left: 35%; animation-delay: -9s; }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-28px) scale(1.04); }
          70% { transform: translateY(18px) scale(0.97); }
        }

        /* HEADER */
        .nc-header {
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
        .nc-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 35%, rgba(139,92,246,0.5) 65%, transparent 100%);
        }
        .nc-header-left { display: flex; align-items: center; gap: 12px; }
        .nc-back {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(232,232,240,0.6);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; flex-shrink: 0;
        }
        .nc-back:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #e8e8f0; }
        .nc-title { font-size: 16px; font-weight: 700; color: #f2f2fa; letter-spacing: -0.015em; }
        .nc-subtitle { font-size: 13px; color: rgba(232,232,240,0.4); margin-top: 2px; }

        /* CONTENT */
        .nc-content {
          position: relative; z-index: 1;
          flex: 1; min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          padding: 20px;
          display: flex; flex-direction: column;
          align-items: flex-start;
        }
        .nc-content::-webkit-scrollbar { width: 3px; }
        .nc-content::-webkit-scrollbar-track { background: transparent; }
        .nc-content::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }

        /* SEARCH */
        .nc-search-wrap {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 6px 12px;
          transition: border-color 0.25s, box-shadow 0.25s;
          margin-bottom: 16px;
          max-width: 400px;
        }
        .nc-search-wrap:focus-within {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.09), 0 0 24px rgba(99,102,241,0.07);
        }
        .nc-search {
          flex: 1; background: transparent; border: none; outline: none;
          color: #e8e8f0; font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0; line-height: 1.4;
        }
        .nc-search::placeholder { color: rgba(232,232,240,0.28); }

        /* ERROR */
        .nc-error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 13px; color: #f87171;
          margin-bottom: 12px;
          animation: slideIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        /* RESULTS */
        .nc-results { flex: 1; display: flex; flex-direction: column; gap: 6px; max-width: 400px; }
        .nc-result-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
          animation: itemSlide 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes itemSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        .nc-result-item:hover {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.3);
          transform: translateX(4px);
        }
        .nc-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4));
          border: 1px solid rgba(139,92,246,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #a5b4fc; flex-shrink: 0;
        }
        .nc-user-name { font-size: 14px; font-weight: 600; color: #e8e8f0; }
        .nc-user-handle { font-size: 12px; color: rgba(232,232,240,0.4); margin-top: 1px; }
        .nc-loading { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .nc-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          user-select: none;
        }
        .nc-empty-text { font-size: 13px; color: rgba(232,232,240,0.3); }

        [data-radix-popper-content-wrapper] { z-index: 999 !important; }
      `}</style>

      <div className="nc-shell">
        <AmbientOrbs />

        {/* HEADER */}
        <header className="nc-header">
          <div className="nc-header-left">
            <Link href="/chat" className="nc-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div>
              <div className="nc-title">Start a New Chat</div>
              <div className="nc-subtitle">Search users and start a conversation</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="nc-content">
          {/* Search Input */}
          <div className="nc-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(232,232,240,0.4)' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="nc-search"
              placeholder="Search by username..."
              value={query}
              onChange={handleSearch}
              disabled={isLoading}
            />
          </div>

          {/* Error */}
          {error && <div className="nc-error">{error}</div>}

          {/* Results */}
          <div className="nc-results">
            {results.map((u, idx) => (
              <div key={u.id} className="nc-result-item" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => handleSelect(u.id)}>
                <div className="nc-avatar">{u.name[0].toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div className="nc-user-name">{u.name}</div>
                  <div className="nc-user-handle">@{u.username}</div>
                </div>
                {isLoading && (
                  <svg className="nc-loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                )}
              </div>
            ))}

            {query.length >= 2 && results.length === 0 && !error && (
              <div className="nc-empty">
                <div className="nc-empty-text">No users found</div>
              </div>
            )}

            {query.length === 0 && results.length === 0 && (
              <div className="nc-empty">
                <div className="nc-empty-text">Search for a username to get started</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}