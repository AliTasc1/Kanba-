import { STATUS_RANK, canDonateTo, lc, longBlood } from '@shared';
import { useApp } from '../store';

/** Needs list after applying the current filters, search and sort (prototype `renderVals` list logic). */
export function useFilteredNeeds() {
  const { st, allNeeds } = useApp();
  const f = st.f;
  let list = allNeeds.filter((n) => n.city === f.city);
  if (f.district !== 'Tümü') list = list.filter((n) => n.district === f.district);
  if (f.bloods.length) list = list.filter((n) => f.bloods.includes(n.blood));
  if (f.compat) list = list.filter((n) => canDonateTo(n.blood));
  if (f.dist) list = list.filter((n) => n.mine || n.dist <= f.dist);
  if (f.urg.length) list = list.filter((n) => f.urg.includes(n.status));
  if (f.open) list = list.filter((n) => n.status !== 'karsilandi');
  const q = lc(st.search.trim());
  if (q) list = list.filter((n) => lc([n.hospital, n.district, n.city, n.blood, longBlood(n.blood), n.id].join(' ')).includes(q));
  const sorters = {
    yeni: (a: typeof list[0], b: typeof list[0]) => a.mins - b.mins,
    yakin: (a: typeof list[0], b: typeof list[0]) => a.dist - b.dist,
    acil: (a: typeof list[0], b: typeof list[0]) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.mins - b.mins,
  };
  return list.slice().sort(sorters[f.sort]);
}

export const activeFilterCount = (f: ReturnType<typeof useApp>['st']['f']) =>
  Number(f.district !== 'Tümü') + (f.bloods.length ? 1 : 0) + Number(f.compat) + (f.dist ? 1 : 0) + (f.urg.length ? 1 : 0) + Number(f.open);
