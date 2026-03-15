import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Upload, Copy, IndianRupee, Clock, CheckCircle2, XCircle } from "lucide-react";

interface InrWithdrawalSectionProps {
  userId: string;
}

const InrWithdrawalSection = ({ userId }: InrWithdrawalSectionProps) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [feeDialog, setFeeDialog] = useState(false);
  const [feeMethod, setFeeMethod] = useState<"usdt" | "inr" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await (supabase.from as any)("site_settings").select("*");
      const settings: Record<string, string> = {};
      (data || []).forEach((s: any) => { settings[s.setting_key] = s.setting_value; });
      setSiteSettings(settings);
    };
    fetchSettings();
  }, []);

  const usdtAddress = siteSettings.usdt_address || "";
  const usdtQrUrl = siteSettings.usdt_qr_url || "";
  const upiQrUrl = siteSettings.upi_qr_url || "";
  const upiAddress = siteSettings.upi_address || "";

  const fetchData = () => {
    (supabase.from as any)("user_balances").select("inr_balance").eq("user_id", userId).single()
      .then(({ data }: any) => { if (data) setBalance(Number(data.inr_balance)); });
    (supabase.from as any)("withdrawal_requests").select("*").eq("user_id", userId).eq("withdrawal_type", "inr").order("created_at", { ascending: false })
      .then(({ data }: any) => { if (data) setWithdrawals(data); });
  };

  useEffect(() => { fetchData(); }, [userId]);

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast({ title: "Enter valid amount", variant: "destructive" }); return; }
    if (amt > balance) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }
    setFeeDialog(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("screenshots").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("screenshots").getPublicUrl(fileName);
      const { error } = await (supabase.from as any)("withdrawal_requests").insert({
        user_id: userId,
        withdrawal_type: "inr",
        amount: parseFloat(amount),
        currency: "INR",
        fee_amount: feeMethod === "usdt" ? "$20" : "₹2,000",
        fee_method: feeMethod!,
        fee_screenshot_url: urlData.publicUrl,
      });
      if (error) throw error;
      toast({ title: "Withdrawal request submitted!", description: "Your INR will be sent to your bank account after verification." });
      setFeeDialog(false);
      setFeeMethod(null);
      setAmount("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 shadow-card">
        <h3 className="text-lg font-display font-bold text-foreground mb-1 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-primary" /> INR Withdrawal
        </h3>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
          <p className="text-sm text-muted-foreground">Available INR Balance</p>
          <p className="text-3xl font-display font-bold text-primary">₹{balance.toLocaleString("en-IN")}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Amount to Withdraw (INR)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount in ₹" className="bg-secondary border-border" />
          </div>
          <Button onClick={handleWithdraw} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Submit Withdrawal Request
          </Button>
        </div>
      </div>

      <Dialog open={feeDialog} onOpenChange={(o) => { if (!o) { setFeeDialog(false); setFeeMethod(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">Submit ₹2,000 to Process Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-xs text-warning">
                Submit ₹2,000 (or $20 USDT) to successfully withdraw your INR to your bank account.
              </p>
            </div>

            {!feeMethod ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setFeeMethod("inr")} className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left">
                  <p className="text-foreground font-semibold">INR (UPI)</p>
                  <p className="text-muted-foreground text-sm">Pay ₹2,000</p>
                </button>
                <button onClick={() => setFeeMethod("usdt")} className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left">
                  <p className="text-foreground font-semibold">USDT (TRC20)</p>
                  <p className="text-muted-foreground text-sm">Pay $20</p>
                </button>
              </div>
            ) : feeMethod === "inr" ? (
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                {upiQrUrl ? (
                  <img src={upiQrUrl} alt="UPI QR" className="w-40 h-40 mx-auto mb-3 rounded-lg" />
                ) : (
                  <div className="w-40 h-40 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
                )}
                <p className="text-xs text-muted-foreground mb-2">UPI ID</p>
                {upiAddress ? (
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-foreground font-mono text-sm break-all">{upiAddress}</code>
                    <button onClick={() => { navigator.clipboard.writeText(upiAddress); toast({ title: "Copied!" }); }}>
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-mono">No UPI configured</p>
                )}
              </div>
            ) : (
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                {usdtQrUrl ? (
                  <img src={usdtQrUrl} alt="USDT QR" className="w-40 h-40 mx-auto mb-3 rounded-lg" />
                ) : (
                  <div className="w-40 h-40 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
                )}
                <p className="text-xs text-muted-foreground mb-2">USDT TRC20 Address</p>
                {usdtAddress ? (
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs text-foreground bg-background px-2 py-1 rounded break-all">{usdtAddress}</code>
                    <button onClick={() => { navigator.clipboard.writeText(usdtAddress); toast({ title: "Copied!" }); }}>
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-mono">No address configured</p>
                )}
              </div>
            )}

            {feeMethod && (
              <div>
                <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
                <Button onClick={() => fileRef.current?.click()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={uploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Submit Payment Screenshot"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {withdrawals.length > 0 && (
        <div className="glass-card p-6 shadow-card">
          <h3 className="text-lg font-display font-bold text-foreground mb-4">Withdrawal History</h3>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div>
                  <p className="text-foreground font-medium">₹{Number(w.amount).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleString()}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  w.status === "confirmed" ? "bg-primary/10 text-primary" :
                  w.status === "rejected" ? "bg-destructive/10 text-destructive" :
                  "bg-accent/10 text-accent"
                }`}>
                  {w.status === "confirmed" ? <CheckCircle2 className="w-3 h-3" /> :
                   w.status === "rejected" ? <XCircle className="w-3 h-3" /> :
                   <Clock className="w-3 h-3" />}
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InrWithdrawalSection;
