import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FloatingINR from "@/components/FloatingINR";
import { Users, Image, Building2, CheckCircle2, XCircle, ShieldCheck, Menu, ArrowRightLeft, ArrowDownToLine, Wallet, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TabType = "payments" | "kyc" | "users" | "banks" | "deposits" | "withdrawals" | "balances";

const TABS: { value: TabType; label: string; icon: any }[] = [
  { value: "payments", label: "Payments", icon: Image },
  { value: "deposits", label: "Deposits", icon: ArrowRightLeft },
  { value: "withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
  { value: "balances", label: "Balances", icon: Wallet },
  { value: "kyc", label: "KYC", icon: ShieldCheck },
  { value: "users", label: "Users", icon: Users },
  { value: "banks", label: "Banks", icon: Building2 },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>("payments");
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editBalance, setEditBalance] = useState<any>(null);
  const [editInr, setEditInr] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/dashboard"); return; }
      setIsAdmin(true);
      fetchAll();
    };
    init();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    const [profilesRes, paymentsRes, banksRes, kycRes, depositsRes, withdrawalsRes, balancesRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("payment_screenshots").select("*").order("created_at", { ascending: false }),
      supabase.from("bank_accounts").select("*"),
      supabase.from("kyc_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("deposits" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("withdrawal_requests" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("user_balances" as any).select("*"),
    ]);
    setUsers(profilesRes.data || []);
    setPayments(paymentsRes.data || []);
    setBankAccounts(banksRes.data || []);
    setKycDocs(kycRes.data || []);
    setDeposits(depositsRes.data || []);
    setWithdrawals(withdrawalsRes.data || []);
    setBalances(balancesRes.data || []);
    setLoading(false);
  };

  const getUserName = (userId: string) => {
    const u = users.find((p) => p.user_id === userId);
    return u ? u.name || u.email : userId.substring(0, 8) + "...";
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await supabase.from(table as any).update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to ${status}!` });
      fetchAll();
    }
  };

  const saveBalance = async () => {
    if (!editBalance) return;
    const { error } = await (supabase.from as any)("user_balances").update({
      inr_balance: parseFloat(editInr) || 0,
    }).eq("id", editBalance.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Balance updated!" });
      setEditBalance(null);
      fetchAll();
    }
  };

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  if (!isAdmin) return null;

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      status === "confirmed" || status === "verified" || status === "approved" ? "bg-success/10 text-success" :
      status === "rejected" ? "bg-destructive/10 text-destructive" :
      "bg-warning/10 text-warning"
    }`}>{status}</span>
  );

  const ApproveReject = ({ id, table, status }: { id: string; table: string; status: string }) => (
    status === "pending" ? (
      <div className="flex gap-1">
        <Button size="sm" onClick={() => updateStatus(table, id, table === "kyc_documents" ? "verified" : "confirmed")} className="bg-success/10 text-success hover:bg-success/20">
          <CheckCircle2 className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => updateStatus(table, id, "rejected")} className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <div className="pt-20 pb-10 max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              <span className="text-gradient">Admin Panel</span>
            </h1>
            <p className="text-muted-foreground text-sm">Manage everything</p>
          </div>
          {/* Mobile hamburger */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-64">
              <div className="mt-8 space-y-2">
                {TABS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => switchTab(t.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      activeTab === t.value ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                    {t.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === t.value ? "bg-primary text-primary-foreground shadow-blue-glow" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Mobile tab indicator */}
        <div className="sm:hidden mb-4">
          <p className="text-sm text-muted-foreground">Current: <span className="text-primary font-semibold">{TABS.find(t => t.value === activeTab)?.label}</span></p>
        </div>

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {payments.map((p) => (
              <div key={p.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(p.user_id)}</span></p>
                    <p className="text-sm text-muted-foreground">Fund: {p.fund_type} | Plan: {p.plan_number} | {p.payment_method} | {p.amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">View</a>
                    <StatusBadge status={p.status} />
                    <ApproveReject id={p.id} table="payment_screenshots" status={p.status} />
                  </div>
                </div>
              </div>
            ))}
            {payments.length === 0 && <p className="text-center text-muted-foreground py-8">No payments</p>}
          </div>
        )}

        {/* DEPOSITS */}
        {activeTab === "deposits" && (
          <div className="space-y-4">
            {deposits.map((d) => (
              <div key={d.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(d.user_id)}</span></p>
                    <p className="text-sm text-muted-foreground">Fund: {d.fund_type} | ${d.amount_usd} × ₹{d.rate} = ₹{d.amount_inr} | {d.payment_method}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(d.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={d.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">View</a>
                    <StatusBadge status={d.status} />
                    <ApproveReject id={d.id} table="deposits" status={d.status} />
                  </div>
                </div>
              </div>
            ))}
            {deposits.length === 0 && <p className="text-center text-muted-foreground py-8">No deposits</p>}
          </div>
        )}

        {/* WITHDRAWALS */}
        {activeTab === "withdrawals" && (
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div key={w.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(w.user_id)}</span></p>
                    <p className="text-sm text-muted-foreground">
                      {w.withdrawal_type.toUpperCase()} | {w.currency} {w.amount} | Fee: {w.fee_amount} ({w.fee_method})
                      {w.usdt_address && ` | Addr: ${w.usdt_address.substring(0, 12)}... (${w.network})`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(w.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {w.fee_screenshot_url && <a href={w.fee_screenshot_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">View Fee</a>}
                    <StatusBadge status={w.status} />
                    <ApproveReject id={w.id} table="withdrawal_requests" status={w.status} />
                  </div>
                </div>
              </div>
            ))}
            {withdrawals.length === 0 && <p className="text-center text-muted-foreground py-8">No withdrawals</p>}
          </div>
        )}

        {/* BALANCES */}
        {activeTab === "balances" && (
          <div className="space-y-4">
            <div className="glass-card p-4 shadow-card mb-2">
              <p className="text-muted-foreground text-sm">Total Users: <span className="text-primary font-bold">{balances.length}</span></p>
            </div>
            {balances.map((b) => (
              <div key={b.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(b.user_id)}</span></p>
                    <p className="text-sm text-muted-foreground">INR Balance: ₹{Number(b.inr_balance).toLocaleString("en-IN")}</p>
                  </div>
                  <Button size="sm" onClick={() => { setEditBalance(b); setEditInr(String(b.inr_balance)); }} className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            ))}
            {balances.length === 0 && <p className="text-center text-muted-foreground py-8">No balances</p>}
          </div>
        )}

        {/* KYC */}
        {activeTab === "kyc" && (
          <div className="space-y-4">
            {kycDocs.map((k) => (
              <div key={k.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(k.user_id)}</span></p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a href={k.aadhaar_front_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">Aadhaar Front</a>
                      <a href={k.aadhaar_back_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">Aadhaar Back</a>
                      <a href={k.pan_card_url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">PAN Card</a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(k.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={k.status} />
                    <ApproveReject id={k.id} table="kyc_documents" status={k.status} />
                  </div>
                </div>
              </div>
            ))}
            {kycDocs.length === 0 && <p className="text-center text-muted-foreground py-8">No KYC</p>}
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="glass-card p-4 shadow-card mb-2">
              <p className="text-muted-foreground text-sm">Total Users: <span className="text-primary font-bold">{users.length}</span></p>
            </div>
            {users.map((u, index) => (
              <div key={u.id} className="glass-card p-4 sm:p-5 shadow-card">
                <p className="text-foreground font-medium"><span className="text-muted-foreground mr-2">#{index + 1}</span>{u.name}</p>
                <p className="text-sm text-muted-foreground">{u.email} | {u.phone}</p>
                <p className="text-xs text-muted-foreground">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* BANKS */}
        {activeTab === "banks" && (
          <div className="space-y-4">
            {bankAccounts.map((b) => (
              <div key={b.id} className="glass-card p-4 sm:p-5 shadow-card">
                <p className="text-foreground font-medium">{b.bank_name} - {b.holder_name}</p>
                <p className="text-sm text-muted-foreground">A/C: {b.account_number} | IFSC: {b.ifsc_code} | UPI: {b.upi_id}</p>
                <p className="text-xs text-primary">User: {getUserName(b.user_id)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Balance Dialog */}
      <Dialog open={!!editBalance} onOpenChange={(o) => { if (!o) setEditBalance(null); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">Edit INR Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">User: <span className="text-primary">{editBalance && getUserName(editBalance.user_id)}</span></p>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">INR Balance</label>
              <Input value={editInr} onChange={(e) => setEditInr(e.target.value)} type="number" className="bg-secondary border-border" />
            </div>
            <Button onClick={saveBalance} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save Balance</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
