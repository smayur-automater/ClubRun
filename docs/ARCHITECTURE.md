# ClubRuns — Technical Architecture & Data Model (Phases 6–7)

Owner: Engineering agent, approved by CEO.

## v1 architecture

Next.js (App Router) mobile-first PWA. All product state flows through a typed domain layer:

```
src/lib/types.ts   — domain model (mirrors the DB schema below)
src/lib/data.ts    — repository functions (async signatures, mock-backed today)
src/lib/format.ts  — pure formatting (pace, distance, duration)
src/components/    — shared UI
src/app/           — routes (thin; screens compose lib + components)
```

**Why:** every screen consumes `lib/data.ts` through async repository functions with API-shaped return types. Swapping mocks for a real backend (Supabase/Postgres + route handlers) changes one module, not every screen. This is the API-first requirement made concrete without building a backend the product hasn't earned yet.

**Record screen:** tracking runs behind a `Tracker` interface (start/pause/resume/stop, tick callback). v1 ships a simulated implementation; real geolocation+sensors is a drop-in replacement. Recording state lives client-side so runs survive connectivity loss (offline-first requirement).

## Target production architecture (v2, when backend lands)

- Postgres (Supabase) + RLS for role-based permissions (member/organizer/admin per club)
- Auth: Supabase Auth (email + Apple/Google) — scales, no password infra to own
- Route handlers as the API layer; event-driven jobs (run reminders, streak checks, weekly summaries) via queue/cron
- Push via web-push/FCM; analytics + crash reporting from day one of beta
- Background GPS via native wrapper (Capacitor) when app-store distribution lands

## Database schema (designed now, implemented with backend)

```sql
users          (id, email, created_at)
profiles       (user_id PK→users, handle UNIQUE, name, avatar_url, pace_sec_per_km, vibe, home_area)
clubs          (id, slug UNIQUE, name, tagline, area, vibe, pace_min, pace_max, cover, created_by→users)
memberships    (club_id→clubs, user_id→users, role CHECK(member|organizer|admin), joined_at, PK(club_id,user_id))
runs           (id, club_id→clubs, title, starts_at, meet_point, lat, lng, distance_km, route_map_url,
                recurrence, status CHECK(scheduled|live|done|cancelled), created_by→users)
pace_groups    (id, run_id→runs, label, pace_sec_per_km, pacer_user_id→users NULL)
rsvps          (run_id→runs, user_id→users, status CHECK(going|out|waitlist), pace_group_id NULL,
                checked_in_at NULL, PK(run_id,user_id))
activities     (id, user_id→users, run_id→runs NULL, started_at, duration_s, distance_m,
                avg_pace_s, elev_gain_m, avg_hr NULL, calories NULL, cadence NULL)
splits         (activity_id→activities, km_index, duration_s, PK(activity_id,km_index))
goals          (id, user_id→users, period CHECK(week|month|year), metric CHECK(distance|runs), target, starts_on)
badges         (id, slug UNIQUE, name, description, tier)
user_badges    (user_id→users, badge_id→badges, earned_at, PK(user_id,badge_id))
announcements  (id, club_id→clubs, author_id→users, body, pinned, created_at)
```

Indexes: `runs(club_id, starts_at)`, `rsvps(user_id)`, `activities(user_id, started_at DESC)`, `memberships(user_id)`. Streaks are derived from `activities` (materialized weekly), not stored counters — counters drift, derivations don't.

## Security & validation posture

- Validation at every boundary — repository functions validate inputs even against mocks, so the discipline exists before the backend does
- No client-trusted role checks once backend lands: RLS is the enforcement point, UI checks are UX only
- Location data is privacy-sensitive: precise home location never stored, only `home_area` labels; live tracking share is opt-in per run

## Testing strategy

Pure logic (`format.ts`, streak/PR derivations, tracker state machine) is unit-testable with no framework mocking; repository layer gets contract tests when the real backend lands. UI: Playwright smoke over the 7 core screens.

## Scale notes

At 10k users mocks obviously don't hold — backend milestone is the gate to beta (Phase 14). At 10M: activities/splits are the hot tables → partition by month; feed/leaderboards move to precomputed materialized views; recording stays client-buffered with batched upload.
