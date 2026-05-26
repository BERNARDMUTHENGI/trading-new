import { useEffect, useState } from "react";

const SEED = [
  { sym: "EUR/USD", price: 1.0847 },
  { sym: "GBP/USD", price: 1.2654 },
  { sym: "BTC/USD", price: 67432 },
  { sym: "ETH/USD", price: 3521 },
  { sym: "XAU/USD", price: 2034.5 },
  { sym: "USD/JPY", price: 151.23 },
  { sym: "Vol 75", price: 412.88 },
  { sym: "Vol 100", price: 1882.4 },
  { sym: "SOL/USD", price: 178.4 },
  { sym: "USOIL", price: 78.32 },
];

export function LiveTickerStrip() {
  const [data, setData] = useState(SEED.map((s) => ({ ...s, change: 0 })));

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) =>
        prev.map((d) => {
          const delta = (Math.random() - 0.5) * d.price * 0.002;
          const next = d.price + delta;
          return { ...d, price: next, change: ((next - d.price) / d.price) * 100 + d.change * 0.6 };
        })
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden border-y border-border bg-card/40">
      <div className="flex animate-[scroll_40s_linear_infinite] gap-8 whitespace-nowrap py-2.5 text-xs">
        {[...data, ...data].map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{d.sym}</span>
            <span className="tabular-nums text-muted-foreground">{d.price < 10 ? d.price.toFixed(4) : d.price.toFixed(2)}</span>
            <span className={`tabular-nums ${d.change >= 0 ? "text-success" : "text-danger"}`}>
              {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}