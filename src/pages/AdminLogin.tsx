import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  // If already logged in, redirect to admin
  useEffect(() => {
    if (!authLoading && session) {
      navigate("/admin", { replace: true });
    }
  }, [session, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        let description = error.message;
        if (error.message.includes("Invalid login credentials")) {
          description = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          description = "Your email has not been confirmed. Please contact the administrator.";
        } else if (error.message.includes("User not found")) {
          description = "No account found with this email address.";
        }
        toast({ title: "Login failed", description, variant: "destructive" });
      } else {
        navigate("/admin");
      }
    } catch (err: any) {
      toast({
        title: "Network error",
        description: "Could not connect to the server. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-8">
        <h1 className="font-heading text-2xl text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your admin credentials to access the CMS.
        </p>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
