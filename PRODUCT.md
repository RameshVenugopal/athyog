# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of equal weight:

- **Pune locals** near Erandwane: parents, working adults and seniors choosing a trustworthy teacher for themselves or their family. Mostly on phones; some prefer Marathi (the site offers a Marathi WhatsApp link).
- **Online learners** anywhere, joining live online batches, often through the 21-day Slim Smart Sadhana programme.

Their job: decide whether Ath Yog is the right teacher and programme, then start a conversation on WhatsApp.

## Product Purpose

Ath Yog Wellness Foundation is a yoga and wellness centre in Pune (est. 2004). The immersive pages (`immersive*.html`) are a concept version of the site. Success is a visitor opening WhatsApp to book a trial, ask about a batch, plan a corporate session, or donate.

## Positioning

What a neighbouring studio could not truthfully copy:

1. **Yog Guru Ashwini Patil herself**: 20+ years of personal, teacher-led practice. The guru is the brand.
2. **Structured programmes**: Slim Smart Sadhana (21 days, three weekly phases: Cleanse, Strengthen, Sustain), Chair Yoga, and corporate wellness.
3. **A foundation, not only a studio**: seva and donations with 80G receipts; yoga for all.

## Operating Context

- Booking and all communication happen on WhatsApp (`wa.link/a0lxj5`, `wa.me/919370019475`). There is no form backend.
- Classes and events are managed by the owner in a Google Sheet and rendered live on the page.
- In-studio in Erandwane, Pune, plus live online batches.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS, with no build step. Tailwind via CDN; shared `assets/css/immersive.css` and `assets/js/immersive.js`.
- Live data comes from Google Sheets (gviz). Sheet content is freeform and can be stale; the UI must degrade gracefully (empty and error states).
- Features to preserve: the class filter, events with ICS "save date", the gallery lightbox, the Seva donation form (sent to WhatsApp), the mobile menu, and the 21-day journey rail.
- The immersive pages carry `noindex`; the main site (`index.html` and programme pages) remains the indexed site.

## Brand Commitments

- The existing Ath Yog logo (`assets/images/logo.png`, green tree) stays as-is.
- The name "Ath Yog" and the phrase "|| Atha Yoga Anushasanam ||".

## Evidence on Hand

- Real photography and video in `assets/images/` (including `sss/`, `corporate/`) and `assets/video/`.
- Real testimonials already on the pages (named students, 4.9 on Google).
- Stated figures in current copy: 20+ years teaching, 5,000+ students guided, 12+ instructors, 95% renewal rate. Do not add new numbers.
- Absent: pricing on the immersive pages (removed deliberately for SSS), press coverage, and certification documents. Do not fabricate them.

## Product Principles

1. Trust in the teacher comes before any programme pitch.
2. Every page offers one obvious WhatsApp next step.
3. Content is live and owner-managed; design for missing, stale or messy data.
4. Welcome all bodies and ages; never imply a fitness prerequisite.

## Accessibility & Inclusion

The audience includes seniors and phone-first users. Target WCAG 2.2 AA: readable type sizes, 24px+ tap targets, full keyboard support, and reduced motion respected.
