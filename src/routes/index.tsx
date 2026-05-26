import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Shield, Zap, Globe, TrendingUp, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { LiveTickerStrip } from "@/components/LiveTickerStrip";
import { MiniChart } from "@/components/MiniChart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brivex — Trade Binary Options Online" },
      { name: "description", content: "The next-generation binary trading platform. Trade forex, crypto, and synthetic indices with real-time charts and instant payouts." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <LiveTickerStrip />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>New: Synthetic indices 24/7</span>
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Trade the markets,<br />
              <span className="bg-gradient-to-r from-primary to-[var(--primary-glow)] bg-clip-text text-transparent">your way.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Up or down. Higher or lower. Brivex makes binary options simple, fast, and beautifully transparent — across 100+ assets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-[var(--primary-glow)] text-primary-foreground hover:opacity-90" style={{ boxShadow: "var(--shadow-glow)" }}>
                <Link to="/signup">Open free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/trade">Try the platform</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <Stat value="1.2M+" label="Active traders" />
              <Stat value="100+" label="Assets" />
              <Stat value="<1s" label="Execution" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-50 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">EUR/USD</div>
                  <div className="mt-1 text-3xl font-bold tabular-nums">1.0847</div>
                </div>
                <div className="rounded-lg bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">+0.42%</div>
              </div>
              <div className="mt-4 h-48">
                <MiniChart positive />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="rounded-xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground transition hover:opacity-90">▲ Higher · 87%</button>
                <button className="rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-danger-foreground transition hover:opacity-90">▼ Lower · 87%</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for serious traders</h2>
            <p className="mt-4 text-lg text-muted-foreground">Powerful tools wrapped in a clean, fast interface.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<Zap className="h-5 w-5" />} title="Instant payouts" desc="Trades settle in seconds with zero hidden fees." />
            <Feature icon={<Shield className="h-5 w-5" />} title="Secure by design" desc="Bank-grade encryption and segregated funds." />
            <Feature icon={<Globe className="h-5 w-5" />} title="Global markets" desc="Forex, crypto, commodities, and synthetics." />
            <Feature icon={<BarChart3 className="h-5 w-5" />} title="Pro charting" desc="Real-time charts with full technical analysis." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-12 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <TrendingUp className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-4xl font-bold tracking-tight">Start trading in seconds</h2>
          <p className="mt-3 text-muted-foreground">Get $10,000 in demo funds. No deposit required.</p>
          <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-primary to-[var(--primary-glow)] text-primary-foreground hover:opacity-90">
            <Link to="/signup">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
