import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** Empty states always route forward — never a dead end (docs/USER_FLOWS.md). */
export function EmptyState({ icon: Icon, title, body, ctaLabel, ctaHref }: Props) {
  return (
    <div className="card flex flex-col items-center gap-3 py-10 text-center">
      <span
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ background: "var(--surface-2)", color: "var(--muted)" }}
      >
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <div>
        <p className="font-extrabold tracking-tight">{title}</p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{body}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-volt mt-2" style={{ minHeight: 44, padding: "0.5rem 1.5rem", fontSize: "0.875rem" }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
