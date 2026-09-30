# Kanbağ Admin

Desktop moderation panel for Kanbağ, built from the Claude Design prototype
`project/KanbagAdmin.dc.html`. It uses Vite, React 18 and TypeScript.

## Run

```bash
cd admin
npm install
npm run dev        # http://localhost:5174
npm run build      # tsc -b + vite build → dist/
npm run preview    # serve dist/ on http://localhost:4174
```

The layout is designed for desktop widths of 1280px and up (the prototype frame is 1440×940).

## Routes (hash based, all linkable)

| Hash | View |
| --- | --- |
| `#/dash` | Dashboard: KPIs, 30-day chart, province map, verification queue |
| `#/verify` | Doğrulama Bekleyenler |
| `#/needs`, `#/needs?tab=aktif` | İhtiyaçlar (tabs: `bekliyor`, `aktif`, `kismen`, `karsilandi`, `suresi`, `iptal`) |
| `#/needs/KB-27-19002` | İhtiyaçlar with the "İlan yönetimi" drawer open (also `#/verify/<id>`) |
| `#/drawer` | Alias for the prototype's `drawer` preview (`#/needs/KB-27-19002`) |
| `#/dons`, `#/users`, `#/payments` | Bağışlar, Kullanıcılar, Destek Ödemeleri |
| `#/reports`, `#/reports/ŞK-1041` | Şikayetler, with a report selected |
| `#/cities` | İller ve İlçeler (81 provinces; clicking a row focuses it on the dashboard map) |
| `#/stats` | İstatistikler |
| `#/notifs`, `#/settings` | Placeholders ("Sonraki tur") |

## Structure

- `src/App.tsx` holds the app state (needs, reports, search, map, toast) and the moderation actions.
- `src/route.ts` is the hash router.
- `src/data.ts` holds the admin-only demo data: needs, users, donations, payments, reports, statuses, drawer actions and titles.
- `src/components/` has Sidebar, Topbar, DataTable (cells, pills, table layout), Drawer, TurkeyMap (d3-geo port of `project/kb-map.js`), Toast and small UI helpers.
- `src/views/` has one component per screen.
- `../shared` is imported as `@shared`. Province stats (`provinceStats`, `TOTALS`), `PROVINCES`, `MONTHS`, `MONTHLY_DONATIONS`, `nf`, the province coordinates and the Türkiye outline all come from here, so the admin figures match the mobile app. The alias is set in `vite.config.ts`, where `server.fs.allow` includes the repo root, and in `tsconfig.app.json` `paths`.

All state is in-memory demo state, so a reload resets it.

## Screenshots

`screenshots/*.png` are the app views at 1440×940. `screenshots/prototype/` holds the prototype rendered at the same size, for comparison.
