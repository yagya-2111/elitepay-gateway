import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

const upiIds = [
  "rahul.sharma@paytm", "priya.verma@okicici", "amit.kumar@ybl", "neha.singh@oksbi",
  "vijay.patel@axl", "sunita.devi@upi", "rajesh.gupta@paytm", "meena.bai@okhdfc",
  "arun.joshi@ybl", "pooja.rani@oksbi", "deepak.mishra@axl", "kavita.kumari@upi",
  "mohit.agarwal@paytm", "anita.sharma@okicici", "sanjay.yadav@ybl", "rekha.pandey@oksbi",
  "manoj.tiwari@axl", "geeta.devi@upi", "suresh.chauhan@paytm", "lata.kumari@okhdfc",
];

interface Txn {
  id: number;
  upi: string;
  amount: string;
  status: "processed" | "processing";
  time: string;
}

const generateTxn = (id: number): Txn => {
  const amt = (Math.floor(Math.random() * 900) + 100) * 100;
  const formatted = `₹${(amt).toLocaleString("en-IN")}`;
  return {
    id,
    upi: upiIds[Math.floor(Math.random() * upiIds.length)],
    amount: formatted,
    status: Math.random() > 0.3 ? "processed" : "processing",
    time: `${Math.floor(Math.random() * 59) + 1}s ago`,
  };
};

const LiveTransactions = () => {
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 12 }, (_, i) => generateTxn(i));
    setTxns(initial);
    let counter = 12;
    const interval = setInterval(() => {
      setTxns((prev) => {
        const newTxn = generateTxn(counter++);
        return [newTxn, ...prev.slice(0, 11)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative bg-blue-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success font-medium">Live Transactions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Real-Time UPI <span className="text-gradient">Processing</span>
          </h2>
          <p className="text-muted-foreground text-lg">Watch transactions being processed in real-time</p>
        </div>
        <div className="glass-card overflow-hidden shadow-card">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-border/50 text-sm font-medium text-muted-foreground">
            <span>UPI ID</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          <div className="divide-y divide-border/30">
            {txns.map((txn) => (
              <div key={txn.id} className="grid grid-cols-4 gap-4 p-4 items-center text-sm hover:bg-secondary/30 transition-colors animate-fade-in-up">
                <span className="text-foreground font-mono text-xs truncate">{txn.upi}</span>
                <span className="text-foreground font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-success" /> {txn.amount}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full w-fit ${
                  txn.status === "processed"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}>
                  {txn.status === "processed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {txn.status === "processed" ? "Processed" : "Processing"}
                </span>
                <span className="text-muted-foreground text-xs">{txn.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTransactions;
