import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Upload, Copy, Wallet } from "lucide-react";

const USDT_ADDRESS = "TYud5LurN9hn16yy5K4gMiyLHpNJRa93C6";
const UPI_ID = "sahilkhan122@ptaxis";

interface UsdtWithdrawalSectionProps {
  userId: string;
}

const UsdtWithdrawalSection = ({ userId }: UsdtWithdrawalSectionProps) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState<"trc20" | "bep20">("trc20");
  const [feeDialog, setFeeDialog] = useState(false);
  const [feeMethod, setFeeMethod] = useState<"usdt" | "inr" | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    (supabase.from as any)("user_balances").select("usdt_balance").eq("user_id", userId).single()
      .then(({ data }: any) => { if (data) setBalance(Number(data.usdt_balance)); });
  }, [userId]);

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast({ title: "Enter valid amount", variant: "destructive" }); return; }
    if (!address.trim()) { toast({ title: "Enter USDT address", variant: "destructive" }); return; }
    if (amt > balance) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }
    setFeeDialog(true);
  };

  const selectFeeMethod = (m: "usdt" | "inr") => {
    setFeeMethod(m);
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
        usdt_address: address,
        network,
        fee_amount: feeMethod === "usdt" ? "$20" : "₹2,000",
        fee_method: feeMethod!,
        fee_screenshot_url: urlData.publicUrl,
      });
      if (error) throw error;

      toast({ title: "Withdrawal request submitted!", description: "Your request will be processed after fee verification." });
      setFeeDialog(false);
      setFeeMethod(null);
      setAmount("");
      setAddress("");
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
          <Wallet className="w-5 h-5 text-primary" /> USDT Withdrawal
        </h3>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
          <p className="text-sm text-muted-foreground">Available USDT Balance</p>
          <p className="text-3xl font-display font-bold text-primary">${balance.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Amount to Withdraw (USDT)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">USDT Wallet Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your USDT address" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Network</label>
            <div className="grid grid-cols-2 gap-3">
              {(["trc20", "bep20"] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setNetwork(n)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    network === n ? "border-primary bg-primary/10" : "border-border/50 bg-secondary/50 hover:border-primary/30"
                  }`}
                >
                  <p className="text-foreground font-semibold uppercase">{n}</p>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleWithdraw} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Submit Withdrawal Request
          </Button>
        </div>
      </div>

      {/* Fee Dialog */}
      <Dialog open={feeDialog} onOpenChange={(o) => { if (!o) { setFeeDialog(false); setFeeMethod(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">Deposit $20 to Process Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-xs text-warning">
                Deposit $20 (or ₹2,000 INR) to successfully withdraw your funds to your wallet.
              </p>
            </div>

            {!feeMethod ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => selectFeeMethod("usdt")} className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left hover:shadow-blue-glow">
                  <p className="text-foreground font-semibold">USDT (TRC20)</p>
                  <p className="text-muted-foreground text-sm">Pay $20</p>
                </button>
                <button onClick={() => selectFeeMethod("inr")} className="p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left hover:shadow-blue-glow">
                  <p className="text-foreground font-semibold">INR (UPI)</p>
                  <p className="text-muted-foreground text-sm">Pay ₹2,000</p>
                </button>
              </div>
            ) : feeMethod === "usdt" ? (
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <img src="/images/usdt-qr.png" alt="USDT QR" className="w-40 h-40 mx-auto mb-3 rounded-lg" />
                <p className="text-xs text-muted-foreground mb-2">USDT TRC20 Address</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xs text-foreground bg-background px-2 py-1 rounded break-all">{USDT_ADDRESS}</code>
                  <button onClick={() => { navigator.clipboard.writeText(USDT_ADDRESS); toast({ title: "Copied!" }); }}>
                    <Copy className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <img src="/images/upi-qr.png" alt="UPI QR" className="w-40 h-40 mx-auto mb-3 rounded-lg" />
                <p className="text-xs text-muted-foreground mb-2">UPI ID</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-foreground font-mono">{UPI_ID}</code>
                  <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast({ title: "Copied!" }); }}>
                    <Copy className="w-4 h-4 text-primary" />
                  </button>
                </div>
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
    </div>
  );
};

export default UsdtWithdrawalSection;
