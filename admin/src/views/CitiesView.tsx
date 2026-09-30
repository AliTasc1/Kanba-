import { nf, PROVINCES, provinceStats } from '@shared/data';
import { DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

/** 81-province summary; clicking a row focuses that province on the dashboard map. */
export function CitiesView({ q, onPick }: { q: string; onPick: (province: string) => void }) {
  const match = matcher(q);
  const rows = PROVINCES.filter((p) => match([p])).map((p) => ({ p, ...provinceStats(p) })).sort((a, b) => b.donation - a.donation);
  return (
    <TableLayout>
      <DataTable
        cols="60px minmax(0,1.4fr) repeat(4,minmax(0,1fr))"
        heads={['#', 'İl', 'Aktif ihtiyaç', 'Karşılanan', 'Toplam bağış', 'Gönüllü']}
        rows={rows.map((r, i) => ({
          key: r.p,
          onClick: () => onPick(r.p),
          cells: [
            tx(String(i + 1), { fg: '#71717A' }), tx(r.p, { fw: 600 }),
            tx(nf(r.active), { fg: r.active >= 15 ? '#A01223' : '#18181B', fw: r.active >= 15 ? 700 : 400 }),
            tx(nf(r.met)), tx(nf(r.donation), { fw: 600 }), tx(nf(r.vol), { fg: '#3F3F46' }),
          ],
        }))}
      />
    </TableLayout>
  );
}
