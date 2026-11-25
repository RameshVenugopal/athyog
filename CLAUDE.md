# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website / PWA for **Ath Yog Wellness Foundation** — a yoga and wellness center in Pune, India. Pure vanilla HTML/CSS/JavaScript with no build system or package manager.

## Running Locally

No build step required. Serve files with any HTTP server:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`. HTML files can also be opened directly in a browser.

## Architecture

### Pages
- `index.html` — Main homepage (hero, services catalog, events, testimonials, contact)
- `slim-smart-sadhana.html` — Slim Smart Sadhana weight-loss program details
- `chair-yoga.html` — Chair yoga program page
- `corporate-profile-design-one.html` — Corporate wellness offerings
- `privacy-policy.html`, `terms-of-service.html` — Legal pages

### Assets
- `assets/css/animations.css` — Custom keyframes (reveal, Ken Burns, parallax, carousel, ripple)
- `assets/js/main.js` — All site JavaScript (~530 lines, no framework)
- `assets/images/` — 67 image files including `corporate/` subdirectory
- `assets/video/` — 12 MP4 video files (bulk of the 164 MB repo size)

### Styling
Tailwind CSS is loaded via CDN (`cdn.tailwindcss.com`) and configured with inline `<style type="text/tailwindcss">` blocks inside each HTML file. Custom CSS variables: `--primary`, `--accent`, `--navy`, `--cream`, `--lavender`, `--mint`.

### JavaScript Modules (main.js)
All functionality is in a single `main.js` file:
- **Navigation** — Smooth scroll, active link highlighting, mobile hamburger menu
- **Scroll animations** — Intersection Observer on `.reveal` class elements
- **Data fetching** — Classes and events loaded from Google Sheets via the `gviz/tq` API endpoint
- **Dynamic rendering** — Service cards generated from sheet data, filterable by 8 categories
- **Testimonial carousel** — Auto-playing with touch/mouse drag support
- **Counter animations** — Animated stat counters on scroll

### External Integrations
| Service | Purpose |
|---------|---------|
| Google Sheets API | Dynamic classes & events (Sheet ID: `1rBPf1PSmuoq8QM7iTAAV0ydb3SQhOxw8N3557hqbuLE`) |
| Google Maps | Location embed iframe |
| Google Analytics 4 | Tag ID: `GA-RSB7DZ227W` |
| Google Fonts | Quicksand, Fredoka typefaces |
| Material Symbols | Icons (Google CDN) |
| WhatsApp Business | Booking link: `wa.link/a0lxj5` |

### Google Sheets Data Structure
- Classes GID: `0` (default sheet) — program catalog with categories, pricing, schedules
- Events GID: `805507452` — upcoming workshops and events
- Categories used for filtering: All, Beginners, Kids, Senior Citizen, Youth, Advanced, Therapy, Health

## Key Design Decisions
- No build pipeline — all dependencies via CDN to keep deployment simple
- Tailwind configured inline per page (not a shared config file)
- Content managed through Google Sheets rather than a CMS
- WhatsApp used for all booking/communication (no form backend needed)
- PWA manifest (`site.webmanifest`) enables installable web app
