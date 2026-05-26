import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Shield, Users, Globe, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Brivex" }, { name: "description", content: "Brivex is the next-generation binary trading platform built for serious traders." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Trading, reimagined.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We believe trading should be transparent, beautiful, and lightning-fast.
            Brivex was built from the ground up by traders, for traders — combining a modern interface
            with the power and reliability of institutional infrastructure.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Users, label: "1.2M+", text: "Active traders" },
            { icon: Globe, label: "180+", text: "Countries" },
            { icon: Award, label: "#1", text: "In execution speed" },
            { icon: Shield, label: "100%", text: "Funds segregated" },
          ].map((s) => (
            <div key={s.text} className="rounded-2xl border border-border bg-card p-6 text-center">
              <s.icon className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-3 text-3xl font-bold">{s.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Our mission</h2>
          <p className="mt-4 text-muted-foreground">
            To make global markets accessible to everyone — without the bloat. We obsess over latency,
            interface clarity, and trust. Whether you're trading your first contract or your ten thousandth,
            Brivex is built to feel native to your workflow.
          </p>
          <h2 className="mt-12 text-3xl font-bold tracking-tight">Risk disclaimer</h2>
          <p className="mt-4 text-muted-foreground">
            This is a demo environment. All trades are simulated. Trading binary options involves substantial risk
            and may not be suitable for all investors. Past performance is not indicative of future results.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}