'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { searchUsers, createChat } from '@/lib/api';

interface User {
  id: string;
  name: string;
  username: string;
}

export default function NewChatPage() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔍 SEARCH USERS
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

  // 💬 CREATE CHAT
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Start a New Chat</h1>
            <p className="text-muted-foreground">
              Search users and start a conversation
            </p>
          </div>
        </div>

        {/* Search Card */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              Find User
            </CardTitle>
            <CardDescription>
              Search by username and start chatting instantly
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">

            {/* Search Input */}
            <Input
              placeholder="Search by username..."
              value={query}
              onChange={handleSearch}
              disabled={isLoading}
              className="border-border bg-muted text-foreground placeholder-muted-foreground focus:border-primary"
            />

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Results */}
            <div className="space-y-2">
              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelect(u.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                    {u.name[0].toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-sm text-muted-foreground">@{u.username}</p>
                  </div>

                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              ))}
            </div>

            {/* Empty state */}
            {query.length >= 2 && results.length === 0 && !error && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No users found
              </p>
            )}

          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4">
          <h3 className="mb-3 font-semibold text-foreground">Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Search using exact or partial usernames</span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary">•</span>
              <span>Click a user to instantly start chatting</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">•</span>
              <span>Chats are created automatically on selection</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}