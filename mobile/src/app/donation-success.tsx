import React from 'react';
import { View } from 'react-native';
import { nav, useApp } from '../store';
import { Btn, KVRows, ResultMark, Screen, SmallBtn, T } from '../ui';

export default function DonationSuccess() {
  const { st, c, toast } = useApp();
  const ld = st.lastDon;
  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 36, paddingHorizontal: 24, paddingBottom: 40, gap: 22 }}>
        <View style={{ alignItems: 'center', gap: 14, paddingTop: 16 }}>
          <ResultMark outer={c.soft} inner={c.red} />
          <T s={28} w={700} ls={-0.02} center accessibilityRole="header">Dayanışmanın bir parçası oldun.</T>
          <T s={15} lh={1.45} c={c.ink3} center>Bağışın kaydedildi. İlan sahibi onayladığında “Doğrulanmış” olarak görünecek.</T>
        </View>
        <KVRows rows={[['Bağış tarihi', ld?.date || '—'], ['Bağış miktarı', (ld?.units || 1) + ' ünite'], ['İhtiyaç', ld?.need ? ld.need + ' kan ihtiyacı' : '—'], ['Hastane', ld?.hospital || '—'], ['Durum', 'Beyan edildi · onay bekliyor']]} />
        <View style={{ backgroundColor: c.fill, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <T s={13} c={c.ink3}>Önerilen bir sonraki bağış</T>
            <T s={16} w={600}>29 Aralık 2026 ve sonrası</T>
          </View>
          <SmallBtn label="Hatırlat" bd={c.line2} onPress={() => toast('29 Aralık 2026 için hatırlatıcı kuruldu.')} />
        </View>
        <View style={{ gap: 10, marginTop: 'auto' }}>
          <Btn label="Bağışlarıma Git" onPress={() => nav.tab('donations')} />
          <Btn label="Ana Sayfaya Dön" kind="secondary" onPress={() => nav.tab('home')} />
        </View>
      </View>
    </Screen>
  );
}
