import { useEffect, useState } from "react";

const FloatingINR = () => {
  const [symbols, setSymbols] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      size: 14 + Math.random() * 28,
    }));
    setSymbols(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((s) => (
        <span
          key={s.id}
          className="absolute text-primary/10 font-bold animate-float-inr select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${5 + Math.random() * 4}s`,
          }}
        >
          ₹
        </span>
      ))}
    </div>
  );
};

export default FloatingINR;
