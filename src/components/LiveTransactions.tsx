import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ArrowUpRight, Zap } from "lucide-react";

const upiIds = [
  "rahul.sharma@paytm", "priya.verma@okicici", "amit.kumar@ybl", "neha.singh@oksbi",
  "vijay.patel@axl", "sunita.devi@upi", "rajesh.gupta@paytm", "meena.bai@okhdfc",
  "arun.joshi@ybl", "pooja.rani@oksbi", "deepak.mishra@axl", "kavita.kumari@upi",
  "mohit.agarwal@paytm", "anita.sharma@okicici", "sanjay.yadav@ybl", "rekha.pandey@oksbi",
  "manoj.tiwari@axl", "geeta.devi@upi", "suresh.chauhan@paytm", "lata.kumari@okhdfc",
];

const bankNames = ["SBI", "HDFC", "ICICI", "Axis", "PNB", "BOB", "Kotak", "IndusInd", "Yes Bank", "Union Bank"];

interface Txn {
  id: number;
  upi: string;
  amount: string;
  amountRaw: number;
  status: "processed" | "processing";
  time: string;
  bank: string;
}

const generateTxn = (id: number): Txn => {
  const amt = (Math.floor(Math.random() * 900) + 100) * 100;
  return {
    id,
    upi: upiIds[Math.floor(Math.random() * upiIds.length)],
    amount: `₹${amt.toLocaleString("en-IN")}`,
    amountRaw: amt,
    status: Math.random() > 0.2 ? "processed" : "processing",
    time: `${Math.floor(Math.random() * 59) + 1}s ago`,
    bank: bankNames[Math.floor(Math.random() * bankNames.length)],
  };
};

const LiveTransactions = () => {
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 8 }, (_, i) => generateTxn(i));
    setTxns(initial);
    let counter = 8;
    const interval = setInterval(() => {
      setTxns((prev) => {
        const newTxn = generateTxn(counter++);
        return [newTxn, ...prev.slice(0, 7)];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="glow-dot" />
                <div className="absolute inset-0 glow-dot animate-pulse-ring" />
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-wider">Live Feed</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">
              UPI <span className="text-gradient">Transactions</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-card text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Processing</span>
            <span className="text-accent font-bold font-mono">2,847</span>
            <span className="text-muted-foreground">txns/min</span>
          </div>
        </div>

        {/* Card Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {txns.map((txn) => (
            <div
              key={txn.id}
              className="glass-card p-4 animate-scale-in hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  txn.status === "processed"
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}>
                  {txn.status === "processed" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                  {txn.status === "processed" ? "Done" : "Processing"}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{txn.time}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                <span className="text-xl font-display font-bold text-foreground">{txn.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[140px]">{txn.upi}</span>
                <span className="text-[10px] text-primary/60 font-medium">{txn.bank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveTransactions;
