import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">CyberPulse</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/report-crime" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Report Crime
          </Link>
          <Link to="/check-misinformation" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Check Misinformation
          </Link>
          <Link to="/awareness" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Awareness
          </Link>
          <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;