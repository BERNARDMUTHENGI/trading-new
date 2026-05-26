import { useEffect, useRef, useState } from "react";

export type Trade = {
  id: string;
  direction: "up" | "down";
  entry: number;
  entryTime: number;
  expiryTime: number;
  stake: number;
  payout: number;
  status: "open" | "won" | "lost";
  exit?: number;
};

export type Candle = { t: number; o: number; h: number; l: number; c: number };

type Props = {
  symbol: string;
  trades: Trade[];
  onPrice: (p: number) => void;
  onResolveTrade: (id: string, exit: number) => void;
};

export function TradingChart({ symbol, trades, onPrice, onResolveTrade }: Props) {
  const [candles, setCandles] = useState<Candle[]>(() => seedCandles(symbol));
  const [price, setPrice] = useState<number>(() => candles[candles.length - 1]?.c ?? 100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 400 });

  // reseed when symbol changes
  useEffect(() => {
    const seeded = seedCandles(symbol);
    setCandles(seeded);
    setPrice(seeded[seeded.length - 1].c);
  }, [symbol]);

  // observe container size
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const r = e.contentRect;
        setSize({ w: r.width, h: r.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // tick price ~500ms; close candle every 5s
  useEffect(() => {
    const tickId = setInterval(() => {
      setPrice((prev) => {
        const vol = volatilityFor(symbol);
        const next = Math.max(0.0001, prev + (Math.random() - 0.5) * vol);
        onPrice(next);
        setCandles((cs) => {
          const last = cs[cs.length - 1];
          if (!last) return cs;
          const now = Date.now();
          if (now - last.t > 5000) {
            const newC: Candle = { t: now, o: last.c, h: Math.max(last.c, next), l: Math.min(last.c, next), c: next };
            return [...cs.slice(-119), newC];
          }
          const updated = { ...last, h: Math.max(last.h, next), l: Math.min(last.l, next), c: next };
          return [...cs.slice(0, -1), updated];
        });
        return next;
      });
    }, 500);
    return () => clearInterval(tickId);
  }, [symbol, onPrice]);

  // resolve expired trades
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      trades.forEach((t) => {
        if (t.status === "open" && now >= t.expiryTime) onResolveTrade(t.id, price);
      });
    }, 250);
    return () => clearInterval(id);
  }, [trades, price, onResolveTrade]);

  const { w, h } = size;
  const pad = { l: 0, r: 64, t: 16, b: 24 };
  const cw = Math.max(0, w - pad.l - pad.r);
  const ch = Math.max(0, h - pad.t - pad.b);

  const allHigh = Math.max(...candles.map((c) => c.h), price);
  const allLow = Math.min(...candles.map((c) => c.l), price);
  const range = (allHigh - allLow) * 1.1 || 1;
  const mid = (allHigh + allLow) / 2;
  const yMax = mid + range / 2;
  const yMin = mid - range / 2;
  const y = (v: number) => pad.t + ((yMax - v) / (yMax - yMin)) * ch;

  const candleW = cw / Math.max(candles.length, 1);
  const bodyW = Math.max(2, candleW * 0.6);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg width={w} height={h} className="block">
        {/* grid */}
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = pad.t + (ch / 4) * i;
          const val = yMax - ((yMax - yMin) / 4) * i;
          return (
            <g key={i}>
              <line x1={pad.l} x2={pad.l + cw} y1={yy} y2={yy} stroke="var(--border)" strokeDasharray="2 4" />
              <text x={pad.l + cw + 6} y={yy + 4} fontSize="10" fill="var(--muted-foreground)" className="tabular-nums">{fmt(val)}</text>
            </g>
          );
        })}

        {/* candles */}
        {candles.map((c, i) => {
          const x = pad.l + i * candleW + candleW / 2;
          const up = c.c >= c.o;
          const color = up ? "var(--success)" : "var(--danger)";
          return (
            <g key={c.t}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} />
              <rect x={x - bodyW / 2} y={y(Math.max(c.o, c.c))} width={bodyW} height={Math.max(1, Math.abs(y(c.o) - y(c.c)))} fill={color} rx={1} />
            </g>
          );
        })}

        {/* live price line */}
        <line x1={pad.l} x2={pad.l + cw} y1={y(price)} y2={y(price)} stroke="var(--primary)" strokeDasharray="4 4" strokeWidth={1} />
        <rect x={pad.l + cw} y={y(price) - 10} width={60} height={20} fill="var(--primary)" rx={3} />
        <text x={pad.l + cw + 30} y={y(price) + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--primary-foreground)" className="tabular-nums">{fmt(price)}</text>

        {/* trade markers */}
        {trades.filter((t) => t.status === "open").map((t) => {
          const yy = y(t.entry);
          const color = t.direction === "up" ? "var(--success)" : "var(--danger)";
          return (
            <g key={t.id}>
              <line x1={pad.l} x2={pad.l + cw} y1={yy} y2={yy} stroke={color} strokeWidth={1} opacity={0.5} />
              <circle cx={pad.l + cw - 2} cy={yy} r={5} fill={color} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function fmt(v: number) {
  if (v >= 1000) return v.toFixed(2);
  if (v >= 10) return v.toFixed(3);
  return v.toFixed(4);
}

function volatilityFor(sym: string) {
  if (sym.startsWith("Vol")) return 0.8;
  if (sym.includes("BTC")) return 50;
  if (sym.includes("ETH")) return 8;
  if (sym.includes("XAU")) return 0.6;
  if (sym.includes("USOIL")) return 0.1;
  return 0.0008;
}

function seedCandles(symbol: string): Candle[] {
  const base = symbol.includes("BTC") ? 67400 : symbol.includes("ETH") ? 3520 : symbol.includes("XAU") ? 2034 : symbol.startsWith("Vol 100") ? 1880 : symbol.startsWith("Vol") ? 412 : symbol.includes("USOIL") ? 78.3 : symbol.includes("JPY") ? 151.2 : symbol === "GBP/USD" ? 1.2654 : 1.0847;
  const vol = volatilityFor(symbol);
  const out: Candle[] = [];
  let v = base;
  const now = Date.now();
  for (let i = 119; i >= 0; i--) {
    const o = v;
    const c = o + (Math.random() - 0.5) * vol * 6;
    const h = Math.max(o, c) + Math.random() * vol * 2;
    const l = Math.min(o, c) - Math.random() * vol * 2;
    out.push({ t: now - i * 5000, o, h, l, c });
    v = c;
  }
  return out;
}