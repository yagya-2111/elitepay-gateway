import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Upload, Copy, ArrowRightLeft } from "lucide-react";

const FUND_RATES: Record<string, { label: string; rate: number; color: string }> = {
  pure: { label: "Pure Fund", rate: 98, color: "text-primary" },
  gaming: { label: "Gaming Fund", rate: 105, color: "text-accent" },
  stock: { label: "Stock Fund", rate: 110, color: "text-primary" },
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
        <p className="text-sm text-muted-foreground font-mono mb-4">Select fund type and enter USD amount</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(FUND_RATES).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setSelectedFund(key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedFund === key
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border/50 bg-secondary/50 hover:border-primary/30"
              }`}
            >
              <p className={`font-display font-bold ${f.color}`}>{f.label}</p>
              <p className="text-muted-foreground text-sm font-mono">₹{f.rate} / $1</p>
            </button>
          ))}
        </div>

        {selectedFund && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1 font-mono">Amount (USD)</label>
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
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground font-mono">You will receive</p>
                <p className="text-3xl font-display font-extrabold text-primary">₹{inrValue.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground font-mono">at ₹{rate}/$</p>
              </div>
            )}

            <Button onClick={() => openPayment("usdt")} className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
              Pay via USDT (TRC20)
            </Button>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setMethod(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">
              Pay ${amountNum} via USDT (TRC20)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              {usdtQrUrl ? (
                <img src={usdtQrUrl} alt="USDT QR" className="w-40 h-40 mx-auto mb-3 rounded-xl" />
              ) : (
                <div className="w-40 h-40 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
              )}
              <p className="text-xs text-muted-foreground font-mono mb-2">USDT TRC20 Address</p>
              {usdtAddress ? (
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xs text-foreground bg-background px-2 py-1 rounded-lg break-all font-mono">{usdtAddress}</code>
                  <button onClick={() => { navigator.clipboard.writeText(usdtAddress); toast({ title: "Copied!" }); }}>
                    <Copy className="w-4 h-4 text-primary" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono">No address configured</p>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-xs text-accent font-mono">
                Deposit exactly ${amountNum}. Any other amount will not be processed.
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
