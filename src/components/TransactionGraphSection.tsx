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
    <section className="py-24 relative bg-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Analytics</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Transaction <span className="text-gradient">Analytics</span>
          </h2>
          <p className="text-muted-foreground text-lg">Real-time insights into our payment processing engine</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 shadow-card">
            <h3 className="text-foreground font-display font-bold text-base mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Monthly Volume (₹ Crores)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 14%)" />
                <XAxis dataKey="month" stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(240, 12%, 7%)", border: "1px solid hsl(240, 10%, 14%)", borderRadius: "12px", color: "hsl(0, 0%, 95%)" }}
                />
                <Bar dataKey="volume" fill="hsl(160, 84%, 39%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-6 shadow-card">
            <h3 className="text-foreground font-display font-bold text-base mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Today's Transaction Flow
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 14%)" />
                <XAxis dataKey="hour" stroke="hsl(240, 5%, 50%)" fontSize={10} interval={3} />
                <YAxis stroke="hsl(240, 5%, 50%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(240, 12%, 7%)", border: "1px solid hsl(240, 10%, 14%)", borderRadius: "12px", color: "hsl(0, 0%, 95%)" }}
                />
                <Area type="monotone" dataKey="txns" stroke="hsl(45, 93%, 58%)" fill="hsl(45, 93%, 58%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionGraphSection;
