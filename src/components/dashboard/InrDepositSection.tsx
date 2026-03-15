import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Copy, IndianRupee, AlertTriangle } from "lucide-react";

interface InrDepositSectionProps {
  userId: string;
}

const InrDepositSection = ({ userId }: InrDepositSectionProps) => {
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

  const upiQrUrl = siteSettings.upi_qr_url || "";
  const upiAddress = siteSettings.upi_address || "";

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
        fund_type: "inr_deposit",
        amount_usd: amt / 98,
        rate: 98,
        payment_method: "inr",
        screenshot_url: urlData.publicUrl,
      });
      if (error) throw error;
      toast({ title: "INR Deposit submitted!", description: "Will be verified and credited soon." });
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
          <IndianRupee className="w-5 h-5 text-primary" /> INR Deposit
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Deposit INR via UPI</p>

        <div className="bg-secondary/50 rounded-xl p-4 text-center mb-4">
          {upiQrUrl ? (
            <img src={upiQrUrl} alt="UPI QR" className="w-40 h-40 mx-auto mb-3 rounded-xl" />
          ) : (
            <div className="w-40 h-40 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm font-mono">No QR Set</div>
          )}
          <p className="text-xs text-muted-foreground mb-2">UPI ID</p>
          {upiAddress ? (
            <div className="flex items-center justify-center gap-2">
              <code className="text-foreground font-mono text-sm">{upiAddress}</code>
              <button onClick={() => { navigator.clipboard.writeText(upiAddress); toast({ title: "Copied!" }); }}>
                <Copy className="w-4 h-4 text-primary" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-mono">No UPI configured</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1 font-mono">Amount (INR)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter INR amount" className="bg-secondary border-border" min="1" />
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

export default InrDepositSection;
