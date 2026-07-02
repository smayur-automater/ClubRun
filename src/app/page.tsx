"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, CalendarX, Megaphone, Sun, Cloud, CloudRain, Snowflake, ChevronRight } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { GoalRing } from "@/components/GoalRing";
import { RunCard } from "@/components/RunCard";
import { EmptyState } from "@/components/EmptyState";
import * as data from "@/lib/data";
import type { Announcement, Club, FriendActivity, Profile, RsvpStatus, Run, Weather, WeeklyProgress } from "@/lib/types";

const WEATHER_ICONS = { sun: Sun, cloud: Cloud, rain: CloudRain, snow: Snowflake } as const;

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [clubs, setClubs] = useState<Map<string, Club>>(new Map());
  const [rsvps, setRsvps] = useState<Map<string, RsvpStatus>>(new Map());
  const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);
  const [streak, setStreak] = useState(0);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [friends, setFriends] = useState<FriendActivity[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("cr.onboarded")) {
      router.replace("/onboarding");
      return;
    }
    (async () => {
      const [p, upcoming, joined, w, s, wx, ff, ann] = await Promise.all([
        data.getProfile(),
        data.getUpcomingRuns(),
        data.getJoinedClubs(),
        data.getWeeklyProgress(),
        data.getStreakWeeks(),
        data.getWeather(),
        data.getFriendFeed(),
        data.getLatestAnnouncement(),
      ]);
      setProfile(p);
      setRuns(upcoming);
      setClubs(new Map(joined.map((c) => [c.id, c])));
      setWeekly(w);
      setStreak(s);
      setWeather(wx);
      setFriends(ff);
      setAnnouncement(ann ?? null);
      const entries = await Promise.all(
        upcoming.map(async (r) => [r.id, await data.getRsvp(r.id)] as const),
      );
      setRsvps(new Map(entries.filter(([, v]) => v !== null) as [string, RsvpStatus][]));
    })();
  }, [router]);

  const handleRsvp = (runId: string) => (status: RsvpStatus | null) => {
    setRsvps((prev) => {
      const next = new Map(prev);
      if (status === null) next.delete(runId);
      else next.set(runId, status);
      return next;
    });
    setRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? { ...r, goingCount: r.goingCount + (status === "going" ? 1 : -1) }
          : r,
      ),
    );
    void data.setRsvp(runId, status);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";

  if (!profile || !weekly) {
    return (
      <div className="page px-4 pt-6 flex flex-col gap-4">
        <div className="skeleton h-10 w-2/3" />
        <div className="skeleton h-44 w-full" />
        <div className="skeleton h-36 w-full" />
        <TabBar />
      </div>
    );
  }

  const progress = weekly.doneKm / weekly.goalKm;
  const WeatherIcon = weather ? WEATHER_ICONS[weather.condition] : null;
  const announcementClub = announcement ? clubs.get(announcement.clubId) : null;

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="stat-label">{greeting}</p>
          <h1 className="text-2xl font-black tracking-tight">{profile.name.split(" ")[0]}</h1>
          {weather && WeatherIcon && (
            <p className="flex items-center gap-1.5 mt-1.5 text-sm font-semibold" style={{ color: "var(--muted)" }}>
              <WeatherIcon size={17} style={{ color: "var(--course)" }} />
              <span className="font-extrabold tabular-nums" style={{ color: "var(--text)" }}>{weather.tempC}°</span>
              {weather.line}
            </p>
          )}
        </div>
        <span className="streak-pill">
          <Flame size={15} strokeWidth={2.5} /> {streak}-week streak
        </span>
      </header>

      {/* Weekly goal — Night Stage hero anchor */}
      <section className="px-4">
        <div className="card card--stage stage flex items-center gap-5">
          <GoalRing progress={progress}>
            <span className="stat-value text-2xl">{weekly.doneKm.toFixed(1)}</span>
            <span className="stat-label mt-1">of {weekly.goalKm} km</span>
          </GoalRing>
          <div className="flex flex-col gap-3">
            <div>
              <p className="stat-value text-xl">{weekly.runs}</p>
              <p className="stat-label mt-0.5">Runs this week</p>
            </div>
            <div>
              <p className="stat-value text-xl">{Math.max(0, weekly.goalKm - weekly.doneKm).toFixed(1)}</p>
              <p className="stat-label mt-0.5">km to goal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mt-6 flex flex-col gap-3">
        <h2 className="stat-label">Coming up in your clubs</h2>
        {runs.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No runs on the board"
            body="Your clubs haven't posted upcoming runs — find a new crew in the meantime."
            ctaLabel="Explore clubs"
            ctaHref="/explore"
          />
        ) : (
          runs.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              clubName={clubs.get(run.clubId)?.name}
              rsvp={rsvps.get(run.id) ?? null}
              onRsvp={handleRsvp(run.id)}
            />
          ))
        )}
      </section>

      {friends.length > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="stat-label">Your people</h2>
            <Link href="/clubs" className="btn-tertiary">
              Your clubs <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="card mt-1 flex flex-col gap-1 py-2">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-1.5">
                <span className="avatar">{f.initials}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{f.name}</p>
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--muted)" }}>{f.line}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {announcement && (
        <section className="px-4 mt-6 flex flex-col gap-3 pb-2">
          <h2 className="stat-label">From your clubs</h2>
          <Link href={`/clubs/${announcement.clubId}`} className="card flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: "var(--surface-2)", color: "var(--course)" }}>
              <Megaphone size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed line-clamp-2">{announcement.body}</p>
              <p className="text-xs font-semibold mt-1.5" style={{ color: "var(--muted)" }}>
                {announcement.author}{announcementClub ? ` · ${announcementClub.name}` : ""}
              </p>
            </div>
          </Link>
        </section>
      )}

      <TabBar />
    </div>
  );
}
