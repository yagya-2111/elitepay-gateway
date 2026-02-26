import { ExternalLink, MessageCircle, Headphones, Shield, Clock, Users } from "lucide-react";

const SupportSection = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Headphones className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">24/7 Support</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            We're Always <span className="text-gradient">Here For You</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our dedicated support team is available round the clock to assist you with any queries or issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Clock, label: "24/7 Availability", desc: "Round the clock support for all your payment needs" },
            { icon: Users, label: "Active Community", desc: "Join thousands of merchants in our Telegram group" },
            { icon: Shield, label: "Trusted & Verified", desc: "Official ElitePay channels for secure communication" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-display font-semibold text-lg mb-1">{item.label}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <a
            href="https://t.me/elitepaycompany"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 flex items-center gap-4 hover:border-primary/40 transition-all hover:shadow-blue-glow group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold text-lg">Telegram Group</p>
              <p className="text-muted-foreground text-sm">Join our official community</p>
              <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1">
                @elitepaycompany <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>

          <a
            href="https://t.me/elitepayofficiall"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 flex items-center gap-4 hover:border-primary/40 transition-all hover:shadow-blue-glow group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold text-lg">Official Owner</p>
              <p className="text-muted-foreground text-sm">Direct contact with management</p>
              <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1">
                @elitepayofficiall <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
