# ClubRun — Design System (v0, reconstructed from `globals.css`)

Maintained by: UI/UX agent. Extend this file whenever a new token, pattern, or component convention is introduced — don't let the design language drift screen by screen.

## Brand

- Primary: Navy `--navy #1a2e4a` (dark `#111d2e`, light `#243d60`) — trust, premium, sport-serious
- Accent: Orange `--orange #f97316` (`--orange-dark #ea6c0a`) — energy, CTAs, active states
- Semantic: green `#16a34a` (going/success), red `#dc2626` (can't-go/error)
- Typeface: Inter / system-ui stack

## Theming

Class-based (`html.dark`), toggled explicitly via `ThemeProvider`/`DarkModeToggle` — not just `prefers-color-scheme`. All colour usage must go through the CSS custom properties in `globals.css`, never a hardcoded hex in a component.

## Motion

Page transitions use the native View Transitions API (`.nav-forward`, `.nav-back`, `.nav-tab` classes) — 150ms exit / 210ms enter, with a `prefers-reduced-motion` kill switch already in place. Any new navigation must reuse these classes rather than introducing a new animation approach.

## Components (existing — reuse, don't reinvent)

- `.btn-primary` / `.btn-secondary` / `.btn-outline-white` — 44px minimum height, enforced accessibility floor
- `.card`, `.stat-card` — surface + border tokens, radius 0.75–1rem
- `.badge`, `.toast` (+ `ToastProvider`), `.skeleton` (shimmer loading), `.rsvp-toggle`, `.floating-btn`
- `BottomNav` — fixed bottom tab bar, safe-area aware, active state in orange

## Rules for new screens

- Never introduce a new button/card/badge style without checking these tokens first
- Every new interactive element must hit the 44px tap-target floor
- Every new screen needs a designed empty state and loading state, not just a happy path
- Icons: `lucide-react` only, used consistently — no mixed icon sets

## Open gaps

- No documented type scale/spacing scale beyond what's used ad hoc in Tailwind classes — should be formalized
- No component library/Storybook — components live inline in page files today
