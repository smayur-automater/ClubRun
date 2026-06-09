"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronRight, Flame, Trophy, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function MemberDashboard() {
  const [rsvp, setRsvp] = useState<"going" | "cant" | null>("going");

  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 pt-6 pb-4" style={{ background: "var(--navy)" }}>
        <div className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Good morning</div>
        <div className="text-2xl font-black text-white mb-1">Sarah 👋</div>
        <div className="text-sm font-medium" style={{ color: "var(--orange)" }}>Next run is Tuesday 5:30am</div>
      </header>

      <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
        {/* Next Run Card */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>Tuesday Morning Run</div>
              <div className="text-sm mt-0.5 font-semibold" style={{ color: "var(--muted)" }}>Tue 10 Jun · 5:30am</div>
            </div>
            <span className="badge text-xs" style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)" }}>10km</span>
          </div>

          {/* Meeting Point */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-xl mb-3 transition-colors"
            style={{ background: "rgba(249,115,22,0.08)", color: "var(--navy)" }}
          >
            <MapPin size={16} style={{ color: "var(--orange)", flexShrink: 0 }} />
            <span className="text-sm font-semibold flex-1">Centennial Park, Gate 5</span>
            <ExternalLink size={14} style={{ color: "var(--muted)", flexShrink: 0 }} />
          </a>

          {/* Pace Group & Route */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 rounded-xl p-3" style={{ background: "var(--surface)" }}>
              <div className="text-xs font-bold mb-0.5" style={{ color: "var(--muted)" }}>YOUR PACE GROUP</div>
              <div className="font-black" style={{ color: "var(--navy)" }}>5:00/km</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Led by Marcus</div>
            </div>
            <a href="#" className="flex-1 rounded-xl p-3 flex flex-col justify-between" style={{ background: "var(--surface)" }}>
              <div className="text-xs font-bold mb-0.5" style={{ color: "var(--muted)" }}>ROUTE</div>
              <div className="font-semibold text-sm" style={{ color: "var(--navy)" }}>View on Strava</div>
              <ExternalLink size={12} style={{ color: "var(--muted)" }} />
            </a>
          </div>

          {/* Who's Coming */}
          <div className="mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>WHO&apos;S COMING</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["T", "M", "J", "A", "R"].map((initial, i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white" style={{ background: ["#7c3aed","var(--orange)","#0891b2","#16a34a","#dc2626"][i] }}>{initial}</div>
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Tom, Mike, Jess + 8 others</span>
            </div>
          </div>

          {/* RSVP Toggle */}
          <div className="rsvp-toggle">
            <button
              className={rsvp === "going" ? "going" : "inactive"}
              onClick={() => setRsvp(rsvp === "going" ? null : "going")}
            >
              {rsvp === "going" ? "✓ I'm Coming" : "I'm Coming"}
            </button>
            <button
              className={rsvp === "cant" ? "cant" : "inactive"}
              onClick={() => setRsvp(rsvp === "cant" ? null : "cant")}
            >
              Can&apos;t Make It
            </button>
          </div>

          {rsvp === "going" && (
            <Link href="/rsvp" className="mt-3 flex items-center justify-between p-2.5 rounded-xl text-sm" style={{ background: "rgba(249,115,22,0.08)" }}>
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
              <div className="text-xs" style={{ color: "var(--muted)" }}>Runs this year</div>
            </div>
            <div className="stat-card">
              <Flame size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>5</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Week streak</div>
            </div>
            <div className="stat-card">
              <Trophy size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-xl" style={{ color: "var(--navy)" }}>3</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>PBs logged</div>
            </div>
          </div>
        </div>

        {/* PBs */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>My PBs</h3>
          <div className="space-y-3">
            {[
              { dist: "5km", time: "22:14" },
              { dist: "10km", time: "47:32" },
              { dist: "Half Marathon", time: "1:48:55" },
            ].map(pb => (
              <div key={pb.dist} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--muted)" }}>{pb.dist}</span>
                <span className="font-black" style={{ color: "var(--navy)" }}>{pb.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
