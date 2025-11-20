import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Close mobile menu on route change
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    // The following is a simplified way to listen to route changes with react-router-dom.
    // A more robust solution might use a history listener if available in the library version.
    return () => {
      // Cleanup if needed
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Primary navigation links (always visible)
  const primaryLinks = [
    { label: "Home", path: "/" },
    { label: "Report Crime", path: "/report-crime" },
    { label: "Check Misinformation", path: "/check-misinformation" },
  ];

  // Secondary links (in "More" dropdown)
  const secondaryLinks = [
    { label: "Awareness", path: "/awareness" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact", path: "/#contact-us", isAnchor: true },
  ];

  // Role-specific links
  const getRoleLinks = () => {
    const links = [];
    if (userRole === "user" || userRole === "ngo" || userRole === "volunteer" || userRole === "admin") {
      links.push({ label: "Dashboard", path: "/dashboard" });
    }
    if (userRole === "ngo" || userRole === "volunteer" || userRole === "admin") {
      links.push({ label: "Volunteer", path: "/volunteer-dashboard" });
    }
    if (userRole === "admin") {
      links.push({ label: "Admin", path: "/admin" });
    }
    return links;
  };

  const roleLinks = getRoleLinks();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Cyber<span className="text-primary">Pulse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Primary Links */}
            {primaryLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 relative",
                  "hover:text-primary",
                  isActive(path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-primary rounded-full"></span>
                )}
              </Link>
            ))}

            {/* Role-specific Links */}
            {roleLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 relative",
                  "hover:text-primary",
                  isActive(path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-primary rounded-full"></span>
                )}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium px-3 py-2 h-auto",
                    secondaryLinks.some(link => isActive(link.path))
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {secondaryLinks.map(({ label, path, isAnchor }) => (
                  <DropdownMenuItem key={path} asChild>
                    {isAnchor ? (
                      <a
                        href={path}
                        className="cursor-pointer"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        to={path}
                        className={cn(
                          "cursor-pointer",
                          isActive(path) && "text-primary font-medium"
                        )}
                      >
                        {label}
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center gap-1.5">
            {userRole ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                Logout
              </Button>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 bg-transparent border-none">
                    <LoginForm onLoginSuccess={() => navigate(0)} />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="btn-cyber px-4">Sign Up</Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 bg-transparent border-none">
                    <SignupForm onSignupSuccess={() => navigate(0)} />
                  </DialogContent>
                </Dialog>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {/* Primary Links */}
            {primaryLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "block font-medium py-3 px-3 rounded-md",
                  isActive(path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {/* Role-specific Links */}
            {roleLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "block font-medium py-3 px-3 rounded-md",
                  isActive(path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {/* Secondary Links */}
            {secondaryLinks.map(({ label, path, isAnchor }) => (
              isAnchor ? (
                <a
                  key={path}
                  href={path}
                  className="block font-medium py-3 px-3 rounded-md text-muted-foreground hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "block font-medium py-3 px-3 rounded-md",
                    isActive(path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
              {userRole ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start p-3"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 text-muted-foreground"
                      >
                        Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none">
                      <LoginForm onLoginSuccess={() => setMobileMenuOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-cyber mt-2">
                        Sign Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none">
                      <SignupForm onSignupSuccess={() => setMobileMenuOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
            <div className="pt-4 border-t border-border/50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 text-muted-foreground"
                  >
                    <Sun className="h-5 w-5 mr-2" /> Theme
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
