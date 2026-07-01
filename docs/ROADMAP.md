# ClubRun — Living Roadmap

Maintained by: CEO agent. Update phase/milestone status here whenever a deliverable is approved. This file, together with `docs/DECISIONS.md`, is ClubRun's project memory — read both before making product decisions.

## Product

ClubRun — a mobile-first social platform connecting runners (morning/evening/night/weekend/marathon/casual/beginner) with running clubs, corporate wellness groups, universities, schools, charities, race organizers, coaches, and gyms.

## Phase status

Per AGENTS.md's required workflow (Phase 1 → Phase 16). Status reflects reality, including where engineering shipped ahead of process — flagged as a gap below.

| # | Phase | Status | Notes |
|---|---|---|---|
| 1 | Market research | Not started | Backfill needed |
| 2 | Competitor analysis | Not started | Backfill needed |
| 3 | Unique value proposition | Informal only | Landing page stakes UVP as "your running club deserves better than a WhatsApp group" — never formalized |
| 4 | Monetization | Partial | Shipped model: free members / A$19-month club subscription — see `docs/MONETIZATION.md`; full opportunity menu unevaluated |
| 5 | PRD | Backfilled | See `docs/PRD.md` — reconstructed from the shipped MVP, needs CEO validation |
| 6 | Technical architecture | Partial | Next.js App Router PWA; no backend, auth, or DB yet — all data is mocked client-side |
| 7 | Database design | Not started | No schema exists |
| 8 | User flows | Implicit | Flows exist as shipped screens but were never diagrammed first |
| 9 | Wireframes | Skipped | Went straight to high-fidelity |
| 10 | High-fidelity UI | Done (v1) | 7 screens shipped — see MVP surface below |
| 11 | Design system | Backfilled | See `docs/DESIGN_SYSTEM.md` — reconstructed from `globals.css` |
| 12 | Engineering implementation | In progress | MVP shipped: landing, dashboard, member, members, profile, rsvp, runs/create, invite |
| 13 | Testing | Not started | No test suite exists |
| 14 | Beta launch | Not started | |
| 15 | Marketing launch | Not started | |
| 16 | Growth | Not started | |

## Gap note (CEO)

Phases 1–3 and 5–9 were never produced as artifacts before Phase 12 implementation began — the MVP was built first and the strategy is being reconstructed after the fact. This is process debt: the CEO agent should not approve significant net-new feature scope until Phases 1–4 get a real pass, since the product is currently built on unvalidated assumptions (Australian running clubs, A$19/month, WhatsApp-replacement UVP).

## Current MVP surface

- Landing page (`/`) — marketing site, pricing, hero
- Dashboard (`/dashboard`)
- Member profile view (`/member`)
- Members list (`/members`)
- User profile (`/profile`)
- RSVP flow (`/rsvp`)
- Run creation (`/runs/create`)
- Invite flow (`/invite`)
- Shared: bottom nav, dark/light theme, toasts, skeleton loaders, view-transition page navigation, PWA manifest

## Next milestone candidates (for CEO to sequence)

- Backfill Phases 1–4 before adding more surface area
- Real backend: auth, database schema, API layer (Phase 6–7 debt)
- Test suite (Phase 13 debt — currently zero coverage)
- Club Manager tooling (event creation, attendance, QR check-in) — in AGENTS.md's core feature list, not yet built
