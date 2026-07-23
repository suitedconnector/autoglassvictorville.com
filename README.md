# autoglassvictorville.com

Rank & rent auto glass site for Victorville, CA. Built with Eleventy (11ty) v3.

## Develop

```bash
npm install
npm start        # dev server with live reload
npm run build    # build to _site/
```

## Deploy — Cloudflare Pages

| Setting | Value |
|---|---|
| Build command | `npx eleventy` |
| Build output directory | `_site` |
| Node version | 18+ |

## Structure

- `src/index.njk` — homepage (LocalBusiness JSON-LD)
- `src/services/` — 7 service pages + overview
- `src/locations/` — Victorville, Hesperia, Apple Valley, Adelanto, Oak Hills
- `src/blog/` — 3 informational posts + index
- `src/about.njk`, `src/contact.njk` — about + quote form
- `src/_data/site.json` — phone, address, hours, service/location lists (single source of truth)
- `src/css/style.css` — mobile-first CSS

## Placeholders to replace before launch

- **Call tracking number:** `phoneTracking` in `src/_data/site.json` (displayed number is `phone`)
- **Quote form:** `https://formspree.io/f/YOUR_FORM_ID` in `src/contact.njk`, `src/index.njk`, `src/_includes/layouts/service.njk`
- **Address:** placeholder address in `src/_data/site.json` and JSON-LD blocks
- **Social links:** `src/_data/site.json`
