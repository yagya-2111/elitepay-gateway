import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ArrowRightLeft } from "lucide-react";

const walletPrefixes = [
  "TYud5L", "TNpXk9", "TRxvHn", "TWd4kQ", "TJfB7m", "TKzXcP",
  "TX8rVn", "TQm3Lp", "TFhN7s", "TBcR2w", "THjK4x", "TLmP6v",
  "TPqS8y", "TDwU3t", "TGnW5r", "TZaY9q", "TCeA1u", "TIgC7o",
  "TViE2n", "TXkG4m",
];

const FUND_TYPES = [
  { label: "Pure Fund", rate: 98, color: "text-primary" },
  { label: "Gaming Fund", rate: 105, color: "text-accent" },
  { label: "Stock Fund", rate: 110, color: "text-success" },
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
    const initial = Array.from({ length: 12 }, (_, i) => generateExTxn(i));
    setTxns(initial);
    let counter = 12;
    const interval = setInterval(() => {
      setTxns((prev) => {
        const newTxn = generateExTxn(counter++);
        return [newTxn, ...prev.slice(0, 11)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Live Exchange</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Real-Time USDT → INR <span className="text-gradient">Exchange</span>
          </h2>
          <p className="text-muted-foreground text-lg">Watch live USDT to INR conversions happening right now</p>
        </div>
        <div className="glass-card overflow-hidden shadow-card">
          <div className="grid grid-cols-5 gap-3 p-4 border-b border-border/50 text-sm font-medium text-muted-foreground hidden sm:grid">
            <span>Wallet</span>
            <span>USDT</span>
            <span>INR Received</span>
            <span>Fund Type</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-border/30">
            {txns.map((txn) => (
              <div key={txn.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-4 items-center text-sm hover:bg-secondary/30 transition-colors animate-fade-in-up">
                <span className="text-foreground font-mono text-xs truncate">{txn.wallet}</span>
                <span className="text-foreground font-semibold flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-primary" /> ${txn.usdAmount}
                </span>
                <span className="text-success font-semibold">{txn.inrAmount}</span>
                <span className={`text-xs font-medium ${txn.fund.color}`}>{txn.fund.label}</span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full w-fit ${
                  txn.status === "completed"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}>
                  {txn.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {txn.status === "completed" ? "Completed" : "Processing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveExchangeTransactions;
