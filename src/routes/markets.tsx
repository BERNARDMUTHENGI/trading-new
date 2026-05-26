import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MiniChart } from "@/components/MiniChart";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/markets")({
  head: () => ({ meta: [{ title: "Markets — Brivex" }, { name: "description", content: "Explore 100+ tradable markets including forex, crypto, commodities, and synthetic indices." }] }),
  component: MarketsPage,
});

const ASSETS = [
  { sym: "EUR/USD", name: "Euro / US Dollar", price: 1.0847, change: 0.42, cat: "Forex", up: true },
  { sym: "GBP/USD", name: "British Pound / USD", price: 1.2654, change: -0.18, cat: "Forex", up: false },
  { sym: "USD/JPY", name: "US Dollar / Yen", price: 151.23, change: 0.31, cat: "Forex", up: true },
  { sym: "BTC/USD", name: "Bitcoin", price: 67432, change: 2.14, cat: "Crypto", up: true },
  { sym: "ETH/USD", name: "Ethereum", price: 3521, change: 1.42, cat: "Crypto", up: true },
  { sym: "SOL/USD", name: "Solana", price: 178.4, change: -0.92, cat: "Crypto", up: false },
  { sym: "XAU/USD", name: "Gold", price: 2034.5, change: 0.55, cat: "Metals", up: true },
  { sym: "USOIL", name: "Crude Oil", price: 78.32, change: -0.74, cat: "Commodities", up: false },
  { sym: "Vol 75", name: "Volatility 75 Index", price: 412.88, change: 1.05, cat: "Synthetics", up: true },
  { sym: "Vol 100", name: "Volatility 100 Index", price: 1882.4, change: -0.42, cat: "Synthetics", up: false },
];

function MarketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Markets</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">100+ instruments across forex, crypto, commodities, and synthetic indices — trade them all from one place.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSETS.map((a) => (
            <Link to="/trade" key={a.sym} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{a.cat}</div>
                  <div className="mt-1 text-lg font-bold">{a.sym}</div>
                  <div className="text-xs text-muted-foreground">{a.name}</div>
                </div>
                <div className={`rounded-lg px-2 py-1 text-xs font-semibold ${a.up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                  {a.change >= 0 ? "+" : ""}{a.change}%
                </div>
              </div>
              <div className="mt-4 h-20"><MiniChart positive={a.up} /></div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xl font-bold tabular-nums">{a.price < 10 ? a.price.toFixed(4) : a.price.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">Trade <ArrowRight className="h-4 w-4" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}