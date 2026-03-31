# CLAUDE.md — Ath Yog Wellness Foundation Website

## Project Overview

This is a **static HTML/CSS/JavaScript website** for Ath Yog Wellness Foundation, a yoga and wellness center founded by Yog Guru Ashwini Patil. The site showcases yoga programs, events, corporate wellness services, and enables bookings via WhatsApp.

**Live domain**: `https://athyog.in`

---

## Repository Structure

```
athyog/
├── index.html                        # Main homepage
├── slim-smart-sadhana.html           # 21-day weight management program page
├── corporate-profile-design-one.html # Corporate yoga services page
├── chair-yoga.html                   # Chair yoga program page
├── privacy-policy.html               # Privacy policy
├── terms-of-service.html             # Terms of service
├── robots.txt                        # SEO crawler rules
├── sitemap.xml                       # XML sitemap (6 URLs)
├── site.webmanifest                  # PWA manifest
├── README.md                         # Project documentation
├── PRD.md                            # Product requirements document
└── assets/
    ├── css/
    │   └── animations.css            # Custom keyframes and animation classes
    ├── js/
    │   └── main.js                   # All site JavaScript logic (531 lines)
    └── images/                       # Static images (JPEG/PNG/AVIF, ~6.8MB)
        └── corporate/                # Corporate program images
    └── video/                        # MP4 video files (~56MB)
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | Tailwind CSS (CDN) + custom `animations.css` |
| Scripting | Vanilla JavaScript ES6+ (no frameworks) |
| Fonts | Google Fonts — Quicksand (body), Fredoka (headings) |
| Icons | Google Material Symbols |
| Data | Google Sheets API (gviz endpoint, no auth) |
| Analytics | Google Analytics 4 (`G-RSB7DZ227W`) |
| Booking | WhatsApp Business link (`https://wa.link/a0lxj5`) |
| Maps | Google Maps embed iframe |

**No build system, no package.json, no npm.** All dependencies are loaded via CDN.

---

## Design System

### CSS Custom Properties (defined in each page's `<style>` block)

```css
:root {
  --primary:  #ff6b6b;  /* Coral Red — CTAs, highlights */
  --accent:   #4ecdc4;  /* Teal — secondary actions */
  --navy:     #2c3e50;  /* Deep Blue — headings, dark backgrounds */
  --cream:    #fffaf0;  /* Warm White — page backgrounds */
  --lavender: #e0d7ff;  /* Soft Purple — accents */
  --mint:     #d7fff1;  /* Soft Green — accents */
}
```

### Typography
- **Headings**: `'Fredoka', sans-serif`
- **Body**: `'Quicksand', sans-serif`

### Responsive Breakpoints (Tailwind defaults)
- Mobile-first: `< 768px`
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1200px+)

---

## JavaScript Architecture (`assets/js/main.js`)

The file is organized as a set of `init*` functions, all called on `DOMContentLoaded`:

| Function | Purpose |
|----------|---------|
| `initSmoothScroll()` | Smooth anchor navigation with header offset; active link highlighting |
| `initScrollAnimations()` | IntersectionObserver-based fade-in-up reveal on scroll |
| `initCounters()` | Animated number counters (20+ years, 5000+ students, etc.) triggered on scroll |
| `initMobileMenu()` | Hamburger menu toggle with `translate-x-full` |
| `initTestimonialCarousel()` | Auto-play carousel (4s interval), touch swipe support, pause on hover |
| `initDataFetching()` | Fetches classes & events from Google Sheets, renders cards dynamically |
| `initFilters()` | Category filter buttons for programs (beginners, kids, senior, etc.) |
| `initRippleEffect()` | Material Design ripple effect on `.ripple-btn` buttons |
| `initParallax()` | Parallax scroll for `.parallax-scroll` elements using `data-speed` |

### Google Sheets Integration

Data is fetched from a public Google Sheet via the `gviz/tq` endpoint:

```javascript
const SHEET_ID = '1rBPf1PSmuoq8QM7iTAAV0ydb3SQhOxw8N3557hqbuLE';
const COURSE_GID = 0;        // Classes/programs sheet
const EVENT_GID = 805507452; // Events/workshops sheet
```

URL pattern:
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&gid={GID}
```

Response is prefixed with `)}]'` — strip this before `JSON.parse()`.

Expected columns: `ID`, `Title`, `Description`, `Image URL`, `Price`, `Duration`, `Category`, `Tags`, `Features`, `WhatsApp Link`

---

## Pages

### `index.html` — Homepage (636 lines)
Sections in order:
1. Fixed header — logo, nav links, WhatsApp CTA
2. Hero — gradient background, video embed, dual CTAs
3. Stats — animated counters (20+ years, 5000+ students, 12+ instructors, 95% renewals)
4. Classes — dynamic grid from Google Sheets with category filters
5. Events — dynamic event cards from Google Sheets
6. About — founder story (Yog Guru Ashwini Patil)
7. Testimonials — carousel (3-up desktop, 1-up mobile)
8. Gallery — masonry grid with videos and images
9. Contact — address, phone, email, embedded Google Map
10. Footer — links, legal pages, copyright
11. WhatsApp FAB — fixed bottom-right floating button

### `slim-smart-sadhana.html` — Program Page (890 lines)
21-day weight management program. Schedule: 5:30–7:00 AM, Mon–Sat. Contains program benefits, testimonials, FAQs, and booking CTAs.

### `corporate-profile-design-one.html` — Corporate Page (729 lines)
Corporate yoga and chair yoga services. Includes instructor credentials, corporate wellness benefits, session gallery, certifications, and corporate booking CTAs.

### `chair-yoga.html` — Chair Yoga Page
Specialized yoga for office/corporate environments. Links back from corporate page.

---

## CSS Animations (`assets/css/animations.css`)

| Class / Keyframe | Effect |
|-----------------|--------|
| `.reveal` | Fade-in-up (opacity 0→1, translateY 30→0px); triggered by JS IntersectionObserver |
| `@keyframes ken-burns` | Slow scale 1.0→1.1 — used on hero/section images |
| `.carousel-slide` | Flex container for testimonial carousel |
| `.skeleton` | Shimmer loading placeholder while Sheets data fetches |
| `.ripple` | Expanding circle from click origin (Material Design) |

---

## SEO Configuration

- **`sitemap.xml`**: 6 URLs with priorities (1.0 homepage, 0.8 services/events, 0.5–0.6 others)
- **`robots.txt`**: `Allow: /`, Sitemap points to `https://athyog.in/sitemap.xml`
- **Meta tags**: Open Graph, Twitter Card, canonical URLs on each page
- **Structured data**: JSON-LD for LocalBusiness schema (in `<script type="application/ld+json">`)
- **Performance targets**: LCP <2.5s, FID <100ms, CLS <0.1, Lighthouse 95+

---

## Development Workflow

### Running Locally
No build step required. Open any `.html` file in a browser, or use a local static server:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

### Making Changes

1. **HTML pages**: Edit the `.html` files directly. Each page is self-contained with inline `<style>` and a `<script>` block that imports `assets/js/main.js`.
2. **Shared JavaScript**: Edit `assets/js/main.js`. All pages share this file.
3. **Animations**: Edit `assets/css/animations.css` for shared animation classes.
4. **Adding images**: Place in `assets/images/`. Prefer JPEG or AVIF for photos; PNG for logos/icons.
5. **Adding videos**: Place MP4 files in `assets/video/`. Keep individual files under 10MB.

### No Build Required
There is no transpilation, bundling, or minification pipeline. Changes take effect immediately on browser refresh.

### Deployment
Copy all files to the static hosting provider. Ensure the `assets/` directory structure is preserved. Domain: `athyog.in`.

---

## Key Conventions

### HTML
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Each page includes full `<head>` with meta tags, fonts, and Tailwind CDN
- Inline `<style>` block at top of `<body>` for page-specific overrides
- Script tag for `main.js` at bottom of `<body>` (`defer` or just before `</body>`)

### CSS / Tailwind
- Utility classes (Tailwind) for layout, spacing, and responsive design
- Custom CSS only for animations and effects not achievable with Tailwind utilities
- Never use `!important` unless absolutely necessary
- CSS custom properties (`var(--primary)`) for brand colors — do not hardcode hex values inline

### JavaScript
- No ES modules; all code in one IIFE-style file (`main.js`)
- Use `const`/`let`, arrow functions, template literals
- DOM queries: prefer `document.querySelector` / `querySelectorAll`
- Use `IntersectionObserver` for scroll-triggered effects (not scroll event listeners)
- Clean up: remove ripple elements after animation completes

### Images and Media
- Images should be web-optimized (compress before adding)
- Use `loading="lazy"` on all images below the fold
- Hero/above-fold images should not use lazy loading
- Videos use `autoplay muted loop playsinline` attributes for background videos
- Always include `alt` text on `<img>` tags

### Google Sheets Data
- Sheet must be publicly readable ("Anyone with the link can view")
- Parse response: strip `)}]'` prefix before JSON.parse
- Handle fetch errors gracefully — show fallback UI when data unavailable
- Skeleton loaders should display while data is fetching

### Analytics
- Custom events are tracked via `gtag('event', ...)` for CTAs and conversions
- Do not remove existing `gtag` calls when editing HTML
- GA Measurement ID: `G-RSB7DZ227W`

### WhatsApp Integration
- All booking CTAs should link to `https://wa.link/a0lxj5` or a contextual `wa.me` URL
- WhatsApp FAB is present on every page for accessibility

---

## Adding a New Page

1. Copy an existing page (e.g., `chair-yoga.html`) as a template
2. Update `<title>`, `<meta>` description, and canonical URL
3. Update `<link rel="alternate">` and Open Graph tags
4. Add the page to `sitemap.xml` with appropriate priority
5. Link to the new page from the header navigation on all pages
6. Add structured data JSON-LD if the page represents a specific service

---

## Common Pitfalls

- **Google Sheets fetch fails silently**: The `gviz/tq` API returns a 200 with HTML error body if the sheet is not public. Check browser console for parse errors.
- **Mobile menu stays open**: The mobile menu closes on nav link clicks — if adding new nav items, ensure they have the same `click` listener pattern in `initMobileMenu()`.
- **Carousel breaks on resize**: The carousel uses pixel-based transforms. If the container width changes, `currentSlide` index may be off. Reload to reset.
- **Video autoplay blocked**: Browsers block autoplay with audio. Always use `muted` attribute on `<video>` elements.
- **Tailwind CDN in production**: The CDN version includes all utilities (large payload). For production optimization, consider building a Tailwind CSS purge pass if bundle size becomes a concern.

---

## Contact & Business Info (hardcoded in HTML)

- **Studio Address**: Ath Yog Wellness Foundation, Pune, Maharashtra, India
- **Phone**: (refer to `index.html` contact section for current number)
- **Email**: (refer to `index.html` contact section for current email)
- **WhatsApp**: `https://wa.link/a0lxj5`
- **Founded**: 20+ years of practice, center established in Pune
