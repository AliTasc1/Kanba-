import React from 'react';
import { View } from 'react-native';
import { nav, useApp } from '../../store';
import { Body, Card, Grid, LinkBtn, Screen, SmallBtn, T } from '../../ui';
import { SettingsGroups, row } from '../../components/Settings';

export default function Profile() {
  const { st, c, toast } = useApp();
  const dons = st.dons;
  const cities = new Set(dons.map((x) => x.place.split(' / ')[1]));
  const stats = [
    { v: dons.reduce((a, x) => a + x.units, 0), l: 'Toplam Ünite' },
    { v: dons.filter((x) => x.need).length, l: 'Desteklenen İhtiyaç' },
    { v: cities.size, l: 'Desteklenen İl' },
    { v: 'Nis 2025', l: 'İlk Bağış' },
  ];
  const mn = st.myNeed;
  const groups = [
    { items: [row('Bağış geçmişim', dons.length + ' bağış', () => nav.tab('donations')), row('İhtiyaçlarım', mn ? '1 ilan' : 'Yok', () => (mn ? nav.go('/need/' + mn.id) : toast('Henüz bir ihtiyaç ilanı oluşturmadın.')))] },
    { items: [row('Bildirim ayarları', '', () => nav.go('/settings/notifications')), row('Bölge ayarlarım', 'Başiskele', () => nav.go('/settings/location')), row('Kan grubu', '0 Rh+', () => nav.go('/profile-edit'))] },
    { items: [row('Gizlilik', '', () => nav.go('/settings/privacy')), row('Güvenlik', '', () => nav.go('/settings/security'))] },
    { items: [row('Yardım', '', () => nav.go('/help')), row('Uygulamayı destekle', '', () => nav.go('/support')), row('Hakkında', 'Sürüm 1.0.0', () => nav.go('/settings'))] },
    { items: [row('Çıkış yap', '', () => nav.reset('/login'), true)] },
  ];

  return (
    <Screen tabbed>
      <Body pt={4} pb={32} gap={16}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T s={32} w={700} ls={-0.025} accessibilityRole="header">Profil</T>
          <LinkBtn label="Ayarlar" s={16} onPress={() => nav.go('/settings')} />
        </View>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <T s={22} w={800} c={c.redtx}>AY</T>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T s={19} w={700}>{st.pe.first} {st.pe.last}</T>
            <T s={14} c={c.ink3}>0 Rh+ · Başiskele / Kocaeli</T>
          </View>
          <SmallBtn label="Düzenle" onPress={() => nav.go('/profile-edit')} />
        </Card>
        <Grid cols={2}>
          {stats.map((x) => (
            <Card key={x.l} r={18} style={{ paddingVertical: 14 }}>
              <T s={24} w={800} ls={-0.02}>{x.v}</T>
              <T s={13} w={500} c={c.ink3}>{x.l}</T>
            </Card>
          ))}
        </Grid>
        <SettingsGroups groups={groups} />
        <T s={12} c={c.ink4} center>Kanbağ 1.0.0 · Tüm özellikler herkes için ücretsizdir.</T>
      </Body>
    </Screen>
  );
}
