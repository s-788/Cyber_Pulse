import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Shield, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Awareness = () => {
  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-whiz-light">Awareness & Education Center</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Learn how to protect yourself from cyber threats and identify misinformation
          </p>
        </div>

        <Tabs defaultValue="cybersafety" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0 h-auto sm:h-10">
            <TabsTrigger value="cybersafety" className="text-xs sm:text-sm">Cyber Safety</TabsTrigger>
            <TabsTrigger value="misinformation" className="text-xs sm:text-sm">Misinformation</TabsTrigger>
            <TabsTrigger value="legal" className="text-xs sm:text-sm">Legal Info</TabsTrigger>
          </TabsList>

          {/* Cyber Safety Tab */}
          <TabsContent value="cybersafety" className="space-y-4 sm:space-y-6">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-whiz-light text-base sm:text-lg md:text-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-whiz-primary" />
                  Essential Cyber Safety Practices
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Protect yourself and your data from common cyber threats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-whiz-primary/10 border border-whiz-primary/20 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-whiz-light text-sm sm:text-base">Strong Passwords</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Use unique passwords for each account. Include uppercase, lowercase, numbers, and special characters.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-whiz-primary/10 border border-whiz-primary/20 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-whiz-light text-sm sm:text-base">Two-Factor Authentication</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Enable 2FA on all important accounts. Use authenticator apps instead of SMS when possible.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-whiz-primary/10 border border-whiz-primary/20 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-whiz-light text-sm sm:text-base">Verify Before Clicking</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Don't click on suspicious links. Hover to check URLs before clicking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-whiz-primary/10 border border-whiz-primary/20 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-whiz-light text-sm sm:text-base">Regular Updates</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Keep your software, OS, and antivirus updated to patch security vulnerabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Scams */}
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-whiz-light text-base sm:text-lg md:text-xl">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                  Common Cyber Scams to Watch Out For
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-whiz-light">
                    <strong>Phishing Emails:</strong> Fraudulent emails pretending to be from legitimate organizations.
                    Look for poor grammar, urgent requests, and suspicious sender addresses.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-whiz-light">
                    <strong>UPI/Payment Frauds:</strong> Scammers requesting money transfers or OTPs.
                    Never share OTPs or click on payment links from unknown sources.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-whiz-light">
                    <strong>Job Scams:</strong> Fake job offers requesting upfront fees or personal information.
                    Legitimate employers never ask for payment during hiring.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-whiz-light">
                    <strong>Social Media Impersonation:</strong> Fake profiles pretending to be friends or officials.
                    Verify through alternate channels before responding to requests.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Misinformation Tab */}
          <TabsContent value="misinformation" className="space-y-4 sm:space-y-6">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-whiz-light text-base sm:text-lg md:text-xl">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-whiz-primary" />
                  How to Identify Misinformation
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Key indicators of fake news and misleading content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Check the Source</h4>
                    <p className="text-sm text-muted-foreground">
                      Is the website known and credible? Look for "About Us" sections.
                      Be wary of sites with unusual domain names or poor design.
                    </p>
                  </div>

                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Verify with Multiple Sources</h4>
                    <p className="text-sm text-muted-foreground">
                      Cross-check the information with reputable news outlets.
                      If only one source reports it, be skeptical.
                    </p>
                  </div>

                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Check the Date</h4>
                    <p className="text-sm text-muted-foreground">
                      Old news stories are often recirculated as current events.
                      Always check publication dates.
                    </p>
                  </div>

                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Look for Evidence</h4>
                    <p className="text-sm text-muted-foreground">
                      Credible stories cite sources, include quotes from experts,
                      and provide verifiable facts.
                    </p>
                  </div>

                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Check Your Biases</h4>
                    <p className="text-sm text-muted-foreground">
                      We're more likely to believe information that confirms our existing beliefs.
                      Question stories that seem too good (or bad) to be true.
                    </p>
                  </div>

                  <div className="border-l-4 border-whiz-primary pl-4 py-2">
                    <h4 className="font-semibold mb-2 text-whiz-light">Reverse Image Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Use Google Images or TinEye to check if photos have been used in different contexts
                      or are from older events.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-light text-base sm:text-lg md:text-xl">Trusted Fact-Checking Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">Government</Badge>
                    <h4 className="font-semibold mb-1 text-whiz-light">PIB Fact Check</h4>
                    <p className="text-sm text-muted-foreground">Official government fact-checking unit</p>
                  </div>
                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">Independent</Badge>
                    <h4 className="font-semibold mb-1 text-whiz-light">Alt News</h4>
                    <p className="text-sm text-muted-foreground">Independent fact-checking platform</p>
                  </div>
                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">Independent</Badge>
                    <h4 className="font-semibold mb-1 text-whiz-light">Boom Live</h4>
                    <p className="text-sm text-muted-foreground">Multimedia fact-checking service</p>
                  </div>
                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <Badge className="mb-2 bg-green-500/20 text-green-400 border-green-500/30">News</Badge>
                    <h4 className="font-semibold mb-1 text-whiz-light">India Today Fact Check</h4>
                    <p className="text-sm text-muted-foreground">News organization's verification unit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Information Tab */}
          <TabsContent value="legal" className="space-y-4 sm:space-y-6">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-light text-base sm:text-lg md:text-xl">Indian IT Act & Cyber Laws</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Key legal provisions related to cyber crimes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-semibold text-whiz-light">Section 66D - Cheating by Personation</h4>
                      <Badge className="bg-whiz-primary/20 text-whiz-primary border-whiz-primary/30">IT Act 2000</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Punishment for cheating by personation using computer resources.
                      Imprisonment up to 3 years and fine up to ₹1 lakh.
                    </p>
                  </div>

                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-semibold text-whiz-light">Section 67 - Publishing Obscene Information</h4>
                      <Badge className="bg-whiz-primary/20 text-whiz-primary border-whiz-primary/30">IT Act 2000</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Publishing or transmitting obscene material in electronic form.
                      Imprisonment up to 5 years and fine up to ₹10 lakh.
                    </p>
                  </div>

                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-semibold text-whiz-light">Section 66C - Identity Theft</h4>
                      <Badge className="bg-whiz-primary/20 text-whiz-primary border-whiz-primary/30">IT Act 2000</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fraudulently using another person's electronic signature or password.
                      Imprisonment up to 3 years and fine up to ₹1 lakh.
                    </p>
                  </div>

                  <div className="p-4 border border-whiz-primary/20 bg-whiz-primary/10 rounded-lg hover:border-whiz-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-semibold text-whiz-light">Section 66E - Privacy Violation</h4>
                      <Badge className="bg-whiz-primary/20 text-whiz-primary border-whiz-primary/30">IT Act 2000</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Capturing, publishing or transmitting images of a person's private areas without consent.
                      Imprisonment up to 3 years or fine up to ₹2 lakh.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full md:w-auto border-whiz-primary/30 hover:bg-whiz-primary/10 hover:text-whiz-primary">
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete IT Act Guide (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-light text-base sm:text-lg md:text-xl">Your Rights as a Victim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-whiz-light">Right to File a Complaint</h4>
                    <p className="text-sm text-muted-foreground">
                      You can file a complaint at your nearest cyber crime police station or online through this portal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-whiz-light">Right to Privacy</h4>
                    <p className="text-sm text-muted-foreground">
                      Your complaint can be filed anonymously to protect your identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-whiz-light">Right to Information</h4>
                    <p className="text-sm text-muted-foreground">
                      You have the right to track your complaint status and receive updates on the investigation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-whiz-light">Right to Legal Assistance</h4>
                    <p className="text-sm text-muted-foreground">
                      Free legal aid is available for victims who cannot afford a lawyer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Awareness;
