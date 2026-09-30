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
- A published listing is "Doğrulama bekliyor" at first. About 8 s later it is verified and gets its final urgency, and the "İlanın" card on Home updates.
- Any 6-digit SMS code is accepted; `000000` shows the wrong-code error.
- Every visit to the Needs tab shows the skeleton for about 650 ms. Searching "Kandıra" or filtering to Bartın shows the empty state.
- Donations are saved as "Beyan · onay bekliyor". The app never claims to verify donations itself.

## Not real yet

- The location permission dialog is drawn in the app. A real build would call `expo-location` behind the same explainer.
- Payments, SMS, sharing, receipts and similar actions show confirmation toasts only.
- There is no backend or persistence, so state resets on reload. Replacing `../shared` and `src/store.tsx` with API calls is the integration point.

`screenshots/` holds web renders of each state from the design canvas, named after the canvas labels.
