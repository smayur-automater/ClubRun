"use client";
import { useState } from "react";
import { Edit2, Moon, Sun, Bell, Shield, LogOut, ChevronRight, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ToastProvider";

const pbs = [
  { dist: "5km",          time: "22:14" },
  { dist: "10km",         time: "47:32" },
  { dist: "Half Marathon",time: "1:48:55" },
];

type NotifKey = "reminders" | "newRuns" | "clubUpdates";

export default function ProfilePage() {
  const { theme, toggle } = useTheme();
  const { toast } = useToast();

  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    reminders:   true,
    newRuns:     true,
    clubUpdates: false,
  });

  const toggleNotif = (key: NotifKey) => {
    setNotifs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      toast(next[key] ? "Notifications enabled" : "Notifications disabled", "info");
      return next;
    });
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 pt-6 pb-5" style={{ background: "var(--navy)", viewTransitionName: "app-header" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl flex-shrink-0" style={{ background: "var(--orange)" }}>SC</div>
            <div>
              <div className="font-black text-xl text-white leading-tight">Sarah Chen</div>
              <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>sydney.striders · Member since Jan 2025</div>
              <div className="badge mt-2 text-white text-xs" style={{ background: "rgba(249,115,22,0.3)", border: "1px solid rgba(249,115,22,0.5)" }}>
                5:00/km pace group
              </div>
            </div>
          </div>
          <button className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}>
            <Edit2 size={16} className="text-white" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex gap-4 mt-5 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          {[["31","Runs this year"],["5","Week streak"],["#2","Club rank"]].map(([v,l]) => (
            <div key={l} className="flex-1 text-center">
              <div className="font-black text-xl text-white">{v}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
        {/* PBs */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: "var(--navy)" }}>Personal Bests</h3>
            <button
              onClick={() => toast("PB editing coming soon!", "info")}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)", border: "none", cursor: "pointer", minHeight: "44px" }}
            >
              + Add PB
            </button>
          </div>
          <div className="space-y-3">
            {pbs.map(pb => (
              <div key={pb.dist} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--muted)" }}>{pb.dist}</span>
                <span className="font-black" style={{ color: "var(--navy)" }}>{pb.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Club */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>My Club</h3>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0" style={{ background: "var(--navy)" }}>SS</div>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{ color: "var(--navy)" }}>Sydney Striders</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>47 members · Organiser: James K.</div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>
            <span className="flex items-center gap-2"><Bell size={16} style={{ color: "var(--orange)" }} /> Notifications</span>
          </h3>
          <div className="space-y-3">
            {([
              ["reminders",   "Run reminders",     "24hr reminder before each run"],
              ["newRuns",     "New runs posted",    "When organiser posts a new run"],
              ["clubUpdates", "Club updates",       "News and announcements"],
            ] as [NotifKey, string, string][]).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{label}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{desc}</div>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  aria-label={`Toggle ${label}`}
                  style={{
                    width: 56, minHeight: 44, background: "none",
                    border: "none", cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "8px 4px",
                  }}
                >
                  <div style={{
                    width: 48, height: 28, borderRadius: 14, position: "relative",
                    background: notifs[key] ? "var(--orange)" : "var(--border)",
                    transition: "background 0.2s", flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute", top: 3,
                      left: notifs[key] ? 23 : 3,
                      width: 22, height: 22, borderRadius: "50%",
                      background: "white",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                    }} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>Appearance</h3>
          <div className="flex gap-2">
            {(["light","dark"] as const).map(t => (
              <button
                key={t}
                onClick={() => { if (theme !== t) toggle(); }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all"
                style={{
                  borderColor: theme === t ? "var(--orange)" : "var(--border)",
                  color: theme === t ? "var(--orange)" : "var(--muted)",
                  background: "var(--background)",
                  cursor: "pointer",
                }}
              >
                {t === "light" ? <Sun size={15} /> : <Moon size={15} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {theme === t && <Check size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="card">
          <h3 className="font-bold mb-3" style={{ color: "var(--navy)" }}>
            <span className="flex items-center gap-2"><Shield size={16} style={{ color: "var(--orange)" }} /> Account</span>
          </h3>
          <div className="space-y-1">
            {["Emergency Contact", "Privacy Settings", "Help & Support"].map(item => (
              <button
                key={item}
                onClick={() => toast(`${item} — coming soon`, "info")}
                className="w-full flex items-center justify-between py-3 text-sm font-semibold"
                style={{ background: "none", border: "none", color: "var(--navy)", cursor: "pointer", borderBottom: "1px solid var(--border)", minHeight: "52px" }}
              >
                {item}
                <ChevronRight size={15} style={{ color: "var(--muted)" }} />
              </button>
            ))}
            <button
              onClick={() => toast("Signed out", "info")}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3 rounded-xl text-sm font-bold"
              style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "none", cursor: "pointer", minHeight: "44px" }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
