import React from 'react';
import { View } from 'react-native';
import { nf } from '@shared';
import { nav, useApp } from '../../store';
import { Btn, KVRows, ResultMark, Screen, T } from '../../ui';

export default function SupportDone() {
  const { st, c, toast } = useApp();
  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 44, paddingHorizontal: 24, paddingBottom: 40, gap: 22 }}>
        <View style={{ alignItems: 'center', gap: 14 }}>
          <ResultMark outer={c.gsoft} inner="#177A4E" />
          <T s={28} w={700} ls={-0.02} center accessibilityRole="header">Desteğin için teşekkürler</T>
          <T s={15} lh={1.45} c={c.ink3} center>Kanbağ’ın herkes için ücretsiz kalmasına katkıda bulundun. Bu destek herhangi bir ayrıcalık sağlamaz.</T>
        </View>
        <KVRows kFlexNone={false} rows={[['Tutar', nf(st.amt) + ' TL'], ['Tarih', '30 Eylül 2026, 14:08'], ['İşlem no', 'KBD-260930-4821', true], ['Ödeme yöntemi', st.payM || 'Apple Pay']]} />
        <View style={{ gap: 10, marginTop: 'auto' }}>
          <Btn label="Profile Dön" onPress={() => nav.tab('profile')} />
          <Btn label="Makbuzu İndir" kind="secondary" onPress={() => toast('Makbuz indirildi.')} />
        </View>
      </View>
    </Screen>
  );
}
