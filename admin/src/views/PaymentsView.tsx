import { PAYS } from '../data';
import { badge, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

export function PaymentsView({ q }: { q: string }) {
  const match = matcher(q);
  return (
    <TableLayout note="Destek ödemeleri hiçbir özellik, öncelik veya görünürlük sağlamaz. Kan bağışı veya ilanlarla ilişkilendirilmez.">
      <DataTable
        cols="180px 120px minmax(0,1fr) minmax(0,1fr) 140px minmax(0,1fr)"
        heads={['İşlem no', 'Tutar', 'Yöntem', 'Tarih', 'Durum', 'Karşılığı']}
        rows={PAYS.filter((p) => match(p)).map((p) => ({
          key: p[0],
          cells: [
            tx(p[0], { mono: true }), tx(p[1], { fw: 700 }), tx(p[2]), tx(p[3], { fg: '#52525B' }),
            p[4] === 'Başarılı' ? badge('Başarılı', '#E4F2EA', '#135E3D') : badge(p[4], '#F4F4F5', '#52525B', '#E4E4E7'),
            tx('Yok · gönüllü destek', { fg: '#52525B' }),
          ],
        }))}
      />
    </TableLayout>
  );
}
