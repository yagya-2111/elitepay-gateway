import { CheckCircle2 } from "lucide-react";

const deposits = [
  { type: "Saving Account", amount: "300 USDT" },
  { type: "Current Account", amount: "400 USDT" },
  { type: "Corporate Account", amount: "500 USDT" },
  { type: "UPI Money Deposit/Withdrawal", amount: "200 USDT (Fixed)" },
];

const SecurityDepositsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Deposits</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-foreground mb-3">
            Security <span className="text-gradient">Deposits</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {deposits.map((d, i) => (
            <div key={i} className="glass-card-hover p-4 sm:p-6 text-center">
              <p className="text-foreground font-display font-bold text-xs sm:text-sm mb-2">{d.type}</p>
              <p className="text-xl sm:text-2xl font-display font-extrabold text-primary mb-2">{d.amount}</p>
              <div className="flex items-center justify-center gap-1 text-primary text-xs">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </div>
            </div>
          ))}
        </div>

        {/* UPI Money Work info */}
        <div className="glass-card p-4 sm:p-6 shadow-card mt-6 text-center">
          <h3 className="text-foreground font-display font-bold text-base mb-2">UPI Money Work</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Commission: <span className="text-primary font-bold">12%</span> • USDT Fund • Volume: <span className="text-accent font-bold">100K/Day</span> • Retail & Corporate accounts supported
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecurityDepositsSection;
