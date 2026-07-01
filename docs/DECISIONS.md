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
