/**
 * ClubRuns domain model — mirrors the database schema in docs/ARCHITECTURE.md.
 * Every screen consumes these types through the repository in `data.ts`;
 * nothing in the UI layer invents its own data shapes.
 */

export type Vibe = "social" | "training" | "trail" | "early";

export const VIBE_LABELS: Record<Vibe, string> = {
  social: "Social",
  training: "Training",
  trail: "Trail",
  early: "Early birds",
};

export interface Profile {
  id: string;
  handle: string;
  name: string;
  initials: string;
  /** Comfortable pace in seconds per km */
  paceSecPerKm: number;
  vibe: Vibe;
  homeArea: string;
  weeklyGoalKm: number;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  area: string;
  vibe: Vibe;
  paceMinSec: number;
  paceMaxSec: number;
  memberCount: number;
  /** Recurring meet summary, e.g. "Tue + Thu · 6:00 PM" */
  schedule: string;
}

export interface PaceGroup {
  id: string;
  label: string;
  paceSecPerKm: number;
  pacerName?: string;
}

export type RunStatus = "scheduled" | "live" | "done" | "cancelled";

export interface Run {
  id: string;
  clubId: string;
  title: string;
  startsAt: string; // ISO datetime
  meetPoint: string;
  distanceKm: number;
  status: RunStatus;
  paceGroups: PaceGroup[];
  goingCount: number;
  /** Short names of a few attendees, for avatar stacks */
  goingPreview: string[];
}

export type RsvpStatus = "going" | "out";

export interface Activity {
  id: string;
  runId?: string;
  title: string;
  startedAt: string; // ISO datetime
  durationS: number;
  distanceM: number;
  avgPaceS: number; // seconds per km
  elevGainM: number;
}

export interface Badge {
  slug: string;
  name: string;
  description: string;
  earnedAt?: string; // ISO date; undefined = locked
}

export interface PersonalRecord {
  label: string;
  value: string;
  date: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface WeeklyProgress {
  goalKm: number;
  doneKm: number;
  runs: number;
}
