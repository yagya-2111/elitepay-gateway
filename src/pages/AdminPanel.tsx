import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FloatingINR from "@/components/FloatingINR";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Image, Building2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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
    const [profilesRes, paymentsRes, banksRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("payment_screenshots").select("*").order("created_at", { ascending: false }),
      supabase.from("bank_accounts").select("*"),
    ]);
    setUsers(profilesRes.data || []);
    setPayments(paymentsRes.data || []);
    setBankAccounts(banksRes.data || []);
    setLoading(false);
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("payment_screenshots").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Payment ${status}!` });
      fetchAll();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <div className="pt-20 pb-10 max-w-7xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          <span className="text-gradient">Admin Panel</span>
        </h1>
        <p className="text-muted-foreground mb-8">Manage users, payments, and bank accounts</p>

        <Tabs defaultValue="payments">
          <TabsList className="bg-secondary border border-border mb-8">
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="w-4 h-4 mr-2" /> Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" /> Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="banks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" /> Bank Accounts ({bankAccounts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <div className="space-y-4">
              {payments.map((p) => (
                <div key={p.id} className="glass-card p-5 shadow-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-foreground font-medium">
                        User: <span className="text-muted-foreground font-mono text-xs">{p.user_id}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fund: {p.fund_type} | Plan: {p.plan_number} | Method: {p.payment_method} | Amount: {p.amount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                        View Screenshot
                      </a>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "confirmed" ? "bg-success/10 text-success" :
                        p.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {p.status}
                      </span>
                      {p.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => updatePaymentStatus(p.id, "confirmed")} className="bg-success/10 text-success hover:bg-success/20">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => updatePaymentStatus(p.id, "rejected")} className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {payments.length === 0 && <p className="text-center text-muted-foreground py-8">No payments yet</p>}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="glass-card p-5 shadow-card">
                  <p className="text-foreground font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email} | {u.phone}</p>
                  <p className="text-xs text-muted-foreground">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="banks">
            <div className="space-y-4">
              {bankAccounts.map((b) => (
                <div key={b.id} className="glass-card p-5 shadow-card">
                  <p className="text-foreground font-medium">{b.bank_name} - {b.holder_name}</p>
                  <p className="text-sm text-muted-foreground">A/C: {b.account_number} | IFSC: {b.ifsc_code} | UPI: {b.upi_id}</p>
                  <p className="text-xs text-muted-foreground font-mono">User: {b.user_id}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
