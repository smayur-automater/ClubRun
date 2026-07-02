"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Moon, Sun, Footprints, Medal, LogOut } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { BarChart } from "@/components/BarChart";
import { useTheme } from "@/components/ThemeProvider";
import * as data from "@/lib/data";
import { signOut } from "@/lib/auth";
import type { Activity, Badge, Club, PersonalRecord, Profile, WeekDay } from "@/lib/types";
import { formatDuration, formatKm, formatPace, formatShortDate } from "@/lib/format";

const WEEK_MS = 7 * 86_400_000;

interface TimelineEntry {
  key: string;
  when: string;
  kind: "run" | "moment";
  title: string;
  meta: string;
  stat?: string;
  statMeta?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [week, setWeek] = useState<WeekDay[]>([]);
  const [streak, setStreak] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    (async () => {
      const [p, a, r, b, c, w, s] = await Promise.all([
        data.getProfile(),
        data.getActivities(),
        data.getRecords(),
        data.getBadges(),
        data.getJoinedClubs(),
        data.getWeekDays(),
        data.getStreakWeeks(),
      ]);
      setProfile(p);
      setActivities(a);
      setRecords(r);
      setBadges(b);
      setClubs(c);
      setWeek(w);
      setStreak(s);
      setNow(Date.now());
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

  // One rail: runs + notable moments (recent badges), newest first
  const timeline: TimelineEntry[] = [
    ...activities.map((a): TimelineEntry => ({
      key: a.id,
      when: a.startedAt,
      kind: "run",
      title: a.title,
      meta: `${formatShortDate(a.startedAt)} · ${formatDuration(a.durationS)}`,
      stat: `${formatKm(a.distanceM)} km`,
      statMeta: `${formatPace(a.avgPaceS)} /km`,
    })),
    ...badges
      .filter((b) => b.earnedAt && now - new Date(b.earnedAt).getTime() < 30 * 86_400_000)
      .map((b): TimelineEntry => ({
        key: b.slug,
        when: b.earnedAt!,
        kind: "moment",
        title: `Badge — ${b.name}`,
        meta: `${formatShortDate(b.earnedAt!)} · ${b.description}`,
      })),
  ].sort((a, b) => b.when.localeCompare(a.when));

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-14 h-14 rounded-full text-lg font-black"
            style={{ background: "var(--pace)", color: "var(--pace-ink)" }}
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
            <p className="stat-value text-xl inline-flex items-center gap-1" style={{ color: "var(--pace)" }}>
              <Flame size={18} strokeWidth={2.5} />{streak}
            </p>
            <p className="stat-label mt-1.5">week streak</p>
          </div>
        </div>
      </section>

      {week.length > 0 && (
        <section className="px-4 mt-6">
          <h2 className="stat-label mb-3">This week</h2>
          <div className="card card--stage stage">
            <BarChart days={week} />
          </div>
        </section>
      )}

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

      {clubs.length > 0 && (
        <section className="px-4 mt-6">
          <h2 className="stat-label mb-3">Clubs</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            {clubs.map((c) => (
              <Link key={c.id} href={`/clubs/${c.id}`} className="flex flex-col items-center gap-1.5 w-16 shrink-0">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-[0.6875rem] font-black"
                  style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {c.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </span>
                <span className="text-[0.625rem] font-bold text-center leading-tight line-clamp-2" style={{ color: "var(--muted)" }}>
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 mt-6">
        <h2 className="stat-label mb-3">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const locked = !b.earnedAt;
            const fresh = b.earnedAt && now > 0 && now - new Date(b.earnedAt).getTime() < WEEK_MS;
            return (
              <div key={b.slug} className="card relative flex flex-col items-center py-4 text-center gap-2" style={locked ? { opacity: 0.45 } : undefined}>
                {fresh && (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--signal)" }} aria-label="New badge" />
                )}
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={locked
                    ? { background: "var(--surface-2)", color: "var(--muted)" }
                    : { background: "color-mix(in srgb, var(--pace) 16%, transparent)", color: "var(--pace)" }}
                >
                  {locked ? <Lock size={16} /> : <Footprints size={17} strokeWidth={2.2} />}
                </span>
                <span className="text-[0.6875rem] font-extrabold leading-tight tracking-tight">{b.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 mt-6 pb-2">
        <h2 className="stat-label mb-3">Activity</h2>
        <div className="relative pl-6">
          {/* The rail */}
          <span className="absolute left-[3px] top-2 bottom-2 w-[1.5px]" style={{ background: "var(--border)" }} aria-hidden />
          <div className="flex flex-col gap-3">
            {timeline.map((entry) => (
              <div key={entry.key} className="relative">
                {entry.kind === "run" ? (
                  <span
                    className="absolute -left-6 top-4 w-2 h-2 rounded-full -translate-x-[0.5px]"
                    style={{ background: "var(--pace)" }}
                    aria-hidden
                  />
                ) : (
                  <span
                    className="absolute -left-[31px] top-3 flex items-center justify-center w-5 h-5 rounded-full"
                    style={{ background: "color-mix(in srgb, var(--signal) 16%, var(--surface))", color: "var(--signal)", border: "1px solid color-mix(in srgb, var(--signal) 40%, transparent)" }}
                    aria-hidden
                  >
                    <Medal size={11} strokeWidth={2.5} />
                  </span>
                )}
                <div className="card flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-extrabold tracking-tight text-sm truncate">{entry.title}</p>
                    <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: "var(--muted)" }}>{entry.meta}</p>
                  </div>
                  {entry.stat && (
                    <div className="text-right shrink-0 ml-3">
                      <p className="stat-value text-lg">{entry.stat}</p>
                      <p className="text-xs font-semibold mt-0.5 tabular-nums" style={{ color: "var(--muted)" }}>{entry.statMeta}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 mt-8 pb-2">
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => {
            signOut();
            router.replace("/auth");
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </section>

      <TabBar />
    </div>
  );
}
