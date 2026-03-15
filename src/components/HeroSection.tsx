import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-16 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full animate-rotate-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/5 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-slide-up">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img src="/images/gclpay-logo.png" alt="GCL PAY" className="w-20 h-20 object-contain relative z-10 rounded-2xl" />
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl" />
              <div className="absolute -inset-2 border border-primary/20 rounded-3xl animate-border-glow" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent, hsl(160, 84%, 39%, 0.05), transparent)", backgroundSize: "200% 100%" }}>
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground/80 font-medium">India's Most Trusted Payment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-6 leading-[0.9] tracking-tight">
            <span className="text-foreground">Next-Gen</span>
            <br />
            <span className="text-gradient">Payment</span>{" "}
            <span className="text-gradient-gold">Gateway</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed px-4">
            Process payments at lightning speed with military-grade security. 
            Trusted by <span className="text-primary font-semibold">50,000+</span> merchants. 
            <span className="text-accent font-semibold"> 99.99%</span> uptime guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl group font-display font-bold"
            >
              Start Earning <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 text-foreground hover:bg-secondary/50 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl font-display"
            >
              Explore Features
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: Shield, label: "Military-Grade Security", desc: "256-bit AES encryption", color: "text-primary" },
            { icon: Zap, label: "Instant Processing", desc: "Sub-second settlements", color: "text-accent" },
            { icon: TrendingUp, label: "Best Exchange Rates", desc: "Competitive USDT rates", color: "text-primary" },
          ].map((item, i) => (
            <div key={i} className="glass-card-hover p-4 sm:p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-foreground font-display font-bold text-sm sm:text-base">{item.label}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
