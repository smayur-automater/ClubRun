"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, CalendarX } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { GoalRing } from "@/components/GoalRing";
import { RunCard } from "@/components/RunCard";
import { EmptyState } from "@/components/EmptyState";
import * as data from "@/lib/data";
import type { Club, Profile, RsvpStatus, Run, WeeklyProgress } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [clubs, setClubs] = useState<Map<string, Club>>(new Map());
  const [rsvps, setRsvps] = useState<Map<string, RsvpStatus>>(new Map());
  const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("cr.onboarded")) {
      router.replace("/onboarding");
      return;
    }
    (async () => {
      const [p, upcoming, joined, w, s] = await Promise.all([
        data.getProfile(),
        data.getUpcomingRuns(),
        data.getJoinedClubs(),
        data.getWeeklyProgress(),
        data.getStreakWeeks(),
      ]);
      setProfile(p);
      setRuns(upcoming);
      setClubs(new Map(joined.map((c) => [c.id, c])));
      setWeekly(w);
      setStreak(s);
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

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="stat-label">{greeting}</p>
          <h1 className="text-2xl font-black tracking-tight">{profile.name.split(" ")[0]}</h1>
        </div>
        <span className="streak-pill">
          <Flame size={15} strokeWidth={2.5} /> {streak}-week streak
        </span>
      </header>

      <section className="px-4">
        <div className="card flex items-center gap-5">
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

      <TabBar />
    </div>
  );
}
