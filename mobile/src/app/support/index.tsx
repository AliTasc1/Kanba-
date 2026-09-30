import React, { useState } from 'react';
import { View } from 'react-native';
import { nf } from '@shared';
import { nav, useApp } from '../../store';
import { isIOSChrome } from '../../theme';
import { Btn, Card, CheckLine, Drop, Grid, KVRows, Screen, Sheet, T, Tap } from '../../ui';

const AMOUNTS = [10, 100, 1000, 10000];

export default function Support() {
  const { st, set, c, pay: payNow } = useApp();
  const [pay, setPay] = useState(false);
  const custom = !AMOUNTS.includes(st.amt);
  const done = (m: string) => {
    setPay(false);
    set({ payM: m, payId: payNow(st.amt, m) });
    nav.reset('/profile');
    nav.go('/support/done');
  };
  return (
    <Screen
      title="Uygulamayı Destekle"
      bar={<Btn label={nf(st.amt) + ' TL Destek Ol'} onPress={() => setPay(true)} />}
      overlay={
        <Sheet open={pay} onClose={() => setPay(false)}>
          <View style={{ paddingTop: 8, paddingHorizontal: 24, paddingBottom: 34, gap: 16 }}>
            <T s={22} w={700}>Destek özeti</T>
            <KVRows bg={c.bg} r={18} py={12} vw={600} bordered={false} rows={[['Tutar', nf(st.amt) + ' TL'], ['Tür', 'Tek seferlik gönüllü destek'], ['Karşılığında', 'Hiçbir özellik açılmaz']]} />
            <Btn label={isIOSChrome ? 'Apple Pay ile Öde' : 'Google Pay ile Öde'} kind="dark" onPress={() => done(isIOSChrome ? 'Apple Pay' : 'Google Pay')} />
            <Btn label="Kart ile Öde" kind="secondary" h={52} s={16} onPress={() => done('Banka kartı')} />
            <T s={12} lh={1.45} c={c.ink3} center>Ödeme güvenli ödeme sağlayıcısı üzerinden alınır; kart bilgilerin Kanbağ’da saklanmaz.</T>
          </View>
        </Sheet>
      }
    >
      <View style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 150, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <Drop size={26} color={c.red} />
          </View>
          <T s={24} w={700} ls={-0.02} center>Uygulamayı Destekle</T>
          <T s={15} lh={1.5} c={c.ink3} center>Bu uygulamanın ücretsiz kalmasına ve daha iyi hale gelmesine katkıda bulunmak istersen destek olabilirsin.</T>
        </View>
        <Grid cols={2}>
          {AMOUNTS.map((v) => {
            const on = st.amt === v;
            return (
              <Tap key={v} onPress={() => set({ amt: v })} accessibilityState={{ selected: on }} style={{ height: 64, borderRadius: 16, borderWidth: 1.5, borderColor: on ? c.red : c.line, backgroundColor: on ? c.soft : c.card, alignItems: 'center', justifyContent: 'center' }}>
                <T s={19} w={700} c={on ? c.redtx : c.ink}>{nf(v)} TL</T>
              </Tap>
            );
          })}
        </Grid>
        <Tap onPress={() => nav.go('/support/amount')} style={{ height: 56, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: custom ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={16} w={600}>{custom ? 'Farklı tutar: ' + nf(st.amt) + ' TL' : 'Farklı Tutar'}</T>
        </Tap>
        <Card r={18} gap={10}>
          <CheckLine text="Hiçbir özelliği açmaz; tüm özellikler herkese ücretsizdir." />
          <CheckLine text="Premium, VIP, üyelik veya reklamsız sürüm yoktur." />
          <CheckLine text="Destekler sunucu, SMS doğrulama ve geliştirme giderlerine gider." />
        </Card>
        <T s={12} lh={1.5} c={c.ink3} center>Bu destek bir kan bağışı değildir. Kanbağ üzerinden kan satışı veya ücretli kan temini yapılamaz.</T>
      </View>
    </Screen>
  );
}
