import { Server, Globe, Zap, Shield, Clock, Lock } from "lucide-react";

const metrics = [
  { icon: Server, label: "Network Uptime", value: "99.97%", color: "text-primary" },
  { icon: Zap, label: "Avg. Latency", value: "12ms", color: "text-accent" },
  { icon: Globe, label: "Active Nodes", value: "48", color: "text-primary" },
  { icon: Clock, label: "TRC20 Confirms", value: "~19 blocks", color: "text-accent" },
  { icon: Shield, label: "Countries", value: "12+", color: "text-primary" },
  { icon: Lock, label: "Encryption", value: "AES-256", color: "text-accent" },
];

const blocks = [
  { hash: "0x7a3f...e9b2", txns: 142, time: "2s ago" },
  { hash: "0x4c1d...a8f3", txns: 89, time: "5s ago" },
  { hash: "0x9e2b...c4d1", txns: 216, time: "8s ago" },
  { hash: "0x1f8a...b7e5", txns: 173, time: "11s ago" },
];

const NetworkInfraSection = () => {
  return (
    <section className="py-24 relative bg-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Infrastructure</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Network & <span className="text-gradient">Infrastructure</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {metrics.map((m, i) => (
            <div key={i} className="glass-card-hover p-4 text-center">
              <m.icon className={`w-5 h-5 ${m.color} mx-auto mb-2`} />
              <p className={`text-lg sm:text-xl font-display font-extrabold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6 shadow-card">
          <h3 className="text-foreground font-display font-bold text-sm mb-4 flex items-center gap-2">
            <div className="glow-dot" /> TRC20 Blocks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {blocks.map((b, i) => (
              <div key={i} className="bg-secondary/50 border border-border/30 rounded-xl p-3">
                <p className="text-primary font-mono text-xs font-bold">{b.hash}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground text-[10px]">{b.txns} txns</span>
                  <span className="text-muted-foreground text-[10px]">{b.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkInfraSection;
