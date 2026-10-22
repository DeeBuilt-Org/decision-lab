# Decision Lab: interface upgrade

**Status:** done 2026-10-21. Ruthnie approved the look; built and committed. The scorecard builder was removed in the same session (see "Scope change" below), which supersedes the Home and sidebar item lists further down.
**Dev server:** port 8128 (`vite.config.ts`). Vite, so builds can run with it open.

## Why

The Platform Picker card is the only surface in Decision Lab that was designed. Everything around it is Ant Design defaults in Inter: a header that's an icon plus a bold heading, a sidebar with oversized gray labels, a "Collapse" row with a hairline chevron, and a footer that lines up with nothing. Someone who arrives for the quiz sees a finished card inside an unfinished app, and trusts the result less for it.

The goal is uniform and intentional, not a new look pulled hard in one direction. Fix the bad parts, make each choice once, and make the header good enough to carry over to the other DeeBuilt tools.

## What's wrong today (diagnosis, confirmed with Ruthnie)

| Surface | Problem | Cause |
|---|---|---|
| Header wordmark | Reads as a default heading, not a brand | Inter 700 at 20px in green next to a loose 24px mark (`AppHeader.tsx`, `header.css`) |
| Sidebar labels | Too big, look like body copy | `--ops-fs-body` (16px) on nav labels (`layout.css`) |
| Sidebar active state | Weight jumps 500 → 600 and color changes on click | `.dl-nav-item.active { font-weight: 600 }` |
| Sidebar icons | Two icon families in one corner | Ant outlined icons in the nav, Phosphor-style scales mark in the header. `ReconciliationOutlined` for Scorecards is an odd glyph |
| Collapse | Full-width row with a caption-size label and hairline chevron, weaker than the items it sits under | `.dl-nav-collapse` in `SideNav.tsx` |
| Footer, vertical | Two rules about 20px apart: the sidebar's Collapse divider and the footer's top border | Footer lives in the main column only; the sidebar is its own full-height sticky column |
| Footer, horizontal | "Made by DeeBuilt" starts about 30px left of the content | `.dl-footer-inner` max-width excludes its padding, `.dl-content` max-width includes it |
| Home | No title, no line saying what Decision Lab is, cards with different widths, right side of the page empty | `.dl-home-start` capped at 60ch, Picker card in a separate two-column grid |
| Typeface | One face for everything, no display face doing any work | Inter only (`index.html`, `index.css`, `theme.tsx`) |

## Decisions

### Type: Bodoni Moda + Lato

Decided 2026-10-21. The tools make their own type decision and do not copy deebuilt.co (Instrument Serif + Inter). Ruthnie offered Cormorant Garamond + Lato or Bodoni Moda + Lato; Bodoni won because its optical-size axis thickens the hairlines at small sizes, so the wordmark stays crisp at 24px where Cormorant goes spindly.

- **Bodoni Moda** (display): the wordmark, page titles, the Platform Picker card's name. Weights 500 to 700, browser optical sizing left on (the default).
- **Lato** (UI and body): nav, body text, buttons, form controls, tables, the Picker card's cycling question.

Lato ships **400 and 700** only (plus 900, unused). So the UI runs on two weights: 400 for nav and body, 700 for emphasis and small headings. Every 500, 600, 650, 750 and 800 in the CSS moves to one of those two or to the display face.

New tokens in `tokens.css`, read everywhere a family is named today (`index.css`, `theme.tsx` `fontFamily`):

```css
--ops-font-display: "Bodoni Moda", "Didot", Georgia, serif;
--ops-font-ui: Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--ops-fs-nav: 14px;
--ops-fs-wordmark: clamp(22px, 5.6vw, 26px);
```

`index.html` loads `Bodoni+Moda:opsz,wght@6..96,400..900` and `Lato:wght@400;700`.

This round is cleanup, not a new style direction: remove the scaffolded, unfinished look and keep everything else.

### Icons: Phosphor everywhere in the chrome

Add `@phosphor-icons/react`. The scales mark is already Phosphor's `Scales`, so the chrome becomes one family. Regular weight, 18px in the nav, 20px in the header.

| Slot | Icon |
|---|---|
| Home | `House` |
| Scorecards | `ListChecks` |
| Run history | `ClockCounterClockwise` |
| Platform Picker | `Compass` |
| Sidebar toggle | `SidebarSimple` |
| Theme | `Moon` / `Sun` |
| Collapsed-rail info | `Info` |

Ant icons inside pages (editor, run mode, modals) stay for now. The rule is no mixing within one surface, and the chrome is one surface.

### Header: a real lockup

Layout, left to right: **sidebar toggle → mark tile → wordmark**, then the theme toggle on the right.

- **Mark tile:** the scales mark in white on a 28px green (`--ops-green`) square with a 7px radius, like an app icon. It matches the app tiles on the Picker card, which gives the chrome and the card a shared language.
- **Wordmark:** "Decision Lab" in Instrument Serif, `--ops-fs-wordmark`, `--ops-text` color (ink, not green), letter-spacing `-0.01em`. The tile carries the color, the name carries the type.
- **Height:** 56px (from 60). Update the sticky offsets in `layout.css` to read a new `--ops-header-h` token, so the number lives in one place.
- **Dark mode:** tile stays green, mark stays white, wordmark flips to `--ops-text`. `--ops-header-accent` (gold in dark) stays for the active nav item.
- **Sidebar toggle:** `SidebarSimple`, text button, 36px square. On desktop it collapses and expands the rail. On mobile, the same button opens the Drawer, and the in-page `.dl-nav-trigger` is removed. A control that opens chrome belongs in chrome. This is not a workspace control, so it doesn't break the header-is-chrome rule.

The header and lockup should be built as one component with three inputs: `mark` (SVG), `name`, `actions`. That's the piece that gets copied into the other tools (see "Carrying it to the other tools").

### Sidebar

- Labels: `--ops-fs-nav` (14px), weight 500 for every item in every state.
- Inactive: `--ops-text-muted`, darkened from `#6b6f6b` to `#5b605c` so it stops reading washed out. Icon same color.
- Hover: `--ops-surface-sunken` fill, `--ops-text` color.
- Active: `--ops-surface-sunken` fill plus `--ops-text` label and `--ops-header-accent` icon. No weight change, so nothing shifts on click.
- Item height 36px, 8px radius, 10px gap between icon and label.
- Rail width 240px (from 248), collapsed 64px (from 72). Both stay tokens.
- The Collapse row is deleted. The header toggle replaces it.

### Footer: moves into the sidebar on desktop

On desktop the sidebar's foot holds the credit and the links, small and quiet:

```
Made by DeeBuilt
About · Privacy
```

12px (`--ops-fs-fine`), muted, pinned to the bottom of the rail with a top border. The main-column `<Footer>` is removed on desktop. That leaves one bottom edge, so there's nothing left to misalign.

- **Collapsed rail:** the foot shows only an `Info` icon. Clicking it opens a small Ant `Dropdown` with About, Privacy and Made by DeeBuilt.
- **Mobile:** no visible rail, so the footer stays in the main column as it is now, with `.dl-footer-inner` fixed to use the same box as `.dl-content` (padding inside the max-width), so its left edge lines up with the cards. The Drawer also gets the same foot as the desktop rail.
- `DeeBuiltCredit.tsx` loses its inline `style={{ fontSize: 12 }}` and takes a class that reads the token.

### Home: a real opening

Home gets an opening block above everything else, the same width as the grid under it:

- **Title** in Instrument Serif at `--ops-fs-h1`.
- **One line** in Inter at `--ops-fs-sub`, muted, saying what Decision Lab does.

Draft copy, for Ruthnie's copy pass (words are hers to change, the structure is what this doc fixes):

> **Run every decision through the same scorecard**
> Build a scorecard once, with weights and dealbreakers, then score each vendor, hire or client against it.

Under the opening, **one two-column grid** for the top row on desktop, one column on phones:

- Left: the scorecards block. When empty, the "Start with a scorecard" card. When there are scorecards, the quick-run list.
- Right: the Platform Picker card.

Both cells stretch to the same height. The 60ch cap on `.dl-home-start` goes. "Lately" (recent runs) stays below, full width.

### Platform Picker card: brought into the system

The card already looks right. Two changes so it shares the type system and stops looking imported:

- `.pp-card-name` → `--ops-font-display`, weight 400.
- `.pp-card-question` → weight 600 (from 750).

Its dark ink ground and brand colors stay. It's still the one dark surface in the app.

## Carrying it to the other tools

Ruthnie wants this header on the other tools that moved to DeeBuilt. The migration doc (`opsette-tools.github.io/docs/DEEBUILT-TOOLS-MIGRATION.md`) made each app independent, with no shared package, and that stays true. What carries over is the **pattern**: each app keeps its own copy of the header component and swaps three things.

| Swaps per app | Stays the same in every app |
|---|---|
| The mark SVG inside the tile | Instrument Serif wordmark, size, tracking, ink color |
| The tool name | 28px tile, 7px radius, white mark |
| The tile color (each app's own green, or its accent) | 56px height, sidebar toggle on the left when the app has a rail, actions slot on the right |

The rollout to the other tools is its own session, after Ruthnie has lived with the Decision Lab version. The generic favicons she flagged in the migration doc are a separate job and not part of this one.

## Build order

1. **Tokens and fonts.** `index.html` font links. New tokens in `tokens.css` (`--ops-font-display`, `--ops-font-ui`, `--ops-fs-nav`, `--ops-fs-wordmark`, `--ops-header-h`, darker `--ops-text-muted`, new sidebar widths). Point `index.css` and `theme.tsx` at the font tokens.
2. **Phosphor.** `npm install @phosphor-icons/react`.
3. **Header.** Rebuild `AppHeader.tsx` and `header.css` as the lockup: toggle, tile, wordmark, actions. Toggle state lifts into `AppLayout`, and the same handler opens the Drawer on mobile.
4. **Sidebar.** `SideNav.tsx` and `layout.css`: Phosphor icons, 14px steady weight, new active state, Collapse row deleted, foot with credit and links (and the `Info` dropdown when collapsed).
5. **Footer.** Remove the main-column footer on desktop, keep it on mobile with the alignment fix. `DeeBuiltCredit` inline style → class.
6. **Home.** Opening block, one grid for the top row, 60ch cap removed.
7. **Picker card.** Name to the display face, question to 600.
8. **Weight sweep.** Grep the CSS for `font-weight: 650|700|750|800` and bring each one into 400/500/600 or the display face.
9. **Check.** `npx tsc -b`. Ruthnie looks at it on port 8128 in light and dark, desktop and a phone-width window, with the rail open and collapsed, then gives her nudges. One Vite build after her go, then commit and push.

## Scope change: scorecards removed (2026-10-21)

Decided by Ruthnie mid-build. Decision Lab stops being a build-your-own-scorecard tool; Google Forms and Typeform already cover that, and the builder was confusing. It becomes a library of ready-made quizzes that let a business find answers on its own, with DeeBuilt as the next step for implementing them.

- **Removed:** the scorecard builder and both scorecard types (`src/types/`), IndexedDB storage (`src/db/`), the Scorecards, editor, run and Run history pages, the template and type pickers, `useScorecards`, `runSummary`, `format.ts`, `uuid.ts`, and the `idb` and `@dnd-kit/*` packages. All recoverable from git history.
- **Home** is the quiz library: a two-column grid of quiz cards (`dl-home-quizzes`), one cell taken by the Platform Picker. The opening title and line were cut at Ruthnie's request ("run" is out).
- **Sidebar:** Home and Platform Picker. Platform Picker stays for now; Home will become the landing page and the rail's contents get decided later.
- **Quiz styles** that lived in the forms type's `run-row.css` moved to `src/quizzes/question-row.css`, shared by every future quiz.
- **Copy:** About, Privacy, the `index.html` description tags and the manifest description now describe quizzes. Privacy says answers are never uploaded or saved, which is true: the quiz stores nothing.
- **Tokens:** the warn, disqualified and blocker state tokens were removed (no users left). Pass and fail stay for quiz results.

Open, for Ruthnie to think through (not part of this build): more quizzes of the Platform Picker's weight, and lead capture. Export has nothing to build on yet; `jspdf` is installed but unused.

## Progress

- **2026-10-21:** Built steps 1 to 7 and the token work.
  - Type is Bodoni Moda + Lato. Weight tokens `--ops-fw-regular` (400), `--ops-fw-bold` (700), `--ops-fw-display` (600) and `--ops-tracking-display` replace every raw weight in the surviving CSS. Ruthnie flagged raw weights and sizes being typed into files; the chrome sizes are tokens too (`--ops-header-tile-size`, `--ops-header-tile-radius`, `--ops-header-mark`, `--ops-control-icon`, `--ops-icon-chrome`, `--ops-icon-nav`, `--ops-nav-item-h`, `--ops-nav-gap`, `--ops-header-h`). Phosphor icons render at 1em and take their size from those tokens, with no `size` props in TSX.
  - Header lockup in `AppHeader.tsx` takes `mark`, `name`, `actions`, `onToggleNav`, `navLabel`; tile color is `--ops-header-tile-bg`.
  - Sidebar: 14px, one weight, Phosphor icons, Collapse row gone (toggle is in the header, and it opens the Drawer on mobile). Credit plus About and Privacy sit in the rail foot; collapsed, an Info menu. Ruthnie confirmed the sidebar and rail-foot footer look right.
  - Page titles (`.dl-h1`), the Picker card name and the quiz's big titles use the display face.
  - `npx tsc --noEmit` clean (single tsconfig). One Vite build, clean.
  - Step 8's weight sweep covers every surviving file; the rest were deleted with the scorecard builder.
  - The design choices are recorded for the other tools at the bottom of `opsette-tools.github.io/docs/DEEBUILT-TOOLS-MIGRATION.md`.
