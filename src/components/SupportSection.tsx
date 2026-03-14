import { ExternalLink, MessageCircle, Headphones, Shield, Clock, Users } from "lucide-react";

const SupportSection = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Support</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Always <span className="text-gradient-gold">Here For You</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our expert team is available 24/7. We're just one message away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock, label: "24/7 Availability", desc: "Round the clock support for all needs" },
            { icon: Users, label: "Active Community", desc: "Join 50K+ merchants on Telegram" },
            { icon: Shield, label: "Verified Channels", desc: "Official ElitePay communication only" },
          ].map((item, i) => (
            <div key={i} className="glass-card-hover p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-bold text-base mb-1">{item.label}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <a
            href="https://t.me/elitepayadmin"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card-hover p-6 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold text-lg">Telegram Group</p>
              <p className="text-muted-foreground text-sm">Join our official community</p>
              <p className="text-primary text-sm font-mono font-medium mt-1 flex items-center gap-1">
                @elitepayadmin <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>

          <a
            href="https://t.me/elitepayadmin"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card-hover p-6 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 transition-colors">
              <Headphones className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold text-lg">Direct Support</p>
              <p className="text-muted-foreground text-sm">Contact management directly</p>
              <p className="text-accent text-sm font-mono font-medium mt-1 flex items-center gap-1">
                @elitepayadmin <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
