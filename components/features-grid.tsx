'use client';

import { Zap, Shield, Users, BarChart3, Lock, Cpu, GitBranch, Layers } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Sub-Millisecond Latency',
    description: 'Message delivery in under 1ms. Built with Rust for maximum performance without compromise.',
    color: 'from-primary/20 to-primary/5',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, zero-knowledge architecture, and compliance with GDPR, HIPAA, and SOC2.',
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    icon: Users,
    title: 'Unlimited Scalability',
    description: 'From 10 users to 10 million. Auto-scaling infrastructure that grows with your team.',
    color: 'from-accent/20 to-accent/5',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Advanced insights into message flow, user engagement, and platform performance.',
    color: 'from-primary/20 to-secondary/5',
  },
  {
    icon: Lock,
    title: 'Data Sovereignty',
    description: 'Deploy anywhere. Self-hosted, cloud, or hybrid deployments with full data control.',
    color: 'from-secondary/20 to-accent/5',
  },
  {
    icon: Cpu,
    title: 'Blazing Performance',
    description: 'Rust-based engine optimized for minimal resource usage and maximum throughput.',
    color: 'from-accent/20 to-primary/5',
  },
  {
    icon: GitBranch,
    title: 'Open API',
    description: 'Comprehensive REST and WebSocket APIs for seamless integration with your stack.',
    color: 'from-primary/20 to-accent/5',
  },
  {
    icon: Layers,
    title: 'Advanced Moderation',
    description: 'AI-powered content moderation, spam detection, and custom filtering rules.',
    color: 'from-secondary/20 to-primary/5',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for Performance
            <span className="block text-primary">And Scale</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for enterprise-grade real-time communication, powered by Rust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
