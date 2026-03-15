import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import FloatingINR from "@/components/FloatingINR";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login successful!", description: "Welcome back to GCL PAY" });
        navigate("/dashboard", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "Welcome to GCL PAY" });
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <FloatingINR />
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className={`hidden lg:flex flex-col justify-center ${isLogin ? "lg:order-2" : "lg:order-1"} animate-fade-in-up`}>
          <div className="flex items-center gap-2 mb-6">
            <img src="/images/gclpay-logo.png" alt="GCL PAY" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-display font-bold text-gradient">GCL PAY</span>
          </div>
          {isLogin ? (
            <>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Welcome Back!</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Access your GCL PAY dashboard to manage your funds, track transactions, and withdraw earnings.
              </p>
              <div className="space-y-3">
                {["Bank-grade security for every login", "Real-time fund tracking", "Instant withdrawal processing"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" /> {t}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Start Earning Today</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Join 50,000+ merchants who trust GCL PAY for their payment processing needs.
              </p>
              <div className="space-y-3">
                {["₹12,500 Cr+ processed monthly", "99.99% uptime guarantee", "24/7 dedicated support"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" /> {t}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={`${isLogin ? "lg:order-1" : "lg:order-2"} animate-fade-in-up`} style={{ animationDelay: "0.2s" }}>
          <div className="glass-card p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <img src="/images/gclpay-logo.png" alt="GCL PAY" className="w-10 h-10 object-contain" />
              <span className="text-xl font-display font-bold text-gradient">GCL PAY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">
              {isLogin ? "Login to your account" : "Create your account"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required className="bg-secondary border-border" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" required className="bg-secondary border-border" />
                  </div>
                </>
              )}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="bg-secondary border-border pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
