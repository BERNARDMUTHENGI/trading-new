import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, TrendingUp, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/markets", label: "Markets" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Brivex</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/trade"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
            >
              Trade
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold tabular-nums">
                ${user.balance.toLocaleString()}
              </div>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
              <Button asChild className="bg-gradient-to-r from-primary to-[var(--primary-glow)] text-primary-foreground hover:opacity-90">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/trade" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">Trade</Link>
                <div className="mt-2 rounded-lg bg-card px-3 py-2 text-sm">Balance: <b>${user.balance.toLocaleString()}</b></div>
                <Button variant="outline" onClick={() => { logout(); setOpen(false); navigate({ to: "/" }); }}>Logout</Button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" asChild className="flex-1"><Link to="/login" onClick={() => setOpen(false)}>Login</Link></Button>
                <Button asChild className="flex-1"><Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link></Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}