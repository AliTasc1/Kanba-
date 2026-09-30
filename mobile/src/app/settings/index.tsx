import React from 'react';
import { nav, syncTarget, useApp, useSyncStatus } from '../../store';
import { Body, Screen } from '../../ui';
import { SettingsGroups, row, seg } from '../../components/Settings';

export default function Settings() {
  const { st, set, toast } = useApp();
  const live = useSyncStatus();
  return (
    <Screen title="Ayarlar">
      <Body pt={18} pb={40} gap={20}>
        <SettingsGroups
          groups={[
            { t: 'Görünüm', items: [seg('Tema', [['light', 'Açık'], ['dark', 'Koyu'], ['system', 'Sistem']], st.theme, (k) => set({ theme: k }))], note: 'Koyu temada kırmızı vurgu korunur; metin kontrastı WCAG AA düzeyindedir.' },
            { t: 'Tercihler', items: [row('Bildirim ayarları', '', () => nav.go('/settings/notifications')), row('Konum ayarları', '', () => nav.go('/settings/location')), row('Dil', 'Türkçe')] },
            { t: 'Hesap', items: [row('Gizlilik', '', () => nav.go('/settings/privacy')), row('Güvenlik', '', () => nav.go('/settings/security'))] },
            { t: 'Canlı bağlantı', items: [row('Yönetim paneli senkronu', live === 'online' ? '● Bağlı' : live === 'connecting' ? 'Bağlanıyor…' : 'Çevrimdışı')], note: `Sunucu: ${syncTarget()} · Çevrimdışıyken uygulama yerel verilerle çalışır.` },
            { t: 'Hakkında', items: [row('Sürüm', '1.0.0'), row('Kullanım koşulları', '', () => toast('Kullanım koşulları açılıyor.')), row('Açık kaynak lisansları', '', () => toast('Lisanslar açılıyor.'))] },
          ]}
        />
      </Body>
    </Screen>
  );
}
