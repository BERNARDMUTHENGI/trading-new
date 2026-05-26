import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Brivex" }, { name: "description", content: "Log in to your Brivex trading account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    navigate({ to: "/trade" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block" style={{ background: "var(--gradient-primary)" }}>
        <div className="absolute inset-0 grid place-items-center p-12 text-primary-foreground">
          <div className="max-w-md">
            <TrendingUp className="h-10 w-10" />
            <h2 className="mt-6 text-4xl font-bold">Welcome back.</h2>
            <p className="mt-3 text-primary-foreground/80">Pick up where you left off. Markets never sleep — and neither do we.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
          <h1 className="mt-6 text-3xl font-bold">Log in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Any email and password will work — this is a demo.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brivex.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-[var(--primary-glow)] text-primary-foreground" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}