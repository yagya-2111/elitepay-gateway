import { useEffect, useState } from "react";

const MARKETS = [
  { pair: "USDT/INR", price: "₹98.00", change: "+0.12%", positive: true },
  { pair: "BTC/USDT", price: "$67,842", change: "+2.4%", positive: true },
  { pair: "ETH/USDT", price: "$3,521", change: "-0.8%", positive: false },
  { pair: "BNB/USDT", price: "$612", change: "+1.1%", positive: true },
  { pair: "SOL/USDT", price: "$178", change: "+5.2%", positive: true },
  { pair: "TRX/USDT", price: "$0.142", change: "+0.3%", positive: true },
  { pair: "XRP/USDT", price: "$2.41", change: "-1.2%", positive: false },
  { pair: "MATIC/USDT", price: "$0.89", change: "+0.7%", positive: true },
];

const CryptoMarketTicker = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const items = [...MARKETS, ...MARKETS];

  return (
    <div className="w-full bg-card/80 backdrop-blur-lg border-y border-border/30 overflow-hidden py-2">
      <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
        {items.map((m, i) => (
          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-primary font-mono font-bold">{m.pair}</span>
            <span className="text-foreground font-medium">{m.price}</span>
            <span className={`font-mono text-xs ${m.positive ? "text-primary" : "text-destructive"}`}>
              {m.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoMarketTicker;
