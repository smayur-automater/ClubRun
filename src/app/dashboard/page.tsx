"use client";
import Link from "next/link";
import { Settings, Edit, List, Bell, Plus, Users, Calendar, Trophy } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const upcomingRuns = [
  { id: 2, date: "Sat 14 Jun", title: "Saturday Tempo Run", rsvp: 9 },
  { id: 3, date: "Tue 17 Jun", title: "Tuesday Morning Run", rsvp: 6 },
  { id: 4, date: "Sat 21 Jun", title: "Saturday Long Run", rsvp: 12 },
];

export default function OrgDashboard() {
  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Top Bar */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: "var(--orange)" }}>CR</div>
          <div>
            <div className="font-bold text-white text-sm leading-tight">Sydney Striders</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>47 members</div>
          </div>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
          <Settings size={18} className="text-white" />
        </button>
      </header>

      <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
        {/* Next Run Card */}
        <div className="card border-l-4" style={{ borderLeftColor: "var(--orange)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="badge text-xs mb-2" style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)" }}>Next Run</div>
              <h2 className="font-black text-xl" style={{ color: "var(--navy)" }}>Tuesday Morning Run</h2>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--muted)" }}>Tue 10 Jun · 5:30am · Centennial Park</p>
            </div>
          </div>

          {/* RSVP Summary */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#dcfce7" }}>
              <div className="text-xl font-black" style={{ color: "#16a34a" }}>14</div>
              <div className="text-xs font-semibold" style={{ color: "#16a34a" }}>Going</div>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fef9c3" }}>
              <div className="text-xl font-black" style={{ color: "#ca8a04" }}>3</div>
              <div className="text-xs font-semibold" style={{ color: "#ca8a04" }}>Maybe</div>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "#fee2e2" }}>
              <div className="text-xl font-black" style={{ color: "#dc2626" }}>2</div>
              <div className="text-xs font-semibold" style={{ color: "#dc2626" }}>Can&apos;t go</div>
            </div>
          </div>

          {/* Pace Groups */}
          <div className="rounded-xl p-3 mb-4" style={{ background: "var(--surface)" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>PACE GROUPS</div>
            <div className="space-y-1.5">
              {[
                { label: "4:30/km", count: 4, color: "#7c3aed" },
                { label: "5:00/km", count: 6, color: "var(--orange)" },
                { label: "5:30/km", count: 4, color: "#0891b2" },
              ].map(g => (
                <div key={g.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-sm font-semibold flex-1" style={{ color: "var(--navy)" }}>{g.label}</span>
                  <span className="text-sm font-bold" style={{ color: g.color }}>{g.count} runners</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href="/runs/create" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: "var(--navy)", color: "var(--navy)" }}>
              <Edit size={14} /> Edit Run
            </Link>
            <Link href="/members" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: "var(--navy)", color: "var(--navy)" }}>
              <List size={14} /> Full List
            </Link>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: "var(--navy)" }}>
              <Bell size={14} /> Remind
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Members", value: "47" },
            { icon: Calendar, label: "Runs this month", value: "4" },
            { icon: Trophy, label: "Top group", value: "5:00s" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card">
              <Icon size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
              <div className="font-black text-lg" style={{ color: "var(--navy)" }}>{value}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Runs */}
        <div>
          <h3 className="font-bold text-base mb-3 px-1" style={{ color: "var(--navy)" }}>Upcoming Runs</h3>
          <div className="space-y-2">
            {upcomingRuns.map(run => (
              <div key={run.id} className="card flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
                  <Calendar size={18} style={{ color: "var(--orange)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate" style={{ color: "var(--navy)" }}>{run.title}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{run.date} · {run.rsvp} RSVPs</div>
                </div>
                <Link href="/runs/create" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--surface)", color: "var(--muted)" }}>Edit</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <Link href="/runs/create" className="floating-btn">
        <Plus size={24} />
      </Link>

      <BottomNav />
    </div>
  );
}
