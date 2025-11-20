import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Users, CheckCircle, Lock, AlertTriangle, Globe, Zap } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl font-bold mb-4">About CyberPulse</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in combating cyber threats and misinformation in the digital age.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksCard
              step="1"
              icon={<AlertTriangle className="w-8 h-8 text-whiz-primary" />}
              title="Report Incident"
              description="Submit detailed information about cybercrime or suspicious content through our secure platform."
            />
            <HowItWorksCard
              step="2"
              icon={<Target className="w-8 h-8 text-whiz-primary" />}
              title="AI Analysis"
              description="Our advanced AI algorithms analyze and verify the authenticity of reported content in real-time."
            />
            <HowItWorksCard
              step="3"
              icon={<Shield className="w-8 h-8 text-whiz-primary" />}
              title="Take Action"
              description="Receive verified results and recommendations. Our team coordinates with authorities when needed."
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-whiz-primary" />}
              title="Secure Reporting"
              description="End-to-end encryption ensures your reports remain confidential and secure."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-whiz-primary" />}
              title="Real-time Verification"
              description="AI-powered instant verification of URLs, text, and images for misinformation."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-whiz-primary" />}
              title="Community Network"
              description="Join a global network of volunteers helping to combat cyber threats."
            />
            <FeatureCard
              icon={<CheckCircle className="w-6 h-6 text-whiz-primary" />}
              title="Case Tracking"
              description="Track your reported cases with real-time updates and resolution status."
            />
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4">Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet the dedicated team behind CyberPulse, working to make the digital world safer for everyone.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TeamMemberCard
              name="Shrinidhi Maheshwaran"
              role="Full Stack Developer"
              education="M.Tech, Amrita Vishwa Vidyapeetham"
              location="Coimbatore, India"
              roleTag="Dev"
              focus="Full Stack"
              image="./src/assets/Shrinidhi.jpg"
            />
            <TeamMemberCard
              name="Archa Biju"
              role="Full Stack Developer"
              education="M.Tech, Amrita Vishwa Vidyapeetham"
              location="Coimbatore, India"
              roleTag="Dev"
              focus="Full Stack"
              image="./src/assets/Archa.jpg"
            />
            <TeamMemberCard
              name="Vrinda Pillai"
              role="Full Stack Developer"
              education="M.Tech, Amrita Vishwa Vidyapeetham"
              location="Coimbatore, India"
              roleTag="Dev"
              focus="Full Stack"
              image="./src/assets/vrinda.jpg"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const HowItWorksCard = ({ step, icon, title, description }: { step: string, icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-whiz-dark/80 border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 text-9xl font-bold text-whiz-primary/5 -mt-4 -mr-4 group-hover:text-whiz-primary/10 transition-all">
      {step}
    </div>
    <CardHeader>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-whiz-primary/10 rounded-lg">
          {icon}
        </div>
        <CardTitle className="text-xl text-whiz-light">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-whiz-dark/80 border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 group">
    <CardHeader>
      <div className="p-3 bg-whiz-primary/10 rounded-lg w-fit mb-3 group-hover:bg-whiz-primary/20 transition-all">
        {icon}
      </div>
      <CardTitle className="text-lg text-whiz-light">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);

const TeamMemberCard = ({ name, role, education, location, roleTag, focus, image }: {
  name: string,
  role: string,
  education: string,
  location: string,
  roleTag: string,
  focus: string,
  image: string
}) => (
  <Card className="bg-whiz-dark/80 border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 overflow-hidden group">
    <CardHeader className="pb-3 pt-8">
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-whiz-primary/30 group-hover:border-whiz-primary/60 transition-all duration-300">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      <CardTitle className="text-xl text-whiz-light text-center">{name}</CardTitle>
      <p className="text-whiz-primary font-medium text-center">{role}</p>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{education}</p>
        <p className="text-sm text-muted-foreground">{location}</p>
      </div>
      <div className="flex gap-2 justify-center">
        <span className="px-3 py-1 bg-whiz-primary/20 text-whiz-primary text-xs font-semibold rounded-full border border-whiz-primary/30">
          ROLE: {roleTag}
        </span>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
          FOCUS: {focus}
        </span>
      </div>
    </CardContent>
  </Card>
);

export default AboutUs;
