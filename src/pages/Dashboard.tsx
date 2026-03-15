import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FloatingINR from "@/components/FloatingINR";
import FundsSection from "@/components/dashboard/FundsSection";
import BankAccountSection from "@/components/dashboard/BankAccountSection";
import ProfileSection from "@/components/dashboard/ProfileSection";
import KYCSection from "@/components/dashboard/KYCSection";
import ExchangeSection from "@/components/dashboard/ExchangeSection";
import InrWithdrawalSection from "@/components/dashboard/InrWithdrawalSection";
import UpiWorkSection from "@/components/dashboard/UpiWorkSection";
import UsdtDepositSection from "@/components/dashboard/UsdtDepositSection";
import InrDepositSection from "@/components/dashboard/InrDepositSection";
import UsdtWithdrawSection from "@/components/dashboard/UsdtWithdrawSection";
import SupportDashboardSection from "@/components/dashboard/SupportDashboardSection";
import FullPanelSection from "@/components/dashboard/FullPanelSection";
import { User, Wallet, Building2, ArrowRightLeft, IndianRupee, Smartphone, DollarSign, ArrowDownToLine, ArrowUpFromLine, Headphones, LayoutGrid } from "lucide-react";
import { Info } from "lucide-react";

const TABS = [
  { value: "profile", label: "Profile", icon: User },
  { value: "bank", label: "Add Account", icon: Building2 },
  { value: "upi-work", label: "UPI Work", icon: Smartphone },
  { value: "exchange", label: "USDT Exchange", icon: ArrowRightLeft },
  { value: "full-panel", label: "Full Panel Access", icon: LayoutGrid },
  { value: "inr-deposit", label: "INR Deposit", icon: IndianRupee },
  { value: "usdt-deposit", label: "USDT Deposit", icon: DollarSign },
  { value: "inr-withdraw", label: "INR Withdraw", icon: ArrowDownToLine },
  { value: "usdt-withdraw", label: "USDT Withdraw", icon: ArrowUpFromLine },
  { value: "support", label: "Support", icon: Headphones },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { navigate("/auth", { replace: true }); return; }
      setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth", { replace: true }); return; }
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
      <div className="pt-20 pb-10 max-w-6xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-display font-bold text-foreground truncate">
            Welcome, <span className="text-gradient">{profile?.name || user.email}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your funds, exchange & withdrawals</p>
        </div>

        {/* Announcement banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 mb-6">
          <Info className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-xs sm:text-sm text-accent font-mono">
            <span className="font-bold">NEW UPDATE SOON</span> 🔜 FOR FUTURE BENEFITS ADD DEPOSIT IN YOUR ID FOR ACTIVE 🔜
          </p>
        </div>

        {/* Tab navigation - scrollable on mobile */}
        <div className="overflow-x-auto -mx-3 px-3 mb-6 sm:mb-8">
          <div className="flex gap-1 min-w-max pb-2">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveTab(t.value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  activeTab === t.value
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "profile" && <ProfileSection user={user} profile={profile} />}
        {activeTab === "bank" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BankAccountSection userId={user.id} />
            <KYCSection userId={user.id} />
          </div>
        )}
        {activeTab === "upi-work" && <UpiWorkSection />}
        {activeTab === "exchange" && <ExchangeSection userId={user.id} />}
        {activeTab === "full-panel" && <FullPanelSection userId={user.id} />}
        {activeTab === "inr-deposit" && <InrDepositSection userId={user.id} />}
        {activeTab === "usdt-deposit" && <UsdtDepositSection userId={user.id} />}
        {activeTab === "inr-withdraw" && <InrWithdrawalSection userId={user.id} />}
        {activeTab === "usdt-withdraw" && <UsdtWithdrawSection userId={user.id} />}
        {activeTab === "support" && <SupportDashboardSection />}
      </div>
    </div>
  );
};

export default Dashboard;
