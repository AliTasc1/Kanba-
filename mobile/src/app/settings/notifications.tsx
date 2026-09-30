import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp, type AppState } from '../../store';
import { Body, Screen, T, Tap } from '../../ui';
import { SettingsGroups, seg, toggle } from '../../components/Settings';

export default function NotificationSettings() {
  const { st, set, c, toast } = useApp();
  const { denied } = useLocalSearchParams<{ denied?: string }>();
  // `?denied=1` previews the state where notifications are off at the OS level.
  useEffect(() => { if (denied) set({ notifDenied: true }); }, [denied, set]);
  const ns = st.ns;
  const setNs = (p: Partial<AppState['ns']>) => set((s) => ({ ns: { ...s.ns, ...p } }));
  const flip = (k: Exclude<keyof AppState['ns'], 'dist'>) => () => setNs({ [k]: !ns[k] });
  return (
    <Screen title="Bildirim Ayarları">
      <Body pt={18} pb={40} gap={20}>
        {st.notifDenied ? (
          <View accessibilityRole="alert" style={{ backgroundColor: c.soft, borderRadius: 18, padding: 16, gap: 6 }}>
            <T s={16} w={700} c={c.redtx}>Bildirimler kapalı</T>
            <T s={13} lh={1.45} c={c.ink2}>Cihaz ayarlarında Kanbağ bildirimleri kapalı. Yakınındaki acil ihtiyaçlardan haberdar olamazsın.</T>
            <Tap onPress={() => { set({ notifDenied: false }); toast('Bildirimler açıldı.'); }} style={{ alignSelf: 'flex-start', marginTop: 6, height: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.red, justifyContent: 'center' }}>
              <T s={14} w={600} c="#FFFFFF">Ayarları Aç</T>
            </Tap>
          </View>
        ) : null}
        <SettingsGroups
          groups={[
            { t: 'Acil ihtiyaçlar', items: [
              toggle('Yakınımdaki acil ihtiyaçlar', 'Seçtiğin mesafe içindeki yeni ilanlar', ns.near, flip('near')),
              toggle('Yalnızca kan grubuma uygun olanlar', '0 Rh+ için: 0+, A+, B+ ve AB+ ihtiyaçları', ns.compat, flip('compat')),
              seg('Bildirim mesafesi', [[10, '10 km'], [25, '25 km'], [50, '50 km'], [0, 'Tüm il']], ns.dist, (k) => setNs({ dist: k })),
            ] },
            { t: 'Diğer', items: [
              toggle('İlan durumu', 'Oluşturduğun veya destek olduğun ilanlardaki gelişmeler', ns.status, flip('status')),
              toggle('Bağış hatırlatmaları', 'Yeniden bağış yapabileceğin tarih geldiğinde', ns.remind, flip('remind')),
              toggle('Bağış geçmişi', 'Bağışın doğrulandığında', ns.history, flip('history')),
              toggle('Gönüllü bildirimleri', 'İlindeki haftalık dayanışma özeti', ns.vol, flip('vol')),
              toggle('Uygulama duyuruları', 'Yeni özellikler ve önemli güncellemeler', ns.news, flip('news')),
            ] },
            { t: 'Sessiz saatler', items: [toggle('23:00 – 08:00 arası sessiz', 'Acil ihtiyaç bildirimleri bu saatlerde de gelir.', ns.quiet, flip('quiet'))] },
          ]}
        />
      </Body>
    </Screen>
  );
}
