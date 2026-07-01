import Link from "next/link";
import { MapPin, Users, CalendarClock } from "lucide-react";
import type { Club } from "@/lib/types";
import { VIBE_LABELS } from "@/lib/types";
import { formatPaceRange } from "@/lib/format";

/** Club card carries enough to decide without tapping (docs/USER_FLOWS.md flow 3). */
export function ClubCard({ club }: { club: Club }) {
  return (
    <Link href={`/clubs/${club.id}`} className="card flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="tag">{VIBE_LABELS[club.vibe]}</span>
        <span className="text-xs font-bold" style={{ color: "var(--volt)" }}>
          {formatPaceRange(club.paceMinSec, club.paceMaxSec)} /km
        </span>
      </div>
      <h3 className="text-lg font-extrabold tracking-tight leading-snug">{club.name}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{club.tagline}</p>
      <div className="flex items-center gap-4 text-xs font-semibold pt-0.5" style={{ color: "var(--muted)" }}>
        <span className="inline-flex items-center gap-1"><MapPin size={13} /> {club.area}</span>
        <span className="inline-flex items-center gap-1"><Users size={13} /> {club.memberCount}</span>
        <span className="inline-flex items-center gap-1"><CalendarClock size={13} /> {club.schedule}</span>
      </div>
    </Link>
  );
}
