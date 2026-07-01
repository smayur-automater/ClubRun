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
Immediate next call for the CEO agent: sequence the Phase 1–4 backfill before approving new feature scope.
