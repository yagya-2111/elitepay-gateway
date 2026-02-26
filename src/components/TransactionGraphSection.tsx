import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const monthlyData = [
  { month: "Jul", volume: 850 },
  { month: "Aug", volume: 920 },
  { month: "Sep", volume: 1100 },
  { month: "Oct", volume: 1350 },
  { month: "Nov", volume: 1500 },
  { month: "Dec", volume: 1800 },
  { month: "Jan", volume: 2100 },
  { month: "Feb", volume: 2400 },
];

const dailyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  txns: Math.floor(Math.random() * 5000) + 2000,
}));

const TransactionGraphSection = () => {
  return (
    <section className="py-24 relative bg-blue-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Transaction <span className="text-gradient">Analytics</span>
          </h2>
          <p className="text-muted-foreground text-lg">Real-time insights into our payment processing</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 shadow-card">
            <h3 className="text-foreground font-display font-semibold text-lg mb-6">Monthly Volume (₹ Crores)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(217, 30%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                />
                <Bar dataKey="volume" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-6 shadow-card">
            <h3 className="text-foreground font-display font-semibold text-lg mb-6">Today's Transaction Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 18%)" />
                <XAxis dataKey="hour" stroke="hsl(215, 20%, 55%)" fontSize={10} interval={3} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(217, 30%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                />
                <Area type="monotone" dataKey="txns" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionGraphSection;
