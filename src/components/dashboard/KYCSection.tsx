import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Upload, CheckCircle2, Clock } from "lucide-react";

interface KYCSectionProps {
  userId: string;
}

const KYCSection = ({ userId }: KYCSectionProps) => {
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const panRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchKYC();
  }, [userId]);

  const fetchKYC = async () => {
    const { data } = await supabase
      .from("kyc_documents")
      .select("status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      setKycStatus(data[0].status);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { error } = await supabase.storage.from("kyc-documents").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("kyc-documents").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!aadhaarFront || !aadhaarBack || !panCard) {
      toast({ title: "Please upload all 3 documents", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ts = Date.now();
      const [frontUrl, backUrl, panUrl] = await Promise.all([
        uploadFile(aadhaarFront, `${userId}/${ts}_aadhaar_front_${aadhaarFront.name}`),
        uploadFile(aadhaarBack, `${userId}/${ts}_aadhaar_back_${aadhaarBack.name}`),
        uploadFile(panCard, `${userId}/${ts}_pan_card_${panCard.name}`),
      ]);

      const { error } = await supabase.from("kyc_documents").insert({
        user_id: userId,
        aadhaar_front_url: frontUrl,
        aadhaar_back_url: backUrl,
        pan_card_url: panUrl,
      });
      if (error) throw error;

      toast({ title: "KYC Submitted Successfully!", description: "Your documents are under review." });
      setKycStatus("pending");
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPanCard(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (kycStatus) {
    return (
      <div className="glass-card p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">KYC Verification</h2>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
          {kycStatus === "verified" ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <p className="text-foreground font-medium">KYC Verified</p>
                <p className="text-muted-foreground text-sm">Your identity has been verified successfully.</p>
              </div>
            </>
          ) : (
            <>
              <Clock className="w-6 h-6 text-warning" />
              <div>
                <p className="text-foreground font-medium">KYC Under Review</p>
                <p className="text-muted-foreground text-sm">Your documents are being reviewed. This may take 24-48 hours.</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">KYC Verification</h2>
          <p className="text-muted-foreground text-sm">Upload your identity documents to verify your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Aadhaar Front */}
        <div className="border border-dashed border-border rounded-lg p-4 text-center">
          <input type="file" ref={frontRef} onChange={(e) => setAadhaarFront(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
          <p className="text-foreground font-medium text-sm mb-2">Aadhaar Front</p>
          {aadhaarFront ? (
            <p className="text-success text-xs truncate">{aadhaarFront.name}</p>
          ) : (
            <Button variant="outline" size="sm" onClick={() => frontRef.current?.click()} className="border-border text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 mr-1" /> Upload
            </Button>
          )}
        </div>

        {/* Aadhaar Back */}
        <div className="border border-dashed border-border rounded-lg p-4 text-center">
          <input type="file" ref={backRef} onChange={(e) => setAadhaarBack(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
          <p className="text-foreground font-medium text-sm mb-2">Aadhaar Back</p>
          {aadhaarBack ? (
            <p className="text-success text-xs truncate">{aadhaarBack.name}</p>
          ) : (
            <Button variant="outline" size="sm" onClick={() => backRef.current?.click()} className="border-border text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 mr-1" /> Upload
            </Button>
          )}
        </div>

        {/* PAN Card */}
        <div className="border border-dashed border-border rounded-lg p-4 text-center">
          <input type="file" ref={panRef} onChange={(e) => setPanCard(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
          <p className="text-foreground font-medium text-sm mb-2">PAN Card</p>
          {panCard ? (
            <p className="text-success text-xs truncate">{panCard.name}</p>
          ) : (
            <Button variant="outline" size="sm" onClick={() => panRef.current?.click()} className="border-border text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 mr-1" /> Upload
            </Button>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={uploading || !aadhaarFront || !aadhaarBack || !panCard}
      >
        {uploading ? "Submitting..." : "Submit KYC Documents"}
      </Button>
    </div>
  );
};

export default KYCSection;
