'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMessages, connectWebSocket, getChats } from '@/lib/api';
import ThemeToggle from '@/components/theme-toggle';
import { editMessage, deleteMessage } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'failed';
  sent_at?: number;
}

interface WsMessage {
  id?: string;
  sender_id: string;
  content: string;
  chat_id: string;
  created_at: string;
  sent_at?: number;
  type?: string;
  sent?: number;
}

function AmbientOrbs() {
  return (
    <div className="fc-orbs" aria-hidden>
      <div className="fc-orb fc-orb-1" />
      <div className="fc-orb fc-orb-2" />
      <div className="fc-orb fc-orb-3" />
    </div>
  );
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="fc-avatar" style={{ width: size, height: size }}>
      <div className="fc-avatar-ring" />
      <div className="fc-avatar-inner">{initials}</div>
    </div>
  );
}

function SendButton({ disabled }: { disabled: boolean }) {
  return (
    <button type="submit" className="fc-send-btn" disabled={disabled} aria-label="Send">
      <div className="fc-send-glow" />
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function DateSep({ date }: { date: string }) {
  return (
    <div className="fc-date-sep">
      <div className="fc-date-line" />
      <span className="fc-date-label">{date}</span>
      <div className="fc-date-line" />
    </div>
  );
}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return String(payload.sub);
    } catch { return null; }
  });
  const [participantName, setParticipantName] = useState('Chat User');
  const sentTimes = useRef<Map<string, number>>(new Map());
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { router.push('/login'); return; }
    const payload = JSON.parse(atob(t.split('.')[1]));
    setToken(t);
    fetchChatDetails(t, payload.sub);
    fetchMessages(t);
    setupWebSocket(t);
    return () => { wsRef.current?.close(); };
  }, [chatId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (t: string) => {
    try {
      const data = await getMessages(t, chatId);
      setMessages(data.map((m: Message) => ({ ...m, sender_id: String(m.sender_id) })));
    } catch (e) { console.error(e); }
  };

  const fetchChatDetails = async (t: string, _: string) => {
    try {
      const chats = await getChats(t);
      const chat = chats.find((c: any) => c.id === chatId);
      if (chat) { setParticipantName(chat.participant_name); setReceiverId(chat.participant_id); }
    } catch (e) { console.error(e); }
  };

  const setupWebSocket = (t: string) => {
    const ws = connectWebSocket(t);
    let ping: ReturnType<typeof setInterval>;

    ws.onopen = () => {
      setWsConnected(true);
      ping = setInterval(() => ws.send(JSON.stringify({ type: 'ping', sent: Date.now() })), 5000);
    };

    ws.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data);
        if (data.type === 'pong' && data.sent) { console.log('RTT:', Date.now() - data.sent, 'ms'); return; }
        if (data.sender_id === userId) { sentTimes.current.clear(); }
        if (data.chat_id !== chatId) return;

        setMessages(prev => {
          const incoming: Message = {
            id: data.id ?? crypto.randomUUID(),
            sender_id: String(data.sender_id),
            content: data.content,
            created_at: data.created_at,
            status: 'sent',
          };
          if (!userId) return [...prev, incoming];
          const isOwn = String(data.sender_id) === String(userId);
          if (!isOwn) return [...prev, incoming];

          const idx = prev.findIndex(m => {
            if (data.id && m.id === data.id) return true;
            if (m.sender_id === userId && m.content === data.content && m.status === 'sending') {
              return Math.abs(new Date(m.created_at).getTime() - new Date(data.created_at).getTime()) < 15000;
            }
            return false;
          });
          if (idx === -1) return [...prev, incoming];
          const next = [...prev];
          next[idx] = { ...next[idx], id: data.id ?? next[idx].id, created_at: data.created_at, status: 'sent' };
          return next;
        });
      } catch (e) { console.error(e); }
    };

    ws.onerror = () => setWsConnected(false);
    ws.onclose = () => { setWsConnected(false); clearInterval(ping); };
    wsRef.current = ws;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageInput.trim();
    if (!content) return;
    const createdAt = new Date().toISOString();
    const sentAt = Date.now();
    const optimisticId = crypto.randomUUID();

    setMessages(prev => [...prev, { id: optimisticId, sender_id: userId!, content, created_at: createdAt, status: 'sending' }]);
    setMessageInput('');
    setSending(true);

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sentTimes.current.set(optimisticId, sentAt);
        wsRef.current.send(JSON.stringify({
          id: optimisticId, chat_id: chatId, content,
          receiver_id: receiverId, sender_id: userId,
          user1_id: userId, user2_id: receiverId,
          created_at: createdAt, sent_at: sentAt,
        }));
      } else throw new Error('WS not connected');
    } catch {
      setMessageInput(content);
      setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, status: 'failed' } : m));
    } finally { setSending(false); }
  };

  const handleEdit = async (messageId: string) => {
    if (!editingContent.trim() || !token) return;
    try {
      const updated = await editMessage(token, messageId, editingContent);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: updated.content } : m));
      setEditingMessageId(null); setEditingContent('');
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (messageId: string) => {
    if (!token) return;
    try {
      await deleteMessage(token, messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (e) { console.error(e); }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100% !important; overflow: hidden !important; }

        .fc-shell {
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
        .fc-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .fc-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.15; animation: orbFloat 14s ease-in-out infinite; }
        .fc-orb-1 { width: 560px; height: 560px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -180px; right: -80px; animation-delay: 0s; }
        .fc-orb-2 { width: 420px; height: 420px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 80px; left: -100px; animation-delay: -5s; }
        .fc-orb-3 { width: 280px; height: 280px; background: radial-gradient(circle, #0891b2, transparent 70%); top: 45%; left: 35%; animation-delay: -9s; }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-28px) scale(1.04); }
          70% { transform: translateY(18px) scale(0.97); }
        }

        /* HEADER */
        .fc-header {
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
        .fc-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 35%, rgba(139,92,246,0.5) 65%, transparent 100%);
        }
        .fc-header-left { display: flex; align-items: center; gap: 12px; }
        .fc-back {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(232,232,240,0.6);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; flex-shrink: 0;
        }
        .fc-back:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #e8e8f0; }
        .fc-user-info { display: flex; flex-direction: column; gap: 1px; }
        .fc-username { font-size: 15px; font-weight: 700; color: #f2f2fa; letter-spacing: -0.015em; }
        .fc-status { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 5px; }
        .fc-status.online { color: #34d399; }
        .fc-status.offline { color: rgba(232,232,240,0.3); }
        .fc-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 6px currentColor; }
        .fc-status.online .fc-status-dot { animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .fc-header-right { display: flex; align-items: center; gap: 8px; }

        /* AVATAR */
        .fc-avatar { position: relative; flex-shrink: 0; }
        .fc-avatar-ring {
          position: absolute; inset: -2px; border-radius: 14px;
          background: conic-gradient(from 0deg, #6366f1, #8b5cf6, #06b6d4, #6366f1);
          animation: spin 5s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 2px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fc-avatar-inner {
          position: absolute; inset: 2px; border-radius: 12px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #a5b4fc; letter-spacing: 0.04em;
        }

        /* MESSAGES */
        .fc-messages {
          position: relative; z-index: 1;
          flex: 1; min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          padding: 20px 20px 8px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .fc-messages::-webkit-scrollbar { width: 3px; }
        .fc-messages::-webkit-scrollbar-track { background: transparent; }
        .fc-messages::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 2px; }

        /* EMPTY */
        .fc-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          user-select: none;
        }
        .fc-empty-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.14);
          display: flex; align-items: center; justify-content: center; font-size: 28px;
        }
        .fc-empty-title { font-size: 16px; font-weight: 600; color: rgba(232,232,240,0.4); }
        .fc-empty-sub { font-size: 13px; color: rgba(232,232,240,0.2); }

        /* DATE SEP */
        .fc-date-sep { display: flex; align-items: center; gap: 12px; margin: 16px 0 8px; }
        .fc-date-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
        .fc-date-label {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em;
          text-transform: uppercase; color: rgba(232,232,240,0.25);
          padding: 3px 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px; white-space: nowrap;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ROW */
        .fc-row { display: flex; width: 100%; padding: 1px 0; }
        .fc-row.own { justify-content: flex-end; }
        .fc-row.other { justify-content: flex-start; }

        .fc-bubble-wrap { max-width: min(68%, 480px); display: flex; flex-direction: column; gap: 3px; }
        .fc-row.own .fc-bubble-wrap { align-items: flex-end; }
        .fc-row.other .fc-bubble-wrap { align-items: flex-start; }

        /* BUBBLE */
        .fc-bubble {
          position: relative;
          padding: 10px 14px;
          word-break: break-word;
          font-size: 14.5px; line-height: 1.58;
          transition: opacity 0.2s;
          animation: bubbleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* own */
        .fc-row.own .fc-bubble {
          background: linear-gradient(145deg, rgba(79,70,229,0.9) 0%, rgba(109,40,217,0.8) 100%);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 18px 18px 4px 18px;
          color: #ede9fe;
          box-shadow: 0 4px 20px rgba(99,102,241,0.22), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .fc-row.own .fc-bubble::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.07), transparent 60%);
          pointer-events: none;
        }

        /* other */
        .fc-row.other .fc-bubble {
          background: rgba(20,20,32,0.82);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px 18px 18px 4px;
          color: #cccce0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        }

        .fc-bubble.sending { opacity: 0.48; }

        /* 3-dot trigger */
        .fc-menu-btn {
          position: absolute; top: 5px; right: 6px; opacity: 0;
          transition: opacity 0.15s;
          background: rgba(0,0,0,0.4); border: none; border-radius: 6px;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.65); padding: 0;
        }
        .fc-bubble:hover .fc-menu-btn { opacity: 1; }

        /* meta */
        .fc-meta { display: flex; align-items: center; gap: 4px; padding: 0 3px; }
        .fc-time { font-size: 10.5px; color: rgba(200,200,220,0.35); font-family: 'JetBrains Mono', monospace; }
        .fc-sending { font-size: 10.5px; color: #818cf8; }
        .fc-failed  { font-size: 10.5px; color: #f87171; }

        /* EDIT */
        .fc-edit-row { display: flex; gap: 6px; align-items: center; width: 100%; }
        .fc-edit-input {
          flex: 1; background: rgba(255,255,255,0.08);
          border: 1px solid rgba(99,102,241,0.5); border-radius: 10px;
          color: #e8e8f0; font-size: 14px; padding: 7px 11px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: box-shadow 0.2s;
        }
        .fc-edit-input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.22); }
        .fc-edit-save {
          padding: 7px 13px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border: none; border-radius: 8px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;
          transition: opacity 0.15s, transform 0.1s;
        }
        .fc-edit-save:hover { opacity: 0.88; }
        .fc-edit-save:active { transform: scale(0.95); }
        .fc-edit-cancel {
          padding: 7px 12px; background: transparent;
          color: rgba(232,232,240,0.4);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 8px;
          font-size: 12px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;
          transition: background 0.15s;
        }
        .fc-edit-cancel:hover { background: rgba(255,255,255,0.06); }

        /* INPUT BAR */
        .fc-inputbar {
          position: relative; z-index: 10; flex-shrink: 0;
          padding: 10px 16px 14px;
          background: rgba(8,8,14,0.92);
          backdrop-filter: blur(28px);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .fc-inputbar::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent);
        }
        .fc-input-wrap {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 5px 5px 5px 16px;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .fc-input-wrap:focus-within {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.09), 0 0 24px rgba(99,102,241,0.07);
        }
        .fc-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #e8e8f0; font-size: 14.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 8px 0; line-height: 1.4; min-width: 0;
        }
        .fc-input::placeholder { color: rgba(232,232,240,0.28); }

        /* SEND */
        .fc-send-btn {
          position: relative; width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          overflow: hidden;
        }
        .fc-send-btn:hover:not(:disabled) { transform: scale(1.07); box-shadow: 0 0 22px rgba(99,102,241,0.55); }
        .fc-send-btn:active:not(:disabled) { transform: scale(0.93); }
        .fc-send-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .fc-send-glow {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent 60%);
          pointer-events: none;
        }

        .fc-conn-lost {
          text-align: center; font-size: 11.5px; color: #f87171;
          padding-top: 7px; font-weight: 500;
        }

        [data-radix-popper-content-wrapper] { z-index: 999 !important; }
      `}</style>

      <div className="fc-shell">
        <AmbientOrbs />

        {/* HEADER */}
        <header className="fc-header">
          <div className="fc-header-left">
            <Link href="/chat" className="fc-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Avatar name={participantName} size={40} />
            <div className="fc-user-info">
              <span className="fc-username">{participantName}</span>
              <span className={`fc-status ${wsConnected ? 'online' : 'offline'}`}>
                <span className="fc-status-dot" />
                {wsConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="fc-header-right">
            <ThemeToggle />
          </div>
        </header>

        {/* MESSAGES */}
        <div className="fc-messages">
          {messages.length === 0 ? (
            <div className="fc-empty">
              <div className="fc-empty-icon">💬</div>
              <span className="fc-empty-title">No messages yet</span>
              <span className="fc-empty-sub">Start the conversation with {participantName}</span>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const isOwn = userId ? String(msg.sender_id) === String(userId) : false;
                const showSep = i === 0 ||
                  new Date(msg.created_at).toDateString() !== new Date(messages[i - 1].created_at).toDateString();

                return (
                  <React.Fragment key={msg.id}>
                    {showSep && <DateSep date={fmtDate(msg.created_at)} />}
                    <div className={`fc-row ${isOwn ? 'own' : 'other'}`}>
                      <div className="fc-bubble-wrap">
                        <div className={`fc-bubble${msg.status === 'sending' ? ' sending' : ''}`}>

                          {editingMessageId === msg.id ? (
                            <div className="fc-edit-row">
                              <input
                                className="fc-edit-input"
                                value={editingContent}
                                onChange={e => setEditingContent(e.target.value)}
                                autoFocus
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleEdit(msg.id);
                                  if (e.key === 'Escape') { setEditingMessageId(null); setEditingContent(''); }
                                }}
                              />
                              <button className="fc-edit-save" onClick={() => handleEdit(msg.id)}>Save</button>
                              <button className="fc-edit-cancel" onClick={() => { setEditingMessageId(null); setEditingContent(''); }}>✕</button>
                            </div>
                          ) : (
                            <p style={{ margin: 0 }}>{msg.content}</p>
                          )}

                          {isOwn && editingMessageId !== msg.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="fc-menu-btn">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="5" cy="12" r="2.2"/>
                                    <circle cx="12" cy="12" r="2.2"/>
                                    <circle cx="19" cy="12" r="2.2"/>
                                  </svg>
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" style={{
                                background: 'rgba(14,14,22,0.97)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '12px', padding: '6px',
                                minWidth: '130px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                              }}>
                                <DropdownMenuItem
                                  onClick={() => { setEditingMessageId(msg.id); setEditingContent(msg.content); }}
                                  style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', borderRadius:'8px', padding:'8px 10px', fontSize:'13px', color:'rgba(232,232,240,0.78)', fontFamily:'Plus Jakarta Sans,sans-serif' }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { if (confirm('Delete this message?')) handleDelete(msg.id); }}
                                  style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', borderRadius:'8px', padding:'8px 10px', fontSize:'13px', color:'#f87171', fontFamily:'Plus Jakarta Sans,sans-serif' }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <div className="fc-meta">
                          <span className="fc-time">{fmt(msg.created_at)}</span>
                          {isOwn && msg.status === 'sending' && <span className="fc-sending">· sending</span>}
                          {isOwn && msg.status === 'failed'  && <span className="fc-failed">· failed</span>}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="fc-inputbar">
          <form onSubmit={handleSendMessage}>
            <div className="fc-input-wrap">
              <input
                className="fc-input"
                placeholder={`Message ${participantName}…`}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                disabled={sending}
                autoComplete="off"
              />
              <SendButton disabled={!wsConnected || !messageInput.trim() || sending} />
            </div>
          </form>
          {!wsConnected && <p className="fc-conn-lost">⚠ Connection lost — reconnecting…</p>}
        </div>
      </div>
    </>
  );
}