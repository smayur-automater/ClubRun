"use client";
import { useEffect, useState } from "react";
import { Flame, Lock, Moon, Sun, Footprints } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { useTheme } from "@/components/ThemeProvider";
import * as data from "@/lib/data";
import type { Activity, Badge, PersonalRecord, Profile } from "@/lib/types";
import { formatDuration, formatKm, formatPace, formatShortDate } from "@/lib/format";

export default function ProfilePage() {
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const [p, a, r, b, s] = await Promise.all([
        data.getProfile(),
        data.getActivities(),
        data.getRecords(),
        data.getBadges(),
        data.getStreakWeeks(),
      ]);
      setProfile(p);
      setActivities(a);
      setRecords(r);
      setBadges(b);
      setStreak(s);
    })();
  }, []);

  if (!profile) {
    return (
      <div className="page px-4 pt-6 flex flex-col gap-4">
        <div className="skeleton h-16 w-full" />
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-40 w-full" />
        <TabBar />
      </div>
    );
  }

  const totalKm = activities.reduce((sum, a) => sum + a.distanceM, 0);

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-14 h-14 rounded-full text-lg font-black"
            style={{ background: "var(--volt)", color: "var(--volt-ink)" }}
          >
            {profile.initials}
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight">{profile.name}</h1>
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              @{profile.handle} · {profile.homeArea}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="flex items-center justify-center w-11 h-11 rounded-full"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <section className="px-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card py-4">
            <p className="stat-value text-xl">{formatKm(totalKm)}</p>
            <p className="stat-label mt-1.5">km logged</p>
          </div>
          <div className="card py-4">
            <p className="stat-value text-xl">{activities.length}</p>
            <p className="stat-label mt-1.5">runs</p>
          </div>
          <div className="card py-4">
            <p className="stat-value text-xl inline-flex items-center gap-1" style={{ color: "var(--volt)" }}>
              <Flame size={18} strokeWidth={2.5} />{streak}
            </p>
            <p className="stat-label mt-1.5">week streak</p>
          </div>
        </div>
      </section>

      <section className="px-4 mt-6">
        <h2 className="stat-label mb-3">Personal records</h2>
        <div className="grid grid-cols-2 gap-3">
          {records.map((r) => (
            <div key={r.label} className="card py-4">
              <p className="stat-label">{r.label}</p>
              <p className="stat-value text-2xl mt-1.5">{r.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: "var(--muted)" }}>{r.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-6">
        <h2 className="stat-label mb-3">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const locked = !b.earnedAt;
            return (
              <div key={b.slug} className="card flex flex-col items-center py-4 text-center gap-2" style={locked ? { opacity: 0.45 } : undefined}>
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={locked
                    ? { background: "var(--surface-2)", color: "var(--muted)" }
                    : { background: "color-mix(in srgb, var(--volt) 16%, transparent)", color: "var(--volt)" }}
                >
                  {locked ? <Lock size={16} /> : <Footprints size={17} strokeWidth={2.2} />}
                </span>
                <span className="text-[0.6875rem] font-extrabold leading-tight tracking-tight">{b.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 mt-6 flex flex-col gap-3">
        <h2 className="stat-label">Recent runs</h2>
        {activities.map((a) => (
          <div key={a.id} className="card flex items-center justify-between">
            <div>
              <p className="font-extrabold tracking-tight text-sm">{a.title}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--muted)" }}>
                {formatShortDate(a.startedAt)} · {formatDuration(a.durationS)}
              </p>
            </div>
            <div className="text-right">
              <p className="stat-value text-lg">{formatKm(a.distanceM)} <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>km</span></p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--muted)" }}>{formatPace(a.avgPaceS)} /km</p>
            </div>
          </div>
        ))}
      </section>

      <TabBar />
    </div>
  );
}
