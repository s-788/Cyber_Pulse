import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Redirect based on role
        if (data.user.role === "ngo") navigate("/volunteer-dashboard");
        else if (data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
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
          <CardTitle className="text-2xl text-whiz-light">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to your CyberPulse account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-whiz-light">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light focus:ring-whiz-primary"
              />
            </div>
            <Button type="submit" className="w-full btn-cyber bg-whiz-primary text-whiz-dark" size="lg">Sign In</Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-whiz-primary font-medium hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
  );
};

export default LoginForm;
