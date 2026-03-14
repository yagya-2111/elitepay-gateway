import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ArrowRightLeft, TrendingUp } from "lucide-react";

const walletPrefixes = [
  "TYud5L", "TNpXk9", "TRxvHn", "TWd4kQ", "TJfB7m", "TKzXcP",
  "TX8rVn", "TQm3Lp", "TFhN7s", "TBcR2w", "THjK4x", "TLmP6v",
];

const FUND_TYPES = [
  { label: "Pure", rate: 98, color: "text-primary" },
  { label: "Gaming", rate: 105, color: "text-accent" },
  { label: "Stock", rate: 110, color: "text-primary" },
];

interface ExTxn {
  id: number;
  wallet: string;
  usdAmount: number;
  inrAmount: string;
  fund: typeof FUND_TYPES[number];
  status: "completed" | "processing";
  time: string;
}

const generateExTxn = (id: number): ExTxn => {
  const fund = FUND_TYPES[Math.floor(Math.random() * FUND_TYPES.length)];
  const usd = Math.floor(Math.random() * 950) + 50;
  const inr = usd * fund.rate;
  const wallet = walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)];
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    id,
    wallet: `${wallet}...${suffix}`,
    usdAmount: usd,
    inrAmount: `₹${inr.toLocaleString("en-IN")}`,
    fund,
    status: Math.random() > 0.25 ? "completed" : "processing",
    time: `${Math.floor(Math.random() * 59) + 1}s ago`,
  };
};

const LiveExchangeTransactions = () => {
  const [txns, setTxns] = useState<ExTxn[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 6 }, (_, i) => generateExTxn(i));
    setTxns(initial);
    let counter = 6;
    const interval = setInterval(() => {
      setTxns((prev) => {
        const newTxn = generateExTxn(counter++);
        return [newTxn, ...prev.slice(0, 5)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="glow-dot" />
                <div className="absolute inset-0 glow-dot animate-pulse-ring" />
              </div>
              <span className="text-xs font-mono text-accent uppercase tracking-wider">Live Exchange</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">
              USDT → INR <span className="text-gradient-gold">Conversions</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-card text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Volume:</span>
            <span className="text-primary font-bold font-mono">$2.4M</span>
            <span className="text-muted-foreground">/24h</span>
          </div>
        </div>

        {/* Horizontal ticker-style cards */}
        <div className="space-y-3">
          {txns.map((txn) => (
            <div
              key={txn.id}
              className="glass-card p-4 animate-slide-up flex items-center gap-4 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                <span className="font-mono text-xs text-muted-foreground truncate">{txn.wallet}</span>
                <span className="text-foreground font-bold font-display">${txn.usdAmount}</span>
                <span className="text-primary font-bold">{txn.inrAmount}</span>
                <span className={`text-xs font-medium ${txn.fund.color}`}>{txn.fund.label} @₹{txn.fund.rate}</span>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    txn.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}>
                    {txn.status === "completed" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {txn.status === "completed" ? "Done" : "Pending"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{txn.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveExchangeTransactions;
