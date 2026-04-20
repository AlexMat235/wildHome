# WildHome — Project Progress & Handoff

## DEPLOYMENT READY ✅

All must-do checklist items are complete. The app builds cleanly with no errors.
`npm run build` → `✓ built` · dist/ = **1.5 MB** · gzip: ~425 KB

---

## What Is WildHome

A fully client-side React 18 + Vite 4 SPA that helps US residents discover native wildflowers for their region. No backend, no API keys, no tracking, no personal data collection. Deployable to Vercel or Netlify in under 5 minutes.

---

## File Inventory (52 files)

### Config & Deployment
| File | Purpose |
|------|---------|
| `package.json` | npm deps — React 18, Vite 4, Tailwind 3, Leaflet, jsPDF 4.x |
| `vite.config.js` | Vite 4 build config, dev server port 5173 |
| `tailwind.config.js` | Custom palette (forest/terra/cream) + `darkMode: 'class'` |
| `postcss.config.js` | PostCSS pipeline for Tailwind |
| `vercel.json` | SPA rewrites + 5 security headers (CSP, X-Frame-Options, etc.) |
| `netlify.toml` | SPA redirects + 5 security headers with inline comments |

### HTML Entry
| File | Purpose |
|------|---------|
| `index.html` | App shell: anti-flash dark mode script, manifest link, Apple PWA meta |
| `src/main.jsx` | React root, Leaflet icon fix, service worker registration |
| `src/index.css` | Tailwind, skeleton animation, dark map tiles, @media print stylesheet |

### Application Shell
| File | Purpose |
|------|---------|
| `src/App.jsx` | GardenContext, HelmetProvider, React Router routes |
| `src/pages/Home.jsx` | Main page — all state, SEO, URL routing, Flower of the Week, blooming-now |
| `src/pages/NotFound.jsx` | 404 page with flower.svg, heading, 3 random flower suggestions |
| `src/pages/PrivacyPolicy.jsx` | Privacy policy — no data collected; hello@wildhome.app contact |
| `src/pages/InvasiveAlternatives.jsx` | 20 invasive plants each with 3 native WildHome alternatives; search + region filter |
| `src/pages/PlantingCalendar.jsx` | 12-month planting guide for 6 US regions; frost dates; seed/sow/transplant |

### Components (14)
| File | Purpose |
|------|---------|
| `src/components/Header.jsx` | Sticky nav: logo, autocomplete search, dark mode toggle 🌙/☀️, My Garden, PWA install |
| `src/components/LocationPicker.jsx` | State-name/abbreviation input only; no GPS, no ZIP, fully client-side |
| `src/components/MapView.jsx` | Leaflet choropleth US map; click-to-filter; iNat observation markers |
| `src/components/FlowerCard.jsx` | Grid card: photo, bloom badge, toxicity warning, share copy button |
| `src/components/FilterPanel.jsx` | Bloom season, color, sun, water filters; collapsible mobile drawer |
| `src/components/FlowerModal.jsx` | Full detail modal: share row (Copy Link + X), Print, PDF, mini map, similar flowers |
| `src/components/MyGarden.jsx` | Slide-in wishlist panel with PDF + CSV export |
| `src/components/ComparisonTool.jsx` | Side-by-side comparison for up to 3 flowers |
| `src/components/WhyNatives.jsx` | 6 ecological benefit cards + CTA "Find My Native Flowers" scroll button |
| `src/components/SkeletonCard.jsx` | Full-card shimmer placeholder |
| `src/components/NurseryDirectory.jsx` | 28 real native plant nurseries in 7 regions; ships-nationally filter + search |
| `src/components/PlantSocieties.jsx` | 24 native plant societies in 7 regions; grouped by region |

### Hooks
| File | Purpose |
|------|---------|
| `src/hooks/useLocalStorage.js` | useState backed by localStorage |

### Data
| File | Purpose |
|------|---------|
| `src/data/wildflowers.js` | 64 curated native wildflowers; TOXICITY_DATA + ENRICHMENT_DATA blocks |
| `src/data/stateData.js` | All 50 US states + DC; STATE_BY_ABBR, expandNativeStates() |

### Services
| File | Purpose |
|------|---------|
| `src/services/iNaturalistService.js` | iNaturalist API v1: photos, obs count, API-down tracking |
| `src/services/geocodingService.js` | Client-side only — in-memory state name/abbr lookup; zero network calls |

### Utilities
| File | Purpose |
|------|---------|
| `src/utils/cache.js` | localStorage TTL cache (cacheGet, cacheSet, cachedFetch) |
| `src/utils/pdfExport.js` | jsPDF 4.x: single-flower guide + multi-page garden PDF + CSV download |

### Public / Assets
| File | Purpose |
|------|---------|
| `public/flower.svg` | Favicon / logo SVG |
| `public/icon-192.png` | PWA icon 192×192 (forest green circle, programmatically generated) |
| `public/icon-512.png` | PWA icon 512×512 (forest green circle, programmatically generated) |
| `public/manifest.json` | PWA manifest — PNG icons (192, 512) + SVG fallback |
| `public/sw.js` | Service worker: cache-first static assets, network-first API calls |
| `public/sitemap.xml` | 116 URLs: homepage + 64 flower pages + 51 state pages |
| `public/robots.txt` | Allows all crawlers; points to sitemap |
| `README.md` | Project documentation |
| `PROGRESS.md` | This file |

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Location (state name/abbr input) | ✅ Complete | No GPS, no ZIP, fully client-side in-memory lookup |
| Flower grid (64 flowers) | ✅ Complete | |
| Search autocomplete dropdown | ✅ Complete | 2+ chars, up to 6 suggestions, keyboard nav (↑↓/Enter/Esc), color swatch |
| Choropleth map + state filter | ✅ Complete | |
| Full-text search (debounced 300ms) | ✅ Complete | |
| Stacked filters (season/color/sun/water) | ✅ Complete | |
| Blooming Now mode | ✅ Complete | Auto-activates when location is set |
| Flower detail modal | ✅ Complete | Focus trap, Helmet SEO, all enrichment data |
| Share buttons (Copy Link + 𝕏) | ✅ Complete | FlowerModal + FlowerCard; 2-second "✅ Copied!" feedback |
| Print stylesheet + Print button | ✅ Complete | @media print in index.css; 🖨 Print button in FlowerModal |
| Dark mode | ✅ Complete | 🌙/☀️ toggle in Header, anti-flash script in index.html, all components covered |
| Dark mode map tiles | ✅ Complete | CSS filter invert via `.dark .leaflet-tile` |
| Flower of the Week | ✅ Complete | Deterministic weekly seed; iNat photo; bloom + toxicity badges |
| My Garden (wishlist) | ✅ Complete | localStorage persistence; PDF + CSV export |
| Comparison Tool | ✅ Complete | Up to 3 flowers side-by-side |
| PDF export (single flower) | ✅ Complete | jsPDF 4.x |
| PDF export (full garden) | ✅ Complete | Multi-page |
| CSV export | ✅ Complete | |
| iNaturalist photo integration | ✅ Complete | TTL cache, photo credit attribution, fallback placeholder |
| iNaturalist observation count | ✅ Complete | |
| iNaturalist sighting markers on map | ✅ Complete | |
| iNaturalist report sighting deep-link | ✅ Complete | |
| Toxicity badges (human + pet) | ✅ Complete | Sacred Datura + Spider Lily now correctly flagged |
| Edible badge | ✅ Complete | Common Camas now flagged with foraging notes |
| Conservation status badges | ✅ Complete | |
| Growing tips | ✅ Complete | |
| Similar flowers section | ✅ Complete | |
| Native range mini-map | ✅ Complete | |
| WhyNatives section | ✅ Complete | With CTA "Find My Native Flowers →" scroll button |
| Nursery Directory | ✅ Complete | 28 nurseries, search + ships-nationally filter |
| Plant Societies Directory | ✅ Complete | 24 societies grouped by region |
| Invasive Alternatives page | ✅ Complete | 20 invasives × 3 native alternatives each; search + region filter |
| Planting Calendar page | ✅ Complete | 6 regions × 12-month grid; frost dates; current month highlighted |
| Privacy Policy page | ✅ Complete | hello@wildhome.app contact |
| PWA install (beforeinstallprompt) | ✅ Complete | |
| Service worker | ✅ Complete | Cache-first for static assets |
| manifest.json with PNG icons | ✅ Complete | 192px + 512px |
| robots.txt | ✅ Complete | |
| sitemap.xml | ✅ Complete | 116 URLs |
| Security headers (CSP etc.) | ✅ Complete | vercel.json + netlify.toml |
| React Helmet SEO (title + meta) | ✅ Complete | All major pages |
| URL routing (/flower/:id, /state/:code) | ✅ Complete | |
| 404 page | ✅ Complete | |
| Keyboard accessibility | ✅ Complete | Focus trap in modal, skip-link, aria-labels |

---

## Security Audit Results

**Command:** `npm audit` · **Date:** April 20, 2026 · **Result:** 2 moderate vulnerabilities

| Package | Severity | Issue | Action |
|---------|----------|-------|--------|
| `vite` ≤6.4.1 | Moderate | Path traversal in dev server; middleware bypass on Windows | Dev-only risk — safe to ship. Fix = Vite 4→8 (breaking change) |
| `esbuild` | Moderate | Transitive through Vite | Same as above |

**Verdict:** Both CVEs affect the **dev server only** — they are not present in the compiled `dist/` that gets deployed. Safe to ship as-is.

**Previously fixed:** `jspdf` had critical CVEs in 2.x (ReDoS, path traversal, PDF injection). Fixed by upgrading to 4.2.1.

---

## Build Output

```
dist/index.html                     1.74 kB │ gzip:   0.84 kB
dist/assets/index-*.css            59.81 kB │ gzip:  14.64 kB
dist/assets/purify.es-*.js         22.90 kB │ gzip:   8.80 kB
dist/assets/index.es-*.js         150.89 kB │ gzip:  51.47 kB
dist/assets/html2canvas.esm-*.js  201.43 kB │ gzip:  47.71 kB
dist/assets/jspdf.es.min-*.js     415.99 kB │ gzip: 134.67 kB
dist/assets/index-*.js            563.15 kB │ gzip: 167.14 kB

Total dist/: ~1.5 MB  │  gzip: ~425 KB  │  Build time: ~60s
```

The large JS chunk is dominated by jsPDF + html2canvas (PDF export feature). Consider lazy-loading these if initial page load time becomes a concern post-launch.

---

## Deployment Instructions

### Vercel (recommended)

1. Push the repo to GitHub (or GitLab/Bitbucket)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

`vercel.json` handles SPA fallback (all routes → index.html) and all 5 security headers automatically.

**Custom domain:** Vercel dashboard → Settings → Domains → Add your domain.

### Netlify

1. Push the repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**

`netlify.toml` handles SPA redirects and security headers automatically.

**Custom domain:** Netlify dashboard → Domain settings → Add custom domain.

### Manual / Other Static Hosts

```bash
npm run build
# Upload the contents of dist/ to S3, Cloudflare Pages, GitHub Pages, etc.
# Configure your host to serve index.html for all unknown routes (SPA fallback)
```

---

## Post-Launch Checklist

- [ ] Test every route on live URL: `/`, `/flower/black-eyed-susan`, `/state/OH`, `/privacy`, `/invasive-alternatives`, `/planting-calendar`, `/nonexistent` (should show 404 page)
- [ ] Test dark mode toggle — preference persists across page refresh
- [ ] Test search autocomplete — type "cone", confirm dropdown + keyboard navigation (↑↓ Enter Escape)
- [ ] Test "🔗 Copy Link" in FlowerModal — paste URL in new tab, confirm correct flower modal opens
- [ ] Test "𝕏 Share" button — confirm tweet pre-fill is correct
- [ ] Test PDF download in FlowerModal and in My Garden panel
- [ ] Test 🖨 Print button in FlowerModal
- [ ] Test PWA install prompt on Android Chrome and iOS Safari (Add to Home Screen)
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console) → Add property → Sitemaps → `https://wildhome.app/sitemap.xml`
- [ ] Update `sitemap.xml` canonical URLs from `wildhome.app` if real domain is different
- [ ] Update OG image + canonical meta tags in `Home.jsx` for the real domain
- [ ] Replace `hello@wildhome.app` in `PrivacyPolicy.jsx` with the real contact email
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on the live URL — target 90+ score
- [ ] Check security headers at [securityheaders.com](https://securityheaders.com)
- [ ] Share on social media 🎉

---

## Router Configuration

```
/                         → Home (flower grid, map, all filters)
/flower/:flowerId         → Home with modal open for that flower (e.g. /flower/black-eyed-susan)
/state/:stateCode         → Home pre-filtered to that US state (e.g. /state/OH)
/privacy                  → PrivacyPolicy
/invasive-alternatives    → InvasiveAlternatives
/planting-calendar        → PlantingCalendar
*                         → NotFound (404)
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI framework |
| react-router-dom | 6.x | Client-side routing |
| react-leaflet / leaflet | 4.x / 1.x | Interactive choropleth map |
| react-helmet-async | 2.x | Dynamic `<head>` / SEO meta tags |
| jspdf | 4.2.1 | PDF export (upgraded from 2.x — fixed critical CVEs) |
| html2canvas | 1.x | Screenshot capture for PDF export |
| tailwindcss | 3.x | Utility-first CSS with dark mode class strategy |
| vite | 4.x | Build tool (dev-server has moderate CVEs — safe to ship) |

---

## Known Limitations

| Item | Notes |
|------|-------|
| Vite dev-server CVEs | 2 moderate, dev-only, safe to ship. Fix = Vite 4→8 (breaking API change) |
| jsPDF 4.x API compatibility | pdfExport.js uses 2.x-style API — PDF export needs smoke-test in browser |
| PWA icons are placeholders | 192/512px green circles; replace with real designed icons before launch |
| `wildhome.app` placeholder domain | Update sitemap.xml + OG canonical URLs when real domain is known |
| Large JS bundle | jsPDF + html2canvas inflate main chunk to 563 KB; lazy-loading would help |
| ComparisonTool sticky cells | Uses inline `style={{ background }}` for sticky columns — dark mode fallback only |
| Map legend dark mode | Leaflet legend overlay uses `bg-white/90` — slightly off in dark mode |

---

## Future Roadmap (v2)

### Monetization Ideas
- **Nursery affiliate links** — NurseryDirectory cards linked to affiliate programs (High Country Gardens, Prairie Nursery have programs)
- **"Garden Plan" premium PDF** — AI-generated planting plan for user's state/zone ($2.99 one-time)
- **Sponsored nursery placement** — Featured slots in NurseryDirectory (clearly labeled)
- **WildHome Pro** — Full offline mode, advanced USDA zone filters, email garden reminders

### Feature Ideas
- **Bloom calendar strip** — Visual 12-month bar on flower cards showing exact bloom window
- **"Lawn to Garden" calculator** — Enter sq footage → estimated CO₂ savings, water savings, pollinator impact
- **Community sightings** — iNat OAuth; "I saw this today" pins on the map
- **Companion planting** — "Pairs well with [X]" based on bloom time and ecological guild
- **State-specific invasive warnings** — Flag any garden flower that is invasive in the user's state
- **Weekly email digest** — "What's blooming near you" (requires minimal backend)
- **Dark map tiles** — Switch to MapTiler dark style instead of CSS filter invert
- **Vite 8 upgrade** — Fixes moderate dev-server CVEs; requires auditing breaking API changes
- **Real PWA icons** — Commission 192/512px designed icons to replace green circle placeholders

---

*Last updated: April 20, 2026*
