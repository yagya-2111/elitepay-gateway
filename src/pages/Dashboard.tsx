import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FloatingINR from "@/components/FloatingINR";
import FundsSection from "@/components/dashboard/FundsSection";
import BankAccountSection from "@/components/dashboard/BankAccountSection";
import ProfileSection from "@/components/dashboard/ProfileSection";
import KYCSection from "@/components/dashboard/KYCSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, Building2, ShieldCheck } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      fetchProfile(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    setProfile(data);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <div className="pt-20 pb-10 max-w-6xl mx-auto px-4 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome, <span className="text-gradient">{profile?.name || user.email}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage your funds, bank accounts & KYC</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-secondary border border-border mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="funds" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wallet className="w-4 h-4 mr-2" /> Funds
            </TabsTrigger>
            <TabsTrigger value="bank" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" /> Bank & KYC
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSection user={user} profile={profile} />
          </TabsContent>
          <TabsContent value="funds">
            <FundsSection userId={user.id} />
          </TabsContent>
          <TabsContent value="bank">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BankAccountSection userId={user.id} />
              <KYCSection userId={user.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
