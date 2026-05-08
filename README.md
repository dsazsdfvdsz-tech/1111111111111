# Salman — Academic Writer Portfolio

Single-page editorial portfolio for Salman, a freelance academic writer.
Pure HTML + Tailwind Play CDN + GSAP. **No build step.**

## Architecture

```
salman-eb/
├── index.html              # Single-page site (markup only)
├── 404.html                # Custom not-found page
├── robots.txt              # Crawler directives
├── sitemap.xml             # Sitemap
├── site.webmanifest        # PWA manifest
├── humans.txt              # Credits
├── .nojekyll               # Disable Jekyll on GitHub Pages
├── README.md
└── assets/
    ├── css/
    │   └── main.css        # All bespoke styles (tokens, components, motion)
    ├── js/
    │   ├── main.js         # App logic (nav, filter, reveals, counters)
    │   └── tailwind.config.js  # Tailwind Play CDN theme extension
    └── img/
        └── favicon.svg     # Monogram favicon (replace with real brand mark)
```

Everything the browser needs is plain static files, so the repo deploys unchanged to GitHub Pages, Netlify, Cloudflare Pages, or any static host.

### Script load order (important)
1. `assets/js/tailwind.config.js` — must run **before** the Play CDN so the theme extension is picked up.
2. `https://cdn.tailwindcss.com` — Tailwind Play CDN.
3. Vendor libs (Lucide, GSAP, ScrollTrigger, Lenis) — loaded `defer`, all pinned.
4. `assets/js/main.js` — the app, loaded `defer` so it runs after vendors.

### Pinned library versions
| Lib | Version | Source |
|---|---|---|
| Lucide | `0.468.0` | unpkg |
| GSAP + ScrollTrigger | `3.12.5` | cdnjs |
| Lenis | `1.0.42` | jsDelivr |
| Tailwind | Play CDN (latest) | cdn.tailwindcss.com |

> Tailwind Play CDN is convenient but does JIT compilation in the browser. If you later want fully production-grade CSS (smaller bundle, no runtime compile warning), switch to the Tailwind standalone CLI and pre-build `assets/css/tailwind.css` — the architecture is already set up to drop it in alongside `main.css`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Visit `https://<your-username>.github.io/<repo>/`.

`.nojekyll` keeps filenames starting with `_` from being stripped. For a custom domain, add a `CNAME` file and point DNS at `<your-username>.github.io`.

## Replace before going live

Every value below is currently a placeholder — search `index.html`, `sitemap.xml`, `robots.txt`, and `site.webmanifest` and swap them for real data.

| What | Where | Current placeholder |
|---|---|---|
| WhatsApp number | `index.html` (all `wa.me/` links + contact section) | `+92 300 1234567` / `923001234567` |
| Email address | `index.html` contact section + form `action` | `salman.writes@example.com` |
| Fiverr profile URL | `index.html` (nav, hero, pricing, contact) | `https://fiverr.com/salman` |
| Canonical / OG / sitemap URLs | `index.html` head, `sitemap.xml`, `robots.txt` | `https://example.com/` |
| OG share image | `index.html` `og:image` + `twitter:image` | `https://example.com/og.jpg` |
| Social links | Footer `#` anchors for LinkedIn / Instagram / GitHub | `#` |
| Stats | About section stat tiles | 1200+, 6+, 98%, 4.9★ |
| Testimonials | Reviews section — 6 cards | Dummy initials & quotes |
| Portfolio samples | Work section — 6 cards | Dummy titles & word counts |
| FAQ copy | FAQ section + JSON-LD `FAQPage` | Dummy answers |
| Pricing | Pricing section — 3 cards | $25 / $55 / $120 |
| Review count in schema | `aggregateRating.reviewCount` | `500` |
| Favicon | `assets/img/favicon.svg` | Monogram `S` |

## Adding a real profile image later

1. Drop the image at `./assets/img/salman.jpg` (ideally 800×1000, < 150 KB, WebP if possible).
2. In `index.html` find the hero `<svg viewBox="0 0 400 500">` block and replace with:

```html
<img src="./assets/img/salman.jpg" alt="Portrait of Salman"
     width="400" height="500" loading="eager" decoding="async"
     class="w-full h-full object-cover" />
```

3. Create a 1200×630 share image at `./assets/img/og.jpg` and update the `og:image` / `twitter:image` meta tags.

## Performance & SEO notes

- Critical head: preconnect + preload for Google Fonts, DNS-prefetch for every vendor CDN.
- Fonts limited to the weights actually rendered (Fraunces 500/600, Inter 400/500/600, JetBrains Mono 400/500).
- All vendor scripts `defer`-loaded; `main.js` is non-blocking and tolerates any lib failing to load.
- `prefers-reduced-motion` short-circuits all GSAP / Lenis code paths.
- 5 JSON-LD schemas embedded inline (Person, ProfessionalService, FAQPage, BreadcrumbList, WebSite).
- Semantic HTML5 landmarks, skip link, focus-visible outlines, WCAG 2.2 AA contrast.

## Libraries

- Tailwind CSS — Play CDN
- GSAP 3.12.5 + ScrollTrigger — cdnjs
- Lenis 1.0.42 — jsDelivr
- Lucide Icons 0.468.0 — unpkg
- Google Fonts: Fraunces, Inter, JetBrains Mono
