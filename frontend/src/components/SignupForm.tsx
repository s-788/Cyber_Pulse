import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

interface SignupFormProps {
    onSignupSuccess?: () => void;
}

const SignupForm = ({ onSignupSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const roleToSend = formData.role === "citizen" ? "user" : formData.role;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: roleToSend,
        }),
      });

      if (res.ok) {
        if (onSignupSuccess) {
            onSignupSuccess();
        }
        // Redirect to login page after successful registration
        window.location.href = "/login";
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
      <Card className="w-full max-w-md bg-whiz-dark/80 border-whiz-secondary/30 text-whiz-light">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-whiz-primary/10 rounded-full flex items-center justify-center border-2 border-whiz-primary/50 glowing-border">
              <Shield className="h-8 w-8 text-whiz-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-whiz-light">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join CyberPulse to report crimes and verify information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-whiz-light">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-whiz-light">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-whiz-light">Account Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="ngo">NGO Volunteer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>

            <Button type="submit" className="w-full btn-cyber bg-whiz-primary text-whiz-dark" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-whiz-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
  );
};

export default SignupForm;
