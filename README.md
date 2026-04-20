# WildHome — Native Wildflower Finder

A full-stack web app that helps US residents discover which wildflowers are native
to their area and explore where any flower grows across the United States.

## Quick start

```bash
# Node 18+ recommended; Node 16 works with engine warnings
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build into /dist
npm run preview    # preview the production build
```

## Features

| Feature | Details |
|---|---|
| **Location detection** | Browser geolocation or ZIP / city / state text entry |
| **Flower grid** | 54 curated native wildflowers with live photos from iNaturalist |
| **Interactive map** | Leaflet + OpenStreetMap tiles, US-state GeoJSON polygons |
| **Map ↔ flowers** | Click a state to filter flowers; select a flower to see its native range |
| **Observation markers** | Real iNaturalist sighting dots overlaid on the flower-range map |
| **Search** | Full-text search across common name, scientific name, color, family, tags |
| **Stacked filters** | Bloom season · Flower color · Sun preference · Water needs |
| **Seasonal calendar** | Month-by-month view of what blooms when (toggle above the grid) |
| **Flower detail modal** | Large photo, full species stats, mini native-range map, growing tips |
| **Similar flowers** | 3 related species with thumbnail photos inside the modal |
| **PDF planting guide** | One-page PDF export per flower (jsPDF, no server needed) |
| **Report a sighting** | Deep-link to iNaturalist observation form pre-filled with the species |
| **My Garden wishlist** | Star any flower to save it; persists in localStorage |
| **Comparison tool** | Side-by-side table for up to 3 flowers (click ⚖ on cards) |
| **"Why plant natives?"** | Informational section with six ecological reasons |
| **Response caching** | All API responses cached in localStorage with 24-hour TTL |

## APIs used (all free, no auth)

| API | Endpoint(s) | Purpose |
|---|---|---|
| **iNaturalist** | `/taxa`, `/taxa/:id`, `/observations/species_counts`, `/observations`, `/places/autocomplete` | Photos, descriptions, observation sightings, state place-IDs |
| **Zippopotam.us** | `/us/{zip}` | ZIP code → lat/lng → state |
| **Nominatim (OSM)** | `/reverse`, `/search` | lat/lng ↔ city/state reverse geocoding |
| **OpenStreetMap** | Tile CDN | Map background tiles (via Leaflet) |
| **PublicaMundi GeoJSON** | GitHub CDN | US-states GeoJSON for choropleth layer |

### CORS notes

All APIs above support CORS from browsers. If you hit rate limits:
- **iNaturalist**: 100 req/min unauthenticated — the 24-hour localStorage cache keeps
  normal usage well under this.
- **Nominatim**: 1 req/sec policy — location lookups are cached aggressively (7 days).
- If deploying publicly, consider proxying Nominatim through your own server or using
  a paid geocoding service to respect their usage policy.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 4 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Maps | Leaflet 1.9 + react-leaflet 4 |
| PDF export | jsPDF 2.5 |
| State | React Context + `useLocalStorage` hook |
| Caching | Custom localStorage wrapper (`src/utils/cache.js`) |

## Project structure

```
wildhome/
├── src/
│   ├── App.jsx                   # GardenContext + router root
│   ├── main.jsx                  # Entry, Leaflet icon fix
│   ├── index.css                 # Tailwind base + custom utilities
│   │
│   ├── pages/
│   │   └── Home.jsx              # Main page — wires everything together
│   │
│   ├── components/
│   │   ├── Header.jsx            # Sticky nav with search + garden button
│   │   ├── LocationPicker.jsx    # Geolocation + text input
│   │   ├── MapView.jsx           # Interactive Leaflet map
│   │   ├── FlowerCard.jsx        # Grid card with live photo
│   │   ├── FlowerModal.jsx       # Detail modal (mini-map, PDF, similar)
│   │   ├── FilterPanel.jsx       # Season / color / sun / water filters
│   │   ├── SkeletonCard.jsx      # Loading placeholder
│   │   ├── WhyNatives.jsx        # Ecological info section
│   │   ├── MyGarden.jsx          # Slide-in wishlist panel
│   │   └── ComparisonTool.jsx    # Side-by-side flower comparison
│   │
│   ├── data/
│   │   ├── wildflowers.js        # 54-flower static database
│   │   └── stateData.js          # US states, iNat place IDs, region helpers
│   │
│   ├── hooks/
│   │   ├── useGeolocation.js     # Browser geolocation wrapper
│   │   └── useLocalStorage.js    # Persistent useState
│   │
│   ├── services/
│   │   ├── iNaturalistService.js # iNaturalist API calls with caching
│   │   └── geocodingService.js   # ZIP / text / reverse geocoding
│   │
│   └── utils/
│       ├── cache.js              # localStorage TTL cache
│       └── pdfExport.js          # jsPDF planting guide generator
│
├── public/
│   └── flower.svg                # Favicon
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Extending the flower dataset

Each entry in `src/data/wildflowers.js` follows this shape:

```js
{
  id:                  'unique-slug',          // used as React key + PDF filename
  commonName:          'Black-eyed Susan',
  scientificName:      'Rudbeckia hirta',
  family:              'Asteraceae',
  nativeStates:        ['EasternUS'],           // abbrs OR REGION keys from stateData.js
  bloomSeason:         'Summer',
  bloomMonths:         [6, 7, 8, 9],           // 1-indexed months for seasonal calendar
  colors:              ['yellow'],
  sunPreference:       'Full Sun',             // 'Full Sun' | 'Partial Shade' | 'Full Shade'
  height:              '24–36 in',
  spread:              '12–18 in',
  soilPreference:      'Well-drained, loamy',
  waterNeeds:          'Low',                  // 'Low' | 'Moderate' | 'High'
  pollinatorValue:     'High',                 // 'High' | 'Medium' | 'Low'
  usdaZones:           '3–9',
  description:         '…',                   // 1–2 sentences shown on card
  growingTips:         '…',                   // shown in modal + PDF
  iNaturalistTaxonId:  47366,                  // speeds up photo fetch (can be null)
  similarFlowers:      ['purple-coneflower'],  // IDs of related flowers
  tags:                ['drought-tolerant'],
}
```

Region keys (`EasternUS`, `Northeast`, `MountainWest`, etc.) are expanded to state
abbreviation arrays by `expandNativeStates()` in `stateData.js`.

## Adding iNaturalist place IDs

The app resolves state place IDs dynamically via `/places/autocomplete` and caches
them in localStorage (key `WILDHOME_place_id_<state_name>`). If you need to pre-seed
them, add entries to the `inatPlaceId` field in `US_STATES` inside `stateData.js`.

## License

MIT. Plant data is sourced from iNaturalist (CC-BY) and USDA PLANTS (public domain).
Map tiles are © OpenStreetMap contributors (ODbL).
