import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import {
  DONATIONS, HOSPITALS, NEEDS, URGENCY_FOR_WHEN, shortName, type Blood, type Donation, type Need, type NeedStatus,
} from '@shared';
import { DARK, LIGHT, type Palette } from './theme';

// ---------- form / filter shapes ----------
export type When = '' | 'Şimdi' | 'Bugün' | 'Yarın' | 'Belirli';
export interface NeedForm {
  blood: Blood | ''; units: number; name: string; cond: string; hospital: string; district: string; hq: string;
  dept: string; city: string; when: When; date: string; time: string; cName: string; cPhone: string;
  pref: 'app' | 'phone'; ok: boolean;
}
export const EMPTY_FORM: NeedForm = { blood: '', units: 0, name: '', cond: '', hospital: '', district: '', hq: '', dept: '', city: 'Kocaeli', when: '', date: '', time: '', cName: '', cPhone: '', pref: 'app', ok: false };

export interface Filters {
  city: string; district: string; bloods: Blood[]; compat: boolean; dist: number; urg: NeedStatus[]; open: boolean;
  sort: 'yeni' | 'yakin' | 'acil';
}
export const DEFAULT_FILTERS: Filters = { city: 'Kocaeli', district: 'Tümü', bloods: [], compat: false, dist: 0, urg: [], open: false, sort: 'yeni' };

export interface Registration { first: string; last: string; dob: string; blood: Blood | '?' | ''; city: string; district: string }

export type ThemePref = 'light' | 'dark' | 'system';

export interface AppState {
  theme: ThemePref;
  committed: Record<string, boolean>;
  dons: Donation[];
  lastDon: Donation | null;
  myNeed: Need | null;
  f: Filters;
  search: string;
  step: number;
  form: NeedForm;
  stepErr: boolean;
  login: string;
  reg: Registration;
  readN: Record<number, boolean>;
  mapSel: string;
  ns: { near: boolean; compat: boolean; dist: number; status: boolean; remind: boolean; history: boolean; vol: boolean; news: boolean; quiet: boolean };
  notifDenied: boolean;
  pv: { name: boolean; anon: boolean };
  sec: { lock: boolean; s2: boolean };
  loc: { mode: 'while' | 'off'; Sakarya: boolean; İstanbul: boolean };
  pe: { first: string; last: string; dob: string; blood: Blood };
  amt: number;
  payM: string;
  faq: { open: number; q: string; topic: string };
}

const INITIAL: AppState = {
  theme: 'light', committed: {}, dons: DONATIONS.slice(), lastDon: null, myNeed: null,
  f: DEFAULT_FILTERS, search: '', step: 1, form: EMPTY_FORM, stepErr: false,
  login: '', reg: { first: '', last: '', dob: '', blood: '', city: '', district: '' },
  readN: {}, mapSel: 'Kocaeli',
  ns: { near: true, compat: true, dist: 25, status: true, remind: true, history: true, vol: false, news: false, quiet: true },
  notifDenied: false, pv: { name: true, anon: true }, sec: { lock: false, s2: true },
  loc: { mode: 'while', Sakarya: true, İstanbul: false },
  pe: { first: 'Ali', last: 'Yılmaz', dob: '12.05.1994', blood: '0+' },
  amt: 100, payM: '', faq: { open: -1, q: '', topic: 'Tümü' },
};

// ---------- need helpers ----------
const deadlineFor = (f: NeedForm) =>
  ({ Şimdi: 'Şimdi · 3 saat içinde', Bugün: 'Bugün 23:59’a kadar', Yarın: 'Yarın 23:59’a kadar' } as Record<string, string>)[f.when] ||
  (f.date ? f.date + (f.time ? ', ' + f.time : '') : '—');
export { deadlineFor };

export const buildNeed = (f: NeedForm): Need => {
  const h = HOSPITALS.find((x) => x.n === f.hospital) || { n: f.hospital || '—', d: f.district || '—' };
  return {
    id: 'KB-41-21008', blood: (f.blood || '0+') as Blood, units: f.units, met: 0, going: 0, status: 'bekliyor',
    final: URGENCY_FOR_WHEN[f.when] || 'aktif', verified: false, hospital: h.n, dept: f.dept || 'Belirtilmedi',
    district: h.d, city: f.city || 'Kocaeli', dist: 0, mins: 0, deadline: deadlineFor(f), forName: shortName(f.name), cond: f.cond, mine: true,
  };
};

export const stepError = (step: number, f: NeedForm) => {
  switch (step) {
    case 1: return f.blood && f.units ? '' : 'Kan grubu ve ihtiyaç miktarını seç.';
    case 2: return f.name.trim().length >= 2 && f.cond ? '' : 'Hasta adı / baş harfleri ve durumu gerekli.';
    case 3: return f.hospital ? '' : 'Listeden bir hastane seç.';
    case 4: return f.when && (f.when !== 'Belirli' || (f.date && f.time)) ? '' : 'İhtiyaç zamanını seç.';
    case 5: return f.cName.trim().length >= 2 && f.cPhone.replace(/\D/g, '').length === 10 ? '' : 'Ad ve 10 haneli telefon numarası gerekli.';
    case 6: return f.ok ? '' : 'Yayınlamak için onay kutusunu işaretle.';
  }
  return '';
};

export const makeDonation = (n: Need, units: number, day: number): Donation => ({
  date: day ? '29 Eylül 2026' : '30 Eylül 2026', units, need: n.blood, hospital: n.hospital, place: n.district + ' / ' + n.city, st: 'p', id: n.id,
});

// ---------- navigation helpers ----------
export type Tab = 'home' | 'needs' | 'donations' | 'impact' | 'profile';
export const nav = {
  go: (path: string) => router.push(path as never),
  back: () => (router.canGoBack() ? router.back() : router.replace('/home' as never)),
  /** Switch to a tab and drop everything stacked above the tab bar. */
  tab: (t: Tab) => {
    if (router.canDismiss()) router.dismissAll();
    router.navigate(('/' + t) as never);
  },
  reset: (path: string) => {
    if (router.canDismiss()) router.dismissAll();
    router.replace(path as never);
  },
};

// ---------- context ----------
type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

interface Ctx {
  st: AppState;
  set: (p: Patch) => void;
  c: Palette;
  dark: boolean;
  allNeeds: Need[];
  toast: (msg: string) => void;
  toastMsg: string | null;
  toastBottom: number;
  setToastBottom: (n: number) => void;
  openNeed: (id: string) => void;
  publish: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

/** Web previews can start in dark mode with `?theme=dark` (like `?os=android`). */
const initialTheme = (): ThemePref => {
  try {
    const t = new URLSearchParams(globalThis.location?.search).get('theme');
    return t === 'dark' || t === 'system' ? t : 'light';
  } catch {
    return 'light';
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [st, setSt] = useState<AppState>(() => ({ ...INITIAL, theme: initialTheme() }));
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastBottom, setToastBottom] = useState(40);
  const tt = useRef<ReturnType<typeof setTimeout>>(undefined);
  const vt = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scheme = useColorScheme();

  const set = useCallback((p: Patch) => setSt((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })), []);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(tt.current);
    tt.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);
  useEffect(() => () => { clearTimeout(tt.current); clearTimeout(vt.current); }, []);

  const dark = st.theme === 'dark' || (st.theme === 'system' && scheme === 'dark');
  const allNeeds = useMemo(() => (st.myNeed ? [st.myNeed, ...NEEDS] : NEEDS), [st.myNeed]);

  const openNeed = useCallback((id: string) => nav.go('/need/' + id), []);

  const publish = useCallback(() => {
    setSt((s) => ({ ...s, myNeed: buildNeed(s.form), step: 1, form: EMPTY_FORM, stepErr: false }));
    nav.reset('/home');
    nav.go('/published');
    clearTimeout(vt.current);
    // Demo: the listing gets verified by the team ~8 s after publishing.
    vt.current = setTimeout(() => {
      setSt((s) => (s.myNeed ? { ...s, myNeed: { ...s.myNeed, status: s.myNeed.final || 'aktif', verified: true } } : s));
      toast('İlanın doğrulandı ve yayına alındı.');
    }, 8000);
  }, [toast]);

  const value = useMemo<Ctx>(
    () => ({ st, set, c: dark ? DARK : LIGHT, dark, allNeeds, toast, toastMsg, toastBottom, setToastBottom, openNeed, publish }),
    [st, set, dark, allNeeds, toast, toastMsg, toastBottom, openNeed, publish],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
};
export const useColors = () => useApp().c;

/** Screens with a bottom action bar lift the toast above it while focused. */
export const useToastOffset = (bottom: number) => {
  const { setToastBottom } = useApp();
  useFocusEffect(
    useCallback(() => {
      setToastBottom(bottom);
    }, [bottom, setToastBottom]),
  );
};
