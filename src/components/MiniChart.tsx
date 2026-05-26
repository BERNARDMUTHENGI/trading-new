import { useEffect, useState } from "react";

export function MiniChart({ positive = true }: { positive?: boolean }) {
  const [points, setPoints] = useState<number[]>(() => {
    const arr: number[] = [];
    let v = 50;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - (positive ? 0.45 : 0.55)) * 4;
      arr.push(v);
    }
    return arr;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1] ?? 50;
        const next = last + (Math.random() - (positive ? 0.45 : 0.55)) * 4;
        return [...prev.slice(1), next];
      });
    }, 1000);
    return () => clearInterval(id);
  }, [positive]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 400;
  const h = 160;
  const step = w / (points.length - 1);
  const norm = (v: number) => h - ((v - min) / range) * h;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${norm(p)}`).join(" ");
  const area = `${d} L ${w},${h} L 0,${h} Z`;
  const color = positive ? "var(--success)" : "var(--danger)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${positive ? "u" : "d"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${positive ? "u" : "d"})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}