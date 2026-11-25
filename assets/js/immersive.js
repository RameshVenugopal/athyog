/**
 * Ath Yog Immersive — shared interactions + live data.
 * Single source of truth extracted from the previously duplicated inline
 * <script> blocks across immersive*.html. Each feature guards on element
 * presence, so any immersive page can load this file safely.
 *
 * Preserved contracts (do not rename without updating all pages):
 *  IDs: #progress, #site-header, #sky-clock (+ #sky-time, #sky-phase),
 *       #mobile-menu, #mobile-menu-btn, #close-mobile-menu, #to-top,
 *       #concept-classes, #concept-filters, #cls-toggle, #cls-count,
 *       #concept-events, #seva-form (+ sv-*), #journey-weeks, #journey-days,
 *       #rail-fill, #rail-week, #immersive-lightbox*
 *  Data attrs: [data-story-step/media/dot/panel], [data-lightbox],
 *              [data-gallery-video], .rv
 *  Styling: every rendered class (cls-row, ev-card, chip …) is defined in
 *  assets/css/immersive.css; templates here never carry colours.
 *  Data sources: same Google Sheets gviz endpoints as index.html/main.js
 */
(function () {
  'use strict';

  var SHEET_ID = '1rBPf1PSmuoq8QM7iTAAV0ydb3SQhOxw8N3557hqbuLE';
  var CLASS_GID = '0';
  var EVENT_GID = '805507452';
  var WA = 'https://wa.link/a0lxj5';
  var WA_NUMBER = 'https://wa.me/919370019475';
  // Chat-bubble mark for WhatsApp actions (drawn, decorative).
  var WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-4.4A8.4 8.4 0 1 1 20 11.5Z"/></svg>';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // Sheet links land in href: allow only http(s)/tel/mailto, else fall back.
  function safeUrl(u, fallback) {
    var s = String(u == null ? '' : u).trim();
    return /^(https?:|mailto:|tel:)/i.test(s) ? esc(s) : fallback;
  }

  // One sheet request path: non-2xx is an error, and a stalled request aborts
  // after 12s so the page falls to its error state instead of "Loading…" forever.
  function fetchSheet(gid) {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 12000) : null;
    return fetch('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&gid=' + gid, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { if (!r.ok) throw new Error('sheet ' + r.status); return r.text(); })
      .then(function (t) { if (timer) clearTimeout(timer); return sheetRows(JSON.parse(t.replace(/^[^\{]+|\);?$/g, ''))); });
  }
  // Body rows only. gviz removes the header row itself when it detects one
  // (parsedNumHeaders > 0: true for the classes sheet, not for events), so
  // skip row 0 only when it did not — otherwise the first class is dropped.
  function sheetRows(data) {
    var rows = data.table.rows.map(function (r) { return r.c.map(function (c) { return c ? c.v : ''; }); });
    return rows.slice(data.table.parsedNumHeaders > 0 ? 0 : 1);
  }

  // Sheet prices are freeform ("3500/-", "Chrges ₹3500", "Rs. 999/- ONLY").
  // Never double the currency symbol; never invent a number that isn't there.
  // A blank or 0 cell means "not set" and renders nothing; only the word
  // "free" renders "Free".
  function formatPrice(p) {
    var s = String(p == null ? '' : p).trim();
    if (/^free$/i.test(s)) return 'Free';
    if (!s || /^0+(\.0+)?$/.test(s)) return '';
    if (/[₹]|rs\.?|inr/i.test(s)) return s;
    var m = s.match(/[\d,]+/);
    return m ? '₹' + m[0] : s;
  }

  /* ---------- Hero video: single visual source, dissolve in when frames are ready.
     Previously a static layer + video poster + first frame fought each other.
     The video now starts transparent and fades in on first frames; the poster
     is the only fallback. Reduced-motion users get the still poster. ---------- */
  var heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    var heroShown = function () { heroVideo.classList.add('is-live'); };
    if (reduced) {
      heroShown();
    } else {
      heroVideo.addEventListener('playing', heroShown, { once: true });
      heroVideo.addEventListener('canplay', heroShown, { once: true });
      // Safety: never leave the hero invisible if the video stalls.
      setTimeout(heroShown, 2500);
      // Start the 5 MB video only after the page and web fonts have loaded so it doesn't compete with them.
      var startHero = function () {
        var play = function () { heroVideo.play().catch(heroShown); };
        requestAnimationFrame(function () {
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(play, play);
          else play();
        });
      };
      if (document.readyState === 'complete') startHero();
      else window.addEventListener('load', startHero, { once: true });
    }
    heroVideo.addEventListener('error', function () {
      heroVideo.pause();
      heroVideo.removeAttribute('src');
      heroVideo.load();
      heroShown();
    }, true);
  }

  /* ---------- Scroll: progress + header + parallax + rails + to-top ---------- */
  var progress = document.getElementById('progress');
  var header = document.getElementById('site-header');
  var skyTime = document.getElementById('sky-time');
  var skyPhase = document.getElementById('sky-phase');
  var dayMarks = document.querySelectorAll('#journey-days .day-mark');
  var weeks = document.getElementById('journey-weeks');
  var railFill = document.getElementById('rail-fill');
  var railWeek = document.getElementById('rail-week');
  var toTop = document.getElementById('to-top');
  var CLOCK_START = 4 * 60 + 45, CLOCK_END = 7 * 60;
  var ticking = false;

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = h.scrollTop || window.pageYOffset || 0;
    var p = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = 'scaleX(' + p + ')';
    if (header) header.classList.toggle('scrolled', y > 40);

    // The clock: reading the page is the morning sadhana, 04:45 → 07:00.
    if (skyTime) {
      var mins = Math.round(CLOCK_START + p * (CLOCK_END - CLOCK_START));
      var label = pad2(Math.floor(mins / 60)) + ':' + pad2(mins % 60);
      if (skyTime.textContent !== label) skyTime.textContent = label;
      if (skyPhase) {
        var phase = mins < 330 ? 'Brahma Muhurta' : (mins < 405 ? 'Practice' : 'Sunrise');
        if (skyPhase.textContent !== phase) skyPhase.textContent = phase;
      }
    }

    /* 21-day journey rail (practice page + future home use) */
    if (weeks && railFill) {
      var wr = weeks.getBoundingClientRect();
      var wp = Math.max(0, Math.min(1, (h.clientHeight * 0.7 - wr.top) / (wr.height || 1)));
      railFill.style.transform = 'scaleY(' + wp + ')';
      if (railWeek) railWeek.textContent = String(1 + Math.min(2, Math.floor(wp * 3)));
      // 21 day marks share the same clock: tick done, flag today, ring ahead.
      if (dayMarks.length) {
        var today = Math.min(20, Math.floor(wp * 21));
        for (var d = 0; d < dayMarks.length; d++) {
          dayMarks[d].classList.toggle('done', d < today);
          dayMarks[d].classList.toggle('today', d === today);
        }
      }
    }

    if (toTop) {
      var showTop = y > h.clientHeight * 1.4;
      toTop.classList.toggle('opacity-0', !showTop);
      toTop.classList.toggle('pointer-events-none', !showTop);
    }

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById('mobile-menu');
  var openBtn = document.getElementById('mobile-menu-btn');
  var closeBtn = document.getElementById('close-mobile-menu');
  function toggleMenu(force) {
    if (!menu) return;
    var show = typeof force === 'boolean' ? force : menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !show);
    menu.classList.toggle('flex', show);
    document.body.classList.toggle('overflow-hidden', show);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(show));
    // AX: the open menu is modal. Everything else goes inert, so Tab cannot
    // leave it (and cannot fall into the map iframe, which swallows Escape).
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== menu && el.tagName !== 'SCRIPT') {
        if (show) el.setAttribute('inert', ''); else el.removeAttribute('inert');
      }
    });
  }
  if (openBtn) openBtn.addEventListener('click', function () { toggleMenu(true); if (closeBtn) closeBtn.focus(); });
  if (closeBtn) closeBtn.addEventListener('click', function () { toggleMenu(false); if (openBtn) openBtn.focus(); });
  // AX: Escape closes the menu and returns focus to the trigger.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.classList.contains('hidden')) {
      toggleMenu(false);
      if (openBtn) openBtn.focus();
    }
  });
  if (menu) {
    var menuLinks = menu.querySelectorAll('a');
    for (var m = 0; m < menuLinks.length; m++) {
      menuLinks[m].addEventListener('click', function () { toggleMenu(false); });
    }
  }
  var toTopBtn = document.getElementById('to-top');
  if (toTopBtn) toTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- Scrollspy (anchor nav only; cross-page nav unaffected) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#site-header nav a[href^="#"]'));
  function setActiveNav(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('nav-on', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['breathe', 'move', 'rest', 'classes', 'events', 'gatherings', 'journey', 'about', 'testimonials', 'voices', 'gallery', 'support', 'contact', 'first-class'].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Pinned Breathe→Move→Rest story ---------- */
  var storySteps = document.querySelectorAll('[data-story-step]');
  var storyMedia = document.querySelectorAll('[data-story-media]');
  var storyDots = document.querySelectorAll('[data-story-dot]');
  var storyPanels = document.querySelectorAll('[data-story-panel]');
  function setStory(index) {
    storySteps.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-story-step') === String(index)); });
    storyMedia.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-story-media') === String(index)); });
    storyDots.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-story-dot') === String(index)); });
    storyPanels.forEach(function (el) { el.classList.toggle('active', el.getAttribute('data-story-panel') === String(index)); });
  }
  if ('IntersectionObserver' in window && storySteps.length) {
    var storyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setStory(entry.target.getAttribute('data-story-step'));
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    storySteps.forEach(function (step) { storyIO.observe(step); });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById('immersive-lightbox');
  var lightboxImage = document.getElementById('immersive-lightbox-image');
  var lightboxCaption = document.getElementById('immersive-lightbox-caption');
  var lightboxClose = document.getElementById('immersive-lightbox-close');
  function openLightbox(tile) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = tile.getAttribute('data-lightbox');
    var inner = tile.querySelector('img');
    lightboxImage.alt = inner ? (inner.alt || '') : (tile.getAttribute('data-caption') || '');
    if (lightboxCaption) lightboxCaption.textContent = tile.getAttribute('data-caption') || '';
    if (lightbox.showModal) lightbox.showModal();
  }
  document.querySelectorAll('[data-lightbox]').forEach(function (tile) {
    tile.addEventListener('click', function () { openLightbox(tile); });
    tile.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(tile); }
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', function () { lightbox.close(); });
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Gallery videos: play only in view, never for reduced-motion ---------- */
  var galleryVideos = document.querySelectorAll('[data-gallery-video]');
  if ('IntersectionObserver' in window && galleryVideos.length) {
    var videoIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting && !reduced) video.play().catch(function () {});
        else video.pause();
      });
    }, { threshold: 0.35 });
    galleryVideos.forEach(function (video) { videoIO.observe(video); });
  }

  /* ---------- Talk reels: user-started, with sound; one plays at a time ---------- */
  var talkVideos = document.querySelectorAll('[data-talk-video]');
  talkVideos.forEach(function (video) {
    video.addEventListener('play', function () {
      talkVideos.forEach(function (other) { if (other !== video) other.pause(); });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.rv').forEach(function (el) {
    if (reduced) el.classList.add('in');
    else if (revealIO) revealIO.observe(el);
  });

  /* ---------- Animated counters ---------- */
  var stats = document.querySelector('.stats-section');
  if (stats && 'IntersectionObserver' in window) {
    var counters = stats.querySelectorAll('.counter-value');
    var started = false;
    var cio = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) {
        started = true;
        counters.forEach(function (c) {
          var target = parseInt(c.getAttribute('data-target'), 10);
          if (isNaN(target)) return; // static number, not a counter — leave it alone
          var suffix = c.getAttribute('data-suffix') || '';
          if (reduced || !(target >= 0)) { c.textContent = target.toLocaleString('en-IN') + suffix; return; }
          var t0 = null, dur = 1600;
          function tick(t) {
            if (!t0) t0 = t;
            var q = Math.min(1, (t - t0) / dur);
            var eased = 1 - Math.pow(1 - q, 3);
            c.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
            if (q < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        cio.disconnect();
      }
    }, { threshold: 0.4 });
    cio.observe(stats);
  }

  /* ---------- Live events (same sheet as index.html #events) ---------- */
  var events = document.getElementById('concept-events');
  if (events) {
    var eventLimit = parseInt(events.getAttribute('data-limit') || '0', 10);

    /* ----- Event card helpers: tolerant date/time parsing + client-side ICS ----- */
    var EV_MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    var EV_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function evMonthIndex(name) {
      var k = String(name || '').slice(0, 3).toLowerCase();
      return Object.prototype.hasOwnProperty.call(EV_MONTHS, k) ? EV_MONTHS[k] : -1;
    }
    // Sheet dates are freeform ("12 Oct 2026", "Oct 12", "12/10/2026",
    // "2nd March to 30th March", "January 1-31, 2026"). Ranges resolve to
    // their START date. Numeric dates are read as Indian DD/MM(/YY).
    // Returns a Date or null — callers must never hide unparseable rows.
    function parseEventDate(str) {
      var s = String(str || '').trim();
      if (!s) return null;
      var m, day, mo, yr;
      var thisYear = new Date().getFullYear();
      var ORD = '(?:\\s*(?:st|nd|rd|th))?';
      m = s.match(new RegExp('(\\d{1,2})' + ORD + '\\s+([A-Za-z]{3,9})\\s*,?\\s*(\\d{4})?'));
      if (m && evMonthIndex(m[2]) >= 0) {
        day = parseInt(m[1], 10); mo = evMonthIndex(m[2]); yr = m[3] ? parseInt(m[3], 10) : thisYear;
      } else if ((m = s.match(new RegExp('([A-Za-z]{3,9})\\s+(\\d{1,2})' + ORD + '\\s*,?\\s*(\\d{4})?'))) && evMonthIndex(m[1]) >= 0) {
        mo = evMonthIndex(m[1]); day = parseInt(m[2], 10); yr = m[3] ? parseInt(m[3], 10) : thisYear;
      } else if ((m = s.match(/(\d{1,2})\s*[\/\-.]\s*(\d{1,2})(?:\s*[\/\-.]\s*(\d{2,4}))?/))) {
        day = parseInt(m[1], 10); mo = parseInt(m[2], 10) - 1; yr = m[3] ? parseInt(m[3], 10) : thisYear;
        if (yr < 100) yr += 2000;
        if (mo < 0 || mo > 11 || day < 1 || day > 31) return null;
      } else {
        return null;
      }
      var dt = new Date(yr, mo, day);
      if (isNaN(dt.getTime()) || dt.getDate() !== day || dt.getMonth() !== mo) return null;
      return dt;
    }
    function validDay(y, m, d) {
      if (m < 0 || m > 11 || d < 1 || d > 31) return null;
      var dt = new Date(y, m, d);
      if (isNaN(dt.getTime()) || dt.getDate() !== d || dt.getMonth() !== m) return null;
      return dt;
    }
    // Date ranges resolve to {start, end}; single dates to {start: d, end: d}.
    // Returns null when nothing is parseable — those rows are ALWAYS kept.
    function parseEventRange(str) {
      var s = String(str || '');
      if (!s.trim()) return null;
      var thisYear = new Date().getFullYear();
      var ORD = '(?:\\s*(?:st|nd|rd|th))?';
      var m, mo, mo2, yr, start, end;
      // "January 1-31, 2026"
      m = s.match(new RegExp('([A-Za-z]{3,9})\\s+(\\d{1,2})' + ORD + '\\s*[–—-]\\s*(\\d{1,2})' + ORD + '\\s*,?\\s*(\\d{4})?'));
      if (m && evMonthIndex(m[1]) >= 0) {
        mo = evMonthIndex(m[1]); yr = m[4] ? parseInt(m[4], 10) : thisYear;
        start = validDay(yr, mo, parseInt(m[2], 10));
        end = validDay(yr, mo, parseInt(m[3], 10));
        if (start && end) return { start: start, end: end };
      }
      // "2nd March to 30th March [2026]" / "2–27 February 2026" (start month optional)
      m = s.match(new RegExp('(\\d{1,2})' + ORD + '\\s*(?:([A-Za-z]{3,9})\\s*)?(?:to|[–—-])\\s*(\\d{1,2})' + ORD + '\\s+([A-Za-z]{3,9})\\s*,?\\s*(\\d{4})?'));
      if (m) {
        mo2 = evMonthIndex(m[4]);
        mo = (m[2] && evMonthIndex(m[2]) >= 0) ? evMonthIndex(m[2]) : mo2;
        if (mo2 >= 0) {
          yr = m[5] ? parseInt(m[5], 10) : thisYear;
          start = validDay(yr, mo, parseInt(m[1], 10));
          end = validDay(yr, mo2, parseInt(m[3], 10));
          if (start && end) {
            if (end < start) end = new Date(end.getFullYear() + 1, end.getMonth(), end.getDate());
            return { start: start, end: end };
          }
        }
      }
      var d = parseEventDate(s);
      return d ? { start: d, end: d } : null;
    }
    // Pure selection: hide ended gatherings (range end before today),
    // dated rows ascending, undated rows last in sheet order.
    function selectUpcoming(list, today) {
      today = today ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    : (function () { var t = new Date(); t.setHours(0, 0, 0, 0); return t; })();
      var dated = [], undated = [];
      list.forEach(function (e) {
        var rng = parseEventRange(e[1]);
        if (!rng) { undated.push(e); return; }
        var end = new Date(rng.end.getFullYear(), rng.end.getMonth(), rng.end.getDate());
        if (end < today) return; // ended — never advertise the past as upcoming
        dated.push([rng.start.getTime(), e]);
      });
      dated.sort(function (a, b) { return a[0] - b[0]; });
      return dated.map(function (p) { return p[1]; }).concat(undated);
    }
    function parseTimeToken(tok) {
      var s = String(tok || '').trim();
      var m = s.match(/(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?\s*[Mm]\.?/);
      if (m) {
        var h = parseInt(m[1], 10) % 12;
        if (/^[Pp]/.test(m[3])) h += 12;
        return { h: h, min: m[2] ? parseInt(m[2], 10) : 0, mer: true };
      }
      m = s.match(/^(\d{1,2}):(\d{2})$/);
      if (m && +m[1] < 24 && +m[2] < 60) return { h: +m[1], min: +m[2], mer: false };
      return null;
    }
    // Returns {start, end}; defaults 10:00-12:00.
    // Shared-meridiem ranges first ("5:30-7 AM", "5–7 PM"), then token pairs.
    function parseEventTimes(str) {
      // Normalize sheet quirks: "4;45 AM" and "9.00pm" mean "4:45 AM" / "9:00pm".
      var s = String(str || '').replace(/(\d)\s*;\s*(\d)/g, '$1:$2').replace(/(\d)\.(\d{2})(?=\s*[AaPp]\.?)/g, '$1:$2');
      var r = s.match(/(\d{1,2})(?::(\d{2}))?\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?\s*[Mm]\.?/);
      if (r) {
        var pm = /^[Pp]/.test(r[5]);
        var sh = parseInt(r[1], 10) % 12, sm = r[2] ? parseInt(r[2], 10) : 0;
        var eh = parseInt(r[3], 10) % 12, em = r[4] ? parseInt(r[4], 10) : 0;
        if (pm) { if (sh < 12) sh += 12; eh += 12; }
        if (eh > 23) eh = 23;
        return { start: { h: sh, min: sm }, end: { h: eh, min: em } };
      }
      var toks = s.match(/\d{1,2}(?::\d{2})?\s*[AaPp]\.?\s*[Mm]\.?|\d{1,2}:\d{2}/g) || [];
      var start = toks.length ? parseTimeToken(toks[0]) : null;
      // First session wins: "5:30 AM … 7:15 AM - 8:15 AM" means 5:30–6:45.
      var end = toks.length > 1 ? parseTimeToken(toks[1]) : null;
      if (!start) start = { h: 10, min: 0, mer: false };
      if (!end) { end = { h: start.h + 2, min: start.min, mer: false }; }
      else if (!start.mer && end.mer && end.h >= 12 && start.h < 12) start.h += 12;
      if (end.h > 23) end.h = 23;
      return { start: start, end: end };
    }
    function icsEsc(s) {
      return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
    }
    function icsStamp(d) {
      return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + 'T' + pad2(d.getHours()) + pad2(d.getMinutes()) + '00';
    }
    function slugify(s) {
      return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'ath-yog-event';
    }
    // "Today" / "Tomorrow" / "In N days" for upcoming dates; '' otherwise
    // (past or unparseable rows are still shown — never hidden by the UI).
    function relativeDayLabel(d, now) {
      if (!d) return '';
      now = now || new Date();
      var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      var b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      var diff = Math.round((a - b) / 86400000);
      if (diff < 0) return '';
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff < 14) return 'In ' + diff + ' days';
      return '';
    }
    // Status cells double as shouty banners — keep one tidy line.
    function shortStatus(s) {
      var t = String(s || 'Workshop').trim().replace(/\s+/g, ' ');
      if (t.length > 48) t = t.slice(0, 48).replace(/\s+\S*$/, '') + '…';
      return t;
    }
    function buildICS(p) {
      var start = new Date(p.dateObj.getTime());
      start.setHours(p.start.h, p.start.min, 0, 0);
      var end = new Date(p.dateObj.getTime());
      end.setHours(p.end.h, p.end.min, 0, 0);
      if (end <= start) end = new Date(start.getTime() + 2 * 3600 * 1000);
      return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ath Yog//Events//EN', 'BEGIN:VEVENT',
        'UID:' + slugify(p.title) + '-' + icsStamp(start) + '@athyog.in',
        'DTSTART:' + icsStamp(start),
        'DTEND:' + icsStamp(end),
        'SUMMARY:' + icsEsc(p.title),
        'LOCATION:' + icsEsc(p.location || 'Ath Yog, Pune'),
        'DESCRIPTION:' + icsEsc(p.desc || 'Join us for this transformative session.'),
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    }
    var icsCache = [];
    // "Save any date" only makes sense when there are dates to save.
    function hideSaveHint() {
      document.querySelectorAll('[data-ev-hint]').forEach(function (el) { el.hidden = true; });
    }
    function eventCardHTML(e, i) {
      var title = String(e[0] || 'Upcoming Event');
      var dateStr = String(e[1] || ''), timeStr = String(e[2] || ''), loc = String(e[3] || '');
      var price = formatPrice(e[4]), desc = String(e[5] || '');
      var status = shortStatus(e[7]);
      var link = safeUrl(e[6], WA);
      var rng = parseEventRange(dateStr);
      var d = rng ? rng.start : null;
      var rel = relativeDayLabel(d);
      if (rel) status += ' · ' + rel;
      var badge, dateRow, icsBtn = '';
      if (d) {
        var iso = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
        badge = '<div class="ev-badge" aria-hidden="true"><span class="ev-day">' + d.getDate() + '</span><span class="ev-mon">' + EV_MON[d.getMonth()] + '</span></div>';
        dateRow = '<p><strong>Date</strong> <time datetime="' + iso + '">' + esc(dateStr) + '</time></p>';
        var times = parseEventTimes(timeStr);
        icsCache[i] = { title: title, dateObj: d, start: times.start, end: times.end, location: loc, desc: (desc || 'Join us for this transformative session.') + ' · Register: ' + (e[6] || WA) };
        icsBtn = '<button type="button" class="ev-ics" data-ics="' + i + '" aria-label="Add ' + esc(title) + ' to your calendar">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>' +
          '<span>Save date</span></button>';
      } else {
        icsCache[i] = null;
        badge = '<div class="ev-badge ev-badge--na" aria-hidden="true"><span class="ev-day">TBD</span></div>';
        dateRow = dateStr ? '<p><strong>Date</strong> ' + esc(dateStr) + '</p>' : '';
      }
      return '<article class="ev-card">' + badge +
        '<div class="min-w-0"><p class="ev-status">' + esc(status) + '</p>' +
          '<h3 class="ev-title">' + esc(title) + '</h3>' +
          '<div class="ev-facts">' + dateRow +
            (timeStr ? '<p><strong>Time</strong> ' + esc(timeStr) + '</p>' : '') +
            (loc ? '<p><strong>Where</strong> ' + esc(loc) + '</p>' : '') + '</div>' +
          '<p class="ev-desc">' + esc(desc || 'Join us for this transformative session.') + '</p></div>' +
        '<div class="ev-actions">' + (price ? '<span class="ev-price">' + esc(price) + '</span>' : '') + icsBtn +
          '<a href="' + link + '" target="_blank" rel="noopener" class="link">Register →</a></div>' +
        '</article>';
    }
    // One delegated listener (container persists across innerHTML renders).
    events.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-ics]') : null;
      if (!btn || !events.contains(btn)) return;
      var p = icsCache[parseInt(btn.getAttribute('data-ics'), 10)];
      if (!p) return;
      var blob = new Blob([buildICS(p)], { type: 'text/calendar' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = slugify(p.title) + '.ics';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    });
    fetchSheet(EVENT_GID)
      .then(function (rows) {
        var list = rows.filter(function (e) { return e[0] && String(e[0]).trim() !== ''; });
        list = selectUpcoming(list);
        if (eventLimit > 0) list = list.slice(0, eventLimit);
        if (!list.length) {
          hideSaveHint();
          events.innerHTML = '<div class="ev-empty"><h3 class="h3">We are planning new workshops.</h3>'
            + '<a class="btn-sun" href="' + WA + '" target="_blank" rel="noopener">' + WA_ICON + 'Ask to be notified on WhatsApp</a></div>';
          return;
        }
        events.innerHTML = list.map(eventCardHTML).join('');
      })
      .catch(function () {
        hideSaveHint();
        events.innerHTML = '<div class="ev-empty"><h3 class="h3">Events are temporarily unavailable.</h3>'
            + '<a class="btn-sun" href="' + WA + '" target="_blank" rel="noopener">' + WA_ICON + 'Ask us on WhatsApp</a></div>';
      });
  }

  /* ---------- Live classes (same sheet as index.html #services) ---------- */
  var grid = document.getElementById('concept-classes');
  function rowHTML(c) {
    var title = esc(c[1]), desc = esc(c[2]), dur = esc(c[5]) || 'course';
    var price = esc(formatPrice(c[4]));
    // Slim Smart Sadhana pricing is deliberately kept off the immersive pages (PRODUCT.md).
    if (String(c[0]).trim().toLowerCase() === 'slim-smart-sadhana') price = '';
    var cat = String(c[6] || 'General').trim();
    var catLabel = cat.replace(/[-_]+/g, ' ').replace(/^\w/, function (ch) { return ch.toUpperCase(); });
    var tags = String(c[7] || '').toLowerCase().split(',').map(function (t) { return t.trim().replace(/\s+/g, '-'); }).join(' ');
    var wa = safeUrl(c[9], WA);
    return '<article class="cls-row cls-item" data-category="'
      + esc(cat.toLowerCase().replace(/\s+/g, '-') + ' ' + tags) + '">'
      + '<div class="min-w-0"><h3>' + title + '</h3>'
      + (desc ? '<p class="cls-desc">' + desc + '</p>' : '')
      + '<p class="cls-meta">' + esc(catLabel) + (price ? ' · ' + price + ' / ' + dur : '') + '</p></div>'
      + '<a href="' + wa + '" target="_blank" rel="noopener" class="link cls-cta" aria-label="Enquire about ' + title + ' on WhatsApp">Enquire</a>'
      + '</article>';
  }
  var clsFilter = 'all', clsExpanded = false;
  var clsToggle = document.getElementById('cls-toggle');
  function paintClsRows() {
    if (!grid) return;
    var items = document.querySelectorAll('#concept-classes .cls-item');
    var previewLimit = parseInt(grid.getAttribute('data-preview') || '5', 10);
    var shown = 0, matchIndex = 0;
    items.forEach(function (item) {
      var hit = clsFilter === 'all' || (item.getAttribute('data-category') || '').indexOf(clsFilter) !== -1;
      var vis = hit && (clsFilter !== 'all' || clsExpanded || matchIndex < previewLimit);
      if (hit) matchIndex++;
      item.style.display = vis ? '' : 'none';
      if (vis) shown++;
    });
    var total = parseInt(grid.dataset.total || '0', 10);
    var cc = document.getElementById('cls-count');
    if (cc) cc.textContent = (clsFilter === 'all' && !clsExpanded && total > previewLimit)
      ? ('Showing ' + previewLimit + ' of ' + total)
      : (clsFilter === 'all' ? (total + ' batches live') : ('Showing ' + shown + ' of ' + total));
    if (clsToggle) {
      var useToggle = clsFilter === 'all' && total > previewLimit;
      clsToggle.classList.toggle('hidden', !useToggle);
      if (useToggle) clsToggle.innerHTML = clsExpanded ? 'Show less ↑' : 'Show all ' + total + ' ↓';
    }
  }
  if (grid) {
    // Preview grids (home) link to the full filtered list; the full list does not link to itself.
    var moreHref = grid.getAttribute('data-more');
    fetchSheet(CLASS_GID)
      .then(function (rows) {
        var courses = rows.filter(function (c) { return c[1] && String(c[1]).trim() !== ''; });
        if (!courses.length) {
          grid.innerHTML = '<p class="py-10 muted">Schedule updating — <a class="link" href="' + WA + '" target="_blank" rel="noopener">ask on WhatsApp</a>.</p>';
          return;
        }
        grid.innerHTML = courses.map(rowHTML).join('')
          + '<p class="pt-5 small muted"><span id="cls-count">' + courses.length + ' batches live</span>'
          + (moreHref ? ' · <a class="link" href="' + esc(moreHref) + '">see all with filters</a>' : '') + '</p>';
        grid.dataset.total = courses.length;
        paintClsRows();
      })
      .catch(function () {
        grid.innerHTML = '<p class="py-10 muted">Could not load the live schedule. <a class="link" href="' + WA + '" target="_blank" rel="noopener">Ask on WhatsApp</a> or <button type="button" class="link" data-retry>retry</button>.</p>';
        var retry = grid.querySelector('[data-retry]');
        if (retry) retry.addEventListener('click', function () { window.location.reload(); });
      });
    document.querySelectorAll('#concept-filters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('#concept-filters .chip').forEach(function (c) {
          c.classList.remove('on');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('on');
        chip.setAttribute('aria-pressed', 'true');
        clsFilter = chip.getAttribute('data-filter');
        paintClsRows();
      });
    });
    if (clsToggle) clsToggle.addEventListener('click', function () { clsExpanded = !clsExpanded; paintClsRows(); });
  }

  /* ---------- Seva donation form → WhatsApp ---------- */
  var sevaForm = document.getElementById('seva-form');
  if (sevaForm) {
    var svAmount = document.getElementById('sv-amount');
    document.querySelectorAll('.sv-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.sv-chip').forEach(function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('on');
        chip.setAttribute('aria-pressed', 'true');
        if (svAmount) { svAmount.value = chip.getAttribute('data-amount'); svAmount.focus(); }
      });
    });
    sevaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      function val(id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }
      var lines = [
        'Namaste Ath Yog! I would like to donate.',
        'Name: ' + val('sv-name'),
        'Phone: ' + val('sv-phone'),
        'Amount: Rs.' + val('sv-amount'),
        'Purpose: ' + val('sv-purpose')
      ];
      var email = val('sv-email'), pan = val('sv-pan'), address = val('sv-address');
      if (email) lines.push('Email: ' + email);
      if (pan) lines.push('PAN (for 80G): ' + pan.toUpperCase());
      if (address) lines.push('Address: ' + address);
      var need80g = document.getElementById('sv-80g');
      lines.push('Need 80G receipt: ' + (need80g && need80g.checked ? 'Yes' : 'No'));
      window.open(WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    });
  }

})();
