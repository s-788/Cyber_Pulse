import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-whiz-dark border-t border-whiz-secondary/30 relative mt-auto">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-whiz-primary/50 to-transparent"></div>

      <div className="container mx-auto px-4 py-12 text-whiz-light">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <ShieldCheck className="h-8 w-8 text-whiz-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-whiz-light">Cyber<span className="text-whiz-primary">Pulse</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A secure and trusted platform for reporting cybercrime and combating misinformation. Your digital safety is our mission.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-whiz-light mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/report-crime">Report Crime</FooterLink>
              <FooterLink to="/check-misinformation">Check Misinformation</FooterLink>
              <FooterLink to="/awareness">Awareness Center</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact-us">
            <h3 className="font-semibold text-whiz-light mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-whiz-primary/80" />
                <a href="mailto:cyberdost@mha.gov.in" className="hover:text-whiz-primary transition-colors">
                  cyberdost@mha.gov.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-whiz-primary/80" />
                <a href="tel:1930" className="hover:text-whiz-primary transition-colors">
                  Emergency Helpline: 1930
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-whiz-primary/80" />
                <span>National Reporting Portal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-whiz-secondary/30 mt-10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CyberPulse Initiative. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2">
            A collaborative project for a safer digital India.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-sm text-muted-foreground hover:text-whiz-primary transition-colors duration-200">
      {children}
    </Link>
  </li>
);

export default Footer;
