# Janma Kundali

A Vedic astrology (Jyotish) web app built with React 19, TypeScript, Vite, and Tailwind v4.

## Features

- Birth chart (Janma Kundli) with Lagna, planets, houses, and dignities
- 20 divisional charts (D1 through D60) with North and South Indian layouts
- Vimshottari Dasha - 3-level cascade (Maha / Antar / Pratyantar)
- Ashtakavarga (BAV + SAV), Bhava Chalit, KP system, Arudha padas
- Special lagnas (Ghatika, Hora, Bhava, Shree, Indu, Pranapada)
- Panchang & Muhurta with GPS/IP-based location detection
- Chandra & Surya reference charts
- Gochar (transits) with Sade Sati, Dhaiya, Vedha detection
- Life predictions (career, wealth, marriage, remedies)
- Upcoming planetary events (transits and aspects calendar)

## Stack

- Framework: React 19 + TypeScript
- Build: Vite 6
- Styling: Tailwind v4 with a devotional saffron/gold theme
- State: Zustand (persisted to localStorage)
- Data fetching: TanStack React Query
- Astrology engine: @prisri/jyotish
- Geocoding: Open-Meteo (free, no API key)

## Getting started

    npm install
    npm run dev

Open http://localhost:5173

## Project structure

    src/
      components/       UI components (cards, charts, panchang, gochar, etc.)
      features/         Hooks and API logic (birth, kundli, location, events)
      lib/              Utilities (astro, text, geocoding)
      theme/            Central theme configuration
      views/            Top-level views and tabs
      index.css         Tailwind + theme tokens
      main.tsx          App entry
      App.tsx           Root component

## Theme customization

All icons, colors, and typography are centralized in src/theme/theme.ts.
See src/theme/README.md for the customization guide.

## License

MIT