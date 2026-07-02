"use client";
import { useEffect, useRef, useState } from "react";
import type { WeekDay } from "@/lib/types";
import { formatKm } from "@/lib/format";

/**
 * Weekly-km bar chart (docs/DESIGN_SYSTEM.md §4). Single series → no legend;
 * bars ≤24px with 4px rounded data-ends and square baselines; values live in
 * text tokens, never the series color. Grows on scroll-into-view (once), with
 * a 40ms stagger. Tap a bar for the exact figure — hit area padded to 44px.
 */
export function BarChart({ days }: { days: WeekDay[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxKm = Math.max(...days.map((d) => d.km), 1);
  const maxIdx = days.reduce((best, d, i) => (d.km > days[best].km ? i : best), 0);
  const PLOT_H = 96;

  return (
    <div ref={ref}>
      <div className="flex items-end justify-between" style={{ height: PLOT_H + 26 }}>
        {days.map((d, i) => {
          const h = d.km > 0 ? Math.max(10, (d.km / maxKm) * PLOT_H) : 6;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(isSelected ? null : i)}
              aria-label={`${d.label}: ${d.km} km`}
              className="relative flex flex-col items-center justify-end flex-1 h-full min-w-11"
            >
              {/* Selective direct label: the week's max only; tap covers the rest */}
              {(i === maxIdx && d.km > 0 && !isSelected) && (
                <span className="text-[0.625rem] font-bold mb-1 tabular-nums" style={{ color: "var(--muted)" }}>
                  {formatKm(d.km * 1000)}
                </span>
              )}
              {isSelected && (
                <span
                  className="absolute -top-1 px-2 py-0.5 rounded-md text-[0.6875rem] font-bold tabular-nums z-10"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {d.km} km
                </span>
              )}
              <span
                className={visible ? "bar-grow" : ""}
                style={{
                  width: 22,
                  height: visible ? h : 6,
                  borderRadius: "4px 4px 0 0",
                  background: d.km > 0 ? "var(--pace)" : "var(--surface-2)",
                  outline: d.isToday ? "1.5px solid var(--course)" : undefined,
                  outlineOffset: d.isToday ? 1 : undefined,
                  "--bar-delay": `${i * 40}ms`,
                } as React.CSSProperties}
              />
              <span
                className="mt-2 text-[0.625rem] font-extrabold"
                style={{ color: d.isToday ? "var(--text)" : "var(--muted)", letterSpacing: "0.04em" }}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
