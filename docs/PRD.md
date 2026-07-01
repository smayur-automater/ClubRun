# ClubRun — Product Requirements Document (v0, reconstructed)

Status: Backfilled from the shipped MVP (Phase 12 happened before Phase 5). Treat this as a draft baseline for the CEO to validate, not a finished PRD — real market research and competitor analysis (Phases 1–2) haven't been done yet.

## Problem

Running clubs coordinate over ad-hoc channels (WhatsApp/Facebook groups, spreadsheets) that don't handle RSVPs, pace groups, attendance, or member management well once a club grows past casual size.

## Target users

Individual runners (all levels and times of day), club managers/organizers, and — per AGENTS.md's long-term scope — corporate wellness groups, universities, schools, charities, race organizers, coaches, and gyms. The MVP targets the first two segments; the rest are unvalidated expansion segments.

## v0 scope (shipped)

- Landing/marketing page with pricing
- Club dashboard
- Member directory and individual member profile
- Personal profile
- Run RSVP flow
- Run creation flow
- Invite flow
- Dark/light mode, PWA manifest, toasts, skeleton loading states

## Explicitly out of scope for v0

- Real backend/auth/database (everything is client-side/mocked today)
- GPS run tracking, wearable integrations, AI coach — listed under AGENTS.md's "Future Features," not MVP
- Payments/billing (pricing is displayed, not processed)
- Club Manager Pro tooling: QR check-in, live tracking, weather alerts, pacer assignment — listed in AGENTS.md's core features, not yet built

## Success signals to define (owner: CEO + Marketing)

- Activation: % of invited members who complete a profile and RSVP to one run
- Retention: club manager week-4 return rate
- Monetization: trial → paid club conversion rate

None of these are instrumented yet — no analytics exist in the codebase.

## Open questions for Phase 1–2 backfill

- Is Australia the right initial wedge, or a placeholder from early copy?
- Who are the real competitors (Strava Clubs, Meetup, WhatsApp, run-specific club tools)? Not yet analyzed.
