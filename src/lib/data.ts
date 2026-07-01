/**
 * Repository layer — the single seam between screens and data.
 *
 * All functions are async and return API-shaped types from `types.ts`, so
 * replacing this module's mock store with real route-handler/Supabase calls
 * (M3 in docs/ROADMAP.md) does not touch any screen. Mutations validate
 * input even against mocks to keep boundary discipline before a backend exists.
 */
import type {
  Activity,
  Announcement,
  Badge,
  Club,
  PersonalRecord,
  Profile,
  RsvpStatus,
  Run,
  WeeklyProgress,
} from "./types";

/** ISO string for `days` from now at hh:mm local time — keeps mock runs perpetually upcoming. */
function at(days: number, hh: number, mm: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(6, 30, 0, 0);
  return d.toISOString();
}

const profile: Profile = {
  id: "u1",
  handle: "alex.runs",
  name: "Alex Rivera",
  initials: "AR",
  paceSecPerKm: 330,
  vibe: "social",
  homeArea: "Inner West",
  weeklyGoalKm: 30,
};

const clubs: Club[] = [
  {
    id: "c1", slug: "midnight-mile", name: "Midnight Mile Collective",
    tagline: "The city is quieter after 9. We own it.",
    area: "CBD", vibe: "social", paceMinSec: 330, paceMaxSec: 420,
    memberCount: 214, schedule: "Wed + Fri · 9:15 PM",
  },
  {
    id: "c2", slug: "harbour-hounds", name: "Harbour Hounds",
    tagline: "Bridges, stairs, and zero mercy on hills.",
    area: "Kirribilli", vibe: "training", paceMinSec: 270, paceMaxSec: 330,
    memberCount: 143, schedule: "Tue + Thu · 6:00 AM",
  },
  {
    id: "c3", slug: "first-light", name: "First Light Runners",
    tagline: "Sunrise over the water, coffee after. Always coffee.",
    area: "Bondi", vibe: "early", paceMinSec: 330, paceMaxSec: 450,
    memberCount: 389, schedule: "Daily · 5:45 AM",
  },
  {
    id: "c4", slug: "dirt-society", name: "Dirt Society",
    tagline: "Singletrack Saturdays. Roots, ridges, river crossings.",
    area: "Blue Mountains", vibe: "trail", paceMinSec: 360, paceMaxSec: 480,
    memberCount: 97, schedule: "Sat · 7:00 AM",
  },
  {
    id: "c5", slug: "no-pace-club", name: "No Pace Club",
    tagline: "Couch to somewhere. Nobody gets dropped, ever.",
    area: "Inner West", vibe: "social", paceMinSec: 420, paceMaxSec: 540,
    memberCount: 512, schedule: "Mon + Sat · 8:00 AM",
  },
  {
    id: "c6", slug: "track-rats", name: "Track Rats",
    tagline: "400s until the lactate wins. Spikes optional.",
    area: "Olympic Park", vibe: "training", paceMinSec: 240, paceMaxSec: 300,
    memberCount: 76, schedule: "Tue · 6:30 PM",
  },
];

const runs: Run[] = [
  {
    id: "r1", clubId: "c1", title: "Neon Loop", startsAt: at(0, 21, 15),
    meetPoint: "Customs House steps", distanceKm: 8, status: "scheduled",
    paceGroups: [
      { id: "pg1", label: "Cruise", paceSecPerKm: 390, pacerName: "Sam K." },
      { id: "pg2", label: "Tempo", paceSecPerKm: 330, pacerName: "Priya N." },
    ],
    goingCount: 38, goingPreview: ["SK", "PN", "JT", "MW"],
  },
  {
    id: "r2", clubId: "c5", title: "Saturday Social 5K", startsAt: at(1, 8, 0),
    meetPoint: "Enmore Park gates", distanceKm: 5, status: "scheduled",
    paceGroups: [
      { id: "pg3", label: "Chatty", paceSecPerKm: 480, pacerName: "Dee L." },
      { id: "pg4", label: "Steady", paceSecPerKm: 420 },
    ],
    goingCount: 64, goingPreview: ["DL", "AB", "Rh", "KO"],
  },
  {
    id: "r3", clubId: "c2", title: "Stair Repeats", startsAt: at(2, 6, 0),
    meetPoint: "Milsons Point station", distanceKm: 10, status: "scheduled",
    paceGroups: [
      { id: "pg5", label: "Threshold", paceSecPerKm: 285, pacerName: "Marco V." },
      { id: "pg6", label: "Strong", paceSecPerKm: 315 },
    ],
    goingCount: 21, goingPreview: ["MV", "CT", "LB"],
  },
  {
    id: "r4", clubId: "c1", title: "Friday Night Flat 10", startsAt: at(3, 21, 15),
    meetPoint: "Customs House steps", distanceKm: 10, status: "scheduled",
    paceGroups: [
      { id: "pg7", label: "Cruise", paceSecPerKm: 390 },
      { id: "pg8", label: "Tempo", paceSecPerKm: 330, pacerName: "Priya N." },
    ],
    goingCount: 26, goingPreview: ["PN", "JT", "EW"],
  },
  {
    id: "r5", clubId: "c3", title: "Sunrise Six", startsAt: at(1, 5, 45),
    meetPoint: "North Bondi surf club", distanceKm: 6, status: "scheduled",
    paceGroups: [
      { id: "pg9", label: "Easy", paceSecPerKm: 420, pacerName: "Noah F." },
      { id: "pg10", label: "Brisk", paceSecPerKm: 345 },
    ],
    goingCount: 87, goingPreview: ["NF", "GH", "TS", "YZ"],
  },
  {
    id: "r6", clubId: "c4", title: "Ridgeline Recon", startsAt: at(4, 7, 0),
    meetPoint: "Wentworth Falls lookout carpark", distanceKm: 14, status: "scheduled",
    paceGroups: [{ id: "pg11", label: "Adventure", paceSecPerKm: 450, pacerName: "Ivy R." }],
    goingCount: 12, goingPreview: ["IR", "BQ"],
  },
  {
    id: "r7", clubId: "c6", title: "8 × 400m", startsAt: at(5, 18, 30),
    meetPoint: "Warm-up track, gate C", distanceKm: 7, status: "scheduled",
    paceGroups: [
      { id: "pg12", label: "Sub-20 5K", paceSecPerKm: 255 },
      { id: "pg13", label: "Sub-22 5K", paceSecPerKm: 280, pacerName: "Coach Ana" },
    ],
    goingCount: 18, goingPreview: ["CA", "DK", "FP"],
  },
];

const announcements: Announcement[] = [
  {
    id: "a1", clubId: "c1", author: "Priya N.",
    body: "Route change Friday — Circular Quay boardwalk is closed, we cut through the Rocks instead. Same distance, better views.",
    createdAt: daysAgo(1),
  },
  {
    id: "a2", clubId: "c1", author: "Sam K.",
    body: "New faces every week lately. If you see someone standing alone at the steps, say hi — that was all of us once.",
    createdAt: daysAgo(4),
  },
  {
    id: "a3", clubId: "c5", author: "Dee L.",
    body: "Post-run pancakes on Saturday are BACK. First stack on the club.",
    createdAt: daysAgo(2),
  },
];

const activities: Activity[] = [
  { id: "t1", runId: "rx1", title: "Neon Loop", startedAt: daysAgo(1), durationS: 2760, distanceM: 8100, avgPaceS: 341, elevGainM: 42 },
  { id: "t2", title: "Solo shakeout", startedAt: daysAgo(2), durationS: 1620, distanceM: 5000, avgPaceS: 324, elevGainM: 18 },
  { id: "t3", runId: "rx2", title: "Saturday Social 5K", startedAt: daysAgo(4), durationS: 1740, distanceM: 5300, avgPaceS: 328, elevGainM: 25 },
  { id: "t4", title: "Long run — river path", startedAt: daysAgo(6), durationS: 5580, distanceM: 16400, avgPaceS: 340, elevGainM: 96 },
  { id: "t5", runId: "rx3", title: "Stair Repeats", startedAt: daysAgo(8), durationS: 3120, distanceM: 9200, avgPaceS: 339, elevGainM: 210 },
];

const records: PersonalRecord[] = [
  { label: "5K", value: "24:31", date: "May 2026" },
  { label: "10K", value: "52:08", date: "Jun 2026" },
  { label: "Half", value: "1:58:44", date: "Apr 2026" },
  { label: "Longest", value: "24.6 km", date: "Mar 2026" },
];

const badges: Badge[] = [
  { slug: "first-run", name: "First Steps", description: "Complete your first club run", earnedAt: "2026-03-02" },
  { slug: "early-bird", name: "Before the Sun", description: "Five runs that start before 6 AM", earnedAt: "2026-04-18" },
  { slug: "streak-10", name: "Double Digits", description: "A 10-week running streak", earnedAt: "2026-06-20" },
  { slug: "night-owl", name: "Night Shift", description: "Ten runs after 9 PM", earnedAt: "2026-06-02" },
  { slug: "century", name: "Club 100", description: "100 km in a single month" },
  { slug: "pacer", name: "Metronome", description: "Pace a group at a club run" },
];

/** Mutable client-side state — the parts a backend would own. */
const state = {
  joinedClubIds: new Set<string>(["c1", "c5", "c2"]),
  rsvps: new Map<string, RsvpStatus>([["r1", "going"], ["r2", "going"]]),
  streakWeeks: 12,
  weekly: { goalKm: profile.weeklyGoalKm, doneKm: 18.4, runs: 3 } satisfies WeeklyProgress,
};

// ── Reads ────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile> {
  return profile;
}

export async function getClubs(): Promise<Club[]> {
  return clubs;
}

export async function getClub(id: string): Promise<Club | undefined> {
  return clubs.find((c) => c.id === id);
}

export async function getJoinedClubs(): Promise<Club[]> {
  return clubs.filter((c) => state.joinedClubIds.has(c.id));
}

export async function isJoined(clubId: string): Promise<boolean> {
  return state.joinedClubIds.has(clubId);
}

/** Upcoming runs, soonest first. Scoped to joined clubs unless `clubId` given. */
export async function getUpcomingRuns(clubId?: string): Promise<Run[]> {
  return runs
    .filter((r) => r.status === "scheduled")
    .filter((r) => (clubId ? r.clubId === clubId : state.joinedClubIds.has(r.clubId)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function getRun(id: string): Promise<Run | undefined> {
  return runs.find((r) => r.id === id);
}

export async function getRsvp(runId: string): Promise<RsvpStatus | null> {
  return state.rsvps.get(runId) ?? null;
}

export async function getAnnouncements(clubId: string): Promise<Announcement[]> {
  return announcements.filter((a) => a.clubId === clubId);
}

export async function getActivities(): Promise<Activity[]> {
  return activities;
}

export async function getRecords(): Promise<PersonalRecord[]> {
  return records;
}

export async function getBadges(): Promise<Badge[]> {
  return badges;
}

export async function getStreakWeeks(): Promise<number> {
  return state.streakWeeks;
}

export async function getWeeklyProgress(): Promise<WeeklyProgress> {
  return { ...state.weekly };
}

// ── Mutations ────────────────────────────────────────────────────

export async function setRsvp(runId: string, status: RsvpStatus | null): Promise<void> {
  if (!runs.some((r) => r.id === runId)) throw new Error(`Unknown run: ${runId}`);
  const previous = state.rsvps.get(runId) ?? null;
  const run = runs.find((r) => r.id === runId)!;
  if (previous === "going" && status !== "going") run.goingCount -= 1;
  if (previous !== "going" && status === "going") run.goingCount += 1;
  if (status === null) state.rsvps.delete(runId);
  else state.rsvps.set(runId, status);
}

export async function joinClub(clubId: string): Promise<void> {
  if (!clubs.some((c) => c.id === clubId)) throw new Error(`Unknown club: ${clubId}`);
  state.joinedClubIds.add(clubId);
}

export async function leaveClub(clubId: string): Promise<void> {
  state.joinedClubIds.delete(clubId);
}

/** Fold a finished recording into weekly progress + history. */
export async function saveActivity(input: { durationS: number; distanceM: number }): Promise<Activity> {
  if (input.durationS <= 0 || input.distanceM <= 0) throw new Error("Activity must have positive duration and distance");
  const activity: Activity = {
    id: `t${Date.now()}`,
    title: "Recorded run",
    startedAt: new Date().toISOString(),
    durationS: Math.round(input.durationS),
    distanceM: Math.round(input.distanceM),
    avgPaceS: Math.round(input.durationS / (input.distanceM / 1000)),
    elevGainM: 0,
  };
  activities.unshift(activity);
  state.weekly.doneKm = Math.round((state.weekly.doneKm + input.distanceM / 1000) * 10) / 10;
  state.weekly.runs += 1;
  return activity;
}
