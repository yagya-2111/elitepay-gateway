import { ExternalLink, MessageCircle, Headphones } from "lucide-react";

const SupportDashboardSection = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 shadow-card">
        <h3 className="text-lg font-display font-bold text-foreground mb-4">Contact Support</h3>
        <p className="text-sm text-muted-foreground mb-6">Need help? Reach out to our team directly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://t.me/gclpayceo" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold">Telegram Group</p>
              <p className="text-primary text-sm font-mono flex items-center gap-1">
                @gclpayceo <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>

          <a href="https://t.me/gclpayceo" target="_blank" rel="noopener noreferrer" className="glass-card-hover p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-foreground font-display font-bold">Direct Support</p>
              <p className="text-accent text-sm font-mono flex items-center gap-1">
                @gclpayceo <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboardSection;
