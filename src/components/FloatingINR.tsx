import { useEffect, useState } from "react";

const symbols = ["₹", "$", "₿", "◆", "⬡", "✦"];

const FloatingINR = () => {
  const [items, setItems] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; symbol: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      size: 10 + Math.random() * 24,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));
    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((s) => (
        <span
          key={s.id}
          className="absolute text-primary/[0.04] font-bold animate-float-symbol select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
};

export default FloatingINR;
