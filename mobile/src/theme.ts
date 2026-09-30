import { Platform } from 'react-native';

export const LIGHT = {
  bg: '#F6F6F7', card: '#FFFFFF', ink: '#18181B', ink2: '#3F3F46', ink3: '#52525B', ink4: '#71717A',
  line: '#E7E7EA', line2: '#D4D4D8', fill: '#F1F1F3', hero: '#18181B', soft: '#FCEEEF', soft2: '#F2B8BF',
  redtx: '#A01223', link: '#C4162A', red: '#C4162A', gsoft: '#E4F2EA', gtx: '#135E3D', asoft: '#FBF0DC',
  atx: '#6B3F00', bar: 'rgba(255,255,255,0.96)', bar2: 'rgba(246,246,247,0.96)', tabbg: '#F8F2F2',
  pill: '#FADADD', sel: '#18181B', selfg: '#FFFFFF',
};
export type Palette = typeof LIGHT;

export const DARK: Palette = {
  bg: '#0F0F10', card: '#18181B', ink: '#F4F4F5', ink2: '#D4D4D8', ink3: '#B4B4BB', ink4: '#9A9AA3',
  line: '#2A2A2F', line2: '#3F3F46', fill: '#232327', hero: '#232327', soft: '#3A161B', soft2: '#6A2530',
  redtx: '#FF8F9A', link: '#FF7A88', red: '#D0202F', gsoft: '#10291D', gtx: '#6FD3A0', asoft: '#33260F',
  atx: '#F2C27A', bar: 'rgba(24,24,27,0.94)', bar2: 'rgba(15,15,16,0.94)', tabbg: '#1B1A1C',
  pill: '#4A1D23', sel: '#F4F4F5', selfg: '#18181B',
};

/** Fixed brand colors that do not change with the theme. */
export const BRAND = { red: '#C4162A', redPressed: '#AD1326', green: '#177A4E', white: '#FFFFFF' };

export type Weight = 400 | 500 | 600 | 700 | 800;
const ONEST: Record<Weight, string> = {
  400: 'Onest_400Regular', 500: 'Onest_500Medium', 600: 'Onest_600SemiBold', 700: 'Onest_700Bold', 800: 'Onest_800ExtraBold',
};
export const fontFamily = (w: Weight = 400, mono = false) =>
  mono ? (w >= 600 ? 'JetBrainsMono_600SemiBold' : 'JetBrainsMono_500Medium') : ONEST[w];

/**
 * The prototype runs on iOS and Android with different chrome (header, tab bar, FAB).
 * On web we default to iOS chrome; `?os=android` previews the Android variant.
 */
export const isIOSChrome = (() => {
  if (Platform.OS === 'web') {
    try {
      return new URLSearchParams(globalThis.location?.search).get('os') !== 'android';
    } catch {
      return true;
    }
  }
  return Platform.OS !== 'android';
})();
