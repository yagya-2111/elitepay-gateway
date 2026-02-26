import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Zap, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero bg-blue-glow pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">India's #1 Trusted Payment Gateway</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="text-foreground">Secure & Instant</span>
            <br />
            <span className="text-gradient">Payment Solutions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Process payments seamlessly with ElitePay — trusted by 50,000+ merchants across India. 
            Lightning-fast UPI transactions with 99.99% uptime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-blue-glow text-lg px-8 py-6 rounded-xl group"
            >
              Start Earning <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6 rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: Shield, label: "Bank-Grade Security", desc: "256-bit SSL encryption" },
            { icon: Globe, label: "Pan-India Coverage", desc: "All major banks supported" },
            { icon: Lock, label: "RBI Compliant", desc: "Fully regulated gateway" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 text-center animate-pulse-glow">
              <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-foreground font-display font-semibold text-lg">{item.label}</h3>
              <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
