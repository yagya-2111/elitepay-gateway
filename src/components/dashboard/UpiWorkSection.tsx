import { Smartphone, Info } from "lucide-react";

const UpiWorkSection = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 shadow-card">
        <h3 className="text-lg font-display font-bold text-foreground mb-1 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" /> UPI Work
        </h3>
        <p className="text-sm text-muted-foreground mb-4">UPI money work details and commission structure</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Commission</p>
            <p className="text-2xl font-display font-bold text-primary">12%</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Daily Volume</p>
            <p className="text-2xl font-display font-bold text-accent">₹1,00,000</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Fund Type</p>
            <p className="text-2xl font-display font-bold text-primary">USDT</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <Info className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-xs text-accent">
            Retail & Corporate accounts supported. Contact support for activation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpiWorkSection;
