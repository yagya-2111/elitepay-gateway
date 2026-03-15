import { Shield, Zap, Clock, HeadphonesIcon, BarChart3, Lock, Globe, CreditCard, Wallet, Building2 } from "lucide-react";

const features = [
  { icon: Shield, title: "Military-Grade Security", desc: "End-to-end AES-256 encryption protects every transaction around the clock.", tag: "Security" },
  { icon: Zap, title: "Instant Settlements", desc: "Funds reach your account within minutes, not days. Lightning-fast processing.", tag: "Speed" },
  { icon: Clock, title: "99.97% Uptime SLA", desc: "Industry-leading reliability backed by enterprise infrastructure.", tag: "Reliability" },
  { icon: HeadphonesIcon, title: "24/7 Live Support", desc: "Expert support team available every minute of every day via Telegram.", tag: "Support" },
  { icon: BarChart3, title: "Real-time Dashboard", desc: "Track transactions, balances, and analytics with live data streams.", tag: "Analytics" },
  { icon: Lock, title: "KYC Verified", desc: "Full compliance with regulatory standards. Your data is always protected.", tag: "Compliance" },
  { icon: Globe, title: "Multi-Network", desc: "TRC20 / BEP20 / ERC20 networks supported for seamless transactions.", tag: "Networks" },
  { icon: CreditCard, title: "UPI & USDT", desc: "Accept UPI, bank transfers, and crypto (USDT TRC20) payments.", tag: "Multi-method" },
  { icon: Wallet, title: "Smart Wallets", desc: "Integrated wallet system with instant internal transfers.", tag: "Wallets" },
  { icon: Building2, title: "40+ Bank Accounts", desc: "Link multiple bank accounts and manage withdrawals seamlessly.", tag: "Banking" },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24 relative bg-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Why <span className="text-gradient">GCL PAY</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Built for businesses that demand speed, security, and scale.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card-hover p-4 sm:p-5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-mono text-primary/60 bg-primary/5 rounded-bl-lg">{f.tag}</div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-bold text-xs sm:text-sm mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
