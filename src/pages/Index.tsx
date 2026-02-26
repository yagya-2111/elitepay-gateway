import FloatingINR from "@/components/FloatingINR";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import LiveTransactions from "@/components/LiveTransactions";
import TrustSection from "@/components/TrustSection";
import TransactionGraphSection from "@/components/TransactionGraphSection";
import ExchangeHomepageSection from "@/components/ExchangeHomepageSection";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <WhyChooseSection />
      <ExchangeHomepageSection />
      <TransactionGraphSection />
      <LiveTransactions />
      <TrustSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
