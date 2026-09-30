import type { DbDonation } from '@shared/sync';
import { badge, bl, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

const shortDate = (d: string) => d.replace(/^(\d+) (\S{3})\S* (\d+)$/, '$1 $2 $3');

export function DonationsView({ q, donations, onVerify }: { q: string; donations: DbDonation[]; onVerify: (id: string) => void }) {
  const match = matcher(q);
  return (
    <TableLayout note="Beyan: kullanıcının kendi kaydı. Doğrulanmış: ilan sahibi veya hastane onayı alınmış bağış. Sistem bağışı otomatik doğrulamaz. Beyanı onayladığında ilgili ilanın karşılanan ünitesi artar ve bağışçının uygulamasında anında “Doğrulanmış” görünür.">
      <DataTable
        cols="150px minmax(0,.8fr) 60px 130px minmax(0,1.6fr) minmax(0,1.1fr) 120px 150px"
        heads={['Bağış ID', 'Bağışçı', 'Grup', 'İlan ID', 'Hastane', 'İl / İlçe', 'Tarih', 'Durum']}
        rows={donations
          .filter((d) => match([d.id, d.donor, d.donorBlood, d.needId ?? '', d.hospital, d.place, d.date, d.status]))
          .map((d) => ({
            key: d.id,
            cells: [
              tx(d.id, { mono: true }), tx(d.donor, { fw: 600 }), bl(d.donorBlood), tx(d.needId ?? '—', { mono: true, fg: '#3F3F46' }), tx(d.hospital),
              tx(d.place, { fg: '#3F3F46' }), tx(shortDate(d.date), { fg: '#52525B' }),
              d.status === 'Beyan'
                ? tx(
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-block', padding: '4px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#FFFFFF', color: '#3F3F46', border: '1px solid #D4D4D8' }}>Beyan</span>
                      <button onClick={() => onVerify(d.id)} style={{ height: 28, padding: '0 10px', borderRadius: 8, border: 'none', background: '#177A4E', color: '#FFFFFF', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Doğrula</button>
                    </span>,
                  )
                : badge('✓ Doğrulanmış', '#E4F2EA', '#135E3D'),
            ],
          }))}
      />
    </TableLayout>
  );
}
