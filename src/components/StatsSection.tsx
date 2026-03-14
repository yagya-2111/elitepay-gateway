import { useEffect, useState, useRef } from "react";
import { Users, IndianRupee, Clock, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { icon: Users, value: 50000, label: "Active Merchants", prefix: "", suffix: "+", format: true },
  { icon: IndianRupee, value: 12500, label: "Crores Processed", prefix: "₹", suffix: " Cr+", format: true },
  { icon: Clock, value: 99.99, label: "Uptime Guaranteed", prefix: "", suffix: "%", format: false },
  { icon: TrendingUp, value: 2000000, label: "Daily Transactions", prefix: "", suffix: "+", format: true },
];

const AnimatedNumber = ({ value, prefix, suffix, format }: { value: number; prefix: string; suffix: string; format: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const displayValue = format
    ? Math.floor(count).toLocaleString("en-IN")
    : count.toFixed(2);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-display font-extrabold text-foreground">
      {prefix}{displayValue}{suffix}
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="glow-line w-full mb-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="glass-card-hover p-6 text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} format={s.format} />
              <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
                {s.label} <ArrowUpRight className="w-3 h-3 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
