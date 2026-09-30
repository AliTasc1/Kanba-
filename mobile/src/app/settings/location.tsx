import React from 'react';
import { nav, useApp, type AppState } from '../../store';
import { Body, Screen } from '../../ui';
import { SettingsGroups, row, seg, toggle } from '../../components/Settings';

export default function LocationSettings() {
  const { st, set } = useApp();
  const loc = st.loc;
  const setLoc = (p: Partial<AppState['loc']>) => set((s) => ({ loc: { ...s.loc, ...p } }));
  return (
    <Screen title="Konum Ayarları">
      <Body pt={18} pb={40} gap={20}>
        <SettingsGroups
          groups={[
            {
              t: 'Konum kullanımı',
              items: [seg('Konum izni', [['while', 'Kullanırken'], ['off', 'Kapalı']], loc.mode, (k) => setLoc({ mode: k }))],
              note: loc.mode === 'off' ? 'Konum kapalıyken mesafe yerine seçtiğin ilçe gösterilir.' : 'Konumun yalnızca mesafe hesaplamak için kullanılır ve kimseyle paylaşılmaz.',
            },
            { t: 'Bölgem', items: [
              row('İl', st.reg.city || 'Kocaeli', () => nav.go('/province?from=settings')),
              row('İlçe', st.reg.district || 'Başiskele', () => {
                if (!st.reg.city) set((s) => ({ reg: { ...s.reg, city: 'Kocaeli' } }));
                nav.go('/district?from=settings');
              }),
            ] },
            {
              t: 'Takip ettiğim diğer iller',
              items: [
                toggle('Sakarya', 'İlanları ve bildirimleri dahil et', loc.Sakarya, () => setLoc({ Sakarya: !loc.Sakarya })),
                toggle('İstanbul', 'İlanları ve bildirimleri dahil et', loc.İstanbul, () => setLoc({ İstanbul: !loc.İstanbul })),
              ],
              note: 'En fazla 3 ek il takip edebilirsin.',
            },
          ]}
        />
      </Body>
    </Screen>
  );
}
