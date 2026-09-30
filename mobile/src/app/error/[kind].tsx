import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { nav, useApp } from '../../store';
import { Btn, Screen, T } from '../../ui';

/**
 * Error states: /error/network | location | inactive | load.
 * Each one offers a way forward so the user is never stuck.
 */
export default function ErrorScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const { c, toast } = useApp();
  const EK = {
    network: { h: 'Kan İhtiyaçları', t: 'Bağlantı kurulamadı', s: 'İnternet bağlantın yok gibi görünüyor. Bağlantı geri geldiğinde ilanlar otomatik yenilenir.', ic: '!', note: 'Son güncelleme 14:32 · kayıtlı 6 ilan çevrimdışı görüntülenebilir.', p: 'Tekrar Dene', s2: 'Kayıtlı İlanları Gör', pa: () => { toast('Yeniden bağlanıldı.'); nav.tab('needs'); }, sa: () => nav.tab('needs') },
    location: { h: 'Konum', t: 'Konumun alınamadı', s: 'Konum servisleri kapalı olabilir. Seçtiğin il ve ilçeye göre devam edebilirsin.', ic: '?', p: 'Tekrar Dene', s2: 'Konum Ayarlarına Git', pa: () => toast('Konum hâlâ alınamıyor. İl/ilçe ile devam ediliyor.'), sa: () => nav.go('/settings/location') },
    inactive: { h: 'İhtiyaç Detayı', t: 'Bu ilan artık aktif değil', s: 'İlan sahibi ihtiyacın karşılandığını bildirdi. Destek olmak istediğin için teşekkürler.', ic: '✓', ok: true, p: 'Benzer İhtiyaçları Gör', s2: 'Ana Sayfaya Dön', pa: () => nav.tab('needs'), sa: () => nav.tab('home') },
    load: { h: 'İhtiyaç Detayı', t: 'İlan yüklenemedi', s: 'İlan bilgileri şu anda getirilemedi. Birkaç saniye sonra tekrar dene.', ic: '!', p: 'Tekrar Dene', s2: 'Ana Sayfaya Dön', pa: () => { nav.tab('home'); nav.go('/need/KB-41-20931'); }, sa: () => nav.tab('home') },
  } as const;
  const e: (typeof EK)[keyof typeof EK] & { ok?: boolean; note?: string } = EK[(kind as keyof typeof EK) || 'network'] ?? EK.network;
  return (
    <Screen title={e.h} fill>
      <View style={{ flexGrow: 1, paddingTop: 48, paddingHorizontal: 28, paddingBottom: 44, alignItems: 'center', gap: 14 }}>
        <View style={{ marginTop: 40, width: 96, height: 96, borderRadius: 48, backgroundColor: e.ok ? c.gsoft : c.soft, alignItems: 'center', justifyContent: 'center' }}>
          <T s={38} w={800} c={e.ok ? c.gtx : c.redtx}>{e.ic}</T>
        </View>
        <T s={24} w={700} ls={-0.02} center accessibilityRole="header">{e.t}</T>
        <T s={15} lh={1.5} c={c.ink3} center>{e.s}</T>
        {e.note ? (
          <View style={{ backgroundColor: c.fill, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }}>
            <T s={13} c={c.ink3} center>{e.note}</T>
          </View>
        ) : null}
        <View style={{ gap: 10, width: '100%', marginTop: 'auto' }}>
          <Btn label={e.p} onPress={e.pa} />
          <Btn label={e.s2} kind="secondary" onPress={e.sa} />
        </View>
      </View>
    </Screen>
  );
}
