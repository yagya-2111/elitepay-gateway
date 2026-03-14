import FloatingINR from "@/components/FloatingINR";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueePartners from "@/components/MarqueePartners";
import StatsSection from "@/components/StatsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ExchangeHomepageSection from "@/components/ExchangeHomepageSection";
import LiveExchangeTransactions from "@/components/LiveExchangeTransactions";
import HowItWorks from "@/components/HowItWorks";
import BankAccountTypes from "@/components/BankAccountTypes";
import TransactionGraphSection from "@/components/TransactionGraphSection";
import LiveTransactions from "@/components/LiveTransactions";
import TrustSection from "@/components/TrustSection";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <HeroSection />
      <MarqueePartners />
      <StatsSection />
      <WhyChooseSection />
      <ExchangeHomepageSection />
      <LiveExchangeTransactions />
      <HowItWorks />
      <BankAccountTypes />
      <TransactionGraphSection />
      <LiveTransactions />
      <TrustSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
