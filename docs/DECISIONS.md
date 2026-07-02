# ClubRun — Decision Log

Maintained by: CEO agent. Append a dated entry for every material product, architecture, design, or pricing decision so future work stays consistent. Do not delete entries — supersede them with a new dated entry that references the old one.

## Format

`YYYY-MM-DD — Decision — Reasoning — Owner agent`

## Log

**Predates this log (reconstructed from shipped code, 2026-07-01)**

- Brand identity: navy (`#1a2e4a`) + orange (`#f97316`) — UI/UX. Reasoning: energetic-but-premium palette distinct from generic blue SaaS or bubbly fitness-app gradients.
- Pricing: free for individual members, A$19/month per club for club managers — Marketing/CEO. Reasoning: club managers are the paying buyer (B2B2C); free membership maximizes the network effect that makes a club's page worth paying for.
- Initial go-to-market wedge: Australian running clubs, positioned as a WhatsApp-group replacement — Marketing. Reasoning: a sharp, narrow UVP beats generic "Strava for clubs." **Not yet validated — flagged as a gap in `docs/ROADMAP.md`.**
- Accessibility floor: all interactive elements ≥44px tap target — Engineering/UI-UX, enforced via a dedicated cleanup pass.
- Navigation model: View Transitions API for forward/back/tab page transitions instead of a UI/animation library — Engineering. Reasoning: native-feeling motion without a heavy dependency.
- Theming: class-based dark mode (`html.dark`) driven by a `ThemeProvider`, not `prefers-color-scheme` alone — Engineering/UI-UX. Reasoning: users need an explicit toggle, not just OS-inherited theme.

**2026-07-01 — Stood up the four-agent operating structure (CEO, Engineering, UI/UX, Marketing) as Claude Code subagents, plus this roadmap/decision-log/PRD/monetization/design-system doc set — CEO.**
Reasoning: AGENTS.md calls for autonomous, collaborating agents with persistent project memory. Implementing them as reusable subagent definitions (rather than one-off prompting each session) makes the governance process durable across sessions instead of being re-derived from scratch every time.

**2026-07-01 — PRODUCT RESET (user directive): retire all prior code, build ClubRuns as a new product — CEO.**
The prior "ClubRun" club-admin SaaS (7-screen MVP on this branch's history) and the independent full-stack build (`claude/determined-wright-xf7b7h`: Supabase/Stripe/attendance) are both retired. History stays recoverable on those branches; nothing is force-deleted. Supersedes the pre-log entries above about A$19/month pricing, the Australian-wedge GTM, and the navy/orange brand — all retired with the old product.

**2026-07-01 — ClubRuns v1 strategy ratified (Phases 1–8, 11) — CEO, with Marketing/Engineering/UI-UX.**
- UVP: "never run alone" — group run as the atomic unit (`docs/STRATEGY.md`)
- Monetization: three-layer freemium (free / ClubRuns+ / Club Pro), free-first until retention data exists (`docs/MONETIZATION.md`)
- Architecture: typed repository layer over mocks, API-shaped so backend swap is one module; DB schema designed up front (`docs/ARCHITECTURE.md`)
- Design language: Volt on Carbon, dark-first (`docs/DESIGN_SYSTEM.md`)
- Phase 9 (wireframes) deliberately merged into Phase 10 for a 4-agent team — flows doc + design system carry that weight
- v1 scope: member-facing 7 screens (`docs/PRD.md`); organizer tools are M4, backend is M3 and gates beta

**2026-07-02 — Design system v2 "Cinder & Signal" ratified and shipped (founder brand directive) — CEO, designed by UI/UX, built by Engineering.**
- Three-accent semantic palette replaces the single-accent Volt on Carbon: `--pace` green = your progress (never a CTA), `--course` athletic blue = facts (routes, pace figures, weather, filters), `--signal` deep orange-red = the one action color (primary buttons, Record, live state). Fixes v1's overloaded green before adding hues could drift rainbow.
- "Night Stage": GoalRing, BarChart, RouteMap, live Record, and the achievement overlay render on a fixed dark stage in both themes (Apple Fitness/NRC precedent) — solves light-mode contrast for the lime fill honestly and keeps live metrics sun-glanceable.
- De-pilled radius scale 10/12/14/16px; only true circles stay round.
- Maps: custom seeded-SVG RouteMap (grid + contour texture, animated route draw, shape-distinct start/finish markers) instead of a tile provider — zero API keys/offline-safe in v1; real tiles revisit at M3.
- Palette validated with the dataviz six-checks validator: CVD separation and surface contrast pass; the categorical lightness-band check was judged not applicable because the three accents are semantic roles never plotted as one series.
- Achievement overlay fires only on badge/PR/streak-milestone unlocks, never routine finishes; v1's reachable trigger is the "On the Board" first-recorded-run badge.
- Deferred from the directive (logged in ROADMAP M1.5): club discussions, photo gallery, calendar view, RunCard map previews.

**2026-07-02 — Production promotion + auth surface (founder directive) — CEO/Engineering.**
- Production architecture for v1: static-export PWA on GitHub Pages, deployed automatically from main only (`.github/workflows/deploy.yml`). Chosen because v1 is fully client-side over mocks and the repo has no hosting credentials — a real URL today beats a blocked Vercel setup; M3's backend forces the move to a server runtime anyway.
- Auth ships as screens + a Supabase-shaped seam (`src/lib/auth.ts`: signInWithPassword/signUp/signInWithOAuth-style/reset/signOut over localStorage). Founder will configure Supabase, Stripe, and email at M3; the contract means those land module-by-module with zero screen changes.
- Feature/monetization advisory recorded in `docs/FEATURE_BACKLOG.md` (three tiers, revenue-line mapping, explicit rejections).
