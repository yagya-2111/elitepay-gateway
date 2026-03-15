import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, LayoutDashboard, Crown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      else { setIsAdmin(false); setIsSuperAdmin(false); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roles = (data || []).map(r => r.role);
    setIsAdmin(roles.includes("admin") || roles.includes("super_admin"));
    setIsSuperAdmin(roles.includes("super_admin"));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-2xl border-b border-border/50 shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/images/gclpay-logo.png" alt="GCL PAY" className="w-9 h-9 object-contain relative z-10" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">GCL PAY</span>
        </Link>
        
        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground hover:bg-primary/5">
                <User className="w-4 h-4 mr-1" /> Dashboard
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="text-primary hover:text-primary hover:bg-primary/5">
                  <LayoutDashboard className="w-4 h-4 mr-1" /> Admin
                </Button>
              )}
              {isSuperAdmin && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/super-admin")} className="text-accent hover:text-accent hover:bg-accent/5">
                  <Crown className="w-4 h-4 mr-1" /> Super Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow text-sm px-5">
              Get Started
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-card/95 backdrop-blur-2xl border-t border-border/50 animate-slide-down">
          <div className="p-4 space-y-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }} className="w-full justify-start text-muted-foreground">
                  <User className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => { navigate("/admin"); setMobileOpen(false); }} className="w-full justify-start text-primary">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                  </Button>
                )}
                {isSuperAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => { navigate("/super-admin"); setMobileOpen(false); }} className="w-full justify-start text-accent">
                    <Crown className="w-4 h-4 mr-2" /> Super Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full justify-start text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full bg-primary text-primary-foreground">
                Get Started
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
