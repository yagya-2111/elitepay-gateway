import { ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FUND_RATES = [
  { label: "Pure Fund", rate: 98, color: "text-primary" },
  { label: "Gaming Fund", rate: 105, color: "text-accent" },
  { label: "Stock Fund", rate: 110, color: "text-success" },
];

const ExchangeHomepageSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <ArrowRightLeft className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Live Exchange Rates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            USDT to INR <span className="text-gradient">Exchange</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Convert your USDT to INR at the best rates. Choose from multiple fund types with instant processing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {FUND_RATES.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 shadow-card text-center hover:shadow-blue-glow transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <p className={`text-lg font-display font-bold ${f.color} mb-1`}>{f.label}</p>
              <p className="text-4xl font-display font-bold text-foreground">
                ₹{f.rate}<span className="text-lg text-muted-foreground">/$</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">per 1 USDT</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-blue-glow px-8 py-3 text-base"
          >
            Start Exchanging Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExchangeHomepageSection;
