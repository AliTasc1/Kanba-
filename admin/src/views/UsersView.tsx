import { USERS } from '../data';
import { badge, bl, DataTable, TableLayout, tx } from '../components/DataTable';
import { matcher } from './match';

export function UsersView({ q }: { q: string }) {
  const match = matcher(q);
  return (
    <TableLayout note="Kişisel veriler maskelidir. Telefon numarası ve doğum tarihi yalnızca yetkili rol ve gerekçeyle görüntülenebilir; her görüntüleme kayda alınır.">
      <DataTable
        cols="minmax(0,1.2fr) 70px minmax(0,1fr) minmax(0,1fr) 110px 130px 110px 100px"
        heads={['Kullanıcı', 'Grup', 'İl', 'İlçe', 'Top. bağış', 'Aktiflik', 'Kayıt', 'Bildirim']}
        rows={USERS.filter((u) => match(u)).map((u) => ({
          key: u[0],
          cells: [
            tx(u[0], { fw: 600 }), bl(u[1]), tx(u[2]), tx(u[3], { fg: '#3F3F46' }), tx(String(u[4]), { fw: 600 }),
            u[5] === 'Pasif' ? badge('Pasif', '#F4F4F5', '#52525B', '#E4E4E7') : badge(u[5], '#E4F2EA', '#135E3D'),
            tx(u[6], { fg: '#52525B' }), tx(u[7], { fg: u[7] === 'Açık' ? '#135E3D' : '#52525B', fw: 600 }),
          ],
        }))}
      />
    </TableLayout>
  );
}
