"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, CalendarClock, Check, Megaphone } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { RunCard } from "@/components/RunCard";
import { RouteMap } from "@/components/RouteMap";
import * as data from "@/lib/data";
import type { Announcement, Club, LeaderboardEntry, RsvpStatus, Run } from "@/lib/types";
import { VIBE_LABELS } from "@/lib/types";
import { formatPace, formatPaceRange, formatShortDate } from "@/lib/format";

export function ClubDetail({ id }: { id: string }) {
  const [club, setClub] = useState<Club | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [joined, setJoined] = useState(false);
  const [rsvps, setRsvps] = useState<Map<string, RsvpStatus>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, r, a, l, j] = await Promise.all([
        data.getClub(id),
        data.getUpcomingRuns(id),
        data.getAnnouncements(id),
        data.getLeaderboard(id),
        data.isJoined(id),
      ]);
      setClub(c ?? null);
      setRuns(r);
      setAnnouncements(a);
      setLeaders(l);
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
        <Link href="/explore" className="btn-secondary mt-4">Back to Explore</Link>
        <TabBar />
      </div>
    );
  }

  // Pace-group directory rolled up from this club's scheduled runs
  const cohorts = [...new Map(
    runs.flatMap((r) => r.paceGroups).map((pg) => [pg.label, pg]),
  ).values()];

  return (
    <div className="page">
      <header className="px-4 pt-5">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold min-h-11" style={{ color: "var(--muted)" }}>
          <ArrowLeft size={16} /> Explore
        </Link>

        {/* Generated cover identity — seeded texture, no photo assets needed */}
        <div className="relative mt-3 rounded-2xl overflow-hidden border" style={{ borderColor: "#272b34" }}>
          <RouteMap seed={club.slug} variant="texture" className="absolute inset-0" />
          <div className="stage relative px-4 pt-14 pb-4">
            <span className="tag">{VIBE_LABELS[club.vibe]}</span>
            <h1 className="text-[1.7rem] font-black tracking-tight leading-tight mt-2" style={{ color: "var(--text)" }}>
              {club.name}
            </h1>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{club.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold mt-3" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> {club.area}</span>
          <span className="inline-flex items-center gap-1 tabular-nums"><Users size={13} /> {club.memberCount} members</span>
          <span className="inline-flex items-center gap-1"><CalendarClock size={13} /> {club.schedule}</span>
        </div>

        <div className="card mt-4 flex items-center justify-between">
          <div>
            <p className="stat-value text-xl" style={{ color: "var(--course)" }}>
              {formatPaceRange(club.paceMinSec, club.paceMaxSec)}
            </p>
            <p className="stat-label mt-1">min / km pace range</p>
          </div>
          {/* Signal asks, pace confirms */}
          <button type="button" onClick={toggleJoin} aria-pressed={joined} className={joined ? "btn-confirmed" : "btn-primary"}>
            {joined ? (<><Check size={16} strokeWidth={3} /> Member</>) : "Join club"}
          </button>
        </div>
      </header>

      {leaders.length > 0 && (
        <section className="px-4 mt-6 flex flex-col gap-3">
          <h2 className="stat-label">This week&apos;s leaderboard</h2>
          <div className="card flex flex-col gap-1 py-2">
            {leaders.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center gap-3 py-2 px-1 rounded-xl"
                style={entry.isYou ? { border: "1.5px solid var(--course)", padding: "0.5rem 0.625rem" } : undefined}
              >
                <span
                  className="stat-value text-lg w-7 text-center"
                  style={{ color: entry.rank === 1 ? "var(--course)" : "var(--muted)" }}
                >
                  {entry.rank}
                </span>
                <span className="avatar">{entry.initials}</span>
                <span className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="font-bold text-sm truncate">{entry.isYou ? "You" : entry.name}</span>
                  {entry.role && <span className="tag">{entry.role}</span>}
                </span>
                <span className="stat-value text-base">
                  {entry.weekKm.toFixed(1)}<span className="text-xs font-bold" style={{ color: "var(--muted)" }}> km</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {cohorts.length > 0 && (
        <section className="px-4 mt-6">
          <h2 className="stat-label mb-3">Pace groups</h2>
          <div className="grid grid-cols-2 gap-3">
            {cohorts.map((pg) => (
              <div key={pg.label} className="card py-3.5">
                <p className="font-extrabold tracking-tight text-sm">{pg.label}</p>
                <p className="stat-value text-lg mt-1.5" style={{ color: "var(--course)" }}>
                  {formatPace(pg.paceSecPerKm)}<span className="text-xs font-bold" style={{ color: "var(--muted)" }}> /km</span>
                </p>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--muted)" }}>
                  {pg.pacerName ? `Paced by ${pg.pacerName}` : "Self-paced"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {announcements.length > 0 && (
        <section className="px-4 mt-6 flex flex-col gap-3">
          <h2 className="stat-label">From the organisers</h2>
          {announcements.map((a) => (
            <div key={a.id} className="card flex gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: "var(--surface-2)", color: "var(--course)" }}>
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
