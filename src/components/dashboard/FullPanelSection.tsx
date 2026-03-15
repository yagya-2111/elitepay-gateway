import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, IndianRupee, DollarSign, Clock, CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";

interface FullPanelSectionProps {
  userId: string;
}

const FullPanelSection = ({ userId }: FullPanelSectionProps) => {
  const [balance, setBalance] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [balRes, depRes, witRes] = await Promise.all([
        (supabase.from as any)("user_balances").select("*").eq("user_id", userId).single(),
        (supabase.from as any)("deposits").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
        (supabase.from as any)("withdrawal_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
      ]);
      if (balRes.data) setBalance(balRes.data);
      if (depRes.data) setDeposits(depRes.data);
      if (witRes.data) setWithdrawals(witRes.data);
    };
    fetchAll();
  }, [userId]);

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      status === "confirmed" ? "bg-primary/10 text-primary" :
      status === "rejected" ? "bg-destructive/10 text-destructive" :
      "bg-accent/10 text-accent"
    }`}>
      {status === "confirmed" ? <CheckCircle2 className="w-3 h-3" /> :
       status === "rejected" ? <XCircle className="w-3 h-3" /> :
       <Clock className="w-3 h-3" />}
      {status}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 shadow-card text-center">
          <IndianRupee className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">INR Balance</p>
          <p className="text-2xl font-display font-bold text-primary">₹{balance ? Number(balance.inr_balance).toLocaleString("en-IN") : "0"}</p>
        </div>
        <div className="glass-card p-6 shadow-card text-center">
          <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">USDT Balance</p>
          <p className="text-2xl font-display font-bold text-accent">${balance ? Number(balance.usdt_balance).toLocaleString() : "0"}</p>
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="glass-card p-6 shadow-card">
        <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-primary" /> Recent Deposits
        </h3>
        {deposits.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No deposits yet</p>
        ) : (
          <div className="space-y-3">
            {deposits.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div>
                  <p className="text-foreground font-medium text-sm">${d.amount_usd} × ₹{d.rate}</p>
                  <p className="text-xs text-muted-foreground">{d.fund_type} • {new Date(d.created_at).toLocaleString()}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Withdrawals */}
      <div className="glass-card p-6 shadow-card">
        <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent" /> Recent Withdrawals
        </h3>
        {withdrawals.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No withdrawals yet</p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div>
                  <p className="text-foreground font-medium text-sm">{w.currency} {Number(w.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{w.withdrawal_type} • {new Date(w.created_at).toLocaleString()}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullPanelSection;
