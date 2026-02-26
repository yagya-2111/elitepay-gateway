import { Shield, Zap, Clock, HeadphonesIcon, BarChart3, Lock, Globe, CreditCard } from "lucide-react";

const features = [
  { icon: Shield, title: "Bank-Grade Security", desc: "End-to-end encryption with 256-bit SSL. Your transactions are protected 24/7." },
  { icon: Zap, title: "Instant Settlements", desc: "Get your funds settled within minutes. No more waiting for days." },
  { icon: Clock, title: "99.99% Uptime", desc: "Industry-leading reliability. Your business never stops." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Dedicated support team available round the clock via chat & call." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track every transaction with detailed insights and reports." },
  { icon: Lock, title: "PCI DSS Compliant", desc: "Highest level of payment security standards compliance." },
  { icon: Globe, title: "Multi-Bank Support", desc: "Supports all major Indian banks and payment methods." },
  { icon: CreditCard, title: "UPI & Cards", desc: "Accept UPI, credit cards, debit cards, net banking & wallets." },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">ElitePay</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by thousands of businesses across India for secure, fast, and reliable payment processing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-blue-glow group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
