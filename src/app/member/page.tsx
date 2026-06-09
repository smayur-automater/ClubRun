"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronRight, Flame, Trophy, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useToast } from "@/components/ToastProvider";
import { getNextRunDate, formatRelativeDate, formatTime } from "@/lib/dates";

const nextRun = getNextRunDate();
const runLabel = formatRelativeDate(nextRun);
const runTime  = formatTime(nextRun);

export default function MemberDashboard() {
  const [rsvp, setRsvp] = useState<"going" | "cant" | null>("going");
  const { toast } = useToast();

  const handleRsvp = (state: "going" | "cant") => {
    if (rsvp === state) {
      setRsvp(null);
      return;
    }
    setRsvp(state);
    if (state === "going") toast("You're in! See you " + runLabel + " at " + runTime + " 🏃", "success");
    else toast("No worries — we'll see you next time", "info");
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header style={{ background: "var(--navy)", viewTransitionName: "app-header" }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <Link href="/" className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: "var(--orange)" }}>CR</Link>
          <DarkModeToggle />
        </div>
        <div className="px-4 pb-5">
          <div className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Good morning</div>
          <div className="text-2xl font-black text-white">Sarah 👋</div>
          <div className="text-sm font-semibold mt-1" style={{ color: "var(--orange)" }}>
            Next run is {runLabel} {runTime}
          </div>
        </div>
      </header>

      <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
        {/* Next Run Card */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-black text-xl leading-tight" style={{ color: "var(--navy)" }}>Tuesday Morning Run</div>
              <div className="text-sm font-semibold mt-0.5" style={{ color: "var(--muted)" }}>{runLabel} · {runTime}</div>
            </div>
            <span className="badge text-xs" style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)" }}>10km</span>
          </div>

          {/* Meeting Point — tap to open Maps */}
          <a
            href="https://maps.google.com/?q=Centennial+Park+Gate+5+Sydney"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl mb-3 transition-all"
            style={{ background: "rgba(249,115,22,0.08)", color: "var(--navy)" }}
          >
            <MapPin size={16} style={{ color: "var(--orange)", flexShrink: 0 }} />
            <span className="text-sm font-semibold flex-1">Centennial Park, Gate 5</span>
            <ExternalLink size={13} style={{ color: "var(--muted)", flexShrink: 0 }} />
          </a>

          {/* Pace group & route */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 rounded-xl p-3" style={{ background: "var(--surface)" }}>
              <div className="text-xs font-bold mb-0.5" style={{ color: "var(--muted)" }}>YOUR PACE GROUP</div>
              <div className="font-black" style={{ color: "var(--navy)" }}>5:00/km</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Led by Marcus</div>
            </div>
            <a href="#" className="flex-1 rounded-xl p-3 flex flex-col gap-1 justify-center" style={{ background: "var(--surface)", textDecoration: "none", minHeight: "64px" }}>
              <div className="text-xs font-bold" style={{ color: "var(--muted)" }}>ROUTE</div>
              <div className="font-semibold text-sm" style={{ color: "var(--navy)" }}>View on Strava</div>
              <ExternalLink size={11} style={{ color: "var(--muted)" }} />
            </a>
          </div>

          {/* Who's coming */}
          <div className="mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>WHO&apos;S COMING</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[["T","#7c3aed"],["M","var(--orange)"],["J","#0891b2"],["A","#16a34a"],["R","#dc2626"]].map(([init,bg],i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: bg as string, border: "2px solid var(--background)" }}>{init}</div>
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Tom, Mike, Jess + 8 others</span>
            </div>
          </div>

          {/* RSVP Toggle */}
          <div className="rsvp-toggle">
            <button
              className={rsvp === "going" ? "going" : "inactive"}
              onClick={() => handleRsvp("going")}
            >
              {rsvp === "going" ? "✓ I'm Coming" : "I'm Coming"}
            </button>
            <button
              className={rsvp === "cant" ? "cant" : "inactive"}
              onClick={() => handleRsvp("cant")}
            >
              Can&apos;t Make It
            </button>
          </div>

          {rsvp === "going" && (
            <Link
              href="/rsvp"
              transitionTypes={["nav-forward"]}
              className="mt-3 flex items-center justify-between px-3 rounded-xl text-sm"
              style={{ background: "rgba(249,115,22,0.08)", minHeight: "44px" }}
            >
              <span className="font-semibold" style={{ color: "var(--navy)" }}>Change pace group</span>
              <ChevronRight size={14} style={{ color: "var(--muted)" }} />
            </Link>
          )}
        </div>

        {/* My Stats */}
        <div>
          <h3 className="font-bold text-base mb-3 px-1" style={{ color: "var(--navy)" }}>My Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card">
              <Calendar size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>31</div>
              <div className="text-xs leading-tight mt-0.5" style={{ color: "var(--muted)" }}>Runs this year</div>
            </div>
            <div className="stat-card">
              <Flame size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>5</div>
              <div className="text-xs leading-tight mt-0.5" style={{ color: "var(--muted)" }}>Week streak</div>
            </div>
            <div className="stat-card">
              <Trophy size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>3</div>
              <div className="text-xs leading-tight mt-0.5" style={{ color: "var(--muted)" }}>PBs logged</div>
            </div>
          </div>
        </div>

        {/* PBs */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>My Personal Bests</h3>
          <div className="space-y-3">
            {[["5km","22:14"],["10km","47:32"],["Half Marathon","1:48:55"]].map(([dist,time]) => (
              <div key={dist} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--muted)" }}>{dist}</span>
                <span className="font-black" style={{ color: "var(--navy)" }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
