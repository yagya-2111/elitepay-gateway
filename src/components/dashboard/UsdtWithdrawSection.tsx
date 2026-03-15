import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Upload, AlertTriangle, Copy, Clock, CheckCircle2, XCircle } from "lucide-react";

interface UsdtWithdrawSectionProps {
  userId: string;
}

const UsdtWithdrawSection = ({ userId }: UsdtWithdrawSectionProps) => {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [feeDialog, setFeeDialog] = useState(false);
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
    fetchWithdrawals();
  }, [userId]);

  const fetchWithdrawals = () => {
    (supabase.from as any)("withdrawal_requests").select("*").eq("user_id", userId).eq("withdrawal_type", "usdt").order("created_at", { ascending: false })
      .then(({ data }: any) => { if (data) setWithdrawals(data); });
  };

  const usdtAddress = siteSettings.usdt_address || "";
  const usdtQrUrl = siteSettings.usdt_qr_url || "";

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast({ title: "Enter valid amount", variant: "destructive" }); return; }
    if (!walletAddress) { toast({ title: "Enter wallet address", variant: "destructive" }); return; }
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
        withdrawal_type: "usdt",
        amount: parseFloat(amount),
        currency: "USDT",
        usdt_address: walletAddress,
        network: network,
        fee_amount: "$10",
        fee_method: "usdt",
        fee_screenshot_url: urlData.publicUrl,
      });
      if (error) throw error;
      toast({ title: "USDT Withdrawal submitted!", description: "Will be processed after verification." });
      setFeeDialog(false);
      setAmount("");
      setWalletAddress("");
      fetchWithdrawals();
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
          <DollarSign className="w-5 h-5 text-primary" /> USDT Withdrawal
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Withdraw USDT to your wallet</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Amount (USDT)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter USDT amount" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Wallet Address</label>
            <Input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Enter TRC20/BEP20 wallet address" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Network</label>
            <select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full rounded-xl bg-secondary border border-border p-2 text-foreground text-sm">
              <option value="TRC20">TRC20</option>
              <option value="BEP20">BEP20</option>
              <option value="ERC20">ERC20</option>
            </select>
          </div>
          <Button onClick={handleWithdraw} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Submit USDT Withdrawal
          </Button>
        </div>
      </div>

      <Dialog open={feeDialog} onOpenChange={(o) => { if (!o) setFeeDialog(false); }}>
        <DialogContent className="bg-card border-border max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">Pay $10 USDT Fee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-xs text-warning">Submit $10 USDT fee to process your withdrawal.</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              {usdtQrUrl ? (
                <img src={usdtQrUrl} alt="USDT QR" className="w-40 h-40 mx-auto mb-3 rounded-lg" />
              ) : (
                <div className="w-40 h-40 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
              )}
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
            <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
            <Button onClick={() => fileRef.current?.click()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Submit Fee Screenshot"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {withdrawals.length > 0 && (
        <div className="glass-card p-6 shadow-card">
          <h3 className="text-lg font-display font-bold text-foreground mb-4">USDT Withdrawal History</h3>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div>
                  <p className="text-foreground font-medium">${Number(w.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{w.usdt_address}</p>
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

export default UsdtWithdrawSection;
