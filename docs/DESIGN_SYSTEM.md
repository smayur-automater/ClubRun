# ClubRuns — Design System (Phase 11)

Owner: UI/UX agent. Extend this file whenever a token or pattern is added — one design language across the whole product, no per-screen styles.

## Identity: **Volt on Carbon**

Dark-first — running happens at 5:30am and 9pm; the app should feel like the night run, and dark is the premium register (Nike Run Club, Spotify). Light mode fully supported, warm paper-white rather than clinical.

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#0B0C0F` carbon | `#FAFAF7` paper |
| `--surface` | `#141519` | `#FFFFFF` |
| `--surface-2` | `#1D1F25` | `#F1F1EC` |
| `--border` | `#26282F` | `#E5E5DE` |
| `--text` | `#F4F4F2` | `#151519` |
| `--muted` | `#8B8E98` | `#6D6F78` |
| `--volt` | `#C8FF3D` — the accent | `#9BD800` (darkened for contrast on paper) |
| `--volt-ink` | `#101203` (text on volt) | same |
| success `--up` | `#4ADE80` / danger `--down` `#F87171` | `#15803D` / `#DC2626` |

Volt is rationed: streak, active states, primary CTA, live-run metrics. If everything is volt, nothing is.

## Typography

Inter via `next/font`. The signature is **big numerals**: stats set in `font-black`, tight tracking (`-0.03em`), tabular-nums for anything that ticks. Hierarchy: numerals > section labels (11px uppercase, wide tracking, muted) > body. Labels-in-caps + huge numbers is the athletic register; no decorative fonts.

## Components (`globals.css`)

- `.btn-volt` (primary, volt bg, carbon text), `.btn-ghost` (bordered) — both ≥48px; all tap targets ≥44px, non-negotiable
- `.card` — surface + 1px border, radius 20px; borders not shadows in dark mode (shadows die on carbon)
- `.chip` — filters/pace tags; `.chip.active` inverts to volt
- `.stat` — the numeral block: value + 11px uppercase label
- `.ring` — SVG progress ring for the weekly goal (volt stroke on `--surface-2` track)
- `.tabbar` + elevated center Record button (56px volt circle, overflows the bar — the one intentionally loud element)
- `.streak-pill` — flame + count, volt tint
- Skeleton shimmer for loading; every list has a designed empty state (icon + line + forward CTA)

## Motion

View Transitions API (`.nav-forward`/`.nav-back`/`.nav-tab`, 150ms out / 210ms in) — carried over from the prior build deliberately: native-feeling, zero dependency. Micro-interactions: buttons scale 0.97 on press; the goal ring animates on mount (600ms ease-out); streak pulses once when it increments; live-run seconds tick with tabular-nums so nothing jitters. Full `prefers-reduced-motion` kill switch.

## Iconography

`lucide-react` exclusively, 1.75px stroke feel, functional not decorative. Never emoji-as-icon in product UI; no AI-cliché sparkles.

## Voice

Confident, brief, athlete-to-athlete: "Lace up", "You showed up", "Streak alive". Never corporate ("Your request has been processed") and never childish ("Yay! 🎉").
