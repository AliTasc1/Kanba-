import React from 'react';
import { useApp } from '../../store';
import { Body, Screen } from '../../ui';
import { SettingsGroups, row, toggle } from '../../components/Settings';

export default function Privacy() {
  const { st, set, toast } = useApp();
  const pv = st.pv;
  return (
    <Screen title="Gizlilik">
      <Body pt={18} pb={40} gap={20}>
        <SettingsGroups
          groups={[
            { t: 'Görünürlük', items: [
              toggle('İlan sahiplerine adımı göster', 'Yalnızca ad ve soyadının baş harfi: Ali Y.', pv.name, () => set({ pv: { ...pv, name: !pv.name } })),
              toggle('Bağışlarımı etki istatistiklerine anonim ekle', 'Kimliğin hiçbir istatistikte görünmez.', pv.anon, () => set({ pv: { ...pv, anon: !pv.anon } })),
            ] },
            { t: 'Telefon numaram', items: [row('Herkese açık', 'Hayır')], note: 'Telefon numaran hiçbir zaman herkese açık gösterilmez. Telefonla iletişimi seçtiğinde yalnızca bağış planını onaylayan gönüllüler görebilir.' },
            { t: 'Verilerim', items: [
              row('KVKK Aydınlatma Metni', '', () => toast('Aydınlatma metni açılıyor.')),
              row('Verilerimi indir', '', () => toast('Verilerin hazırlanıyor; hazır olduğunda bildireceğiz.')),
              row('Hesabımı sil', '', () => toast('Hesap silme onayı için SMS kodu gönderilecek.'), true),
            ] },
          ]}
        />
      </Body>
    </Screen>
  );
}
