const partners = [
  "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "PNB", "Bank of Baroda",
  "Kotak Mahindra", "IndusInd Bank", "Yes Bank", "Union Bank", "Canara Bank", "IDBI Bank",
  "Federal Bank", "RBL Bank", "South Indian Bank", "Bandhan Bank",
];

const MarqueePartners = () => {
  return (
    <section className="py-12 relative overflow-hidden border-y border-border/20">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-center text-xs font-mono text-muted-foreground uppercase tracking-wider">Trusted Banking Partners</p>
      </div>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="mx-6 flex items-center gap-2 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <span className="text-sm font-display font-semibold text-muted-foreground/60">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueePartners;
