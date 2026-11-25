---
name: Ath Yog Immersive
description: The morning sadhana as a website. Flat sky bands move from Brahma Muhurta night to full day as you read.
colors:
  night: "#121735"
  predawn: "#262355"
  dawn: "#5B3A6E"
  blush: "#D4687E"
  day: "#F4F6FB"
  sun: "#F29B38"
  star: "#F1F2FA"
  star-muted: "#B7BBDA"
  ink: "#121735"
  ink-muted: "#4B5070"
  blush-muted-ink: "#2B1A33"
  day-rule: "#D9DCEA"
  day-field: "#FFFFFF"
typography:
  display:
    fontFamily: "'Anek Latin', 'Mukta', system-ui, sans-serif"
    fontSize: "clamp(3rem, 10vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125"
  headline-1:
    fontFamily: "'Anek Latin', 'Mukta', system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 118"
  headline-2:
    fontFamily: "'Anek Latin', 'Mukta', system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "'Anek Latin', 'Mukta', system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  quote:
    fontFamily: "'Anek Latin', 'Mukta', system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  lede:
    fontFamily: "'Mukta', system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "'Mukta', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Mukta', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  mark: "2px"
  focus: "4px"
  field: "0.75rem"
  plate: "1.25rem"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 2rem)"
  wrap: "72rem"
  section: "clamp(4.5rem, 10vw, 8rem)"
  section-tight: "clamp(3.5rem, 7vw, 5.5rem)"
  row: "1.5rem"
  header: "72px"
  sun-bar: "56px"
  target: "44px"
components:
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.75rem"
    height: "52px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.star}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.75rem"
    height: "52px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.125rem"
    height: "44px"
  chip-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.day}"
    rounded: "{rounded.pill}"
  field:
    backgroundColor: "{colors.day-field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.625rem 0.875rem"
    height: "48px"
  plate-frame:
    rounded: "{rounded.plate}"
  sun-bar:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.night}"
    height: "56px"
  site-header:
    backgroundColor: "{colors.night}"
    textColor: "{colors.star}"
    height: "72px"
---

# Design System: Ath Yog Immersive

Scope: only `immersive*.html`, with `assets/css/immersive.css` (tokens, components) and `assets/js/immersive.js` (behaviour, DOM contract in its header comment). `index.html` and the rest of the main site keep their own Tailwind/Quicksand look; do not port these tokens there. Direction contract: `.impeccable/surfaces/immersive-html.md`.

## Overview

**Creative North Star: "Brahma Muhurta"**

The site is the morning sadhana itself. The page is a sky that moves from pre-dawn night to full day as you read, and the header clock keeps the hour: 04:45 at the top, 07:00 at the foot. Colour comes in flat, registered bands like a woodblock print, never blended. One sun rises in it: saffron, and it only ever means "open WhatsApp".

Surfaces are ruled, not boxed. Lists are hairline ledgers, photographs are plates with ruled captions, and progress is shown with marks (tick, flag, ring), not colour changes. The system rejects the category's photo-hero + beige + serif studio template and the dark-neon meditation-app look.

**Key Characteristics:**
- Five flat sky bands; each band sets its own foreground roles.
- Saffron is the single stamp, reserved for WhatsApp actions.
- Wide Anek Latin display over Mukta body (Latin + Devanagari).
- Hairline rules instead of cards; captions on every plate.
- One authored motion moment: the scroll clock.

## Colors

A night-to-day ramp of five flat bands plus one saffron sun.

### Primary
- **Sun Saffron** (sun): WhatsApp actions only: `btn-sun` and the mobile `sun-bar`. Text on it is Night (7.94:1). One exception exists in code: the focus-only skip link.

### Sky bands (the ground)
- **Night Indigo** (night): hero, header, footer, mobile menu, lightbox backdrop (92% opacity), `theme-color`.
- **Pre-dawn** (predawn): second dark band.
- **Dawn Violet** (dawn): third dark band; the story pin's second hour.
- **First Blush** (blush): the one light-warm band; also the accent for focus rings, the horizon progress line, link underlines, current-nav underline, selection.
- **Day** (day): the default reading band for long content.

### Neutral (foreground roles)
- **Star** (star) / **Star Muted** (star-muted): text on Night, Pre-dawn and Dawn.
- **Ink** (ink) / **Ink Muted** (ink-muted): text on Day. Ink equals Night.
- **Blush Muted Ink** (blush-muted-ink): muted text on Blush.
- **Field rule** (`--field-rule`): the border of text inputs, at 3:1 or better against the field and the band (Day `#7C819C`, dark bands Star at 55%, Blush Night at 72%). Hairlines stay on `--rule`; chips keep `--rule` because their label identifies them.
- **Day Rule** (day-rule) and **Day Field** (day-field): hairlines and input fill on Day. Dark bands use Star at 20% for rules and 6% for field fill; Blush uses Night at 28% / 6%.

### Contrast pairings (computed, WCAG ratio)
| Foreground on band | Main | Muted |
|---|---|---|
| Night band | 15.69 | 9.28 |
| Pre-dawn band | 12.94 | 7.66 |
| Dawn band | 8.27 | 4.89 |
| Blush band (Night text) | 5.07 | 4.68 |
| Day band | 16.19 | 7.25 |
| Sun (Night text) | 7.94 | n/a |

Blush as a focus ring on Day is 3.19:1: passes the 3:1 non-text rule, with no headroom. Never set Blush text on Day.

**The One Sun Rule.** Saffron appears only on actions that open WhatsApp (trial, batch enquiry, corporate session, donation enquiry). Anything else that is saffron is a bug.

**The Band Owns the Ink Rule.** Components read `--fg`, `--fg-muted`, `--fg-inverse`, `--rule`, `--field` from the band class they sit in (`band-night|predawn|dawn|blush|day`). Components never hard-code a colour; JS templates never carry colours.

**The Flat Sky Rule.** Bands are solid fills that meet at a hard edge. No gradients, glows or blends between them.

## Typography

**Display Font:** Anek Latin (width 75–125, weight 300–800), fallback Mukta, system-ui
**Body Font:** Mukta (400/500/700), fallback system-ui
Each has a metric-matched local fallback (`Anek Latin Fallback` 114%, `Mukta Fallback` 96%, `size-adjust` on Arial/Roboto) so the font swap does not shift the layout. Loaded from Google Fonts in one request: `family=Anek+Latin:wdth,wght@75..125,300..800&family=Mukta:wght@400;500;700`.

**Character:** A wide, confident Indian-foundry display over a plain, bilingual-ready text face. Width (`font-stretch`), not weight, carries the hierarchy.

### Hierarchy (classes)
- **`.display`** (700, 125% width, 0.96 lh): the hero headline, once per page.
- **`.h1`** (700, 118%): page headlines on inner pages.
- **`.h2`** (700, 112%): section headlines.
- **`.h3`** (700, 100%): row titles, ledger headings.
- **`.lede`** (max 36rem, muted): the paragraph under a headline.
- **`.body`** (max 65ch, muted) and **`.small`** / **`.meta`** (0.9375rem, meta 500 weight, max 70ch).
- **`.quote`** / **`.quote--lg`** (Anek 500/600): testimonials. **`.mantra`** (Anek 500, +0.02em): Sanskrit lines.
- **`.num`**: tabular numerals; always on times, days, prices, counters.
- **`.link`**: 700 weight, 2px Blush underline at 6px offset, 44px min height.

**The No Kicker Rule.** No small uppercase labels above headings. A headline stands on its own.

## Layout

- Content sits in `.wrap` (max 72rem, gutter `clamp(1.25rem, 4vw, 2rem)`). Tailwind supplies layout utilities only, precompiled into `assets/css/immersive.tailwind.css` (linked after `immersive.css`; rebuild with `npm run build:css` after changing any Tailwind class). Colour and type live in `immersive.css`.
- Sections: `.section` (`clamp(4.5rem, 10vw, 8rem)` block padding) or `.section--tight`. Two consecutive Day bands share one gap (`.band-day + .band-day` drops the top padding).
- Fixed 72px Night header; `scroll-padding-top: 76px`. From 768px to 959px the header hides the phase label and tightens the nav so the WhatsApp button stays on screen.
- Mobile (<768px): body reserves 56px + safe-area for the sticky `sun-bar`. Ledger rows collapse to one column below 640px; facts go 2 → 4 columns at 1024px; gallery 2 → 4 columns at 900px.

## Elevation & Depth

Flat. Depth comes from band order (darker = earlier in the morning), hairline rules and framed plates. The only shadows: the to-top button (`0 4px 12px rgba(0,0,0,0.3)`) and the field focus halo (3px Blush at 45%).

**The Rule, Not the Card Rule.** Group content with 1px `--rule` hairlines. No card grids, no raised panels.

## Shapes

Pills (999px) for every button, chip and brand tag. Plates and the story stage use 1.25rem corners; fields 0.75rem. The "today" day-mark is a flag (2px left corners, round right). Icons are drawn inline SVG at 20px with a 2px stroke.

## Components

- **Plate** (`.plate > .plate__frame + .plate__cap`): every photo or video. Photos over 200 KB use the light copies in `assets/images/immersive/` (max 1000px wide; `data-lightbox` keeps the original). Looping silent videos use the light copies in `assets/video/immersive/` (sized to the plate, no audio), never the full-size files the main site uses. Rounded frame, then a caption above a hairline: `<strong>` subject left, context right. Hero video is a framed plate, never full-bleed; it fades in on first frame (2.5s safety fallback).
- **Ledger** (`.ledger`, `.ledger-row`, `.ledger-link`): hairline list with 1.5rem rows. `ledger-row` is a 14rem label column + content; `ledger-link` adds a 44px ringed arrow that fills with `--fg` on hover.
- **Facts** (`.facts` `dl`): ruled stat grid; `dd` in wide Anek, 2–2.75rem, tabular.
- **btn-sun**: saffron pill, 52px, Night text, WhatsApp chat-bubble SVG first. Hover lifts 2px. Always `target="_blank" rel="noopener"`.
- **btn-line**: transparent pill with a 1.5px currentColor border; hover inverts to `--fg` fill. Every non-WhatsApp action.
- **Chip** (`.chip`, `.sv-chip`): 44px filter pill with `--rule` border; pressed state (`aria-pressed="true"` / `.on`) fills with `--fg`. Filters are toggle buttons, not tabs.
- **Field** (`.field-label` + `.field`): 48px, 1.5px `--field-rule` border, `--field` fill; placeholder at full opacity (`--placeholder` on dark bands); focus shifts the border to `--fg` with a Blush halo. `.check` uses Night accent.
- **Sun bar** (`.sun-bar`): mobile-only fixed WhatsApp bar, min 56px, safe-area padded. Every page must have one.
- **Header chrome**: brand mark (Star disc + logo), `Immersive` tag, sky clock (`#sky-time`, `#sky-phase`, `aria-hidden`), nav links with Blush underline for current, header `btn-sun`. Horizon line `#progress`: a 3px Blush bar scaled by scroll.
- **Story pin** (`.story-wrap` 250svh, sticky `.story-pin`): the practice hour. Background follows the active step Night → Dawn → Blush; media crossfade 0.8s; on phones the photo takes 38svh (30svh when the viewport is under 700px tall); `.story-hour` time stamp; `.story-rail` dots. Inactive step titles are dimmed with `--story-dim` (0.42 on Night, 0.5 on Dawn, 0.68 on Blush) so they stay at 3:1.
- **Journey marks** (`.day-mark`, `.story-dot`): 21 marks in a 7-column grid. State by shape: tick = done, filled flag = today, ring = ahead. `#rail-fill` and `#rail-week` follow the same scroll tick.
- **Class rows** (`.cls-row`, JS-rendered from Sheets): title, 2-line description, meta, 44px CTA. A blank or 0 price shows no price (only the word "free" shows "Free"); Slim Smart Sadhana never shows a price here.
- **Event rows** (`.ev-card`): big tabular day + month badge, status, title, facts, title and description clamped to 3 lines, actions (price, `.ev-ics` calendar button, WhatsApp). `.ev-empty` is a real live state (the sheet currently has no upcoming rows).
- **Talk reels** (`.talks`, `[data-talk-video]`): portrait 9:16 plates in a 2/3-column grid for spoken talks. Native controls, `preload="none"`, never autoplay/muted/loop; starting one pauses the others. Caption: title left, language right.
- **Gallery + lightbox**: plates in a 2/4-column grid with `--wide` and `--tall` variants; tiles open a native `<dialog>` with a Night backdrop and a 44px Star close button. Gallery videos play only in view and never under reduced motion.

## Motion

**The One Moment Rule.** One authored moment: scroll drives the header clock 04:45 → 07:00 (phase label Brahma Muhurta → Practice at 05:30 → Sunrise at 06:45), the horizon line, and the 21-day rail, all in one `requestAnimationFrame` tick. Everything else is visible by default and only settles: `.rv` translates from 12px (0.9s), `.rise` from 16px with 0.08s steps. Nothing fades in from zero opacity, except the hero video's dissolve on its first frame. Easing: `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)`.

**Reduced motion:** reveals, rises, story transitions and the button lift are off; the hero shows its poster; gallery videos do not play; counters jump to their final value; scrolling is instant. Bands stay static.

## Accessibility

- 44px minimum for every target, footer links included (48px for fields and menu links, 52px buttons).
- Every input/select/textarea has a `<label for>`; every `<img>` has `alt`; one `<h1>` per page.
- Mobile menu is `role="dialog" aria-modal="true"`: opening it makes every other body child `inert`, moves focus to close; Escape or close returns focus to the trigger.
- Skip link to `#main` (saffron, shown on focus). Global focus ring: 2px Blush, 3px offset. On the Dawn and Blush bands, and inside the story pin, the ring uses the band's `--fg` instead (Blush is 2.67:1 on Dawn and invisible on Blush).
- Scrollspy sets `aria-current` on in-page nav; the sky clock is decorative (`aria-hidden`).

## Do's and Don'ts

### Do:
- **Do** put every section on a band class and let components read the band's roles.
- **Do** use `btn-sun` / `sun-bar` for WhatsApp and `btn-line` or `.link` for everything else.
- **Do** caption every photograph as a plate.
- **Do** show progress and state with marks (tick, flag, ring), not with hue.

### Don't:
- **Don't** add kicker labels above headings.
- **Don't** build card grids or raised panels; use ledgers and hairlines.
- **Don't** use glows, gradients, orbs, tickers, sheen, tilt or breathing animations.
- **Don't** load Fraunces, Space Grotesk or Space Mono, or retired tokens (`--gold`, `--paper`, `--cream`, `f-serif`, `f-disp`).
- **Don't** use glyph icons (like a "WA" text bubble); draw inline SVG.
- **Don't** use saffron for anything that does not open WhatsApp.

## Adding an immersive page

1. Copy the chrome from an existing `immersive-*.html`: head meta (`lang="en"`, `robots noindex`, `theme-color #121735`, the one Anek Latin + Mukta font link), skip link, `#progress`, `#site-header` with `#sky-clock`, `#mobile-menu` / `#mobile-menu-btn` / `#close-mobile-menu`, footer, `#to-top`, sun bar.
2. Link `assets/css/immersive.css`, then `assets/css/immersive.tailwind.css`, and `assets/js/immersive.js` exactly once; never the Tailwind CDN. Run `npm run build:css` after adding Tailwind classes. No inline `<script>` and no inline `:root` tokens.
3. Order sections as a morning: dark bands first, Day for long reading, Blush sparingly.
4. Use `.rv` for reveals (never legacy `.reveal`); WhatsApp links need `target="_blank" rel="noopener"`.
5. Link the page from an existing immersive page, then run `npm test` (`scripts/check-immersive.mjs`); it must report 0 failures.
