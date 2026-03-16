import { ArrowRight, Zap, Shield, MessageCircle, Cpu, Users, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FeaturesGrid from '@/components/features-grid';
import PerformanceSection from '@/components/performance-section';
import CTASection from '@/components/cta-section';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Rust Chat - Lightning Fast Real-Time Communication',
  description: 'Built in Rust for maximum performance. Sub-millisecond message delivery, enterprise-grade security, and seamless scalability.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <PerformanceSection />
      <CTASection />
      <Footer />
    </div>
  );
}
