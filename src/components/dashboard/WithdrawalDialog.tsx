import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Upload, QrCode, Copy } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onClose: () => void;
  fundType: string;
  userId: string;
}

const plans = [
  { id: 1, usdAmount: "50$", inrAmount: "5,000", reward: "20,000 INR" },
  { id: 2, usdAmount: "100$", inrAmount: "10,000", reward: "40,000 INR" },
  { id: 3, usdAmount: "200$", inrAmount: "20,000", reward: "80,000 INR" },
];

const USDT_ADDRESS = "TXqH7kBPae4oCgVt8WQhVfxv9yZL6K1erN";
const UPI_ID = "elitepay@okaxis";

const WithdrawalDialog = ({ open, onClose, fundType, userId }: WithdrawalDialogProps) => {
  const [step, setStep] = useState<"plans" | "method" | "payment">("plans");
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [method, setMethod] = useState<"usdt" | "inr" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleOpen = () => {
    setStep("plans");
    setSelectedPlan(null);
    setMethod(null);
  };

  const checkBankAccount = async () => {
    const { data } = await supabase.from("bank_accounts").select("id").eq("user_id", userId).limit(1);
    return data && data.length > 0;
  };

  const selectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setStep("method");
  };

  const selectMethod = (m: "usdt" | "inr") => {
    setMethod(m);
    setStep("payment");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const hasBank = await checkBankAccount();
      
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("screenshots").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("screenshots").getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("payment_screenshots").insert({
        user_id: userId,
        fund_type: fundType,
        plan_number: selectedPlan!.id,
        payment_method: method!,
        amount: method === "usdt" ? selectedPlan!.usdAmount : selectedPlan!.inrAmount,
        screenshot_url: urlData.publicUrl,
      });
      if (insertError) throw insertError;

      if (hasBank) {
        toast({
          title: "Payment submitted!",
          description: "Deposit will be confirmed shortly and withdrawal amount will be reflected in your bank account soon.",
        });
      } else {
        toast({
          title: "Payment submitted!",
          description: "Please add a bank account to receive your withdrawal.",
          variant: "destructive",
        });
      }
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); else handleOpen(); }}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground font-display">
            {step === "plans" && "Choose Withdrawal Plan"}
            {step === "method" && "Choose Payment Method"}
            {step === "payment" && `Pay via ${method === "usdt" ? "USDT (TRC20)" : "UPI (INR)"}`}
          </DialogTitle>
        </DialogHeader>

        {step === "plans" && (
          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => selectPlan(plan)}
                className="w-full p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left group hover:shadow-blue-glow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-foreground font-semibold">Plan {plan.id}</p>
                    <p className="text-muted-foreground text-sm">
                      Deposit {plan.usdAmount} or ₹{plan.inrAmount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-display font-bold">Get ₹{plan.reward}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "method" && (
          <div className="space-y-3">
            <button
              onClick={() => selectMethod("usdt")}
              className="w-full p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left hover:shadow-blue-glow"
            >
              <p className="text-foreground font-semibold">USDT (TRC20)</p>
              <p className="text-muted-foreground text-sm">Pay via cryptocurrency</p>
            </button>
            <button
              onClick={() => selectMethod("inr")}
              className="w-full p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-left hover:shadow-blue-glow"
            >
              <p className="text-foreground font-semibold">INR (UPI)</p>
              <p className="text-muted-foreground text-sm">Pay via UPI transfer</p>
            </button>
          </div>
        )}

        {step === "payment" && selectedPlan && method && (
          <div className="space-y-4">
            {method === "usdt" ? (
              <>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-primary mb-3" />
                  <p className="text-xs text-muted-foreground mb-2">USDT TRC20 Address</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs text-foreground bg-background px-2 py-1 rounded break-all">{USDT_ADDRESS}</code>
                    <button onClick={() => { navigator.clipboard.writeText(USDT_ADDRESS); toast({ title: "Copied!" }); }}>
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Amount</label>
                  <Input value={selectedPlan.usdAmount} disabled className="bg-secondary border-border" />
                </div>
              </>
            ) : (
              <>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-primary mb-3" />
                  <p className="text-xs text-muted-foreground mb-2">UPI ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-foreground font-mono">{UPI_ID}</code>
                    <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast({ title: "Copied!" }); }}>
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Amount</label>
                  <Input value={`₹${selectedPlan.inrAmount}`} disabled className="bg-secondary border-border" />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-xs text-warning">
                Deposit exactly {method === "usdt" ? selectedPlan.usdAmount : `₹${selectedPlan.inrAmount}`}. Any other amount will not be processed.
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
