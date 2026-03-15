import { Building2 } from "lucide-react";

const banks = [
  { name: "State Bank of India (SBI)", tags: ["Saving", "Current", "Corporate", "CMP", "MQR"] },
  { name: "HDFC Bank", tags: ["Corporate", "Domain ID", "Payout"] },
  { name: "ICICI Bank", tags: ["Corporate", "MQR", "Payin"] },
  { name: "Axis Bank", tags: ["Saving", "Current", "NEO", "Bulk Payment"] },
  { name: "Kotak Mahindra Bank", tags: ["CMS", "Corporate", "Payout"] },
  { name: "Bank of Baroda", tags: ["Saving", "Current", "Corporate"] },
  { name: "Punjab National Bank", tags: ["Saving", "Current"] },
  { name: "IndusInd Bank", tags: ["MQR", "Corporate", "Bulk Payment"] },
  { name: "Canara Bank", tags: ["Saving", "Bulk Payment"] },
  { name: "IDFC FIRST Bank", tags: ["Saving", "Current", "MQR"] },
  { name: "RBL Bank", tags: ["Corporate", "MQR", "Bulk", "RazorpayX"] },
  { name: "YES Bank", tags: ["Business", "MSME", "Corporate"] },
  { name: "Federal Bank", tags: ["eBiz", "Saving"] },
  { name: "Bandhan Bank", tags: ["Corporate", "Bulk Payment"] },
  { name: "Indian Bank", tags: ["Corporate", "MQR"] },
  { name: "DBS Bank", tags: ["Corporate", "IDEAL", "MQR"] },
  { name: "IDBI Bank", tags: ["Corporate", "MQR"] },
  { name: "AU Bank", tags: ["Corporate", "Bulk Payment"] },
  { name: "Equitas Bank", tags: ["Corporate", "MQR"] },
  { name: "KVB Bank", tags: ["Corporate", "MQR", "Bulk"] },
];

const BankDirectorySection = () => {
  return (
    <section className="py-24 relative bg-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Banking</span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold text-foreground mb-3">
            <span className="text-gradient">{banks.length}+</span> Banks Linked
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">Complete banking infrastructure for seamless transactions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {banks.map((bank, i) => (
            <div key={i} className="glass-card p-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-foreground font-display font-bold text-xs sm:text-sm truncate">{bank.name}</span>
                <span className="ml-auto text-[10px] text-primary font-mono">Active</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {bank.tags.map((tag, j) => (
                  <span key={j} className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/5 text-primary/80 border border-primary/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankDirectorySection;
