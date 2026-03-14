import { Shield, Award, FileCheck, BadgeCheck, Lock, Fingerprint, Eye, Server } from "lucide-react";

const badges = [
  { icon: Shield, label: "PCI DSS Level 1", desc: "Highest payment security" },
  { icon: Award, label: "ISO 27001", desc: "Certified security" },
  { icon: FileCheck, label: "RBI Licensed", desc: "Fully regulated" },
  { icon: BadgeCheck, label: "NPCI Authorized", desc: "Official partner" },
  { icon: Lock, label: "AES-256 Encryption", desc: "Military-grade" },
  { icon: Fingerprint, label: "Biometric Auth", desc: "Multi-factor" },
  { icon: Eye, label: "Fraud Detection AI", desc: "Real-time monitoring" },
  { icon: Server, label: "99.99% SLA", desc: "Enterprise uptime" },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative">
      <div className="glow-line w-full mb-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Trust & Security</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Enterprise <span className="text-gradient-gold">Security</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your security is non-negotiable. We exceed every regulatory standard.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div key={i} className="glass-card-hover p-5 text-center group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-display font-bold text-sm block">{b.label}</span>
              <span className="text-[11px] text-muted-foreground">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
