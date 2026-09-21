# Janma Kundali

> A comprehensive Vedic astrology (Jyotish) web application for computing, exploring, and understanding birth charts — built entirely in the browser.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Overview

**Janma Kundali** computes the complete Vedic birth chart and its classical derivatives — all client-side, offline-capable, and free of API keys. Enter a name, date, time, and place; the app produces:

- The full Janma Kundli (birth chart) with sidereal planetary positions
- 20 divisional charts (vargas) from D1 through D60
- Every major predictive analysis used in Parashari, Jaimini, and KP traditions
- A daily Panchangam and Muhurta engine with location-aware timings
- Live transit analysis (Gochar) with Sade Sati and Vedha detection
- A comprehensive multi-system interpretive report

No backend is required for the astrology calculations themselves — the entire engine is pure TypeScript running in the browser.

---

## Features

### Birth Chart & Divisional Charts
- **Janma Kundli** — Lagna, 9 planets, 12 houses, nakshatras with padas, dignities (exalted, debilitated, own, moolatrikona)
- **20 divisional charts** — D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D16, D20, D24, D27, D30, D40, D45, D60
- **North Indian** (diamond) and **South Indian** (grid) chart layouts, switchable on the fly
- **Chandra Kundli** and **Surya Kundli** reference charts with classical interpretations
- Per-house color coding, depth effects, and full planet placement inside each cell

### Predictive Systems
- **Vimshottari Dasha** — 3-level cascading tree (Mahadasha → Antardasha → Pratyantardasha) with real-time progress indicators
- **Ashtakavarga** — Bhinnashtakavarga (BAV) and Sarvashtakavarga (SAV) with house strength ratings
- **Bhava Chalit** — Sripati and Equal house systems with planetary shift detection
- **KP System** — Placidus cusps, 4-fold rulers (sign / star / sub / sub-sub), 4-level significators, ruling planets
- **Arudha Padas** — All 12 Arudhas (A1 through A12) with proper Parashari exceptions
- **Special Lagnas** — Ghatika, Hora, Bhava, Shree, Indu, and Pranapada
- **Jaimini Chara Karakas** — 7 and 8 karaka variants (AK through DK)
- **Life Predictions** — Career, wealth, marriage, remedies, and Lal Kitab analysis
- **Comprehensive Report** — A multi-system synthesis rendered as structured Markdown

### Panchang & Muhurta
- **Pancha Anga** — Tithi, Nakshatra, Yoga, Karana, Vara with end times
- **Sun & Moon timings** — Sunrise, sunset, moonrise, moonset, day/night duration
- **Auspicious windows** — Brahma, Abhijit, Vijaya, Godhuli, Nishita, Madhyahna muhurtas
- **Inauspicious periods** — Rahu Kalam, Gulika Kalam, Yamaganda, Dur Muhurta
- **Choghadiya** — Day and night slots with quality ratings
- **Hora** — 24 planetary hours with current lord highlighted
- **Location-aware** — Automatically detects the user's current city (GPS with IP fallback) and offers manual override via search

### Transits & Events
- **Gochar analysis** — Live planetary positions with house-from-Moon and house-from-Lagna
- **Sade Sati** — Full 7.5-year cycle tracking with phase detection
- **Dhaiya** — Kantaka (4th) and Ashtama (8th) Saturn cycles
- **Vedha detection** — Obstruction pairs that cancel auspicious transit results
- **Upcoming events calendar** — Next 60 days of rashi ingresses, nakshatra ingresses, and planetary aspects

### Design & UX
- **Grouped sidebar navigation** — 11 sections organized under Chart / Time / Strength / Jaimini / KP / Guidance
- **Devotional saffron & gold palette** with serif typography
- **Centralized theme system** — Every icon, color, and font editable from a single file
- **Fully responsive** — Sidebar collapses to horizontal scroll on mobile
- **Zero hard-coded locations** — All places resolved dynamically from geocoding APIs

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 with TypeScript 5.6 |
| **Build tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 with custom `@theme` tokens |
| **State management** | Zustand with `persist` middleware (localStorage) |
| **Data fetching** | TanStack React Query v5 |
| **Astrology engine** | [`@prisri/jyotish`](https://www.npmjs.com/package/@prisri/jyotish) — pure TypeScript, astronomy-engine powered |
| **Geocoding** | Open-Meteo Geocoding API (free, no key, CORS-enabled) |
| **Location** | Browser Geolocation API + `ipwho.is` fallback |
| **Icons** | Custom Unicode glyphs + inline SVG |

No backend. No API keys. No paid services. Works offline after first load (except geocoding and location detection).

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (Vite 6 requirement)
- **npm** ≥ 9 (or pnpm / yarn)
- A modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
git clone https://github.com/AzureDevWorks/janmakundali.git
cd janmakundali
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The first time you open **Panchang & Muhurta** or **Transit Calendar**, the browser will prompt for location permission. Grant it for auto-detection, or use the manual search to pick any city.

### Production Build

```bash
npm run build
npm run preview
```

The built output goes to `dist/` — a static site deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

### Lint

```bash
npm run lint
```

---

## Project Structure

```
janmakundali/
├── public/                          Static assets
├── scripts/                         Dev utilities and diagnostics
│   ├── check-ascii.mjs              Prebuild guard: fails on non-ASCII source
│   └── inspect.mjs                  Diagnostic dumper for library shapes
├── src/
│   ├── components/
│   │   ├── astro/                   RashiGlyph, PlanetGlyph
│   │   ├── cards/                   Overview + prediction cards
│   │   ├── charts/                  ModernSouthChart, ModernNorthChart, ChartSection
│   │   ├── dashas/                  VimshottariDasha (3-level cascade)
│   │   ├── events/                  UpcomingEventsCard
│   │   ├── gochar/                  Transit analysis components
│   │   ├── layout/                  Sidebar, MobileNav, IdentityCard
│   │   ├── location/                LocationPicker
│   │   ├── overview/                IdentityHero, PanchangCard, DashaCard, etc.
│   │   ├── panchang/                Full Panchang & Muhurta suite
│   │   ├── reference/               Chandra & Surya Kundli section
│   │   ├── ui/                      Card, Badge primitives
│   │   └── BirthForm.tsx            Main input form
│   ├── features/
│   │   ├── birth/                   Birth profile store (Zustand)
│   │   ├── events/                  Planetary events engine
│   │   ├── kundli/                  Kundli & Panchang hooks
│   │   └── location/                Current location detection
│   ├── lib/
│   │   ├── astro.ts                 Rashi/planet metadata re-exports
│   │   ├── geocoding.ts             Open-Meteo client
│   │   ├── text.ts                  ASCII-safe Devanagari & symbol library
│   │   └── utils.ts                 cn() and shared utilities
│   ├── theme/
│   │   ├── theme.ts                 Master theme file (edit here!)
│   │   ├── index.ts                 Barrel export
│   │   └── README.md                Theme customization guide
│   ├── views/
│   │   ├── tabs/                    One file per sidebar section
│   │   └── HomeView.tsx             Sidebar shell + tab router
│   ├── App.tsx                      Root component
│   ├── index.css                    Tailwind imports + theme tokens
│   └── main.tsx                     App entry + providers
├── components.json                  shadcn/ui config
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Architecture

The app uses a **four-layer architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│  1. INPUT LAYER — BirthForm                                 │
│     Captures name, date, time, place, ayanamsa, houses      │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. STATE LAYER — Zustand (birthProfile.store)              │
│     Persists only the raw input to localStorage             │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. COMPUTE LAYER — React Query + @prisri/jyotish           │
│     getKundli() runs ONCE per birth-data change             │
│     Returns one big object (~50 KB) shared by all cards     │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. PRESENTATION LAYER — Cards & Charts                     │
│     Every card calls useKundli() → reads from cached data   │
└─────────────────────────────────────────────────────────────┘
```

**Key principle:** Only the raw input is persisted. Every chart, every dasha, every prediction is recomputed from source on page load — in 20–80 ms. This means bug fixes in the astrology engine propagate to all existing charts automatically, with no data migration.

### Data Flow

```
User submits form
    │
    ├─→ Zustand store updates
    │     └─→ localStorage["janmakundali:profile"]
    │
    └─→ React Query queryKey changes
          │
          └─→ getKundli() runs once
                │
                └─→ Kundli object cached in memory
                      │
                      └─→ Every card reads via useKundli()
```

---

## Theme Customization

The entire visual identity lives in **one file**:

```
src/theme/theme.ts
```

Change any icon, color, or font, and it propagates across the app. Examples:

| What to change | Where in `theme.ts` |
|---|---|
| Zodiac symbols (♈ ♉ ♊ …) | `ICONS.zodiac` |
| Planet glyphs (☉ ☽ ♂ …) | `ICONS.planet` |
| UI glyphs (OM, dot, check, arrows) | `ICONS.ui` |
| Rashi colors by element | `RASHI_ELEMENT_COLORS` |
| Per-rashi color override | `RASHI_COLOR_OVERRIDES` |
| Planet colors | `PLANET_COLORS` |
| Dignity badge colors | `DIGNITY_COLORS` |
| Heading / body fonts | `TYPOGRAPHY` |

App-wide color palette and font families live in `src/index.css` under the `@theme` block.

Full guide: [`src/theme/README.md`](./src/theme/README.md)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `node scripts/inspect.mjs` | Dump shapes of all library functions (dev diagnostic) |

---

## Data Sources & Attribution

| Service | Purpose | Attribution |
|---|---|---|
| **@prisri/jyotish** | All astrology calculations | ISC License · [GitHub](https://github.com/prisri/jyotish) |
| **Open-Meteo Geocoding** | City search + reverse geocoding | Free for non-commercial use · [terms](https://open-meteo.com/en/terms) |
| **ipwho.is** | IP-based location fallback | Free, no key · [terms](https://ipwhois.io/terms) |
| **astronomy-engine** | Ephemeris (used internally by @prisri/jyotish) | MIT License · [GitHub](https://github.com/cosinekitty/astronomy) |

No API keys are required for any of these services.

---

## Accuracy Notes

The astrology engine (`@prisri/jyotish`) targets:

- **Planetary longitudes** — ±0.02° sidereal for Sun–Saturn
- **Lagna** — cross-verified against Jagannath Hora reference charts
- **Sunrise / sunset** — ±29 s observed vs. reference almanacs
- **Tithi / Nakshatra / Yoga names** — exact match vs. DrikPanchang reference

The app preserves the **IANA timezone** identifier and resolves the **UTC offset for the specific birth date**, so historical DST changes and offset shifts (e.g., Nepal's 1986 switch from +05:30 to +05:45) are handled correctly.

---



## Contributing

Issues and pull requests are welcome. Before submitting a PR:

1. Run `npx tsc --noEmit` — must be silent
2. Run `npm run lint` — no new warnings
3. Keep source files ASCII-only (the prebuild check enforces this)
4. Use the centralized theme file for any new visual styling

---

## License

[MIT](./LICENSE) © 2026 Agile Matrix

---

<p align="center">
  <strong>ॐ</strong><br>
  <em>॥ श्री गणेशाय नमः ॥</em>
</p>
