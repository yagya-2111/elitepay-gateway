import { Shield, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/elitepay-logo.png" alt="ElitePay" className="w-10 h-10 object-contain" />
              <span className="text-xl font-display font-bold text-gradient">ElitePay</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              India's most trusted payment gateway. Secure, fast, and reliable payment solutions for businesses of all sizes.
            </p>
            <p className="text-muted-foreground text-xs mt-4">For educational purposes only.</p>
          </div>
          <div>
            <h4 className="text-foreground font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-display font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <a
                href="https://t.me/elitepaycompany"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Telegram Channel: @elitepaycompany
              </a>
              <a
                href="https://t.me/elitepayofficiall"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Owner: @elitepayofficiall
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            © 2024 ElitePay. All rights reserved. | For Educational Purposes Only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
