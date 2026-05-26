import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Brivex</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The next-generation binary trading platform.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/markets" className="hover:text-foreground">Markets</Link></li>
            <li><Link to="/trade" className="hover:text-foreground">Trading Room</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Disclaimer</h4>
          <p className="mt-3 text-xs text-muted-foreground">Simulated environment. Not financial advice. Trading involves risk.</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© 2026 Brivex. All rights reserved.</div>
    </footer>
  );
}