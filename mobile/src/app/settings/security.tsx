import React from 'react';
import { useApp } from '../../store';
import { isIOSChrome } from '../../theme';
import { Body, Screen } from '../../ui';
import { SettingsGroups, row, toggle } from '../../components/Settings';

export default function Security() {
  const { st, set, toast } = useApp();
  const sc = st.sec;
  return (
    <Screen title="Güvenlik">
      <Body pt={18} pb={40} gap={20}>
        <SettingsGroups
          groups={[
            { t: 'Giriş yöntemleri', items: [row('Telefon', '+90 532 *** ** 90 · ✓'), row('Apple', 'Bağlı'), row('Google', 'Bağla', () => toast('Google hesabı bağlanıyor.'))] },
            { t: 'Uygulama kilidi', items: [
              toggle(isIOSChrome ? 'Face ID ile kilitle' : 'Parmak izi ile kilitle', 'Uygulamayı açarken kimliğini doğrula', sc.lock, () => set({ sec: { ...sc, lock: !sc.lock } })),
              toggle('Uygulama önizlemesini gizle', 'Uygulama değiştiricide içerik bulanıklaşır', sc.s2, () => set({ sec: { ...sc, s2: !sc.s2 } })),
            ] },
            {
              t: 'Aktif oturumlar',
              items: [row(isIOSChrome ? 'iPhone · bu cihaz' : 'Android · bu cihaz', 'Şimdi'), row('iPad · İzmit', '3 gün önce · Kapat', () => toast('Oturum kapatıldı.'), true)],
              note: 'Tanımadığın bir oturum görürsen hemen kapat.',
            },
          ]}
        />
      </Body>
    </Screen>
  );
}
