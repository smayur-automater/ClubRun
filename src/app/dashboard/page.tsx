"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Settings, Edit, List, Bell, Plus, Users, Calendar, Trophy } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DashboardSkeleton } from "@/components/Skeleton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useToast } from "@/components/ToastProvider";
import { ViewTransition } from "react";

const upcomingRuns = [
  { id: 2, date: "Sat 14 Jun", title: "Saturday Tempo Run",   rsvp: 9  },
  { id: 3, date: "Tue 17 Jun", title: "Tuesday Morning Run",  rsvp: 6  },
  { id: 4, date: "Sat 21 Jun", title: "Saturday Long Run",    rsvp: 12 },
];

function DashboardContent() {
  const { toast } = useToast();
  const [reminding, setReminding] = useState(false);

  const sendReminder = async () => {
    setReminding(true);
    await new Promise(r => setTimeout(r, 900));
    setReminding(false);
    toast("Reminder sent to 14 members ✓", "success");
  };

  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
      {/* Next Run Card */}
      <div className="card border-l-4" style={{ borderLeftColor: "var(--orange)" }}>
        <div className="mb-3">
          <div className="badge text-xs mb-2" style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)" }}>Next Run</div>
          <h2 className="font-black text-xl leading-tight" style={{ color: "var(--navy)" }}>Tuesday Morning Run</h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--muted)" }}>Tomorrow · 5:30am · Centennial Park</p>
        </div>

        {/* RSVP Summary */}
        <div className="flex gap-2 mb-4">
          {[["14","Going","#dcfce7","#16a34a"],["3","Maybe","#fef9c3","#ca8a04"],["2","Can't go","#fee2e2","#dc2626"]].map(([n,l,bg,c]) => (
            <div key={l} className="flex-1 rounded-xl p-3 text-center" style={{ background: bg as string }}>
              <div className="text-xl font-black" style={{ color: c as string }}>{n}</div>
              <div className="text-xs font-semibold" style={{ color: c as string }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Pace Groups */}
        <div className="rounded-xl p-3 mb-4" style={{ background: "var(--surface)" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>PACE GROUPS</div>
          <div className="space-y-2">
            {[
              { label: "4:30/km", count: 4,  color: "#7c3aed" },
              { label: "5:00/km", count: 6,  color: "var(--orange)" },
              { label: "5:30/km", count: 4,  color: "#0891b2" },
            ].map(g => (
              <div key={g.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: g.color }} />
                <span className="text-sm font-semibold flex-1" style={{ color: "var(--navy)" }}>{g.label}</span>
                <div className="flex gap-1">
                  {Array.from({ length: g.count > 4 ? 4 : g.count }).map((_,i) => (
                    <div key={i} className="w-4 h-4 rounded-full" style={{ background: g.color, opacity: 0.8 - i * 0.15 }} />
                  ))}
                  {g.count > 4 && <span className="text-xs font-bold self-center" style={{ color: g.color }}>+{g.count - 4}</span>}
                </div>
                <span className="text-xs font-bold w-12 text-right" style={{ color: g.color }}>{g.count} runners</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href="/runs/create" transitionTypes={["nav-forward"]} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: "var(--navy)", color: "var(--navy)", minHeight: "44px" }}>
            <Edit size={13} /> Edit Run
          </Link>
          <Link href="/members" transitionTypes={["nav-tab"]} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: "var(--navy)", color: "var(--navy)", minHeight: "44px" }}>
            <List size={13} /> Full List
          </Link>
          <button
            onClick={sendReminder}
            disabled={reminding}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "var(--navy)", minHeight: "44px", opacity: reminding ? 0.7 : 1, transition: "opacity 0.2s" }}
          >
            <Bell size={13} className={reminding ? "animate-bounce" : ""} />
            {reminding ? "Sending…" : "Remind"}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users,    label: "Members",        value: "47" },
          { icon: Calendar, label: "Runs this month", value: "4"  },
          { icon: Trophy,   label: "Top group",       value: "5:00s" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="stat-card">
            <Icon size={18} className="mx-auto mb-1" style={{ color: "var(--orange)" }} />
            <div className="font-black text-xl" style={{ color: "var(--navy)" }}>{value}</div>
            <div className="text-xs leading-tight mt-0.5" style={{ color: "var(--muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Runs */}
      <div>
        <h3 className="font-bold text-base mb-3 px-1" style={{ color: "var(--navy)" }}>Upcoming Runs</h3>
        <div className="space-y-2">
          {upcomingRuns.map(run => (
            <ViewTransition key={run.id} name={`run-card-${run.id}`}>
              <div className="card flex items-center gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
                  <Calendar size={18} style={{ color: "var(--orange)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate" style={{ color: "var(--navy)" }}>{run.title}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{run.date} · {run.rsvp} RSVPs</div>
                </div>
                <Link href="/runs/create" transitionTypes={["nav-forward"]} className="text-xs font-semibold px-4 rounded-lg flex items-center" style={{ background: "var(--surface)", color: "var(--muted)", minHeight: "44px" }}>Edit</Link>
              </div>
            </ViewTransition>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrgDashboard() {
  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Top Bar */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)", viewTransitionName: "app-header" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0" style={{ background: "var(--orange)" }}>CR</Link>
          <div>
            <div className="font-bold text-white text-sm leading-tight">Sydney Striders</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>47 members</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
            <Settings size={18} className="text-white" />
          </button>
        </div>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>

      {/* Floating Add Button */}
      <Link href="/runs/create" transitionTypes={["nav-forward"]} className="floating-btn" aria-label="Add new run">
        <Plus size={24} />
      </Link>

      <BottomNav />
    </div>
  );
}
