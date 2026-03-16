'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { getMessages, connectWebSocket, getChats } from '@/lib/api';
import ThemeToggle from '@/components/theme-toggle';

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

}

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [token, setToken] = useState<string | null>(null);
const [userId, setUserId] = useState<string | null>(() => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return String(payload.sub);
  } catch {
    return null;
  }
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

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    // decode user id from JWT
    const payload = JSON.parse(atob(t.split('.')[1]));
    setToken(t);
    fetchChatDetails(t, payload.sub);
    fetchMessages(t);
    setupWebSocket(t);

    return () => {
      wsRef.current?.close();
    };
  }, [chatId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (t: string) => {
  try {
    const data = await getMessages(t, chatId);

    const normalized = data.map((m: Message) => ({
      ...m,
      sender_id: String(m.sender_id),
    }));

    setMessages(normalized);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

  const fetchChatDetails = async (t: string, currentUserId: string) => {
  try {
    const chats = await getChats(t);
    const chat = chats.find((c: any) => c.id === chatId);
    if (chat) {
      setParticipantName(chat.participant_name);
      setReceiverId(chat.participant_id);
    }
  } catch (error) {
    console.error('Failed to fetch chat details:', error);
  }
};

  const setupWebSocket = (t: string) => {
  const ws = connectWebSocket(t);

  ws.onopen = () => {
    setWsConnected(true);
  };

  ws.onmessage = (event) => {
    try {
      const data: WsMessage = JSON.parse(event.data);
      console.log("received id:", data.id);
console.log("pending ids:", sentTimes.current);

if (data.sender_id === userId) {
  const lastSent = Array.from(sentTimes.current.values()).pop();

  if (lastSent) {
    const latency = Date.now() - lastSent;
    console.log("WebSocket latency:", latency, "ms");
    sentTimes.current.clear();
  }
}
      if (data.chat_id !== chatId) return;

      setMessages((prev) => {
        if (!userId) {
          return [
            ...prev,
            {
              id: data.id ?? crypto.randomUUID(),
              sender_id: data.sender_id,
              content: data.content,
              created_at: data.created_at,
              status: 'sent',
            },
          ];
        }

        const incomingMessage: Message = {
  id: data.id ?? crypto.randomUUID(),
  sender_id: String(data.sender_id),
  content: data.content,
  created_at: data.created_at,
  status: 'sent',
};

const isOwnMessage = String(data.sender_id) === String(userId);

if (!isOwnMessage) return [...prev, incomingMessage];

        const matchIndex = prev.findIndex((message) => {
          if (data.id && message.id === data.id) return true;

          if (
            message.sender_id === userId &&
            message.content === data.content &&
            message.status === 'sending'  
          ) {
            const localTime = new Date(message.created_at).getTime();
            const serverTime = new Date(data.created_at).getTime();
            return Math.abs(localTime - serverTime) < 15000;
          }

          return false;
        });

        if (matchIndex === -1) return [...prev, incomingMessage];

        const next = [...prev];
        next[matchIndex] = {
          ...next[matchIndex],
          id: data.id ?? next[matchIndex].id,
          created_at: data.created_at,
          status: 'sent',
        };

        return next;
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

    ws.onerror = () => setWsConnected(false);
    ws.onclose = () => setWsConnected(false);

    wsRef.current = ws;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("userId", userId);

    const content = messageInput.trim();
    const createdAt = new Date().toISOString();
    const sentAt = Date.now();  
    const optimisticId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        sender_id: userId!,
        content,
        created_at: createdAt,
        status: 'sending',
      },
    ]);

    setMessageInput('');
    setSending(true);

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
sentTimes.current.set(optimisticId, sentAt);
wsRef.current.send(
  JSON.stringify({
    id: optimisticId,
    chat_id: chatId,
    content,
    receiver_id: receiverId,
    sender_id: userId,
    user1_id: userId,
    user2_id: receiverId,
    created_at: createdAt,
    sent_at: sentAt
  })
);
      } else {
        throw new Error('WebSocket is not connected');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageInput(content);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === optimisticId ? { ...message, status: 'failed' } : message
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{participantName}</h1>
            <p className="text-sm text-muted-foreground">
              {wsConnected && ' • Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-muted'}`} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-muted/20 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = userId ? String(message.sender_id) === String(userId) : false;

            return (
           <div key={message.id} className="flex w-full">
              <div
  className={`max-w-[80%] sm:max-w-md px-4 py-2.5 shadow-sm ${
    isOwnMessage
      ? 'ml-auto bg-primary text-primary-foreground rounded-2xl rounded-br-md'
      : 'mr-auto bg-muted text-foreground rounded-2xl rounded-bl-md'
  }`}
>
                <p className="break-words text-sm leading-relaxed">{message.content}</p>
                <div className="mt-1 flex items-center gap-2 justify-end">
                  <p
                    className={`text-[11px] ${
                      isOwnMessage
                        ? 'text-primary-foreground/80'
                        : 'text-foreground/60'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {isOwnMessage && message.status === 'sending' && (
                    <span className="text-[11px] text-primary-foreground/80">Sending…</span>
                  )}
                  {isOwnMessage && message.status === 'failed' && (
                    <span className="text-[11px] text-destructive">Failed</span>
                  )}
                </div>
              </div>
            </div>
          )})
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-border/50 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50"
      >
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sending}
            className="flex-1 rounded-full px-4"
          />
          <Button
            type="submit"
            disabled={!wsConnected || !messageInput.trim() || sending}
            className="bg-gradient-to-r from-primary to-accent rounded-full h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!wsConnected && (
          <p className="text-xs text-destructive mt-2">Connection lost. Reconnecting...</p>
        )}
      </form>
    </div>
    </>
  );
}
