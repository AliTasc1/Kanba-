import React from 'react';
import { View } from 'react-native';
import { FAQ } from '@shared';
import { nav, useApp } from '../store';
import { Body, Card, Grid, Screen, SearchField, SmallBtn, T, Tap } from '../ui';

export default function Help() {
  const { set, c, toast } = useApp();
  const openFaq = (topic = 'Tümü', open = -1) => { set({ faq: { topic, open, q: '' } }); nav.go('/faq'); };
  return (
    <Screen title="Yardım">
      <Body pt={18} pb={40} gap={16}>
        <SearchField placeholder="Soru veya konu ara" onPress={() => openFaq()} />
        <View style={{ backgroundColor: c.soft, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.red, alignItems: 'center', justifyContent: 'center' }}>
            <T s={15} w={800} c="#FFFFFF">112</T>
          </View>
          <T s={14} lh={1.4} style={{ flex: 1 }}><T s={14} w={700}>Acil tıbbi bir durumda önce 112’yi ara.</T> Kanbağ bir acil sağlık hizmeti değildir.</T>
        </View>
        <Grid cols={2}>
          {[['Kan bağışı', 'Kimler, nasıl, ne zaman'], ['İlanlar', 'Oluşturma, doğrulama, bildirme'], ['Gizlilik', 'Konum ve telefon'], ['Hesap', 'Profil ve geçmiş']].map(([t, sub]) => (
            <Tap key={t} onPress={() => openFaq(t)} style={{ minHeight: 88, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, padding: 14, justifyContent: 'space-between', gap: 6 }}>
              <T s={16} w={600}>{t}</T>
              <T s={12} c={c.ink3}>{sub}</T>
            </Tap>
          ))}
        </Grid>
        <T s={14} w={600} c={c.ink3} style={{ paddingHorizontal: 4 }}>Sık sorulanlar</T>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, overflow: 'hidden' }}>
          {[1, 4, 6].map((i, k) => (
            <Tap key={i} onPress={() => openFaq('Tümü', i)} scale={1} dim={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54, paddingHorizontal: 16, borderBottomWidth: k === 2 ? 0 : 1, borderBottomColor: c.line }}>
              <T s={15} style={{ flex: 1 }}>{FAQ[i][1]}</T>
              <T s={20} c={c.ink4}>›</T>
            </Tap>
          ))}
        </View>
        <Card r={18} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T s={16} w={600}>Bize ulaş</T>
            <T s={13} c={c.ink3}>destek@kanbag.app · hafta içi 09:00–18:00</T>
          </View>
          <SmallBtn label="Yaz" onPress={() => toast('E-posta uygulaması açılıyor.')} />
        </Card>
      </Body>
    </Screen>
  );
}
