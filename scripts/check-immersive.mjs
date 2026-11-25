#!/usr/bin/env node
// Static regression checks for the immersive*.html pages.
// No dependencies: run with `node scripts/check-immersive.mjs` (or `npm test`).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(root).filter((f) => /^immersive.*\.html$/.test(f)).sort();

const REQUIRED_IDS = ['progress', 'site-header', 'mobile-menu', 'mobile-menu-btn', 'close-mobile-menu', 'to-top', 'sky-clock'];
// IDs rendered at runtime by immersive.js — count them as present for anchors,
// and flag if a page also hard-codes them (duplicate ID once JS runs).
const RUNTIME_IDS = ['cls-count'];

let failures = 0;
const fail = (page, msg) => { failures++; console.log(`  ✗ ${msg}`); };

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  console.log(page);
  const before = failures;

  // Shared assets, exactly once; no inline <script> blocks.
  const count = (re) => (html.match(re) || []).length;
  if (count(/<script[^>]+src="assets\/js\/immersive\.js"/g) !== 1) fail(page, 'must load assets/js/immersive.js exactly once');
  if (count(/<link[^>]+href="assets\/css\/immersive\.css"/g) !== 1) fail(page, 'must link assets/css/immersive.css exactly once');
  if (/<script>/.test(html)) fail(page, 'inline <script> block found (logic belongs in assets/js/immersive.js)');
  if (/<style>[\s\S]*?:root\s*\{/.test(html)) fail(page, 'inline :root tokens duplicate assets/css/immersive.css');

  // Head meta: concept pages must not compete with the real pages in search.
  if (!/<meta name="robots" content="noindex"/.test(html)) fail(page, 'missing <meta name="robots" content="noindex">');
  if (!/name="theme-color"/.test(html)) fail(page, 'missing theme-color meta');
  if (!/<html[^>]+lang="en"/.test(html)) fail(page, 'missing <html lang="en">');

  // Shared reveal system (.rv honours reduced motion); legacy .reveal does not.
  if (/class="[^"]*\breveal\b/.test(html)) fail(page, 'legacy .reveal class — use .rv');

  // Brahma Muhurta design system (see .impeccable/surfaces/immersive-html.md).
  if (!/family=Anek\+Latin[^"]*family=Mukta/.test(html)) fail(page, 'must load Anek Latin + Mukta');
  if (/Fraunces|Space\+Grotesk|Space\+Mono/.test(html)) fail(page, 'retired font still loaded (Fraunces / Space Grotesk / Space Mono)');
  if (/\bf-serif\b|\bf-disp\b|--gold|--paper|--cream/.test(html)) fail(page, 'retired class or token (f-serif, f-disp, --gold, --paper, --cream)');
  if (/\bbreath-orb\b|\bticker\b|\bbtn-breathe\b|\bfloat-soft\b|\bstat-glow\b|\bsheen\b|data-tilt|data-grow/.test(html)) fail(page, 'retired decorative motion (orb/ticker/breathe/float/glow/sheen/tilt/grow)');
  if (/\bkicker\b/.test(html)) fail(page, 'kicker labels above headings are banned');
  if (/<a\b[^>]*href="https:\/\/wa\.(?:link|me)[^"]*"[^>]*>\s*<span[^>]*>WA<\/span>/.test(html)) fail(page, 'glyph "WA" bubble — use the sticky bar / header action');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail(page, 'must have exactly one <h1>');
  if (/role="tab"/.test(html)) fail(page, 'role="tab" without a tabpanel — filters are toggle buttons (aria-pressed)');
  if (/class="[^"]*\bstory-rail\b[^"]*"[^>]*aria-label/.test(html)) fail(page, 'aria-label on role-less .story-rail');
  if (/<img\b[^>]*\bsrc=""/.test(html)) fail(page, '<img src=""> ships a broken image');
  // Every text-entry control has a <label for>.
  for (const [, tag, id] of html.matchAll(/<(input|select|textarea)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    if (!new RegExp(`<label[^>]*\\bfor="${id}"`).test(html) && !new RegExp(`<label\\b[^>]*>(?:(?!</label>)[^])*?id="${id}"`).test(html)) fail(page, `<${tag} id="${id}"> has no label`);
  }

  // IDs: required present, no duplicates, runtime IDs not hard-coded.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of REQUIRED_IDS) if (!ids.includes(id)) fail(page, `missing required #${id}`);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) fail(page, `duplicate id #${id}`); seen.add(id); }
  if (html.includes('id="concept-classes"')) for (const id of RUNTIME_IDS) if (ids.includes(id)) fail(page, `#${id} is rendered by JS; do not hard-code it`);

  // Anchors resolve.
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!seen.has(id)) fail(page, `broken anchor #${id}`);

  // Local assets / pages exist.
  const refs = [
    ...[...html.matchAll(/(?:src|href|poster|data-lightbox)="([^"#?]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)].map((m) => m[1]),
  ].filter((p) => !/^(https?:|mailto:|tel:|data:|\/\/)/.test(p));
  for (const p of new Set(refs)) if (!existsSync(join(root, p))) fail(page, `missing local file ${p}`);

  // Images: alt required.
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(tag)) fail(page, `<img> without alt: ${tag.slice(0, 80)}`);

  // WhatsApp links open in a new tab safely.
  for (const [tag] of html.matchAll(/<a\b[^>]*href="https:\/\/wa\.(?:link|me)[^"]*"[^>]*>/g)) {
    if (!/target="_blank"/.test(tag) || !/rel="[^"]*noopener/.test(tag)) fail(page, `WhatsApp link without target="_blank" rel="noopener": ${tag.slice(0, 80)}`);
  }

  // Mobile: the shared CSS reserves 56px for a sticky CTA bar — pages must provide it.
  if (!/md:hidden fixed bottom-0 inset-x-0/.test(html)) fail(page, 'missing sticky mobile CTA bar (body reserves 56px for it)');

  if (failures === before) console.log('  ✓ ok');
}

// Shared CSS/JS rules that no single page can prove.
{
  console.log('assets/css/immersive.css + assets/js/immersive.js');
  const before = failures;
  const css = readFileSync(join(root, 'assets/css/immersive.css'), 'utf8');
  const js = readFileSync(join(root, 'assets/js/immersive.js'), 'utf8');
  const reducedBlock = (css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/) || [])[1] || '';
  // Pages carry Tailwind's .scroll-smooth on <html>, which outranks a plain `html {}` rule.
  if (!/scroll-behavior:\s*auto\s*!important/.test(reducedBlock)) fail('css', 'reduced motion must force scroll-behavior: auto !important (html.scroll-smooth outranks it otherwise)');
  // The global focus ring is Blush: invisible on the Blush band (1.00:1), 2.67:1 on Dawn.
  for (const band of ['band-blush', 'band-dawn']) {
    if (!new RegExp(`\\.${band} :focus-visible[^{]*\\{[^}]*outline-color`).test(css)) fail('css', `.${band} needs its own :focus-visible outline-color (Blush ring fails 3:1 there)`);
  }
  if (!/\.story-pin :focus-visible[^{]*\{[^}]*outline-color/.test(css)) fail('css', '.story-pin needs its own :focus-visible outline-color (it turns Dawn and Blush)');
  // Sheet requests must not hang on "Loading…" forever.
  const rawFetches = (js.match(/\bfetch\(/g) || []).length;
  if (!/function fetchSheet\(/.test(js) || !/AbortController/.test(js) || rawFetches !== 1) fail('js', `sheet requests must go through one fetchSheet() with an abort timeout (found ${rawFetches} fetch( calls)`);
  // Without JS the hero video stays at opacity 0 unless a <noscript> style restores it.
  for (const page of pages) {
    const html = readFileSync(join(root, page), 'utf8');
    if (/id="hero-video"/.test(html) && !/<noscript>[\s\S]*?\.hero-video\s*\{\s*opacity:\s*1[\s\S]*?<\/noscript>/.test(html)) fail(page, `${page}: #hero-video needs a <noscript> style restoring opacity (blank plate without JS)`);
  }
  // Field boundaries and dimmed story titles must reach 3:1 on every band (WCAG 1.4.11 / 1.4.3 large text).
  if (!/\.field\s*\{[^}]*border:[^}]*var\(--field-rule/.test(css)) fail('css', '.field border must use --field-rule (the hairline --rule is 1.3–1.8:1)');
  if (!/\.story-title\s*\{[^}]*opacity:\s*var\(--story-dim/.test(css)) fail('css', '.story-title dimming must use --story-dim so Dawn/Blush states can raise it to 3:1');
  if (/\.field::placeholder\s*\{[^}]*opacity:\s*0\.8/.test(css)) fail('css', '.field::placeholder must not be dimmed with opacity (3.27:1 on Dawn)');
  if (!/\.footer a\s*\{[^}]*min-height:\s*44px/.test(css)) fail('css', 'footer links must meet the 44px target minimum (DESIGN.md)');
  // gviz strips the header row itself when it can detect one (parsedNumHeaders); a fixed slice(1) then drops a real row.
  for (const [name, src] of [['assets/js/immersive.js', js], ['assets/js/main.js', readFileSync(join(root, 'assets/js/main.js'), 'utf8')]]) {
    if (!/parsedNumHeaders/.test(src)) fail('js', `${name}: sheet rows must key the header skip on parsedNumHeaders`);
    if (/rows\.slice\(1\)|\[header, \.\.\./.test(src)) fail('js', `${name}: unconditional header skip (rows.slice(1) / [header, ...]) drops the first class`);
  }
  // Blank or 0 price is "not set", never "Free".
  if (/if \(!s \|\| \/\^free\$\/i\.test\(s\)\) return 'Free'/.test(js)) fail('js', 'formatPrice must not turn a blank/0 price into "Free"');
  // Pages paint before the Google Fonts stylesheet arrives; without metric-matched fallbacks the
  // headline reflows twice (measured layout shift up to 0.17 on a throttled phone).
  for (const [fam, token] of [['Anek Latin Fallback', '--font-display'], ['Mukta Fallback', '--font-body']]) {
    if (!new RegExp(`@font-face\\s*\\{[^}]*font-family:\\s*'${fam}'[^}]*size-adjust`).test(css)) fail('css', `missing @font-face '${fam}' with size-adjust`);
    if (!new RegExp(`${token}:[^;]*'${fam}'`).test(css)) fail('css', `${token} must list '${fam}' right after the web font`);
  }
  // Tailwind is precompiled for every page (the CDN is render-blocking and dies without JS).
  const SHARED_VIDEOS = /assets\/video\/(yoga-background|guru|smart|medicalstudents|chairyoga1?)\.mp4/;
  for (const page of pages) {
    const html = readFileSync(join(root, page), 'utf8');
    if (/cdn\.tailwindcss\.com/.test(html)) fail(page, `${page}: loads the Tailwind CDN — link assets/css/immersive.tailwind.css instead`);
    const iCss = html.indexOf('assets/css/immersive.css'), iTw = html.indexOf('assets/css/immersive.tailwind.css');
    if (iTw < 0 || iTw < iCss) fail(page, `${page}: must link immersive.tailwind.css after immersive.css`);
    if (SHARED_VIDEOS.test(html)) fail(page, `${page}: uses a full-size shared video — use the light copy in assets/video/immersive/`);
    if (/id="concept-events"/.test(html) && !/id="concept-events"[\s\S]*?<noscript>[\s\S]*?<\/noscript>\s*<\/div>/.test(html)) fail(page, `${page}: #concept-events needs a <noscript> fallback`);
  }
  // Image weight: plates show at most ~640 CSS px, so nothing an <img src> or poster loads should be heavy.
  // (data-lightbox keeps the full-size original on purpose.)
  const IMG_BUDGET = 200 * 1024;
  for (const page of pages) {
    const html = readFileSync(join(root, page), 'utf8');
    const srcs = new Set([...html.matchAll(/<(?:img|video)\b[^>]*?\b(?:src|poster)="(assets\/images\/[^"]+)"/g)].map((m) => m[1]));
    for (const src of srcs) { const f = join(root, src); if (existsSync(f) && statSync(f).size > IMG_BUDGET) fail(page, `${page}: ${src} is ${Math.round(statSync(f).size / 1024)} KB (budget 200 KB) — use a light copy in assets/images/immersive/`); }
  }
  // Every Tailwind class used in markup must exist in the compiled file (catches a forgotten rebuild for common cases).
  const tw = readFileSync(join(root, 'assets/css/immersive.tailwind.css'), 'utf8').replace(/\\2c /g, ',').replace(/\\/g, ''); // Tailwind escapes a comma as "\2c "
  const missing = new Set();
  for (const page of pages) {
    const html = readFileSync(join(root, page), 'utf8');
    for (const [, cls] of html.matchAll(/class="([^"]+)"/g)) for (const c of cls.split(/\s+/)) {
      if (/^(!?)(?:(?:sm|md|lg|xl):)?(?:[a-z-]+-\[[^\]]+\]|(?:mt|mb|ml|mr|mx|my|pt|pb|px|py|p|gap|gap-x|gap-y|space-y|w|h|max-w|min-h|grid-cols|z|top|bottom|left|right|inset|inset-x|order|col-span)-[a-z0-9./]+|flex|grid|hidden|block|inline|inline-flex|fixed|absolute|relative|sticky|sr-only|uppercase|text-center|items-(?:start|center|end)|justify-(?:center|between))$/.test(c) && !tw.includes('.' + c + '{') && !tw.includes('.' + c + ',') && !tw.includes('.' + c + '>') && !tw.includes('.' + c + ':')) missing.add(c);
    }
  }
  if (missing.size) fail('css', `immersive.tailwind.css is missing classes used in markup (rebuild: npm run build:css): ${[...missing].slice(0, 12).join(' ')}`);
  if (failures === before) console.log('  ✓ ok');
}

// Talk reels (speech, click-to-play): index.html + immersive-stories.html.
// They must never be picked up by the silent-autoplay observers.
const TALK_COUNT = 9;
for (const page of ['index.html', 'immersive-stories.html']) {
  const html = readFileSync(join(root, page), 'utf8');
  console.log(`${page} (talk reels)`);
  const before = failures;
  const talks = [...html.matchAll(/<video\b[^>]*\bdata-talk-video\b[^>]*>[\s\S]*?<\/video>/g)].map((m) => m[0]);
  if (talks.length !== TALK_COUNT) fail(page, `expected ${TALK_COUNT} [data-talk-video], found ${talks.length}`);
  for (const block of talks) {
    const tag = block.match(/<video\b[^>]*>/)[0];
    const src = (block.match(/<source[^>]+src="([^"]+)"/) || [])[1] || '(no source)';
    if (!/\bcontrols\b/.test(tag)) fail(page, `talk video without controls: ${src}`);
    if (!/preload="none"/.test(tag)) fail(page, `talk video must be preload="none": ${src}`);
    if (/\b(autoplay|muted|loop|data-lazy|data-gallery-video)\b/.test(tag)) fail(page, `talk video must be click-to-play with sound (no autoplay/muted/loop/data-lazy/data-gallery-video): ${src}`);
    if (!/aria-label="[^"]+"/.test(tag)) fail(page, `talk video without aria-label: ${src}`);
    for (const [, p] of block.matchAll(/(?:src|poster)="([^"#?]+)"/g)) if (!existsSync(join(root, p))) fail(page, `missing local file ${p}`);
  }
  if (new Set(talks.map((b) => (b.match(/<source[^>]+src="([^"]+)"/) || [])[1])).size !== talks.length) fail(page, 'duplicate talk video source');
  if (failures === before) console.log('  ✓ ok');
}

console.log(`\n${pages.length} pages, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
