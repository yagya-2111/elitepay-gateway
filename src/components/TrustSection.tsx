import { Shield, Award, FileCheck, BadgeCheck, Lock, Fingerprint, Eye, Server } from "lucide-react";

const badges = [
  { icon: Shield, label: "PCI DSS Level 1" },
  { icon: Award, label: "ISO 27001 Certified" },
  { icon: FileCheck, label: "RBI Licensed" },
  { icon: BadgeCheck, label: "NPCI Authorized" },
  { icon: Lock, label: "256-bit Encryption" },
  { icon: Fingerprint, label: "Biometric Auth" },
  { icon: Eye, label: "Fraud Detection AI" },
  { icon: Server, label: "99.99% SLA" },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Trusted & <span className="text-gradient">Secure</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your security is our top priority. We comply with all regulatory standards.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <div key={i} className="glass-card p-5 text-center hover:border-primary/30 transition-all hover:shadow-blue-glow">
              <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <span className="text-foreground font-medium text-sm">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
