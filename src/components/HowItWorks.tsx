import { UserPlus, Shield, ArrowRightLeft, Wallet, CheckCircle } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Create Account", desc: "Sign up in 30 seconds with email verification" },
  { icon: Shield, step: "02", title: "Complete KYC", desc: "Upload Aadhaar & PAN for instant verification" },
  { icon: ArrowRightLeft, step: "03", title: "Deposit & Exchange", desc: "Send USDT or INR and convert at best rates" },
  { icon: Wallet, step: "04", title: "Withdraw Funds", desc: "Instant withdrawal to your bank account" },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative bg-glow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Process</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">Four simple steps to get started</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="glass-card-hover p-6 text-center relative">
              <div className="text-3xl font-display font-extrabold text-primary/20 mb-4">{s.step}</div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-bold text-base mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-[2px] bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
