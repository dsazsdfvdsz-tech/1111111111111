/* ============================================================
   Salman — Academic Writer Portfolio · v2
   Main script. Powered by `motion` (ESM CDN) for animations.
   Handles: theme toggle, scroll progress, cursor spotlight,
   nav, mobile menu, work filter, library filter, hero word
   reveal, hero word rotator, magnetic CTAs, stat counters,
   reveal-on-scroll, sticky mobile CTA bar.

   The page stays fully usable if motion fails to load — every
   .reveal element falls back to visible after a short timeout.
   ============================================================ */

(function () {
  'use strict';

  const ready = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  /* ---------- Theme (runs immediately to avoid FOUC) ---------- */
  const THEME_KEY = 'salman-theme';
  const root = document.documentElement;
  const getSaved = () => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  };
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#13120f' : '#f7f3ec');
  };
  const initial =
    getSaved() ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial);

  /* ---------- Reveal safety net (always runs as a hard floor) ---------- */
  const forceRevealAll = () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  };
  // After 1.2s, anything still hidden gets force-shown so content never strands.
  setTimeout(forceRevealAll, 1200);

  // Wait briefly for motion ESM module to finish loading before running.
  // Falls back after 600ms so the page never stalls if motion fails.
  const waitForMotion = () => new Promise((resolve) => {
    if (window.motion) return resolve();
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    window.addEventListener('motion-ready', finish, { once: true });
    setTimeout(finish, 600);
  });

  ready(async () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = !window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    if (window.lucide) lucide.createIcons();

    await waitForMotion();

    /* ---------- Hero heading: wrap words for masked reveal ---------- */
    const heroH = document.getElementById('hero-h');
    if (heroH && !reduced) {
      // Walk only direct text nodes (skip the rotator <span>).
      const wrapTextNodes = (parent) => {
        const nodes = [];
        parent.childNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) nodes.push(n);
        });
        let wi = 0;
        nodes.forEach((node) => {
          const parts = node.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const outer = document.createElement('span');
            outer.className = 'word';
            outer.style.setProperty('--i', wi++);
            const inner = document.createElement('span');
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.parentNode.replaceChild(frag, node);
        });
      };
      wrapTextNodes(heroH);
      requestAnimationFrame(() => heroH.classList.add('is-in'));
    }

    /* ---------- Theme toggle buttons ---------- */
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch {}
        btn.animate(
          [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(360deg) scale(1.08)' }, { transform: 'rotate(360deg) scale(1)' }],
          { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      });
    });

    /* ---------- Mobile menu (slide-in) ---------- */
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    const setMenu = (open) => {
      if (!menu || !burger) return;
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      burger.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', open ? 'x' : 'menu');
      i.className = 'w-5 h-5';
      burger.appendChild(i);
      if (window.lucide) lucide.createIcons();
    };
    burger?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu?.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setMenu(false))
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false);
    });

    /* ---------- Nav scrolled bg + scroll progress + sticky mobile CTA ---------- */
    const nav = document.getElementById('siteNav');
    const progress = document.getElementById('scrollProgressBar');
    const stickyCTA = document.getElementById('mobileCTA');
    const onScroll = () => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('nav-scrolled', y > 20);
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (y / h) * 100 : 0;
        progress.style.width = pct + '%';
      }
      if (stickyCTA) {
        // Show after first viewport, hide near footer
        const showAfter = window.innerHeight * 0.85;
        const docH = document.documentElement.scrollHeight;
        const nearBottom = (y + window.innerHeight) > (docH - 220);
        stickyCTA.classList.toggle('is-shown', y > showAfter && !nearBottom);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* ---------- Work filter ---------- */
    const tabs = document.querySelectorAll('[data-work-tabs] .filter-tab');
    const cards = document.querySelectorAll('.work-card');
    tabs.forEach((t) =>
      t.addEventListener('click', () => {
        tabs.forEach((x) => {
          x.classList.remove('active');
          x.setAttribute('aria-selected', 'false');
        });
        t.classList.add('active');
        t.setAttribute('aria-selected', 'true');
        const f = t.dataset.filter;
        cards.forEach((c) => {
          const show = f === 'all' || c.dataset.cat === f;
          if (show) {
            c.style.display = '';
            if (window.motion && !reduced) {
              window.motion.animate(c, { opacity: [0, 1], y: [14, 0], scale: [.98, 1] }, { duration: .5, easing: [.2,.8,.2,1] });
            }
          } else {
            c.style.display = 'none';
          }
        });
      })
    );

    /* ---------- Sample-library filter ---------- */
    const libTabs = document.querySelectorAll('[data-lib-tabs] .filter-tab');
    const libCards = document.querySelectorAll('.lib-card');
    libTabs.forEach((t) =>
      t.addEventListener('click', () => {
        libTabs.forEach((x) => {
          x.classList.remove('active');
          x.setAttribute('aria-selected', 'false');
        });
        t.classList.add('active');
        t.setAttribute('aria-selected', 'true');
        const f = t.dataset.filter;
        libCards.forEach((c) => {
          const show = f === 'all' || c.dataset.cat === f;
          c.classList.toggle('is-hidden', !show);
          if (show && window.motion && !reduced) {
            window.motion.animate(c, { opacity: [0, 1], y: [14, 0] }, { duration: .45, easing: [.2,.8,.2,1] });
          }
        });
      })
    );

    /* ---------- Cursor spotlight (desktop pointer only) ---------- */
    const spot = document.getElementById('cursorSpot');
    const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (spot && canHover && !reduced) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const loop = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        spot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        document.documentElement.style.setProperty('--mx', (tx / window.innerWidth * 100) + '%');
        document.documentElement.style.setProperty('--my', (ty / window.innerHeight * 100) + '%');
        raf = null;
      };
      window.addEventListener('mousemove', (e) => {
        tx = e.clientX; ty = e.clientY;
        spot.classList.add('is-active');
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
      window.addEventListener('mouseleave', () => spot.classList.remove('is-active'));
    }

    /* ---------- Rotating hero word ---------- */
    const rotator = document.querySelector('[data-rotator]');
    if (rotator && !reduced) {
      const words = (rotator.dataset.words || '')
        .split('|').map((w) => w.trim()).filter(Boolean);
      const wordEl = rotator.querySelector('.rotator__word');
      let idx = 0;
      const cycle = () => {
        const next = words[(idx + 1) % words.length];
        const animateOut = () => {
          if (window.motion) {
            return window.motion.animate(wordEl, { y: [0, -28], opacity: [1, 0] }, { duration: .35, easing: [.4,0,.6,1] }).finished;
          }
          wordEl.style.transition = 'transform .35s ease, opacity .35s ease';
          wordEl.style.transform = 'translateY(-28px)';
          wordEl.style.opacity = '0';
          return new Promise((r) => setTimeout(r, 360));
        };
        const animateIn = () => {
          if (window.motion) {
            return window.motion.animate(wordEl, { y: [28, 0], opacity: [0, 1] }, { duration: .5, easing: [.2,.8,.2,1] }).finished;
          }
          wordEl.style.transform = 'translateY(28px)';
          wordEl.style.opacity = '0';
          requestAnimationFrame(() => {
            wordEl.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), opacity .5s ease';
            wordEl.style.transform = 'translateY(0)';
            wordEl.style.opacity = '1';
          });
          return new Promise((r) => setTimeout(r, 520));
        };
        animateOut().then(() => {
          wordEl.textContent = next;
          idx = (idx + 1) % words.length;
          return animateIn();
        });
      };
      setInterval(cycle, 2400);
    }

    /* ---------- Stat counters ---------- */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      const animateCount = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isFloat = String(target).includes('.');
        const dur = 1700;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = target * eased;
          el.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      counters.forEach((c) => io.observe(c));
    }

    /* ---------- Reveal on scroll using IntersectionObserver + motion ---------- */
    const useMotion = () => window.motion && !reduced;
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (useMotion()) {
            window.motion.animate(el, { opacity: [0, 1], y: [22, 0] }, { duration: .85, easing: [.2,.8,.2,1] });
          } else {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
          obs.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      revealEls.forEach((el) => io.observe(el));
    }

    // Section group reveals — stagger children when section enters
    const sections = document.querySelectorAll('section[data-stagger]');
    sections.forEach((sec) => {
      const items = sec.querySelectorAll('[data-stagger-item]');
      if (!items.length) return;
      // Initial state
      items.forEach((it) => {
        it.style.opacity = '0';
        it.style.transform = 'translateY(22px)';
        it.style.willChange = 'transform,opacity';
      });
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (useMotion()) {
            items.forEach((it, i) => {
              window.motion.animate(it,
                { opacity: [0, 1], y: [22, 0] },
                { duration: .8, delay: i * 0.07, easing: [.2,.8,.2,1] }
              );
            });
          } else {
            items.forEach((it) => { it.style.opacity = '1'; it.style.transform = 'none'; });
          }
          obs.unobserve(sec);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      io.observe(sec);
    });

    /* ---------- Magnetic CTAs + shine ---------- */
    document.querySelectorAll('.magnetic').forEach((el) => {
      let raf = null;
      let tx = 0, ty = 0;
      const apply = () => {
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        raf = null;
      };
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        tx = x * 0.22;
        ty = y * 0.22;
        if (!raf) raf = requestAnimationFrame(apply);
        el.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--by', ((e.clientY - r.top) / r.height * 100) + '%');
      });
      el.addEventListener('mouseleave', () => {
        if (window.motion && !reduced) {
          window.motion.animate(el, { x: [tx, 0], y: [ty, 0] }, { duration: .6, easing: [.2,.8,.2,1] });
        } else {
          el.style.transform = '';
        }
        tx = 0; ty = 0;
      });
    });

    /* ---------- 3D tilt on service & price cards (desktop only) ---------- */
    const tiltEls = isTouch ? [] : document.querySelectorAll('.svc, .price-card, .lib-card');
    tiltEls.forEach((el) => {
      let raf = null;
      let rx = 0, ry = 0;
      const apply = () => {
        el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        raf = null;
      };
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        rx = ((e.clientY - r.top) / r.height - .5) * -5;
        ry = ((e.clientX - r.left) / r.width - .5) * 5;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      el.addEventListener('mouseleave', () => {
        rx = 0; ry = 0;
        el.style.transform = '';
      });
    });

    /* ---------- Scrollspy: highlight nav link of current section ---------- */
    const sectionIds = ['about', 'services', 'work', 'samples', 'reviews', 'faq'];
    const navLinks = document.querySelectorAll('header .nav-link');
    const setActive = (id) => {
      navLinks.forEach((a) => {
        const m = (a.getAttribute('href') || '').replace('#', '') === id;
        if (m) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    const spyIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) spyIO.observe(sec);
    });

    /* ---------- Final safety: if motion not loaded yet, retry forceReveal a bit later ---------- */
    setTimeout(() => {
      if (!window.motion) {
        document.querySelectorAll('.reveal').forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      }
    }, 2000);
  });
})();
