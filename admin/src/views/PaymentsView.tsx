import { paymentLabel, type DbPayment } from '@shared/sync';
import { badge, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

export function PaymentsView({ q, payments }: { q: string; payments: DbPayment[] }) {
  const match = matcher(q);
  return (
    <TableLayout note="Destek ödemeleri hiçbir özellik, öncelik veya görünürlük sağlamaz. Kan bağışı veya ilanlarla ilişkilendirilmez.">
      <DataTable
        cols="180px 120px minmax(0,1fr) minmax(0,1fr) 140px minmax(0,1fr)"
        heads={['İşlem no', 'Tutar', 'Yöntem', 'Tarih', 'Durum', 'Karşılığı']}
        rows={payments.filter((p) => match([p.id, paymentLabel(p), p.method, p.date, p.status])).map((p) => ({
          key: p.id,
          cells: [
            tx(p.id, { mono: true }), tx(paymentLabel(p), { fw: 700 }), tx(p.method), tx(p.date, { fg: '#52525B' }),
            p.status === 'Başarılı' ? badge('Başarılı', '#E4F2EA', '#135E3D') : badge(p.status, '#F4F4F5', '#52525B', '#E4E4E7'),
            tx('Yok · gönüllü destek', { fg: '#52525B' }),
          ],
        }))}
      />
    </TableLayout>
  );
}
