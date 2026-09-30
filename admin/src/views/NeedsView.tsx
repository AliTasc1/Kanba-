import { agoTxt, inTab, NEED_TABS, ST, type AdminNeed, type NeedTab } from '../data';
import { badge, bl, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

interface Props {
  mode: 'needs' | 'verify';
  needs: AdminNeed[];
  tab: NeedTab;
  q: string;
  sel: string | null;
  onTab: (t: NeedTab) => void;
  onOpen: (id: string) => void;
}

const COLS = '130px 60px minmax(0,2.2fr) minmax(0,1.1fr) 80px 110px 170px 70px';
const HEADS = ['İlan ID', 'Grup', 'Hastane', 'İl / İlçe', 'Ünite', 'Oluşturma', 'Durum', 'Şikayet'];

export function NeedsView({ mode, needs, tab, q, sel, onTab, onOpen }: Props) {
  const tabK: NeedTab = mode === 'verify' ? 'bekliyor' : tab;
  const match = matcher(q);
  const rows = needs.filter((n) => inTab(n, tabK) && match([n.id, n.hospital, n.city, n.district, n.blood, n.owner]));

  const tabs = mode === 'needs' && (
    <div role="tablist" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {NEED_TABS.map(([k, l]) => {
        const on = tab === k;
        return (
          <button key={k} role="tab" aria-selected={on} onClick={() => onTab(k)} style={{ height: 36, padding: '0 14px', borderRadius: 999, border: `1px solid ${on ? '#18181B' : '#E4E4E7'}`, background: on ? '#18181B' : '#FFFFFF', color: on ? '#FFFFFF' : '#18181B', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            {l}
            <span style={{ fontSize: 12, opacity: 0.75 }}>{needs.filter((n) => inTab(n, k)).length}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <TableLayout
      tabs={tabs}
      note={mode === 'verify' ? 'Kontrol listesi: hastane kayıtlı mı · servis ve kan grubu tutarlı mı · iletişim numarası SMS ile doğrulanmış mı · ilanda ücret veya kişisel sağlık bilgisi var mı.' : undefined}
    >
      <DataTable
        cols={COLS}
        heads={HEADS}
        rows={rows.map((n) => {
          const s = ST[n.status];
          return {
            key: n.id,
            onClick: () => onOpen(n.id),
            selected: sel === n.id,
            cells: [
              tx(n.id, { mono: true, fw: 600 }), bl(n.blood), tx(n.hospital, { fw: 500 }), tx(n.district + ' / ' + n.city, { fg: '#3F3F46' }),
              tx(n.met + ' / ' + n.units), tx(agoTxt(n.mins), { fg: '#52525B' }), badge(s[0], s[1], s[2], s[3]),
              n.reports ? badge(String(n.reports), '#C4162A', '#FFFFFF') : tx('—', { fg: '#A1A1AA' }),
            ],
          };
        })}
      />
    </TableLayout>
  );
}
