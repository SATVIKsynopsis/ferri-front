'use client';

import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-4 gap-px opacity-5 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-primary" />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute -bottom-32 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/10 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-sm font-semibold text-primary">Built on Rust • Ultra-Fast</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold mb-8 text-balance leading-tight">
          The Future of
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Real-Time Chat
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance">
          Lightning-fast messaging built on Rust. Sub-millisecond latency, enterprise security, and effortless scaling for teams of any size.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            <Play className="mr-2 w-4 h-4" /> Watch Demo
          </Button>
        </div>

        {/* Hero visual */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-primary/20 to-transparent p-1 rounded-2xl">
            <div className="bg-card rounded-2xl p-8 border border-border backdrop-blur">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-left space-y-2">
                  <div className="text-sm font-mono text-secondary">$ npm create rustchat@latest</div>
                  <div className="text-xs text-muted-foreground font-mono space-y-1">
                    <div>✓ Installing dependencies...</div>
                    <div>✓ Configuring Rust runtime...</div>
                    <div>✓ Initializing WebSocket server...</div>
                    <div className="text-primary">✓ Ready in 2.3s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary">1ms</div>
            <div className="text-sm text-muted-foreground">Message Latency</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">99.99%</div>
            <div className="text-sm text-muted-foreground">Uptime SLA</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">10M+</div>
            <div className="text-sm text-muted-foreground">Concurrent Users</div>
          </div>
        </div>
      </div>
    </section>
  );
}
