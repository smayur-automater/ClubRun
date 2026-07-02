"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Ruler, Users, Check, Zap } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { RouteMap } from "@/components/RouteMap";
import * as data from "@/lib/data";
import type { Club, RsvpStatus, Run } from "@/lib/types";
import { formatPace, formatRunTime } from "@/lib/format";

export default function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [run, setRun] = useState<Run | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [rsvp, setRsvpState] = useState<RsvpStatus | null>(null);
  const [paceGroupId, setPaceGroupId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await data.getRun(id);
      setRun(r ?? null);
      if (r) {
        const [c, status] = await Promise.all([data.getClub(r.clubId), data.getRsvp(r.id)]);
        setClub(c ?? null);
        setRsvpState(status);
      }
      setLoaded(true);
    })();
  }, [id]);

  const toggleGoing = () => {
    if (!run) return;
    const next: RsvpStatus | null = rsvp === "going" ? null : "going";
    setRsvpState(next);
    setRun({ ...run, goingCount: run.goingCount + (next === "going" ? 1 : -1) });
    void data.setRsvp(run.id, next);
  };

  if (!loaded) {
    return (
      <div className="page px-4 pt-6 flex flex-col gap-4">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-52 w-full" />
        <div className="skeleton h-32 w-full" />
        <TabBar />
      </div>
    );
  }

  if (!run) {
    return (
      <div className="page px-4 pt-6">
        <p className="font-extrabold">Run not found.</p>
        <Link href="/" className="btn-secondary mt-4">Back home</Link>
        <TabBar />
      </div>
    );
  }

  const going = rsvp === "going";

  return (
    <div className="page">
      <header className="px-4 pt-5">
        <Link
          href={club ? `/clubs/${club.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-sm font-bold min-h-11"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={16} /> {club?.name ?? "Home"}
        </Link>
        <p className="text-sm font-bold mt-3" style={{ color: "var(--course)" }}>{formatRunTime(run.startsAt)}</p>
        <h1 className="text-[1.7rem] font-black tracking-tight leading-tight mt-1">{run.title}</h1>
        <div className="flex items-center gap-4 text-xs font-semibold mt-3" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> {run.meetPoint}</span>
          <span className="inline-flex items-center gap-1 tabular-nums"><Ruler size={13} /> {run.distanceKm} km</span>
          <span className="inline-flex items-center gap-1 tabular-nums"><Users size={13} /> {run.goingCount} going</span>
        </div>
      </header>

      {/* The flagship route-draw moment (docs/DESIGN_SYSTEM.md §6.3) */}
      <section className="px-4 mt-4">
        <RouteMap
          seed={run.id}
          distanceKm={run.distanceKm}
          elevGainM={run.elevGainM}
          hasRoute={run.hasRoute}
          className="aspect-[16/10]"
        />
      </section>

      <section className="px-4 mt-5">
        <button type="button" onClick={toggleGoing} aria-pressed={going} className={`${going ? "btn-confirmed" : "btn-primary"} w-full`}>
          {going ? (<><Check size={17} strokeWidth={3} /> You&apos;re in — tap to bail</>) : "Count me in"}
        </button>
      </section>

      <section className="px-4 mt-6 flex flex-col gap-3">
        <h2 className="stat-label">Pace groups</h2>
        {run.paceGroups.map((pg) => {
          const selected = paceGroupId === pg.id;
          return (
            <button
              key={pg.id}
              type="button"
              disabled={!going}
              onClick={() => setPaceGroupId(selected ? null : pg.id)}
              aria-pressed={selected}
              className="card flex items-center justify-between text-left transition-colors disabled:opacity-50"
              style={selected ? { borderColor: "var(--pace)", background: "color-mix(in srgb, var(--pace) 8%, var(--surface))" } : undefined}
            >
              <span>
                <span className="block font-extrabold tracking-tight">{pg.label}</span>
                <span className="block text-xs font-semibold mt-0.5" style={{ color: "var(--muted)" }}>
                  {pg.pacerName ? `Paced by ${pg.pacerName}` : "Self-paced"}
                </span>
              </span>
              {/* Pace figure is a fact → course; picking it is a commitment → pace tint */}
              <span className="stat-value text-lg" style={{ color: selected ? "var(--pace)" : "var(--course)" }}>
                {formatPace(pg.paceSecPerKm)}<span className="text-xs font-bold" style={{ color: "var(--muted)" }}> /km</span>
              </span>
            </button>
          );
        })}
        {!going && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>RSVP first, then pick your group.</p>
        )}
      </section>

      <section className="px-4 mt-6 flex flex-col gap-3">
        <h2 className="stat-label">Who&apos;s coming</h2>
        <div className="card flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {run.goingPreview.map((initials) => (
              <span key={initials} className="avatar">{initials}</span>
            ))}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            {run.goingCount} runner{run.goingCount === 1 ? "" : "s"} locked in{going ? " — including you" : ""}
          </p>
        </div>
      </section>

      <section className="px-4 mt-6 pb-2">
        <Link href="/record" className="card flex items-center justify-between" style={{ borderColor: "color-mix(in srgb, var(--signal) 30%, var(--border))" }}>
          <span className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full" style={{ background: "var(--signal)", color: "#ffffff" }}>
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span>
              <span className="block font-extrabold tracking-tight text-sm">Running this one?</span>
              <span className="block text-xs mt-0.5" style={{ color: "var(--muted)" }}>Track it live from the start line</span>
            </span>
          </span>
        </Link>
      </section>

      <TabBar />
    </div>
  );
}
