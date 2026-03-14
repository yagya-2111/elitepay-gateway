import { Building2, CreditCard, Wallet, ArrowRightLeft, Banknote, Globe } from "lucide-react";

const accountTypes = [
  { icon: Building2, name: "Savings Account", desc: "Direct bank transfers with instant settlement", supported: "200+ Banks" },
  { icon: CreditCard, name: "Current Account", desc: "Business accounts with high-limit transactions", supported: "All Major Banks" },
  { icon: Wallet, name: "UPI Wallet", desc: "Lightning-fast UPI payments @handle", supported: "All UPI Apps" },
  { icon: ArrowRightLeft, name: "USDT TRC20", desc: "Crypto-to-INR instant conversion", supported: "Tron Network" },
  { icon: Banknote, name: "NEFT / RTGS", desc: "High-value bank-to-bank transfers", supported: "Pan-India" },
  { icon: Globe, name: "International Wire", desc: "Cross-border payment support", supported: "Coming Soon" },
];

const BankAccountTypes = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Payment Methods</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Supported <span className="text-gradient">Account Types</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Multiple payment channels for maximum flexibility and convenience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountTypes.map((a, i) => (
            <div key={i} className="glass-card-hover p-6 group relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <a.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-display font-bold text-base mb-1">{a.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{a.desc}</p>
                  <span className="inline-block text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{a.supported}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankAccountTypes;
