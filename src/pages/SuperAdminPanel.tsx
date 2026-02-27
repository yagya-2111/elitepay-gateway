import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FloatingINR from "@/components/FloatingINR";
import {
  Users, Trash2, ShieldCheck, Shield, ShieldOff, Crown,
  Menu, Image, Building2, ArrowRightLeft, ArrowDownToLine, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TabType = "users" | "payments" | "deposits" | "withdrawals" | "balances" | "kyc" | "banks";

const TABS: { value: TabType; label: string; icon: any }[] = [
  { value: "users", label: "Users & Roles", icon: Users },
  { value: "payments", label: "Payments", icon: Image },
  { value: "deposits", label: "Deposits", icon: ArrowRightLeft },
  { value: "withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
  { value: "balances", label: "Balances", icon: Wallet },
  { value: "kyc", label: "KYC", icon: ShieldCheck },
  { value: "banks", label: "Banks", icon: Building2 },
];

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "super_admin");
      if (!r || r.length === 0) { navigate("/dashboard"); return; }
      setIsSuperAdmin(true);
      fetchAll();
    };
    init();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    const [profilesRes, rolesRes, paymentsRes, depositsRes, withdrawalsRes, balancesRes, kycRes, banksRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("payment_screenshots").select("*").order("created_at", { ascending: false }),
      supabase.from("deposits" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("withdrawal_requests" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("user_balances" as any).select("*"),
      supabase.from("kyc_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("bank_accounts").select("*"),
    ]);
    setUsers(profilesRes.data || []);
    setRoles(rolesRes.data || []);
    setPayments(paymentsRes.data || []);
    setDeposits(depositsRes.data || []);
    setWithdrawals(withdrawalsRes.data || []);
    setBalances(balancesRes.data || []);
    setKycDocs(kycRes.data || []);
    setBankAccounts(banksRes.data || []);
    setLoading(false);
  };

  const getUserName = (userId: string) => {
    const u = users.find((p) => p.user_id === userId);
    return u ? u.name || u.email : userId.substring(0, 8) + "...";
  };

  const getUserRoles = (userId: string) => {
    return roles.filter(r => r.user_id === userId).map(r => r.role);
  };

  const RoleBadge = ({ role }: { role: string }) => {
    const cls = role === "super_admin"
      ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
      : role === "admin"
        ? "bg-primary/15 text-primary border border-primary/30"
        : "bg-muted text-muted-foreground border border-border";
    const icon = role === "super_admin" ? <Crown className="w-3 h-3" /> : role === "admin" ? <Shield className="w-3 h-3" /> : null;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${cls}`}>
        {icon}{role}
      </span>
    );
  };

  const promoteToAdmin = async (userId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" } as any);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Promoted to admin!" }); fetchAll(); }
  };

  const demoteAdmin = async (userId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Demoted from admin!" }); fetchAll(); }
  };

  const deleteRecord = async (table: string, id: string, label: string) => {
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `${label} deleted!` }); fetchAll(); }
  };

  const deleteUserCompletely = async (userId: string) => {
    // Delete all user data from all tables
    await Promise.all([
      supabase.from("payment_screenshots").delete().eq("user_id", userId),
      supabase.from("deposits" as any).delete().eq("user_id", userId),
      supabase.from("withdrawal_requests" as any).delete().eq("user_id", userId),
      supabase.from("user_balances" as any).delete().eq("user_id", userId),
      supabase.from("kyc_documents").delete().eq("user_id", userId),
      supabase.from("bank_accounts").delete().eq("user_id", userId),
      supabase.from("user_roles").delete().eq("user_id", userId),
    ]);
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "User deleted completely!" }); fetchAll(); }
  };

  const DeleteButton = ({ onConfirm, label }: { onConfirm: () => void; label: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (!isSuperAdmin) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <div className="pt-20 pb-10 max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              <Crown className="inline w-6 h-6 text-amber-500 mr-2" />
              <span className="text-gradient">Super Admin</span>
            </h1>
            <p className="text-muted-foreground text-sm">Full control over all data</p>
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-64">
              <div className="mt-8 space-y-2">
                {TABS.map((t) => (
                  <button key={t.value} onClick={() => { setActiveTab(t.value); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${activeTab === t.value ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                    <t.icon className="w-5 h-5" />{t.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button key={t.value} onClick={() => setActiveTab(t.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === t.value ? "bg-primary text-primary-foreground shadow-blue-glow" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        <div className="sm:hidden mb-4">
          <p className="text-sm text-muted-foreground">Current: <span className="text-primary font-semibold">{TABS.find(t => t.value === activeTab)?.label}</span></p>
        </div>

        {/* USERS & ROLES */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="glass-card p-4 shadow-card mb-2">
              <p className="text-muted-foreground text-sm">Total Users: <span className="text-primary font-bold">{users.length}</span></p>
            </div>
            {users.map((u, i) => {
              const userRoles = getUserRoles(u.user_id);
              const isAdmin = userRoles.includes("admin");
              const isSA = userRoles.includes("super_admin");
              return (
                <div key={u.id} className="glass-card p-4 sm:p-5 shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-foreground font-medium"><span className="text-muted-foreground mr-2">#{i + 1}</span>{u.name}</p>
                        {userRoles.map(r => <RoleBadge key={r} role={r} />)}
                      </div>
                      <p className="text-sm text-muted-foreground">{u.email} | {u.phone}</p>
                      <p className="text-xs text-muted-foreground">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {!isSA && !isAdmin && (
                        <Button size="sm" onClick={() => promoteToAdmin(u.user_id)} className="bg-primary/10 text-primary hover:bg-primary/20">
                          <Shield className="w-4 h-4 mr-1" /> Make Admin
                        </Button>
                      )}
                      {isAdmin && !isSA && (
                        <Button size="sm" onClick={() => demoteAdmin(u.user_id)} className="bg-warning/10 text-warning hover:bg-warning/20">
                          <ShieldOff className="w-4 h-4 mr-1" /> Remove Admin
                        </Button>
                      )}
                      {!isSA && (
                        <DeleteButton label="User & All Data" onConfirm={() => deleteUserCompletely(u.user_id)} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
                  <DeleteButton label="Payment" onConfirm={() => deleteRecord("payment_screenshots", p.id, "Payment")} />
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
                  <DeleteButton label="Deposit" onConfirm={() => deleteRecord("deposits", d.id, "Deposit")} />
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
                      {w.withdrawal_type?.toUpperCase()} | {w.currency} {w.amount} | Status: {w.status}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(w.created_at).toLocaleString()}</p>
                  </div>
                  <DeleteButton label="Withdrawal" onConfirm={() => deleteRecord("withdrawal_requests", w.id, "Withdrawal")} />
                </div>
              </div>
            ))}
            {withdrawals.length === 0 && <p className="text-center text-muted-foreground py-8">No withdrawals</p>}
          </div>
        )}

        {/* BALANCES */}
        {activeTab === "balances" && (
          <div className="space-y-4">
            {balances.map((b) => (
              <div key={b.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">User: <span className="text-primary">{getUserName(b.user_id)}</span></p>
                    <p className="text-sm text-muted-foreground">INR: ₹{Number(b.inr_balance).toLocaleString("en-IN")} | USDT: {b.usdt_balance}</p>
                  </div>
                  <DeleteButton label="Balance Record" onConfirm={() => deleteRecord("user_balances", b.id, "Balance")} />
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
                    <p className="text-sm text-muted-foreground">Status: {k.status} | {new Date(k.created_at).toLocaleString()}</p>
                  </div>
                  <DeleteButton label="KYC Document" onConfirm={() => deleteRecord("kyc_documents", k.id, "KYC")} />
                </div>
              </div>
            ))}
            {kycDocs.length === 0 && <p className="text-center text-muted-foreground py-8">No KYC documents</p>}
          </div>
        )}

        {/* BANKS */}
        {activeTab === "banks" && (
          <div className="space-y-4">
            {bankAccounts.map((b) => (
              <div key={b.id} className="glass-card p-4 sm:p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium">{b.bank_name} - {b.holder_name}</p>
                    <p className="text-sm text-muted-foreground">A/C: {b.account_number} | IFSC: {b.ifsc_code} | UPI: {b.upi_id}</p>
                    <p className="text-xs text-primary">User: {getUserName(b.user_id)}</p>
                  </div>
                  <DeleteButton label="Bank Account" onConfirm={() => deleteRecord("bank_accounts", b.id, "Bank Account")} />
                </div>
              </div>
            ))}
            {bankAccounts.length === 0 && <p className="text-center text-muted-foreground py-8">No bank accounts</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPanel;
