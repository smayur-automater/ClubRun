"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, CalendarClock, Check, Megaphone } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { RunCard } from "@/components/RunCard";
import * as data from "@/lib/data";
import type { Announcement, Club, RsvpStatus, Run } from "@/lib/types";
import { VIBE_LABELS } from "@/lib/types";
import { formatPaceRange, formatShortDate } from "@/lib/format";

export default function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [club, setClub] = useState<Club | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [joined, setJoined] = useState(false);
  const [rsvps, setRsvps] = useState<Map<string, RsvpStatus>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, r, a, j] = await Promise.all([
        data.getClub(id),
        data.getUpcomingRuns(id),
        data.getAnnouncements(id),
        data.isJoined(id),
      ]);
      setClub(c ?? null);
      setRuns(r);
      setAnnouncements(a);
      setJoined(j);
      const entries = await Promise.all(r.map(async (run) => [run.id, await data.getRsvp(run.id)] as const));
      setRsvps(new Map(entries.filter(([, v]) => v !== null) as [string, RsvpStatus][]));
      setLoaded(true);
    })();
  }, [id]);

  const toggleJoin = () => {
    setJoined((j) => {
      void (j ? data.leaveClub(id) : data.joinClub(id));
      return !j;
    });
  };

  const handleRsvp = (runId: string) => (status: RsvpStatus | null) => {
    setRsvps((prev) => {
      const next = new Map(prev);
      if (status === null) next.delete(runId);
      else next.set(runId, status);
      return next;
    });
    setRuns((prev) =>
      prev.map((r) => (r.id === runId ? { ...r, goingCount: r.goingCount + (status === "going" ? 1 : -1) } : r)),
    );
    void data.setRsvp(runId, status);
  };

  if (!loaded) {
    return (
      <div className="page px-4 pt-6 flex flex-col gap-4">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-36 w-full" />
        <TabBar />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="page px-4 pt-6">
        <p className="font-extrabold">Club not found.</p>
        <Link href="/explore" className="btn-ghost mt-4">Back to Explore</Link>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="px-4 pt-5">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold min-h-11" style={{ color: "var(--muted)" }}>
          <ArrowLeft size={16} /> Explore
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <span className="tag">{VIBE_LABELS[club.vibe]}</span>
            <h1 className="text-[1.7rem] font-black tracking-tight leading-tight mt-2">{club.name}</h1>
            <p className="mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>{club.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold mt-3" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> {club.area}</span>
          <span className="inline-flex items-center gap-1"><Users size={13} /> {club.memberCount} members</span>
          <span className="inline-flex items-center gap-1"><CalendarClock size={13} /> {club.schedule}</span>
        </div>

        <div className="card mt-4 flex items-center justify-between">
          <div>
            <p className="stat-value text-xl" style={{ color: "var(--volt)" }}>
              {formatPaceRange(club.paceMinSec, club.paceMaxSec)}
            </p>
            <p className="stat-label mt-1">min / km pace range</p>
          </div>
          <button type="button" onClick={toggleJoin} aria-pressed={joined} className={joined ? "btn-ghost" : "btn-volt"}>
            {joined ? (<><Check size={16} strokeWidth={3} /> Member</>) : "Join club"}
          </button>
        </div>
      </header>

      {announcements.length > 0 && (
        <section className="px-4 mt-6 flex flex-col gap-3">
          <h2 className="stat-label">From the organisers</h2>
          {announcements.map((a) => (
            <div key={a.id} className="card flex gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: "var(--surface-2)", color: "var(--volt)" }}>
                <Megaphone size={16} />
              </span>
              <div>
                <p className="text-sm leading-relaxed">{a.body}</p>
                <p className="text-xs font-semibold mt-1.5" style={{ color: "var(--muted)" }}>
                  {a.author} · {formatShortDate(a.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="px-4 mt-6 flex flex-col gap-3">
        <h2 className="stat-label">Upcoming runs</h2>
        {runs.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing scheduled yet — check back soon.</p>
        ) : (
          runs.map((run) => (
            <RunCard key={run.id} run={run} rsvp={rsvps.get(run.id) ?? null} onRsvp={handleRsvp(run.id)} />
          ))
        )}
      </section>

      <TabBar />
    </div>
  );
}
