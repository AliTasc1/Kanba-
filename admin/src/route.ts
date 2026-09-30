import { useEffect, useState } from 'react';
import { VIEWS, type NeedTab, type View, NEED_TABS } from './data';

export interface Route {
  view: View;
  /** Selected need (needs/verify drawer) or report id (reports). */
  sel: string | null;
  tab: NeedTab;
}

const TABS = NEED_TABS.map((t) => t[0]);

/**
 * Hash routes:
 *   #/dash, #/verify, #/needs, #/needs?tab=aktif, #/needs/KB-27-19002 (drawer open),
 *   #/reports/ŞK-1041, #/cities, … and #/drawer as an alias of the prototype's "drawer" preview.
 */
export const parseHash = (hash: string): Route => {
  const raw = hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [v, ...rest] = path.split('/').filter(Boolean);
  if (v === 'drawer') return { view: 'needs', sel: 'KB-27-19002', tab: 'all' };
  const view = (VIEWS as string[]).includes(v) ? (v as View) : 'dash';
  const sel = rest.length ? decodeURIComponent(rest.join('/')) : null;
  const t = new URLSearchParams(query).get('tab');
  const tab = t && (TABS as string[]).includes(t) ? (t as NeedTab) : 'all';
  return { view, sel, tab };
};

export const toHash = ({ view, sel, tab }: Route) =>
  '#/' + view + (sel ? '/' + encodeURIComponent(sel) : '') + (tab !== 'all' ? '?tab=' + tab : '');

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (next: Partial<Route> & { view?: View }) => {
    const r: Route = { view: next.view ?? route.view, sel: next.sel ?? null, tab: next.tab ?? 'all' };
    const h = toHash(r);
    if (h !== window.location.hash) window.location.hash = h;
    else setRoute(r);
  };
  return { route, go };
}
