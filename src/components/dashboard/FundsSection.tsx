import { useState } from "react";
import { IndianRupee, TrendingUp, Landmark, Vote, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import WithdrawalDialog from "./WithdrawalDialog";

const pureFund = Math.floor(Math.random() * 5000000) + 10000000;
const stockFund = Math.floor(Math.random() * 5000000) + 20000000;
const politicalFund = Math.floor(Math.random() * 10000000) + 40000000;
const totalFund = pureFund + stockFund + politicalFund;

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface FundsSectionProps {
  userId: string;
}

const FundsSection = ({ userId }: FundsSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<string>("");

  const handleWithdraw = (fundType: string) => {
    setSelectedFund(fundType);
    setDialogOpen(true);
  };

  const funds = [
    { icon: Landmark, label: "Pure Fund", amount: pureFund, type: "pure", color: "text-primary" },
    { icon: TrendingUp, label: "Stock Fund", amount: stockFund, type: "stock", color: "text-success" },
    { icon: Vote, label: "Political Fund", amount: politicalFund, type: "political", color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="glass-card p-8 shadow-card shadow-blue-glow text-center">
        <p className="text-muted-foreground text-sm mb-2">Total Funds Available</p>
        <div className="text-4xl md:text-5xl font-display font-bold text-gradient flex items-center justify-center gap-2">
          <IndianRupee className="w-8 h-8" />
          {formatINR(totalFund)}
        </div>
        <p className="text-muted-foreground text-xs mt-2">8,00,00,000+ INR portfolio</p>
      </div>

      {/* Fund cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funds.map((f, i) => (
          <div key={i} className="glass-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-xl font-display font-bold text-foreground">{formatINR(f.amount)}</p>
              </div>
            </div>
            <Button
              onClick={() => handleWithdraw(f.type)}
              className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" /> Withdraw
            </Button>
          </div>
        ))}
      </div>

      <WithdrawalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fundType={selectedFund}
        userId={userId}
      />
    </div>
  );
};

export default FundsSection;
