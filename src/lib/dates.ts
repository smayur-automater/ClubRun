export function getNextRunDate(): Date {
  const now = new Date();
  // Next Tuesday 5:30am
  const next = new Date(now);
  const day = now.getDay();
  const daysUntilTuesday = (2 - day + 7) % 7 || 7;
  next.setDate(now.getDate() + daysUntilTuesday);
  next.setHours(5, 30, 0, 0);
  return next;
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 6) {
    return date.toLocaleDateString("en-AU", { weekday: "long" });
  }
  return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}
