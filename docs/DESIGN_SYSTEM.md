# ClubRuns — Design System (Phase 12)

Owner: UI/UX agent. This is a spec to build from, not an essay — every token, component and motion value below is final and buildable. IA, routing, and the View Transitions mechanism are unchanged from Phase 11; this is a **visual-language elevation**, not a re-architecture. Extend this file whenever a token or pattern is added — one design language across the whole product, no per-screen styles.

## 1. Identity: **Cinder & Signal**

ClubRuns runs on a dark cinder-track neutral base (charcoal, white, black) with a disciplined three-accent system, each with exactly one job: **Pace** (green) is *your progress* — goal ring, streak, a completed run. **Course** (blue) is *the facts* — routes, pace figures, weather, data you didn't earn, you're just looking at. **Signal** (deep orange-red) is *do this now* — the one hue for primary actions, the Record button, a live recording, and errors. Everything else is neutral. This is the fix v1 needed: Volt-on-Carbon was good but overloaded one green for both "primary action" and "your progress," which is why it risked drifting toward decoration. Cinder & Signal gives every color a single, memorizable role — the same discipline Apple Fitness (red/green/blue rings) and WHOOP (black canvas, sparing accent) use to stay premium instead of rainbow. Radii are tightened and de-pilled everywhere (buttons and chips are rounded rectangles, not capsules) — pill buttons are the single fastest way to read as a generic template, and the founder's guardrail against them is enforced structurally below, not just this once.

**Night Stage** is the other new pattern: every data-visualization surface — GoalRing, BarChart, RouteMap, the live Record screen, the achievement overlay — renders on a fixed dark stage *regardless of the app's light/dark theme*, exactly like Apple Fitness's rings and Nike Run Club's active-run screen. Why: (a) it solves light-mode contrast for a lime-green fill honestly rather than washing the color out, (b) live metrics must stay glanceable in direct sun or pitch dark, and (c) it gives ClubRuns one consistent, recognizably premium "hero" register for its best moments instead of re-deriving contrast per screen.

## 2. Tokens — dark + light, with contrast

Radius scale (new, replaces v1's uniform pill/20px): **10px chips → 12px inputs → 14px buttons → 16px cards.** Only true circles (avatars, dots, the Record disc, ring/route markers) are fully round. No other pill shapes anywhere in the product.

### Neutrals

| Token | Dark | Light | Note |
|---|---|---|---|
| `--bg` | `#0A0B0E` | `#FAFAF9` | page background |
| `--surface` | `#15171C` | `#FFFFFF` | card fill |
| `--surface-2` | `#1D2028` | `#EEF0F2` | nested fill, chip default, skeleton base, ring track |
| `--border` | `#272B34` | `#E1E4E9` | 1px hairlines only, decorative |
| `--text` | `#F5F6F8` | `#14161A` | >15:1 both themes |
| `--muted` | `#9198A6` | `#6A7180` | 6.79:1 on `--bg` (dark) / 4.68:1 on `--bg` (light) — both pass AA body text |

### Accents — exact roles, no exceptions

| Token | Dark | Light | Contrast | Role |
|---|---|---|---|---|
| `--pace` | `#C8FF3D` (unchanged from v1 volt — kept, not evolved, for brand equity) | `#4B7A00` (text/icon use) | dark: >10:1 on `--bg`; light: 4.91:1 on `--bg` | Progress, positive delta, streak, "confirmed/going," completed-run result. **Never** a CTA. |
| `--pace-ink` | `#0F1300` | — | text-on-pace-fill (buttons/chips using pace as a solid bg) | |
| `--course` | `#4C8EFF` | `#1D5FD1` | dark: 5.65:1 on `--surface`; light: 5.56:1 on `--bg` | Routes, map lines, pace figures, filters/selection, weather, any *fact* about a run or club. |
| `--signal` | `#D53F1E` (same hex both themes) | `#D53F1E` | white text on fill: 4.61:1 (both) | The **one** primary-action color: primary buttons, Record disc, live-recording indicator, destructive actions, error text. |
| `--signal-2` | `#FF6A45` | `#B8320F` | dark: 6.93:1 on `--bg` (small text/icon use); light: 5.65:1 on `--bg` | Use only where `--signal` base itself would be text (not a button fill) and needs extra contrast at small sizes. |

`--up`/`--down` from v1 are retired: a good week is `--pace`, a quiet week is plain `--muted` — a lighter training week is not a danger state and must never borrow `--signal`.

### Night Stage — fixed tokens, do not theme-swap

| Token | Value |
|---|---|
| `--stage-bg` | `#0A0B0E` |
| `--stage-surface` | `#15171C` |
| `--stage-surface-2` | `#1D2028` |
| `--stage-border` | `#272B34` |
| `--stage-text` | `#F5F6F8` |
| `--stage-muted` | `#9198A6` |
| `--stage-pace` | `#C8FF3D` |
| `--stage-course` | `#4C8EFF` |
| `--stage-signal` | `#FF6A45` (brighter than base `--signal` — reads better as a live/text accent on true black) |

## 3. Type scale (rem) + numeral treatment

Inter, unchanged foundation. Root 16px.

| Name | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| Display | `clamp(4.5rem, 24vw, 7rem)` | 900 | -0.04em | Record live distance only |
| H1 | 1.75rem (28px) | 900 | -0.02em | Screen title, profile name |
| Stat-lg | 1.5rem (24px) | 900 | -0.03em | Goal ring center, run-summary stats |
| Stat-md | 1.25rem (20px) | 800 | -0.02em | Card numerals (pace, distance, leaderboard) |
| Stat-sm | 1rem (16px) | 800 | -0.01em | Inline pills, streak count |
| Body | 0.9375rem (15px) | 500–600 | -0.011em | Copy, descriptions |
| Body-sm | 0.8125rem (13px) | 600 | normal | Meta lines |
| Label | 0.6875rem (11px) | 700 | 0.08em, upper | Section eyebrows (unchanged from v1 — validated) |
| Micro | 0.625rem (10px) | 800 | 0.04em | Badge captions, chart axis letters |

**Numeral rule (expanded from v1):** every `.stat-value` — not just ticking timers — is `font-variant-numeric: tabular-nums`, always. This matters more now: leaderboard ranks, weekly-chart labels, and split times must align in a column even though they don't animate.

## 4. Component specs

**Buttons** — `.btn-primary` (was `.btn-volt`): bg `--signal`, text white, radius 14px, min-height 50px, padding 0.75rem 1.5rem, weight 800. Hover: brightness +6% dark / darken 4% light. Press: `scale(0.97)`, 90ms. Disabled: opacity .38. `.btn-secondary` (was `.btn-ghost`): bordered, radius 14px, unchanged behavior. `.btn-tertiary` (new): text-only, color `--course`, for low-emphasis navigational actions ("See all," "See full leaderboard") — blue because it's a wayfinding fact, not a call to act.

**Cards** — `.card`: `--surface` + 1px `--border`, radius 16px (down from 20px — tighter geometry reads engineered, not bubbly). `.card--stage`: same shape, Night Stage tokens, used by GoalRing/BarChart/RouteMap hosts. Hover (pointer devices only): `translateY(-1px)`, border lightens — border-based elevation only, no shadows, no glassmorphism (the tab bar's blur remains the *one* sanctioned blur surface in the product — do not add blur elsewhere).

**Chips** — radius 10px (was pill). Filter/selection chips (Explore vibe filter, onboarding pace/vibe pickers): active state = `--course` border + tinted text/bg — choosing a filter is picking a fact, not earning a status. Pace-group chips (Run detail): active state = `--pace` tint — this *is* a personal commitment, correctly stays green. RSVP: unconfirmed state is `.btn-primary` (signal, "I'm in"); once tapped it flips to a `--pace`-tinted confirmed pill ("Going ✓") — red asks, green confirms, a single consistent narrative reused everywhere an action becomes a status (Join club, RSVP, pace-group pick).

**Stat blocks** — `.stat-value` + `.stat-label` unchanged mechanically, now always tabular-nums (§3). Delta indicators use `TrendingUp`/`TrendingDown` (lucide): up = `--pace`, down = `--muted`, never `--signal`.

**GoalRing** — lives on `.card--stage`. Track `--stage-surface-2`, fill `--stage-pace`, stroke-linecap round, unchanged geometry. Mount animation unchanged (600ms `--ease-glide`, dashoffset). New: at progress ≥ 1, fill completes then does one opacity pulse (1→0.5→1, 500ms) — a quiet acknowledgment; the loud celebration belongs to the Achievement overlay, not the ring.

**TabBar** — structure unchanged (5 tabs, elevated center Record disc — validated IA, don't touch). Record disc recolors `--volt`→`--signal`: it is literally the app's one "important action," so it gets the one signal color, full stop. Active tab: icon/label darkens to `--text` (unchanged) *plus* a new 3px `--course` dot beneath the icon — a redundant, non-color-dependent cue for current location (helps color-blind users and one-handed glancing alike). Bar chrome (blur, border, safe-area) unchanged.

**RouteMap** (new, signature element) — a custom SVG cartographic surface, no tile provider. `.card--stage`, 16:10 (run detail) or 4:3 compact (RunCard preview).
- Base: `--stage-bg` fill + a faint 24px technical grid (`--stage-border` @ 40%) and 2–3 soft, seeded contour blobs (`--stage-border` @ 15%, blurred) — seeded by `run.id` so every route reads distinct, not templated.
- Route polyline: `--stage-course`, 3.5px stroke, round cap/join.
- Start marker: 8px filled circle, `--stage-course`, 2px `--stage-bg` halo.
- Meet-point marker: 32px circular badge, `--stage-surface` fill, 1.5px `--stage-course` border, `MapPin` icon 20px inside.
- Finish marker: 12px diamond (square rotated 45°), filled `--stage-signal` — the one warm accent on the whole map, drawing the eye to the payoff, and a shape (not just color) difference from the start circle for color-blind legibility.
- Distance/elevation chip, bottom-left: `--stage-surface` pill, "{km} km · +{m} m".
- **Route-draw animation**: on first mount only, stroke-dasharray/dashoffset draws the path start→finish over 900ms `--ease-glide`; finish marker pops (`scale 0.8→1.05→1`, 220ms, `--ease-spring`) exactly as the draw completes. This is the flagship "route drawing" motion the brand needs.
- Empty state: runs without a posted route render the base texture only + centered `--stage-muted` label "Route posted closer to run day" — never a blank void.
- Reduced motion: path renders fully drawn, markers appear with no pop.

**BarChart** (new, weekly km) — `.card--stage`. 7 rounded-top bars (radius 4px top only — not pills), 8px gap. Fill `--stage-pace` for a logged day, `--stage-surface-2` for none, 6px floor height so empty days still show a lane. Today gets a 1.5px `--stage-course` outline (independent bit from "has data" — two facts, two encodings, no ambiguity). Axis: single-letter day labels, Micro, `--stage-muted`. Animate on scroll-into-view (not mount — Profile is a long scroll, don't burn the reveal off-screen): bars grow 0→value, staggered 40ms, 420ms `--ease-glide` each, once per mount. Tap a bar for an exact-km popover (hit-area padded to 44px even though the visual bar is thinner).

**Leaderboard row** (new, club detail) — regular themed `.card` (it's a ranked list, not a visualization). Rank numeral fixed-width ~28px, Stat-md, tabular-nums; only rank #1 gets `--course` color (the week's pace-setter), ranks 2+ stay neutral weight/size hierarchy — deliberately not a medal-color ladder, to avoid a 4th accent hue. Avatar (existing `.avatar`) + name + optional role `.tag` + right-aligned weekly stat. Current-user row: 1.5px `--course` border on the card (their standing is a fact about them, not a status they earned this second) — no full-bg highlight, keeps the list scannable.

**Activity timeline** (new, profile) — replaces v1's flat "Recent runs" list. Left rail, 8px nodes on a 1.5px `--border` line. Routine-run node: `--pace`. PR/badge node: `--signal` + a small icon chip (`Trophy`/`Medal`) instead of a plain dot — rare, deliberately loud against a mostly-green rail, so standout days visually pop out of the routine. Row content (date · title · distance) reuses the existing recent-runs row styling.

**Badge tiles** — 3-col grid, radius 16px (was implicit card radius). Unlocked: icon in `--pace`-tinted circle (unchanged, correct — earned status). Locked: `Lock`, muted, 0.45 opacity (unchanged). New: badges earned in the last 7 days get a 6px `--signal` dot, top-right corner — same "notable moment" language as the timeline.

**Weather chip** (new, Home) — inline, no colored background (Home must stay uncluttered). Lucide condition icon (`Sun`/`Cloud`/`CloudRain`/`Snowflake`) 18px in `--course`, temp in Stat-sm, one-line condition in `--muted`. Blue because it's a fact, not a feeling.

**Achievement-celebration overlay** (new) — full-screen, always rendered as a Night Stage regardless of app theme (this is the single most "hero" moment in the product, and it deserves the same fixed drama as the ring/route). Icon (56px) inside a 2px `--stage-signal` **ring**, not a filled disc — a filled full-bleed red circle reads as an alert, not a win; a ring reads as a spotlight. Headline Stat-lg `--stage-text`, one line `--stage-muted`, single `.btn-primary` dismiss ("Nice." / "Keep going." — never "Awesome!!! 🎉"). Motion: overlay scale 0.94→1 + opacity, 260ms `--ease-glide`; ring does one stroke-draw sweep, 500ms, 80ms delay after the overlay lands — the same draw-in technique as GoalRing/RouteMap, a single consistent motion signature across every "reveal" in the product. Triggers: new badge, new PR, streak milestone (every 4 weeks) — **never** on a routine run finish; Record's existing "You showed up" summary stays calm by design. If multiple unlock at once, queue silently, show highest priority (PR > badge > streak), never stack.

**Skeletons / empty states** — mechanically unchanged (shimmer, icon-in-circle + title + body + forward CTA), radius now 16px to match cards. RouteMap gets its own empty state (above). Every new component above ships with a designed empty condition — no afterthoughts.

## 5. Motion spec

| Token | Value | Use |
|---|---|---|
| `--ease-glide` | `cubic-bezier(0.22,1,0.36,1)` | The system's one reveal easing — rings, bars, routes, page transitions, the overlay. |
| `--ease-spring` | `cubic-bezier(0.34,1.56,0.64,1)` | Reserved for exactly two spots: Record disc press, achievement icon/finish-marker pop. Never for routine chrome — overshoot everywhere is what makes UI feel like a bouncy mascot. |
| `--dur-press` | 90ms | Button/chip/disc press scale |
| `--dur-ui` | 150ms | Hover/focus/chip toggle |
| `--dur-page` | 150ms out / 210ms in | View Transitions (unchanged from v1) |
| `--dur-reveal` | 400–600ms | Ring fill, bar-chart grow, overlay entrance |
| `--dur-hero` | 500–900ms | Route draw, achievement ring sweep — the slowest tier, reserved for rare hero moments only |

`prefers-reduced-motion: reduce` (extends the existing kill-switch in `globals.css`, same mechanism, more selectors): view-transitions, skeleton shimmer, live-dot, ring-fill duration all already zeroed in v1 — add bar-chart grow (render final heights), route draw (render full path, no marker pop), and the achievement overlay (opacity-only cross-fade, no scale/draw sweep).

## 6. Per-screen redesign notes (priority order)

1. **Home** — Add Weather chip beside greeting (new). GoalRing card becomes `.card--stage` (hero anchor, theme-independent). Add a lightweight "Friends' activity" row (3–4 avatars + one line each, one `.btn-tertiary` "See club feed" — deliberately not a full feed, Home must stay uncluttered). Surface the single latest club announcement as one compact card (reuses the Club-detail announcement pattern — one component, not two). RunCards optionally gain compact RouteMap previews (priority 2). No new "Start run" button — the tab bar's Record disc is the one obvious entry point; a second CTA would compete with it.
2. **Record** — Pre-run "Lace up" button and the live-dot recolor `--volt`→`--signal` (starting/holding a live recording is the primary action, matching the tab-bar disc). Live + paused screens become explicit Night Stage screens (fixed dark) — this also fixes a latent v1 gap where the light theme would have silently washed out "glanceable while moving" contrast on the live numerals. Live distance numeral is `--signal` while actively recording, fades to `--stage-muted` when paused; the finished-summary stats flip to `--pace` (the result is now a positive, completed thing) — a deliberate red-while-live → green-once-done arc.
3. **Run detail** — Add the full 16:10 RouteMap hero under the header (priority 1 for this screen — it's the natural home for the flagship route-draw moment). RSVP button follows the signal-asks/pace-confirms pattern. Pace-group figures recolor `--volt`→`--course` (a fact, not a status); selected-state stays `--pace` (a real commitment). "Track it live" shortcut badge recolors to `--signal`.
4. **Club detail** — Add a generated "cover" identity band using the RouteMap texture generator (seeded contour/grid pattern, no photo asset needed) behind the club name — gives each club a memorable identity without image uploads or external services. Add Member Leaderboard (this week, top 5, `.btn-tertiary` "See full leaderboard"). Add a compact Pace Groups rollup (cohort cards: name, member count, typical pace — a directory, not the full per-run picker that stays on Run detail). Join button recolors to the signal-asks/pace-confirms pattern (was one color both states in v1).
5. **Explore** — Filter chips de-pill to 10px radius, active state recolors `--volt`→`--course` (selecting a filter is picking a fact). ClubCard pace-range figure recolors `--volt`→`--course` for the same reason — this is the single most important systemic recolor: every "figure about a run/club that you didn't personally earn" moves from green to blue across RunCard, ClubCard, and PaceGroup, freeing green to mean, everywhere, without exception, "this is you succeeding."
6. **Profile** — Add BarChart (weekly km, `.card--stage`) directly under the top stat row — explicit founder ask, currently missing. Replace the flat "Recent runs" list with the unified Activity Timeline (runs + PR/badge moments on one rail). Add a Club Memberships section (compact row of square 36px, radius-12 club-mark tiles linking to each club) — explicit founder ask, currently entirely absent from Profile. Badge tiles get the "new" signal-dot.
7. **Onboarding** — Token-level only: pace/vibe picker chips follow the new de-pill + `--course`-selected pattern (a preference is a fact, same logic as Explore filters); primary CTA becomes `.btn-primary` (signal). No flow change — the 3-minute-to-RSVP activation goal in `docs/USER_FLOWS.md` is unaffected by a visual-token pass.

## 7. Voice & iconography

`lucide-react` exclusively, ~1.75–2px stroke, functional not decorative — unchanged from v1, still correct. Never emoji-as-icon. New icons introduced by this phase: `Trophy`/`Medal` (achievements/timeline), `Sun`/`Cloud`/`CloudRain`/`Snowflake` (weather), `TrendingUp`/`TrendingDown` (deltas). Voice stays confident, brief, athlete-to-athlete ("Lace up," "You showed up," "Nice.") — the achievement overlay is the one place copy could tip into mascot-cheerful territory, and it must not: no exclamation points, no emoji, dismiss labels stay as flat and confident as everything else in the product.
