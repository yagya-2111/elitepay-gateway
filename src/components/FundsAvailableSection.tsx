import { Landmark, TrendingUp, Vote, DollarSign } from "lucide-react";

const funds = [
  { icon: Landmark, label: "Gaming Fund Available", amount: "₹53,52,63,005", color: "text-accent" },
  { icon: TrendingUp, label: "Stock Fund Available", amount: "₹1,94,89,52,838", color: "text-primary" },
  { icon: Vote, label: "Political Fund Available", amount: "₹3,04,26,28,384", color: "text-accent" },
  { icon: DollarSign, label: "USDT Fund Available", amount: "$40,726 USDT", color: "text-primary" },
];

const FundsAvailableSection = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">💰 Updated Daily</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-foreground mb-3">
            Funds <span className="text-gradient-gold">Available</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {funds.map((f, i) => (
            <div key={i} className="glass-card-hover p-4 sm:p-6 text-center group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{f.label}</p>
              <p className={`text-lg sm:text-2xl font-display font-extrabold ${f.color}`}>{f.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundsAvailableSection;
