import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';
import {
  HOSPITALS, ME, SYNC_PORT, SyncClient, URGENCY_FOR_WHEN, donorStatus, longDate, rid, shortName, stamp,
  type Action, type Blood, type DbDonation, type DbNeed, type Donation, type Need, type NeedStatus, type SyncStatus,
} from '@shared';
import { DARK, LIGHT, type Palette } from './theme';

// ---------- live sync with the admin panel ----------
/**
 * The sync server runs on the same computer as the Expo dev server, so its host
 * is taken from Expo's hostUri (e.g. 192.168.1.20:8081 → ws://192.168.1.20:4000).
 * EXPO_PUBLIC_SYNC_URL overrides it.
 */
const syncUrl = () => {
  if (process.env.EXPO_PUBLIC_SYNC_URL) return process.env.EXPO_PUBLIC_SYNC_URL;
  if (Platform.OS === 'web') return `ws://${globalThis.location?.hostname || 'localhost'}:${SYNC_PORT}`;
  const host = (Constants.expoConfig?.hostUri ?? '').split(':')[0] || 'localhost';
  return `ws://${host}:${SYNC_PORT}`;
};
export const sync = new SyncClient(syncUrl(), 'mobile');
export const useSyncStatus = (): SyncStatus => useSyncExternalStore((f) => sync.subscribe(f), () => sync.status);
export const syncTarget = syncUrl;

/** Synced listing → the shape the mobile screens render (null when hidden from donors). */
export const toMobileNeed = (n: DbNeed): Need | null => {
  const status = donorStatus(n);
  if (!status) return null;
  return {
    id: n.id, blood: n.blood, units: n.units, met: n.met, going: n.going, status, final: n.urgency, verified: n.verified,
    hospital: n.hospital, dept: n.dept, district: n.district, city: n.city, dist: n.dist, mins: n.mins, deadline: n.deadline,
    forName: n.forName, cond: n.cond, mine: n.createdBy === ME,
  };
};

const toMobileDonation = (d: DbDonation): Donation => ({
  id: d.id, date: d.date, units: d.units, need: d.needBlood, hospital: d.hospital, place: d.place,
  st: d.status === 'Doğrulanmış' ? 'v' : d.needId ? 'p' : 'b',
});

const yymmdd = (d = new Date()) => String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');

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
  lastDon: Donation | null;
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
  payId: string;
  faq: { open: number; q: string; topic: string };
}

const INITIAL: AppState = {
  theme: 'light', lastDon: null,
  f: DEFAULT_FILTERS, search: '', step: 1, form: EMPTY_FORM, stepErr: false,
  login: '', reg: { first: '', last: '', dob: '', blood: '', city: '', district: '' },
  readN: {}, mapSel: 'Kocaeli',
  ns: { near: true, compat: true, dist: 25, status: true, remind: true, history: true, vol: false, news: false, quiet: true },
  notifDenied: false, pv: { name: true, anon: true }, sec: { lock: false, s2: true },
  loc: { mode: 'while', Sakarya: true, İstanbul: false },
  pe: { first: 'Ali', last: 'Yılmaz', dob: '12.05.1994', blood: '0+' },
  amt: 100, payM: '', payId: 'KBD-260930-4821', faq: { open: -1, q: '', topic: 'Tümü' },
};

// ---------- need helpers ----------
const deadlineFor = (f: NeedForm) =>
  ({ Şimdi: 'Şimdi · 3 saat içinde', Bugün: 'Bugün 23:59’a kadar', Yarın: 'Yarın 23:59’a kadar' } as Record<string, string>)[f.when] ||
  (f.date ? f.date + (f.time ? ', ' + f.time : '') : '—');
export { deadlineFor };

/** Listing preview built from the create form (used by the summary step). */
export const buildNeed = (f: NeedForm): Need => {
  const h = HOSPITALS.find((x) => x.n === f.hospital) || { n: f.hospital || '—', d: f.district || '—' };
  return {
    id: 'KB-41-21008', blood: (f.blood || '0+') as Blood, units: f.units, met: 0, going: 0, status: 'bekliyor',
    final: URGENCY_FOR_WHEN[f.when] || 'aktif', verified: false, hospital: h.n, dept: f.dept || 'Belirtilmedi',
    district: h.d, city: f.city || 'Kocaeli', dist: 0, mins: 0, deadline: deadlineFor(f), forName: shortName(f.name), cond: f.cond, mine: true,
  };
};

/** The synced listing sent to the server when the user publishes. */
const buildDbNeed = (f: NeedForm): DbNeed => {
  const n = buildNeed(f);
  const at = stamp();
  const owner = shortName(f.cName);
  return {
    ...n, id: 'KB-41-2' + rid(4), committers: [], status: 'bekliyor', urgency: (n.final === 'acil' || n.final === 'oncelikli' ? n.final : 'aktif'),
    verified: false, created: at, owner, createdBy: ME, reports: 0,
    hist: [{ t: at, who: 'Sistem', a: `İlan oluşturuldu · ${owner} · iletişim: ${f.pref === 'app' ? 'uygulama içi' : 'telefon'}` }],
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

export const makeDonation = (n: Need, units: number, day: number): DbDonation => {
  const d = new Date();
  if (day) d.setDate(d.getDate() - 1);
  return {
    id: `BG-${yymmdd(d)}-${rid(3)}`, donor: ME, donorBlood: '0+', needId: n.id, needBlood: n.blood, hospital: n.hospital,
    place: n.district + ' / ' + n.city, date: longDate(d), units, status: 'Beyan',
  };
};

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
  /** Every synced listing, including ones hidden from donors. */
  dbNeeds: DbNeed[];
  myNeed: Need | null;
  dons: Donation[];
  committed: (id: string) => boolean;
  dispatch: (a: Action) => void;
  commit: (id: string) => void;
  recordDonation: (d: DbDonation) => void;
  report: (need: string, reason: string) => void;
  pay: (amount: number, method: string) => string;
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
  const db = useSyncExternalStore((f) => sync.subscribe(f), () => sync.db);

  const set = useCallback((p: Patch) => setSt((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })), []);
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(tt.current);
    tt.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);
  useEffect(() => () => { clearTimeout(tt.current); clearTimeout(vt.current); }, []);

  const dark = st.theme === 'dark' || (st.theme === 'system' && scheme === 'dark');
  const allNeeds = useMemo(() => db.needs.map(toMobileNeed).filter((n): n is Need => !!n), [db.needs]);
  const myNeed = useMemo(() => allNeeds.find((n) => n.mine) ?? null, [allNeeds]);
  const dons = useMemo(() => db.donations.filter((d) => d.donor === ME).map(toMobileDonation), [db.donations]);
  const committed = useCallback((id: string) => !!db.needs.find((n) => n.id === id)?.committers.includes(ME), [db.needs]);
  const dispatch = useCallback((a: Action) => sync.dispatch(a), []);

  // Moderator decisions from the admin panel reach the user instantly.
  useEffect(
    () =>
      sync.onEvent(({ action: a, mine }) => {
        if (mine) return;
        if (a.type === 'need.setStatus' && sync.db.needs.find((n) => n.id === a.id)?.createdBy === ME) {
          const msg = ({
            aktif: 'İlanın doğrulandı ve yayına alındı.',
            iptal: 'İlanın doğrulanamadı ve yayından kaldırıldı.',
            askida: 'İlanın incelemeye alındı ve geçici olarak askıya alındı.',
            karsilandi: 'İlanın karşılandı olarak işaretlendi. Teşekkürler!',
          } as Record<string, string>)[a.status];
          if (msg) toast(msg);
        }
        if (a.type === 'donation.verify' && sync.db.donations.find((d) => d.id === a.id)?.donor === ME)
          toast('Bağışın doğrulandı. Dayanışman için teşekkürler!');
      }),
    [toast],
  );

  const openNeed = useCallback((id: string) => nav.go('/need/' + id), []);

  const publish = useCallback(() => {
    const need = buildDbNeed(st.form);
    sync.dispatch({ type: 'need.create', need });
    setSt((s) => ({ ...s, step: 1, form: EMPTY_FORM, stepErr: false }));
    nav.reset('/home');
    nav.go('/published');
    clearTimeout(vt.current);
    // Without a sync server nobody can moderate, so the demo verifies the listing itself after ~8 s.
    if (sync.status !== 'online')
      vt.current = setTimeout(() => {
        sync.dispatch({ type: 'need.setStatus', id: need.id, status: 'aktif', label: 'Doğrulandı (çevrimdışı demo)', who: 'Sistem', at: stamp() });
        toast('İlanın doğrulandı ve yayına alındı.');
      }, 8000);
  }, [st.form, toast]);

  const commit = useCallback((id: string) => sync.dispatch({ type: 'need.commit', id, user: ME, at: stamp() }), []);
  const recordDonation = useCallback((d: DbDonation) => sync.dispatch({ type: 'donation.record', donation: d, at: stamp() }), []);
  const report = useCallback((need: string, reason: string) => sync.dispatch({ type: 'report.create', id: 'ŞK-1' + rid(3), need, reason }), []);
  const pay = useCallback((amount: number, method: string) => {
    const id = `KBD-${yymmdd()}-${rid(4)}`;
    const d = new Date();
    const date = `${d.getDate()} ${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][d.getMonth()]} ${d.getFullYear()} ${stamp(d).split(' ')[2]}`;
    sync.dispatch({ type: 'payment.create', payment: { id, amount, method, date, status: 'Başarılı', by: ME } });
    return id;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      st, set, c: dark ? DARK : LIGHT, dark, allNeeds, dbNeeds: db.needs, myNeed, dons, committed, dispatch, commit, recordDonation, report, pay,
      toast, toastMsg, toastBottom, setToastBottom, openNeed, publish,
    }),
    [st, set, dark, allNeeds, db.needs, myNeed, dons, committed, dispatch, commit, recordDonation, report, pay, toast, toastMsg, toastBottom, setToastBottom, openNeed, publish],
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
