import React from 'react';
import { View } from 'react-native';
import { nav, useApp } from '../store';
import { Btn, Card, ResultMark, Screen, T } from '../ui';

export default function Published() {
  const { c, myNeed: mn } = useApp();
  const pending = !!mn && mn.status === 'bekliyor';
  const ms = mn ? (mn.status === 'bekliyor' ? 1 : mn.status === 'karsilandi' ? 3 : 2) : 0;
  const steps = [
    ['İlan oluşturuldu', 'Az önce'],
    ['Doğrulama', 'Ekibimiz ilan bilgilerini kontrol ediyor.'],
    ['Yayında', `${mn ? mn.district : 'Başiskele'} çevresindeki uyumlu gönüllülere bildirim gönderilir.`],
    ['Karşılandı', 'Tüm üniteler tamamlandığında.'],
  ];
  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 36, paddingHorizontal: 24, paddingBottom: 40, gap: 22 }}>
        <View style={{ alignItems: 'center', gap: 14, paddingTop: 12 }}>
          <ResultMark outer={c.fill} inner={c.hero} size={28} />
          <T s={28} w={700} ls={-0.02} center accessibilityRole="header">{pending ? 'İlanın alındı' : 'İlanın yayında'}</T>
          <T s={15} lh={1.45} c={c.ink3} center>
            {pending
              ? 'Kısa bir doğrulamadan sonra yayına alınacak ve çevrendeki uyumlu gönüllülere bildirim gönderilecek.'
              : 'Uyumlu kan grubundaki gönüllülere bildirim gönderildi. Gelişmeleri ana sayfada takip edebilirsin.'}
          </T>
        </View>
        <Card>
          {steps.map(([t, sub], i) => {
            const done = i < ms, now = i === ms;
            return (
              <View key={t} style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: 22, alignItems: 'center' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: done ? c.red : c.card, borderWidth: 2, borderColor: done || now ? c.red : c.line2, alignItems: 'center', justifyContent: 'center' }}>
                    {done ? <T s={12} w={700} c="#FFFFFF">✓</T> : null}
                  </View>
                  <View style={{ width: 2, flex: 1, minHeight: 14, backgroundColor: i === 3 ? 'transparent' : done ? c.red : c.line }} />
                </View>
                <View style={{ paddingBottom: 14, gap: 2, flex: 1 }}>
                  <T s={15} w={600} c={done || now ? c.ink : c.ink4}>{t}</T>
                  <T s={13} lh={1.4} c={c.ink3}>{sub}</T>
                </View>
              </View>
            );
          })}
        </Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: c.fill, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16 }}>
          <T s={14} c={c.ink2}>İlan ID</T>
          <T s={15} w={600} mono>{mn?.id ?? 'KB-41-21008'}</T>
        </View>
        <View style={{ gap: 10, marginTop: 'auto' }}>
          <Btn label="İlanı Görüntüle" onPress={() => { if (mn) { nav.tab('home'); nav.go('/need/' + mn.id); } }} />
          <Btn label="Ana Sayfaya Dön" kind="secondary" onPress={() => nav.tab('home')} />
        </View>
      </View>
    </Screen>
  );
}
