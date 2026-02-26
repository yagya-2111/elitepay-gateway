import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Upload, Copy, ArrowRightLeft } from "lucide-react";

const USDT_ADDRESS = "TYud5LurN9hn16yy5K4gMiyLHpNJRa93C6";
const UPI_ID = "sahilkhan122@ptaxis";

const FUND_RATES: Record<string, { label: string; rate: number; color: string }> = {
  pure: { label: "Pure Fund", rate: 98, color: "text-primary" },
  gaming: { label: "Gaming Fund", rate: 105, color: "text-accent" },
  stock: { label: "Stock Fund", rate: 110, color: "text-success" },
};

interface ExchangeSectionProps {
  userId: string;
}

const ExchangeSection = ({ userId }: ExchangeSectionProps) => {
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"usdt" | "inr" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const rate = selectedFund ? FUND_RATES[selectedFund].rate : 0;
  const amountNum = parseFloat(amount) || 0;
  const inrValue = amountNum * rate;

  const openPayment = (m: "usdt" | "inr") => {
    if (!amountNum || amountNum <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    setMethod(m);
    setDialogOpen(true);
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

      const { error: insertError } = await (supabase.from as any)("deposits").insert({
        user_id: userId,
        fund_type: selectedFund!,
        amount_usd: amountNum,
        rate: rate,
        payment_method: method!,
        screenshot_url: urlData.publicUrl,
      });
      if (insertError) throw insertError;

      toast({ title: "Deposit submitted!", description: "Your deposit will be verified and balance updated soon." });
      setDialogOpen(false);
      setAmount("");
      setSelectedFund(null);
      setMethod(null);
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
          <ArrowRightLeft className="w-5 h-5 text-primary" /> USDT to INR Exchange
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Select a fund type and enter amount in USD</p>

        {/* Fund selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(FUND_RATES).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setSelectedFund(key)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedFund === key
                  ? "border-primary bg-primary/10 shadow-blue-glow"
                  : "border-border/50 bg-secondary/50 hover:border-primary/30"
              }`}
            >
              <p className={`font-semibold ${f.color}`}>{f.label}</p>
              <p className="text-muted-foreground text-sm">₹{f.rate} / $1</p>
            </button>
          ))}
        </div>

        {selectedFund && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Amount (USD)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in $"
                className="bg-secondary border-border"
                min="1"
              />
            </div>

            {amountNum > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground">You will receive</p>
                <p className="text-2xl font-display font-bold text-primary">₹{inrValue.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground">at ₹{rate}/$</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => openPayment("usdt")} className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                Pay via USDT
              </Button>
              <Button onClick={() => openPayment("inr")} className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                Pay via UPI
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setMethod(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">
              Pay {method === "usdt" ? `$${amountNum} via USDT (TRC20)` : `₹${(amountNum * rate).toLocaleString("en-IN")} via UPI`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {method === "usdt" ? (
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

            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-xs text-warning">
                Deposit exactly {method === "usdt" ? `$${amountNum}` : `₹${(amountNum * rate).toLocaleString("en-IN")}`}. Any other amount will not be processed.
              </p>
            </div>

            <div>
              <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
              <Button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Submit Payment Screenshot"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExchangeSection;
