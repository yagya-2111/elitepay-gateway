import FloatingINR from "@/components/FloatingINR";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import LiveTransactions from "@/components/LiveTransactions";
import TrustSection from "@/components/TrustSection";
import TransactionGraphSection from "@/components/TransactionGraphSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <WhyChooseSection />
      <TransactionGraphSection />
      <LiveTransactions />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
