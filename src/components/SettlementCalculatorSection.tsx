import { Calculator, Clock } from "lucide-react";

const SettlementCalculatorSection = () => {
  const accountLimit = 10000000;
  const usedPercent = 87;
  const inrVolume = Math.floor(accountLimit * usedPercent / 100);
  const grossUsdt = Math.floor(inrVolume / 98);
  const charges = Math.floor(grossUsdt * 0.02);
  const finalUsdt = grossUsdt - charges;

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Calculator</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-foreground mb-3">
            Settlement <span className="text-gradient-gold">Calculator</span>
          </h2>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-xs text-muted-foreground font-mono">Account Limit</p>
              <p className="text-lg sm:text-xl font-display font-bold text-foreground">₹{(accountLimit).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">Used Volume</p>
              <p className="text-lg sm:text-xl font-display font-bold text-accent">{usedPercent}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">INR Volume</p>
              <p className="text-lg sm:text-xl font-display font-bold text-foreground">₹{inrVolume.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2 mb-6">
            <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${usedPercent}%` }} />
          </div>

          <div className="glow-line w-full mb-6" />

          <p className="text-xs text-muted-foreground font-mono mb-4">USDT = Total Volume ÷ 98</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 border border-border/30 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">Gross USDT</p>
              <p className="text-xl font-display font-bold text-foreground">${grossUsdt.toLocaleString()}</p>
            </div>
            <div className="bg-secondary/50 border border-border/30 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">Charges (2%)</p>
              <p className="text-xl font-display font-bold text-destructive">-${charges.toLocaleString()}</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">Final USDT</p>
              <p className="text-xl font-display font-bold text-primary">${finalUsdt.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
            <Clock className="w-3 h-3" />
            Settlement Window: <span className="text-primary font-bold">9:00 PM</span> — <span className="text-primary font-bold">9:00 AM</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettlementCalculatorSection;
