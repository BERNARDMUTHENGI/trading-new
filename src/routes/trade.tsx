import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Clock, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TradingChart, type Trade } from "@/components/TradingChart";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/trade")({
  head: () => ({ meta: [{ title: "Trading Room — Brivex" }, { name: "description", content: "Live binary options trading room with real-time charts." }] }),
  component: TradeRoom,
});

const ASSETS = [
  { sym: "EUR/USD", cat: "Forex" },
  { sym: "GBP/USD", cat: "Forex" },
  { sym: "USD/JPY", cat: "Forex" },
  { sym: "BTC/USD", cat: "Crypto" },
  { sym: "ETH/USD", cat: "Crypto" },
  { sym: "XAU/USD", cat: "Metals" },
  { sym: "USOIL", cat: "Energy" },
  { sym: "Vol 75", cat: "Synthetics" },
  { sym: "Vol 100", cat: "Synthetics" },
];

const DURATIONS = [
  { label: "15s", seconds: 15 },
  { label: "30s", seconds: 30 },
  { label: "1m", seconds: 60 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
];

const PAYOUT_PCT = 0.87;

function TradeRoom() {
  const { user, updateBalance } = useAuth();
  const [symbol, setSymbol] = useState("EUR/USD");
  const [duration, setDuration] = useState(60);
  const [stake, setStake] = useState(10);
  const [price, setPrice] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState<{ msg: string; kind: "win" | "loss" | "info" } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const placeTrade = useCallback(
    (direction: "up" | "down") => {
      if (!user) return;
      if (stake <= 0 || stake > user.balance) {
        setToast({ msg: "Insufficient balance", kind: "info" });
        return;
      }
      updateBalance(-stake);
      const t: Trade = {
        id: Math.random().toString(36).slice(2),
        direction,
        entry: price,
        entryTime: Date.now(),
        expiryTime: Date.now() + duration * 1000,
        stake,
        payout: stake * (1 + PAYOUT_PCT),
        status: "open",
      };
      setTrades((prev) => [t, ...prev]);
    },
    [user, stake, price, duration, updateBalance]
  );

  const resolveTrade = useCallback(
    (id: string, exit: number) => {
      setTrades((prev) =>
        prev.map((t) => {
          if (t.id !== id || t.status !== "open") return t;
          const won = t.direction === "up" ? exit > t.entry : exit < t.entry;
          if (won) {
            updateBalance(t.payout);
            setToast({ msg: `Won +$${(t.payout - t.stake).toFixed(2)}`, kind: "win" });
          } else {
            setToast({ msg: `Lost −$${t.stake.toFixed(2)}`, kind: "loss" });
          }
          return { ...t, status: won ? "won" : "lost", exit };
        })
      );
    },
    [updateBalance]
  );

  const openTrades = useMemo(() => trades.filter((t) => t.status === "open"), [trades]);
  const history = useMemo(() => trades.filter((t) => t.status !== "open").slice(0, 20), [trades]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto grid max-w-[1600px] gap-4 px-3 py-4 lg:grid-cols-[260px_1fr_320px]">
        {/* Asset list */}
        <aside className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Markets</div>
          <div className="space-y-1">
            {ASSETS.map((a) => (
              <button
                key={a.sym}
                onClick={() => setSymbol(a.sym)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  symbol === a.sym ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                <span className="font-medium">{a.sym}</span>
                <span className={`text-xs ${symbol === a.sym ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{a.cat}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chart */}
        <main className="rounded-2xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">{symbol}</div>
              <div className="text-2xl font-bold tabular-nums">{price ? formatPrice(price) : "—"}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="font-medium">LIVE</span>
              </div>
              <div className="hidden items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-semibold text-success sm:flex">
                Payout {(PAYOUT_PCT * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="h-[440px] sm:h-[520px]">
            <TradingChart symbol={symbol} trades={trades} onPrice={setPrice} onResolveTrade={resolveTrade} />
          </div>
        </main>

        {/* Trade panel */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" /> Balance
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duration</div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {DURATIONS.map((d) => (
                <button
                  key={d.seconds}
                  onClick={() => setDuration(d.seconds)}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${duration === d.seconds ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stake (USD)</div>
            <div className="mt-2 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setStake((s) => Math.max(1, s - 5))}>−</Button>
              <Input type="number" value={stake} onChange={(e) => setStake(Math.max(0, +e.target.value))} className="text-center font-semibold tabular-nums" />
              <Button variant="outline" size="sm" onClick={() => setStake((s) => s + 5)}>+</Button>
            </div>
            <div className="mt-2 flex gap-1">
              {[10, 25, 50, 100].map((v) => (
                <button key={v} onClick={() => setStake(v)} className="flex-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium hover:bg-accent">${v}</button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Potential payout</span><span className="font-semibold tabular-nums">${(stake * (1 + PAYOUT_PCT)).toFixed(2)}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Profit</span><span className="font-semibold tabular-nums text-success">+${(stake * PAYOUT_PCT).toFixed(2)}</span></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => placeTrade("up")}
                className="group flex flex-col items-center gap-1 rounded-xl bg-success py-4 font-semibold text-success-foreground transition hover:opacity-90"
              >
                <ArrowUp className="h-5 w-5 transition group-hover:-translate-y-0.5" />
                Higher
              </button>
              <button
                onClick={() => placeTrade("down")}
                className="group flex flex-col items-center gap-1 rounded-xl bg-danger py-4 font-semibold text-danger-foreground transition hover:opacity-90"
              >
                <ArrowDown className="h-5 w-5 transition group-hover:translate-y-0.5" />
                Lower
              </button>
            </div>
          </div>

          {/* Open positions */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Open positions
            </div>
            {openTrades.length === 0 ? (
              <div className="mt-3 rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">No open trades</div>
            ) : (
              <div className="mt-3 space-y-2">
                {openTrades.map((t) => {
                  const remain = Math.max(0, t.expiryTime - now);
                  const total = t.expiryTime - t.entryTime;
                  const pct = 1 - remain / total;
                  const inMoney = t.direction === "up" ? price > t.entry : price < t.entry;
                  return (
                    <div key={t.id} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {t.direction === "up" ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : <TrendingDown className="h-3.5 w-3.5 text-danger" />}
                          ${t.stake.toFixed(2)}
                        </div>
                        <div className={`font-semibold tabular-nums ${inMoney ? "text-success" : "text-danger"}`}>
                          {inMoney ? "▲ in" : "▼ out"} · {(remain / 1000).toFixed(1)}s
                        </div>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary transition-all" style={{ width: `${pct * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* History */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</div>
            {history.length === 0 ? (
              <div className="mt-3 rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">No closed trades yet</div>
            ) : (
              <div className="mt-3 space-y-1.5">
                {history.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      {t.direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      <span className="tabular-nums text-muted-foreground">${t.stake.toFixed(2)}</span>
                    </div>
                    <span className={`font-semibold tabular-nums ${t.status === "won" ? "text-success" : "text-danger"}`}>
                      {t.status === "won" ? `+$${(t.payout - t.stake).toFixed(2)}` : `−$${t.stake.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg animate-in slide-in-from-bottom-4 ${
          toast.kind === "win" ? "border-success/40 bg-success/10 text-success" :
          toast.kind === "loss" ? "border-danger/40 bg-danger/10 text-danger" :
          "border-border bg-card text-foreground"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function formatPrice(v: number) {
  if (v >= 1000) return v.toFixed(2);
  if (v >= 10) return v.toFixed(3);
  return v.toFixed(4);
}