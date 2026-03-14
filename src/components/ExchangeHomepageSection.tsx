import { ArrowRightLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FUND_RATES = [
  { label: "Pure Fund", rate: 98, color: "text-primary", tag: "Popular" },
  { label: "Gaming Fund", rate: 105, color: "text-accent", tag: "Best Value" },
  { label: "Stock Fund", rate: 110, color: "text-primary", tag: "Premium" },
];

const ExchangeHomepageSection = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [usdInput, setUsdInput] = useState("100");

  return (
    <section className="py-24 relative z-10 bg-glow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Exchange</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-3">
            USDT → INR <span className="text-gradient">Exchange</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Best rates in the market. Instant processing. Zero hidden fees.
          </p>
        </div>

        {/* Interactive calculator */}
        <div className="glass-card p-8 max-w-lg mx-auto mb-10 shadow-card">
          <label className="text-sm text-muted-foreground font-mono block mb-2">Enter USDT Amount</label>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl text-accent font-bold">$</span>
            <input
              type="number"
              value={usdInput}
              onChange={(e) => setUsdInput(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-2xl font-display font-bold text-foreground w-full focus:outline-none focus:border-primary/50 transition-colors"
              min="1"
            />
          </div>
          <div className="space-y-3">
            {FUND_RATES.map((f, i) => {
              const inr = (parseFloat(usdInput) || 0) * f.rate;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    hovered === i ? "border-primary/40 bg-primary/5 shadow-glow" : "border-border/40 bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft className={`w-4 h-4 ${f.color}`} />
                    <div>
                      <span className={`font-display font-bold text-sm ${f.color}`}>{f.label}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">₹{f.rate}/$</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-display font-bold text-foreground">₹{inr.toLocaleString("en-IN")}</span>
                    <span className="block text-[10px] text-primary font-mono">{f.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-10 py-4 text-base rounded-2xl font-display font-bold group"
          >
            Start Exchanging <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExchangeHomepageSection;
