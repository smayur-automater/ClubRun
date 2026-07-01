"use client";
import Link from "next/link";
import { MapPin, Check } from "lucide-react";
import type { Run, RsvpStatus } from "@/lib/types";
import { formatRunTime } from "@/lib/format";

interface Props {
  run: Run;
  clubName?: string;
  rsvp: RsvpStatus | null;
  /** Optimistic toggle — never blocks on a spinner (docs/USER_FLOWS.md). */
  onRsvp: (status: RsvpStatus | null) => void;
}

export function RunCard({ run, clubName, rsvp, onRsvp }: Props) {
  const going = rsvp === "going";
  return (
    <div className="card flex flex-col gap-3">
      <Link href={`/runs/${run.id}`} className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[0.8125rem] font-bold" style={{ color: "var(--volt)" }}>
            {formatRunTime(run.startsAt)}
          </span>
          <span className="tag">{run.distanceKm} km</span>
        </div>
        <h3 className="text-lg font-extrabold tracking-tight leading-snug">{run.title}</h3>
        <div className="flex items-start gap-1.5 text-sm leading-snug" style={{ color: "var(--muted)" }}>
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span>
            {run.meetPoint}
            {clubName && <> · {clubName}</>}
          </span>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <div className="flex -space-x-2.5">
            {run.goingPreview.slice(0, 4).map((initials) => (
              <span key={initials} className="avatar">{initials}</span>
            ))}
          </div>
          <span className="ml-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
            {run.goingCount} going
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRsvp(going ? null : "going")}
          aria-pressed={going}
          className={going ? "btn-volt" : "btn-ghost"}
          style={{ minHeight: 44, padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
        >
          {going ? (<><Check size={15} strokeWidth={3} /> Going</>) : "I'm in"}
        </button>
      </div>
    </div>
  );
}
