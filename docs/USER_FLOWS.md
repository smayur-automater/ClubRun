# ClubRuns — User Flows (Phase 8)

Owner: UI/UX agent. The IA is five surfaces on a bottom tab bar with Record as the elevated center action — the app's "camera button."

## Information architecture

```
Onboarding (/onboarding, first-run only)
└── Tab bar
    ├── Home     /            today's runs, streak, weekly goal
    ├── Explore  /explore     find clubs
    ├── Record   /record      elevated center button — live run
    ├── Clubs    /clubs       your clubs → /clubs/[id]
    └── Profile  /profile     stats, badges, history
Run detail /runs/[id] — reached from Home, Club detail, Explore
```

## Flow 1 — First run (activation)

Onboarding: pace (relatable labels — "chatty pace" not "6:30/km"), vibe (social/training/trail/early), weekly goal → land on Explore pre-filtered to matching clubs → club detail → Join → next run's RSVP is one tap away. **Every step removes a reason to bounce; the goal is RSVP'd-to-first-run within 3 minutes of install.**

## Flow 2 — The weekly loop (retention)

Home shows the next run from your clubs → RSVP (going/out, pick pace group) → run day: Record from the run card → live screen (timer/distance/pace/splits) → finish → summary feeds streak + weekly ring + badges → Home reflects progress. The streak and the crew seeing your RSVP are the two retention hooks; both must be visible on Home without scrolling.

## Flow 3 — Join a club (growth)

Explore search/filter → club card (pace range, next run, member count — enough to decide without tapping) → detail (identity, upcoming runs, pace groups, announcements) → Join → club appears in Clubs tab and its runs flow into Home.

## Flow 4 — Record a run (core utility)

Record tab → pre-run state (linked run banner if RSVP'd today) → Start → live metrics with pause/resume (44px+ controls, glanceable while moving: max type sizes on the fixed-dark Night Stage) → Finish → summary (distance, time, pace, splits, streak delta; achievement overlay only if something unlocked) → Done → Home.

## State rules

- Every list screen has a designed empty state that routes forward (no clubs → Explore; no runs → browse clubs), never a dead end
- Record survives navigation away and back (running state persists in the tracker singleton)
- RSVP is optimistic UI — instant toggle, reconciles later; never make a runner wait on a spinner for a yes/no
