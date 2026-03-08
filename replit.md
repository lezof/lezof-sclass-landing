# LEZOF S-Class Landing Page

## Overview
Arabic RTL dark premium landing page for LEZOF Auto Services — Mercedes S-Class Maintenance Program (2020–2025). Single-page, front-end only, no database.

## Architecture
- **Frontend only** — React + Vite + Tailwind CSS
- **No backend/database required** — static landing page with interactive pricing selector
- All booking CTAs redirect to external `https://book.lezof.com` with URL parameters

## Key Files
- `client/src/pages/landing.tsx` — Main landing page with all sections (Header, Hero, Problem, Solution, Selector, Pricing, Trust, Risk Reduction, FAQ, Footer)
- `client/src/lib/pricing-data.ts` — All pricing data, engine configs, mileage stops, and URL builder
- `client/src/index.css` — Custom LEZOF dark theme CSS variables and utilities
- `client/index.html` — RTL Arabic HTML with IBM Plex Sans Arabic font

## Design System
- Dark premium theme (Apple/Tesla style) with LEZOF accent red (#EF4136)
- RTL Arabic layout using IBM Plex Sans Arabic
- CSS variables: --lz-bg, --lz-surface-1, --lz-surface-2, --lz-border, --lz-text, --lz-text-2, --lz-text-3, --lz-accent
- Corner triangle accent element on key cards

## Features
- Interactive engine selector (3 options: 6-cyl, 8-cyl, S63 AMG)
- Mileage slider with 8 fixed stops
- Dynamic pricing with Service A/B auto-detection
- Two package cards (Periodic + Major) with exact prices
- Comparison table
- FAQ accordion
- Sticky mobile CTA
- All CTAs build booking URLs with query parameters

## Running
```
npm run dev
```
