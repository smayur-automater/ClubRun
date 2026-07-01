# ClubRuns

**Never run alone.** A mobile-first social running platform built around the group run as the atomic unit — find your crew, RSVP, show up, track it together.

## The operating model

This repo is run by a four-agent AI company defined in `.claude/agents/`:

| Agent | Role |
|---|---|
| `ceo` | Product governor — roadmap, milestone sign-off, decision log |
| `engineering` | Production-quality implementation |
| `ui-ux` | Product design to an App-Store-Top-Charts bar |
| `marketing` | Monetization, growth, retention, virality |

Project memory lives in `docs/`: `ROADMAP.md` (phase status), `DECISIONS.md` (append-only decision log), `STRATEGY.md`, `PRD.md`, `ARCHITECTURE.md`, `USER_FLOWS.md`, `DESIGN_SYSTEM.md`, `MONETIZATION.md`. Read the roadmap and decision log before changing product direction.

## Stack

Next.js (App Router) + TypeScript + Tailwind 4, shipped as a mobile-first PWA. v1 runs on a typed mock repository (`src/lib/data.ts`) shaped like the future API — the backend swap (M3) touches one module, no screens. Run tracking sits behind a `Tracker` interface (`src/lib/tracker.ts`); real GPS is a drop-in.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run lint
npm run build
```

## v1 surface

Onboarding → Explore (find clubs) → Club detail → Run detail + RSVP → Record (live tracking) → Home (streak, weekly goal ring, upcoming runs) → Profile (stats, PRs, badges).
