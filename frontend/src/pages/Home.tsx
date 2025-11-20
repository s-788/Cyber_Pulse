import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Search, BookOpen, BarChart, AlertTriangle } from "lucide-react";

// Using a cybersecurity-themed background - Digital Security & Network
const heroImage = "./src/assets/Cyber.jpg";

const Home = () => {
  return (
    <div className="flex flex-col text-foreground">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center text-center text-white py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 flex flex-col items-center space-y-4 sm:space-y-6 animate-fade-in w-full">
          <div className="bg-black/60 backdrop-blur-md px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 rounded-xl sm:rounded-2xl border border-whiz-primary/30 shadow-2xl max-w-5xl w-full mx-2 sm:mx-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-tight animate-glow text-white mb-4 sm:mb-6">
              Your Shield Against <span className="text-whiz-primary">Digital Threats</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl font-medium mx-auto px-2">
              CyberPulse is your frontline defense for reporting cybercrime and verifying information in the digital age. Secure, swift, and reliable.
            </p>
            <div className="pt-6 sm:pt-8">
              <Link to="/report-crime">
                <Button size="lg" className="btn-cyber text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 bg-whiz-primary text-whiz-dark hover:bg-whiz-primary/90 shadow-lg w-full sm:w-auto">
                  <ShieldCheck className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Report a Cybercrime
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-whiz-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Core Platform Features</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-2 px-4">
              Integrated tools for a safer digital environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<ShieldCheck size={32} className="text-whiz-primary" />}
              title="Secure Crime Reporting"
              description="File detailed cybercrime reports through an encrypted, user-friendly interface. Your data's security is our top priority."
              link="/report-crime"
              linkText="File a Report"
            />
            <FeatureCard
              icon={<Search size={32} className="text-whiz-primary" />}
              title="Misinformation Analysis"
              description="Verify suspicious links, articles, or messages using our AI-powered detection engine to combat the spread of false information."
              link="/check-misinformation"
              linkText="Verify Content"
            />
            <FeatureCard
              icon={<BookOpen size={32} className="text-whiz-primary" />}
              title="Awareness Portal"
              description="Stay informed with our curated library of articles, guides, and best practices for staying safe online."
              link="/awareness"
              linkText="Learn More"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-whiz-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <StatItem value="12,000+" label="Incidents Reported" />
          <StatItem value="98%" label="Case Resolution Rate" />
          <StatItem value="6M+" label="Threats Neutralized" />
          <StatItem value="24/7" label="Support Network" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-whiz-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <AlertTriangle className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mx-auto mb-4 sm:mb-6 text-whiz-primary" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">Are You Facing a Cyber Emergency?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
            Our rapid response team and emergency resources are available around the clock. Don't hesitate to get help now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" variant="outline" className="h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg border-whiz-primary text-whiz-primary hover:bg-whiz-primary/10 hover:text-whiz-primary w-full sm:w-auto">
                Call Helpline: 1930
            </Button>
            <Link to="/report-crime" className="w-full sm:w-auto">
                <Button size="lg" className="btn-cyber text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 bg-whiz-primary text-whiz-dark w-full sm:w-auto">
                    File Emergency Report
                </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link: string, linkText: string }) => (
  <Card className="bg-whiz-dark/60 backdrop-blur-sm border-border/50 hover:border-whiz-primary/50 transition-all duration-300 transform hover:-translate-y-2 group">
    <CardHeader className="items-center text-center">
      <div className="p-4 bg-whiz-primary/10 rounded-full mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link to={link}>
        <Button variant="ghost" className="text-whiz-primary hover:bg-whiz-primary/10 hover:text-whiz-primary">
            {linkText}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="p-2">
    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-whiz-primary mb-1 sm:mb-2">{value}</div>
    <div className="text-xs sm:text-sm uppercase tracking-wide sm:tracking-widest text-muted-foreground">{label}</div>
  </div>
);

export default Home;
