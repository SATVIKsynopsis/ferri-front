'use client';
import MetricBar from './metric-bar';

import { TrendingUp } from 'lucide-react';

export default function PerformanceSection() {
  return (
    <section id="performance" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-sm font-semibold text-primary">Performance Metrics</span>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Rust Powers
              <span className="block text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text">
                Industry-Leading Speed
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Compared to traditional chat platforms, RustChat delivers 10x faster message delivery and 50x lower memory consumption. 
              Our Rust-based architecture eliminates garbage collection overhead and unsafe memory access.
            </p>

            <div className="space-y-6">
              <MetricBar label="Message Latency" value="1ms" comparison="50x faster than Node.js alternatives" percent={2} color="from-primary" />
              <MetricBar label="Memory Usage" value="2MB per 1K users" comparison="100x more efficient than competitors" percent={2} color="from-secondary" />
              <MetricBar label="Throughput" value="100K msgs/sec" comparison="Per single server instance" percent={90} color="from-accent" />
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-1 rounded-2xl">
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-primary mb-4">Message Delivery Timeline</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Network Transit', time: '0.2ms', color: 'from-primary' },
                        { label: 'Processing', time: '0.3ms', color: 'from-secondary' },
                        { label: 'Database Write', time: '0.2ms', color: 'from-accent' },
                        { label: 'WebSocket Broadcast', time: '0.3ms', color: 'from-primary' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                            <div className={`h-2 rounded-full bg-gradient-to-r ${item.color} to-transparent w-${(idx + 1) * 20}`} style={{ width: `${(idx + 1) * 20}%` }} />
                          </div>
                          <div className="text-sm font-mono font-semibold text-primary">{item.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Total: 1.0ms End-to-End</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-secondary mb-4">Concurrent Connections</h3>
                    <div className="flex items-end gap-2">
                      {[40, 60, 80, 95, 100, 85, 70].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div className={`w-full rounded-t bg-gradient-to-t from-secondary to-transparent`} style={{ height: `${val * 2}px` }} />
                          <span className="text-xs text-muted-foreground">{idx}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
