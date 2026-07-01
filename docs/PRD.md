# ClubRuns — PRD v1 (Phase 5)

Owner: CEO agent. Scope for the v1 member-facing MVP; supersedes the retired club-admin product.

## Problem

Runners who want company coordinate in group chats and track in separate solo apps. Beginners can't find a crew at their pace; organizers drown in manual logistics. No product treats the *group run* as its atomic unit.

## Users

1. **Member** (primary v1): joins clubs, RSVPs, runs, tracks, builds streaks.
2. **Organizer** (v1.1): creates clubs/runs, manages pace groups, attendance, announcements.
3. Later: corporates, universities, charities, race organizers, coaches (see AGENTS.md).

## v1 scope (this build — frontend with typed mock data layer shaped like the future API)

| Feature | What ships |
|---|---|
| Onboarding | 3-step: pace/vibe/goals → recommended clubs. Must feel premium; first 60 seconds decide retention |
| Home | Today's runs from joined clubs, streak, weekly-km goal ring, next run card |
| Explore | Search/browse clubs by vibe, pace range, meet time; club cards with live member/next-run info |
| Club detail | Cover identity, stats, upcoming runs, pace groups, announcements, join |
| Run detail | Meeting point, route, pace groups w/ pacer, attendee avatars, RSVP |
| Record | Live run screen: timer, distance, pace, splits; pause/resume/finish; works offline by design |
| Profile | Stats (distance/runs/PRs), streak, badges, goals, run history |

## Explicitly out of v1

Real backend/auth (schema is designed — `docs/ARCHITECTURE.md` — but v1 is mocked), payments, GPS/sensor integration (Record uses a simulated tracker behind a `Tracker` interface so real GPS is a drop-in), club chat/DMs, wearables, AI coach.

## Success metrics (instrument at beta)

- Activation: signup → first RSVP ≥ 40%; → first attended run ≥ 25%
- W4 retention ≥ 35% for members with ≥1 attended run
- ≥ 60% of runs recorded through ClubRuns among attendees
- Invite → signup conversion ≥ 20%

## Why users love it / retention / revenue / virality (per-feature answers)

- **Streaks + crew visibility**: your absence is *seen* — social accountability beats push notifications (retention).
- **RSVP as the loop**: every run is a shareable invite (virality); RSVPs are club-value proof for Club Pro (revenue).
- **Beginner-first pace groups**: the underserved cohort becomes the acquisition wedge (growth).
