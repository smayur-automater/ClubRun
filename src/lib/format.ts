/** Pure formatting helpers — unit-testable, no framework imports. */

/** 330 -> "5:30" (pace in min:sec per km, without unit suffix) */
export function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Pace range like "5:30–6:30" */
export function formatPaceRange(minSec: number, maxSec: number): string {
  return `${formatPace(minSec)}–${formatPace(maxSec)}`;
}

/** 4812 -> "1:20:12"; 492 -> "8:12" */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? m.toString().padStart(2, "0") : m.toString();
  return `${h > 0 ? `${h}:` : ""}${mm}:${sec.toString().padStart(2, "0")}`;
}

/** meters -> "12.4" (km, one decimal) */
export function formatKm(meters: number): string {
  return (meters / 1000).toFixed(1);
}

/**
 * ISO datetime -> "Today · 6:00 PM" / "Tomorrow · 5:30 AM" / "Thu · 6:00 PM".
 * Falls back to "12 Jul" beyond a week out.
 */
export function formatRunTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }).toUpperCase();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000);
  if (dayDiff === 0) return `Today · ${time}`;
  if (dayDiff === 1) return `Tomorrow · ${time}`;
  if (dayDiff > 1 && dayDiff < 7) {
    return `${d.toLocaleDateString("en-AU", { weekday: "short" })} · ${time}`;
  }
  return `${d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })} · ${time}`;
}

/** ISO date -> "12 Jun" */
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
