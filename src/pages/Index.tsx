import FloatingINR from "@/components/FloatingINR";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CryptoMarketTicker from "@/components/CryptoMarketTicker";
import MarqueePartners from "@/components/MarqueePartners";
import StatsSection from "@/components/StatsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import FundsAvailableSection from "@/components/FundsAvailableSection";
import ExchangeHomepageSection from "@/components/ExchangeHomepageSection";
import LiveExchangeTransactions from "@/components/LiveExchangeTransactions";
import HowItWorks from "@/components/HowItWorks";
import BankAccountTypes from "@/components/BankAccountTypes";
import SettlementCalculatorSection from "@/components/SettlementCalculatorSection";
import TransactionGraphSection from "@/components/TransactionGraphSection";
import LiveTransactions from "@/components/LiveTransactions";
import NetworkInfraSection from "@/components/NetworkInfraSection";
import BankDirectorySection from "@/components/BankDirectorySection";
import SecurityDepositsSection from "@/components/SecurityDepositsSection";
import TrustSection from "@/components/TrustSection";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingINR />
      <Navbar />
      <HeroSection />
      <CryptoMarketTicker />
      <MarqueePartners />
      <StatsSection />
      <WhyChooseSection />
      <FundsAvailableSection />
      <ExchangeHomepageSection />
      <LiveExchangeTransactions />
      <HowItWorks />
      <BankAccountTypes />
      <SettlementCalculatorSection />
      <TransactionGraphSection />
      <LiveTransactions />
      <NetworkInfraSection />
      <BankDirectorySection />
      <SecurityDepositsSection />
      <TrustSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
