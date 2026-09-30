# Kanbağ mobile app

An Expo (SDK 57) / React Native app for iOS and Android. It is built from the Claude Design prototype `project/KanbagApp.dc.html`, whose screens are laid out on the canvas in `project/Kanbag.dc.html`. All data is local mock data from `../shared`, which the admin panel also uses.

## Run

```bash
cd mobile
npm install
npx expo start          # press i / a for a simulator, or scan the QR code with Expo Go
npx expo start --web    # browser preview
npm run typecheck
```

Web previews accept query flags:

- `?os=android` shows the Android chrome (top app bar, Material nav bar, FAB).
- `?theme=dark` starts in dark mode.

On a device, the chrome follows the real platform, and the theme is set under Ayarlar → Tema (Açık / Koyu / Sistem).

## Structure

```
src/app/            Expo Router routes (one file per screen)
  index.tsx         Splash → /onboarding
  onboarding, login, otp, register, blood, province, district, location-permission
  (tabs)/           home, needs, donations, impact, profile + custom iOS/Android tab bar
  need/[id]/        İhtiyaç detayı (+ confirm / report sheets), record.tsx (Bağış kaydı)
  create.tsx        6-step "Acil Kan İhtiyacı" flow → published.tsx
  donation-success, notifications, map, city, profile-edit, help, faq
  settings/         index (Tema), notifications, location, privacy, security
  support/          index (+ payment sheet), amount, done
  error/[kind].tsx  network | location | inactive | load
src/store.tsx       App state (React context), form validation, navigation helpers
src/theme.ts        Light/dark tokens (the prototype's CSS variables), Onest font mapping
src/ui/             Design-system primitives, chrome (Screen, Header, Sheet, Toast), need cards, charts, Türkiye map
src/components/     Filters sheet, settings rows, registration pickers
../shared/          Demo data + helpers shared with /admin (needs, 81 provinces, stats formula, map outline)
```

## Prototype behaviour that carries over

- Blood compatibility follows the red-cell donor table. For incompatible listings the main button becomes "İlanı Paylaş".
- A published listing is "Doğrulama bekliyor" until a moderator verifies it in the admin panel (offline: automatically after about 8 s).
- Any 6-digit SMS code is accepted; `000000` shows the wrong-code error.
- Every visit to the Needs tab shows the skeleton for about 650 ms. Searching "Kandıra" or filtering to Bartın shows the empty state.
- Donations are saved as "Beyan · onay bekliyor". The app never claims to verify donations itself.

## Live sync with the admin panel

`src/store.tsx` connects to the sync server (`../server`, port 4000) via `@shared/syncClient`. The server host is taken from Expo's `hostUri`; set `EXPO_PUBLIC_SYNC_URL` to override it. Listings, donation plans, donations, reports and support payments are sent as actions. Moderator decisions from the admin panel arrive instantly and show as toasts. Without a server, the app keeps working on local data. See `../CALISTIRMA.md` for the step-by-step test guide.

## Not real yet

- The location permission dialog is drawn in the app. A real build would call `expo-location` behind the same explainer.
- Payments, SMS, sharing, receipts and similar actions show confirmation toasts only.
- The sync server keeps data in memory only (a restart resets it) and has no authentication.

`screenshots/` holds web renders of each state from the design canvas, named after the canvas labels.
