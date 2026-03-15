import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Copy, DollarSign, AlertTriangle } from "lucide-react";

interface UsdtDepositSectionProps {
  userId: string;
}

const UsdtDepositSection = ({ userId }: UsdtDepositSectionProps) => {
  const [amount, setAmount] = useState("");
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("screenshots").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("screenshots").getPublicUrl(fileName);
      const { error } = await (supabase.from as any)("deposits").insert({
        user_id: userId,
        fund_type: "usdt_deposit",
        amount_usd: amt,
        rate: 1,
        payment_method: "usdt",
        screenshot_url: urlData.publicUrl,
      });
      if (error) throw error;
      toast({ title: "USDT Deposit submitted!", description: "Will be verified and credited soon." });
      setAmount("");
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
          <DollarSign className="w-5 h-5 text-primary" /> USDT Deposit
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Deposit USDT to your account</p>

        <div className="bg-secondary/50 rounded-xl p-4 text-center mb-4">
          {usdtQrUrl ? (
            <img src={usdtQrUrl} alt="USDT QR" className="w-40 h-40 mx-auto mb-3 rounded-xl" />
          ) : (
            <div className="w-40 h-40 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
          )}
          <p className="text-xs text-muted-foreground mb-2">USDT TRC20 Address</p>
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

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1 font-mono">Amount (USDT)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter USDT amount" className="bg-secondary border-border" min="1" />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
            <p className="text-xs text-accent font-mono">Send exact amount. Other amounts won't be processed.</p>
          </div>

          <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
          <Button onClick={() => fileRef.current?.click()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Submit Payment Screenshot"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsdtDepositSection;
