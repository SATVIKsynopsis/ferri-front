'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getChats, logout } from '@/lib/api';
import { MessageSquare, LogOut, Plus, Search, User } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';

interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  participant_id: string;
  participant_name: string;
  participant_username: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    fetchChats(t);
  }, []);

  const fetchChats = async (t: string) => {
    try {
      setLoading(true);
      const data = await getChats(t);
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  const filteredChats = chats.filter((chat) =>
    chat.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participant_username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">{filteredChats.length} conversations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/chat/new')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chat List */}
        {filteredChats.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No conversations yet</p>
              <Button
                onClick={() => router.push('/chat/new')}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Start a conversation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredChats.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`} className="group">
                <Card className="cursor-pointer transition-all hover:border-primary/50 hover:bg-card/80">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {chat.participant_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{chat.participant_username}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}