import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Brivex" }, { name: "description", content: "Open your free Brivex demo trading account." }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, password, name);
    navigate({ to: "/trade" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 order-2 lg:order-1">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
          <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Get $10,000 in demo funds. Demo mode — no real deposit needed.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Trader" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brivex.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-[var(--primary-glow)] text-primary-foreground" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block order-1 lg:order-2" style={{ background: "var(--gradient-primary)" }}>
        <div className="absolute inset-0 grid place-items-center p-12 text-primary-foreground">
          <div className="max-w-md">
            <TrendingUp className="h-10 w-10" />
            <h2 className="mt-6 text-4xl font-bold">Trade smarter.</h2>
            <p className="mt-3 text-primary-foreground/80">Join over a million traders on the platform built for speed and clarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}