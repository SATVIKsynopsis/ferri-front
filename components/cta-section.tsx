'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-3xl -z-10 blur-2xl" />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-1 rounded-2xl border border-border">
          <div className="bg-card rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience
              <span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Lightning-Fast Chat?
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of teams and enterprises already experiencing the future of real-time communication. 
              Start free, upgrade when you need to scale.
            </p>

            <div className="space-y-6 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Starter', price: 'Free', features: ['Up to 100 users', '100GB storage', 'Community support'] },
                  { title: 'Pro', price: '$99', features: ['Up to 10K users', 'Unlimited storage', '24/7 support', 'API access'], highlighted: true },
                  { title: 'Enterprise', price: 'Custom', features: ['Unlimited users', 'Dedicated support', 'Custom integrations', 'SLA guarantee'] },
                ].map((plan, idx) => (
                  <div key={idx} className={`rounded-xl border p-6 transition-all ${plan.highlighted ? 'bg-primary/10 border-primary/50 ring-2 ring-primary/30 scale-105' : 'border-border bg-card/50 hover:border-border'}`}>
                    <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-sm text-muted-foreground">/month</span>}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : 'bg-card border border-border hover:bg-muted'}`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.title === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Account Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Start building today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
