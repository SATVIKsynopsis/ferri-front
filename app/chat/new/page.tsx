'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createChat } from '@/lib/api';

export default function NewChatPage() {
  const router = useRouter();
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!receiverId.trim()) {
      setError('Receiver ID is required');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const chat = await createChat(token, receiverId.trim());
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
            <p className="text-muted-foreground">Create a new conversation with one or more people</p>
          </div>
        </div>

        {/* Creation Card */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              Create New Chat
            </CardTitle>
            <CardDescription>
              Enter a chat name and add participants (optional)
            </CardDescription>
          </CardHeader>

         <CardContent className="pt-6">
  <form onSubmit={handleCreateChat} className="space-y-6">
    
    {/* Receiver ID */}
    <div className="space-y-2">
      <Label htmlFor="receiverId" className="text-foreground">
        Receiver ID <span className="text-accent">*</span>
      </Label>
      <Input
        id="receiverId"
        placeholder="Enter user UUID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="border-border bg-muted text-foreground placeholder-muted-foreground focus:border-primary"
        disabled={isLoading}
      />
      <p className="text-xs text-muted-foreground">
        Enter the UUID of the user you want to chat with
      </p>
    </div>

    {/* Error Message */}
    {error && (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Chat
                    </>
                  )}
                </Button>
                <Link href="/chat" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4">
          <h3 className="mb-3 font-semibold text-foreground">Tips for Creating Chats</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">•</span>
              <span>Use clear, descriptive names so participants understand the chat purpose</span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary">•</span>
              <span>Add participants now or invite them later from the chat settings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">•</span>
              <span>You can always edit the chat name or add more participants later</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
