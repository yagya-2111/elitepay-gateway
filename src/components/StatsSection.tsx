import { useEffect, useState } from "react";
import { Users, IndianRupee, Clock, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Merchants", suffix: "" },
  { icon: IndianRupee, value: "₹12,500", label: "Crores Processed", suffix: " Cr+" },
  { icon: Clock, value: "99.99%", label: "Uptime Guaranteed", suffix: "" },
  { icon: TrendingUp, value: "2M+", label: "Daily Transactions", suffix: "" },
];

const StatsSection = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-20 relative bg-blue-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`glass-card p-6 text-center shadow-card transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
