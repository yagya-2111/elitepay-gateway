import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, Trash2 } from "lucide-react";

interface BankAccountSectionProps {
  userId: string;
}

const BankAccountSection = ({ userId }: BankAccountSectionProps) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ account_number: "", ifsc_code: "", bank_name: "", holder_name: "", upi_id: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    const { data } = await supabase.from("bank_accounts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setAccounts(data || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("bank_accounts").insert({ ...form, user_id: userId });
      if (error) throw error;
      toast({ title: "Bank account added!" });
      setForm({ account_number: "", ifsc_code: "", bank_name: "", holder_name: "", upi_id: "" });
      setShowForm(false);
      fetchAccounts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("bank_accounts").delete().eq("id", id);
    fetchAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">Bank Accounts</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Account
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-6 shadow-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Account Number</label>
              <Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} required className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">IFSC Code</label>
              <Input value={form.ifsc_code} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })} required className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Bank Name</label>
              <Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} required className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Account Holder Name</label>
              <Input value={form.holder_name} onChange={(e) => setForm({ ...form, holder_name: e.target.value })} required className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">UPI ID</label>
              <Input value={form.upi_id} onChange={(e) => setForm({ ...form, upi_id: e.target.value })} required className="bg-secondary border-border" />
            </div>
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
            {loading ? "Adding..." : "Add Bank Account"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="glass-card p-8 text-center shadow-card">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No bank accounts added yet</p>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="glass-card p-5 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">{acc.bank_name} - {acc.holder_name}</p>
                  <p className="text-muted-foreground text-sm">A/C: {acc.account_number} | IFSC: {acc.ifsc_code}</p>
                  <p className="text-muted-foreground text-xs">UPI: {acc.upi_id}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(acc.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BankAccountSection;
