# ClubRuns — Living Roadmap

Maintained by: CEO agent. This file plus `docs/DECISIONS.md` is the project memory — read both before product decisions.

## Product

**ClubRuns — never run alone.** Mobile-first social running platform built around the group run as the atomic unit. Full vision and constraints: `AGENTS.md`. Product reset 2026-07-01: the prior "ClubRun" club-admin SaaS (and the parked full-stack branch `claude/determined-wright-xf7b7h`) are retired; history preserved on their branches.

## Phase status

| # | Phase | Status | Artifact |
|---|---|---|---|
| 1 | Market research | Done (v1) | `docs/STRATEGY.md` |
| 2 | Competitor analysis | Done (v1) | `docs/STRATEGY.md` |
| 3 | Unique value proposition | Done (v1) | `docs/STRATEGY.md` |
| 4 | Monetization | Done (v1) | `docs/MONETIZATION.md` — free-first, gate after retention data |
| 5 | PRD | Done (v1) | `docs/PRD.md` |
| 6 | Technical architecture | Done (v1) | `docs/ARCHITECTURE.md` |
| 7 | Database design | Designed | Schema in `docs/ARCHITECTURE.md`; implemented at backend milestone |
| 8 | User flows | Done (v1) | `docs/USER_FLOWS.md` |
| 9 | Wireframes | Merged into 10 | Deliberate: flows doc + design system make separate wireframes ceremony for a 4-agent team |
| 10 | High-fidelity UI | Done (v1.5) | The build itself, elevated by the brand directive pass |
| 11 | Design system | **Done (v2)** | `docs/DESIGN_SYSTEM.md` (Cinder & Signal — supersedes Volt on Carbon) |
| 12 | Engineering implementation | **v1.5 shipped** | 7 screens over typed mock repository + RouteMap, BarChart, leaderboard, timeline, achievement overlay |
| 13 | Testing | Next | Unit tests for `format`/tracker/derivations, then Playwright smoke |
| 14 | Beta launch | Blocked on backend | Gate: real auth + DB + instrumentation (see ARCHITECTURE v2) |
| 15 | Marketing launch | Not started | |
| 16 | Growth | Not started | |

## Milestones

- **M1 — v1 member MVP**: onboarding, home, explore, club detail, run detail + RSVP, record, profile — mocked data behind API-shaped repository. ✅
- **M1.5 — Brand elevation** (founder directive): Cinder & Signal design system (three-accent semantic palette, Night Stage), custom RouteMap with route-draw animation, weekly BarChart, club leaderboards + cover identities, activity timeline, weather, friends' activity, achievement-celebration overlay. ✅ Deferred from the directive to M4+: club discussions, photo gallery, event calendar view; compact RouteMap previews on RunCards (perf/clutter call).
- **M1.6 — Production + auth surface**: static-export PWA deployed to GitHub Pages from main on every merge; sign-in/sign-up/reset screens live behind a Supabase-shaped seam (`src/lib/auth.ts`) — founder configures Supabase, Stripe, and email services at M3 and the swap is per-module, not per-screen. ✅
- **M2 — Quality**: unit tests on pure logic, Playwright smoke, CI. 
- **M3 — Backend**: Supabase auth + Postgres schema from ARCHITECTURE.md, swap `lib/data.ts` mocks for real queries and `lib/auth.ts` mock for Supabase Auth, Stripe billing for ClubRuns+/Club Pro, transactional email (run reminders, weekly summaries, password resets), instrumentation (activation/retention funnels). Tracking-depth features begin per `docs/FEATURE_BACKLOG.md` Tier 1.
- **M4 — Organizer tools** (Club Pro surface): create club/run, recurring runs, attendance, QR check-in, announcements+push.
- **M5 — Beta** (Phase 14): 3–5 real clubs, measure the PRD metrics before any paywall.

## Standing CEO reviews

Every milestone: engineering deliverable vs ARCHITECTURE.md standards, UI vs DESIGN_SYSTEM.md bar, and the four marketing questions (love/retention/revenue/virality) answered in the PR description.
