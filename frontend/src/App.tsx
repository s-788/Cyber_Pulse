import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ReportCrime = lazy(() => import("./pages/ReportCrime"));
const CheckMisinformation = lazy(() => import("./pages/CheckMisinformation"));
const Awareness = lazy(() => import("./pages/Awareness"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashBoard"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const CyberSafetyGuide = lazy(() => import("./pages/CyberSafetyGuide"));
const LegalInformation = lazy(() => import("./pages/LegalInformation"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ChatBot = lazy(() => import("./components/ChatBot"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whiz-primary"></div>
            </div>
          }>
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/report-crime" element={<ReportCrime />} />
                <Route path="/check-misinformation" element={<CheckMisinformation />} />
                <Route path="/awareness" element={<Awareness />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/cyber-safety-guide" element={<CyberSafetyGuide />} />
                <Route path="/legal-information" element={<LegalInformation />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ChatBot />
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
