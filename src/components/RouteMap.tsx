"use client";
import { MapPin } from "lucide-react";

/**
 * Custom SVG cartographic surface — no tile provider (docs/DESIGN_SYSTEM.md §4).
 * Geometry is seeded by `seed` (the run id) so every route reads distinct.
 * Always renders on the Night Stage; the route draw uses pathLength=1000 so
 * the CSS dash animation needs no runtime measurement.
 */

type Variant = "hero" | "texture";

interface Props {
  seed: string;
  distanceKm?: number;
  elevGainM?: number;
  hasRoute?: boolean;
  /** "texture" renders the cartographic base only (club cover bands) */
  variant?: Variant;
  className?: string;
}

/** mulberry32 over a string hash — tiny deterministic PRNG */
function rng(seed: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h = (h ^= h >>> 16) >>> 0;
    return h / 4294967296;
  };
}

const W = 340;
const H = 212;

/** Seeded waypoints smoothed into a single bezier path, left → right. */
function buildRoute(rand: () => number): { d: string; start: [number, number]; end: [number, number] } {
  const n = 6;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = 36 + (i / (n - 1)) * (W - 84) + (rand() - 0.5) * 26;
    const y = 46 + rand() * (H - 96);
    pts.push([x, y]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < n; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q ${(px + x) / 2 + (rand() - 0.5) * 30} ${(py + y) / 2 + (rand() - 0.5) * 30}, ${x} ${y}`;
  }
  return { d, start: pts[0], end: pts[n - 1] };
}

export function RouteMap({ seed, distanceKm, elevGainM, hasRoute = true, variant = "hero", className }: Props) {
  const rand = rng(seed);
  const route = buildRoute(rand);
  const contours = Array.from({ length: 3 }, () => ({
    cx: rand() * W,
    cy: rand() * H,
    rx: 40 + rand() * 60,
    ry: 26 + rand() * 40,
  }));
  const gridLines: React.ReactNode[] = [];
  for (let x = 24; x < W; x += 24) gridLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />);
  for (let y = 24; y < H; y += 24) gridLines.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />);

  const showRoute = variant === "hero" && hasRoute;

  return (
    <div
      className={`stage overflow-hidden ${variant === "hero" ? "relative rounded-2xl border" : ""} ${className ?? ""}`}
      style={{ background: "#0a0b0e", borderColor: variant === "hero" ? "#272b34" : undefined }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full block" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <filter id={`blur-${seed}`}>
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <g stroke="var(--border)" strokeWidth="1" opacity="0.4">{gridLines}</g>
        <g fill="var(--border)" opacity="0.15" filter={`url(#blur-${seed})`}>
          {contours.map((c, i) => (
            <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} />
          ))}
        </g>
        {showRoute && (
          <>
            <path
              className="route-path"
              d={route.d}
              pathLength={1000}
              strokeDasharray={1000}
              style={{ "--route-len": 1000 } as React.CSSProperties}
            />
            {/* Start: circle with bg halo */}
            <circle cx={route.start[0]} cy={route.start[1]} r={6.5} fill="var(--bg)" style={{ fill: "#0a0b0e" }} />
            <circle cx={route.start[0]} cy={route.start[1]} r={4} fill="var(--course)" />
            {/* Finish: signal diamond — shape difference from start, not just color */}
            <rect
              className="route-finish"
              x={route.end[0] - 6}
              y={route.end[1] - 6}
              width={12}
              height={12}
              fill="var(--signal)"
              transform={`rotate(45 ${route.end[0]} ${route.end[1]})`}
            />
          </>
        )}
      </svg>

      {showRoute && (
        <>
          {/* Meet-point badge anchored near the start */}
          <span
            className="absolute flex items-center justify-center w-8 h-8 rounded-full"
            style={{
              left: `${(route.start[0] / W) * 100}%`,
              top: `${(route.start[1] / H) * 100}%`,
              transform: "translate(-50%, -130%)",
              background: "var(--surface)",
              border: "1.5px solid var(--course)",
              color: "var(--course)",
            }}
            aria-hidden
          >
            <MapPin size={17} strokeWidth={2} />
          </span>
          {distanceKm !== undefined && (
            <span
              className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums"
              style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {distanceKm} km{elevGainM !== undefined && ` · +${elevGainM} m`}
            </span>
          )}
        </>
      )}

      {variant === "hero" && !hasRoute && (
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Route posted closer to run day
        </span>
      )}
    </div>
  );
}
