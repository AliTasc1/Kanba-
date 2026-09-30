import React from 'react';
import { View } from 'react-native';
import { useApp } from '../../store';
import { Body, Card, Grid, Pill, Screen, T } from '../../ui';

export default function Donations() {
  const { st, c } = useApp();
  const dons = st.dons;
  const cities = new Set(dons.map((x) => x.place.split(' / ')[1]));
  const stats = [
    { v: dons.length, l: 'Toplam Bağış' },
    { v: dons.reduce((a, x) => a + x.units, 0), l: 'Toplam Ünite' },
    { v: dons.filter((x) => x.need).length, l: 'Destek Olunan İhtiyaç' },
    { v: cities.size, l: 'Destek Olunan İl' },
  ];
  const elig = st.lastDon
    ? { k: 'Bir sonraki bağış', v: '29 Aralık 2026 ve sonrası', bg: c.fill, fg: c.ink }
    : { k: 'Son bağışından 104 gün geçti', v: '✓ Bugün bağış yapabilirsin', bg: c.gsoft, fg: c.gtx };
  const SD = {
    v: { l: '✓ DOĞRULANMIŞ', bg: c.gsoft, fg: c.gtx, bd: c.gsoft, dot: '#177A4E' },
    b: { l: 'BEYAN', bg: c.card, fg: c.ink2, bd: c.line2, dot: '#A1A1AA' },
    p: { l: 'BEYAN · ONAY BEKLİYOR', bg: c.card, fg: c.ink2, bd: c.line2, dot: c.red },
  };

  return (
    <Screen tabbed>
      <Body pt={4} pb={32} gap={18}>
        <T s={32} w={700} ls={-0.025} accessibilityRole="header">Bağışlarım</T>
        <Grid cols={2}>
          {stats.map((x) => (
            <Card key={x.l} r={18} gap={4}>
              <T s={30} w={700} ls={-0.02}>{x.v}</T>
              <T s={13} w={500} c={c.ink3}>{x.l}</T>
            </Card>
          ))}
        </Grid>
        <View style={{ borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: elig.bg, gap: 2 }}>
          <T s={13} w={500} c={elig.fg}>{elig.k}</T>
          <T s={16} w={600} c={elig.fg}>{elig.v}</T>
        </View>
        <T s={20} w={700} style={{ marginTop: 4 }}>Geçmiş</T>
        <View>
          {dons.map((x, i) => {
            const q = SD[x.st];
            return (
              <View key={x.date + i} style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: 14, alignItems: 'center', paddingTop: 18 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: q.dot }} />
                  <View style={{ width: 2, flex: 1, backgroundColor: i === dons.length - 1 ? 'transparent' : c.line }} />
                </View>
                <Card r={18} style={{ flex: 1, minWidth: 0, paddingVertical: 14, marginBottom: 12, gap: 5 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <T s={13} w={500} c={c.ink3}>{x.date}</T>
                    <Pill label={q.l} bg={q.bg} fg={q.fg} bd={q.bd} ls={0.05} />
                  </View>
                  <T s={16} w={600}>{`${x.units} Ünite · ${x.need ? x.need + ' ihtiyacı için' : 'Genel bağış'}`}</T>
                  <T s={14} c={c.ink2}>{x.hospital}</T>
                  <T s={13} c={c.ink4}>{x.place}</T>
                </Card>
              </View>
            );
          })}
        </View>
      </Body>
    </Screen>
  );
}
