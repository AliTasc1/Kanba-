import { DONS } from '../data';
import { badge, bl, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

export function DonationsView({ q }: { q: string }) {
  const match = matcher(q);
  return (
    <TableLayout note="Beyan: kullanıcının kendi kaydı. Doğrulanmış: ilan sahibi veya hastane onayı alınmış bağış. Sistem bağışı otomatik doğrulamaz.">
      <DataTable
        cols="150px minmax(0,.8fr) 60px 130px minmax(0,1.6fr) minmax(0,1.1fr) 120px 130px"
        heads={['Bağış ID', 'Bağışçı', 'Grup', 'İlan ID', 'Hastane', 'İl / İlçe', 'Tarih', 'Durum']}
        rows={DONS.filter((d) => match(d)).map((d) => ({
          key: d[0],
          cells: [
            tx(d[0], { mono: true }), tx(d[1], { fw: 600 }), bl(d[2]), tx(d[3], { mono: true, fg: '#3F3F46' }), tx(d[4]),
            tx(d[5], { fg: '#3F3F46' }), tx(d[6], { fg: '#52525B' }),
            d[7] === 'Beyan' ? badge('Beyan', '#FFFFFF', '#3F3F46', '#D4D4D8') : badge('✓ Doğrulanmış', '#E4F2EA', '#135E3D'),
          ],
        }))}
      />
    </TableLayout>
  );
}
