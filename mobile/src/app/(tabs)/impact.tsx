import React from 'react';
import { View } from 'react-native';
import { MONTHLY_DONATIONS, PROVINCES, TOTALS, nf, provinceStats } from '@shared';
import { nav, useApp } from '../../store';
import { Body, Btn, Card, Grid, Screen, T } from '../../ui';
import { Donut, HBar, LineChart, TurkeyMap } from '../../ui/charts';

const DONUT = [
  { l: 'A+', p: 38, c: '#C4162A' },
  { l: '0+', p: 29, c: '#E26A76' },
  { l: 'B+', p: 14, c: '#F2B8BF' },
  { l: 'AB+', p: 7, c: '#8A8A93' },
  { l: 'Rh− (tümü)', p: 12, c: '#D4D4D8' },
];

export default function Impact() {
  const { st, c } = useApp();
  const dons = st.dons;
  const dCities = new Set(dons.map((x) => x.place.split(' / ')[1]));
  const stats = [
    { v: nf(Math.round(TOTALS.don * 1.03)), l: 'Toplam Ünite' },
    { v: nf(TOTALS.met), l: 'Karşılanan Acil İhtiyaç' },
    { v: nf(TOTALS.vol), l: 'Aktif Gönüllü' },
    { v: '81', l: 'Desteklenen İl' },
    { v: '874', l: 'Desteklenen İlçe' },
  ];
  const byDon = PROVINCES.map((p) => ({ n: p, ...provinceStats(p) })).sort((a, b) => b.donation - a.donation).slice(0, 5);

  return (
    <Screen tabbed>
      <Body pt={4} pb={32} gap={16}>
        <View>
          <T s={29} w={700} ls={-0.025} lh={1.1} accessibilityRole="header">Birlikte Ne Kadar Fayda Sağladık?</T>
          <T s={13} c={c.ink3} style={{ marginTop: 6 }}>Türkiye geneli · son 12 ay · demo veriler</T>
        </View>
        <View style={{ backgroundColor: c.hero, borderRadius: 24, padding: 20, gap: 4 }}>
          <T s={52} w={800} ls={-0.04} lh={1} c="#FFFFFF">{nf(TOTALS.don)}</T>
          <T s={12} w={700} ls={0.08} c="#C9C9CF">TOPLAM KAN BAĞIŞI</T>
          <T s={13} c="#D4D4D8" style={{ marginTop: 8 }}>{`Senin katkın: ${dons.length} bağış · ${dons.filter((x) => x.need).length} ihtiyaç · ${dCities.size} il`}</T>
        </View>
        <Grid cols={2}>
          {stats.map((x) => (
            <Card key={x.l} r={18} gap={4}>
              <T s={26} w={800} ls={-0.02}>{x.v}</T>
              <T s={11} w={700} ls={0.06} c={c.ink3} upper>{x.l}</T>
            </Card>
          ))}
        </Grid>
        <Card gap={10}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T s={16} w={600}>Türkiye haritası</T>
            <T s={12} c={c.ink3}>İhtiyaç yoğunluğu</T>
          </View>
          <TurkeyMap height={170} selected={st.mapSel} />
          <Btn label="Haritayı aç ›" kind="secondary" h={44} r={12} s={15} onPress={() => nav.go('/map')} />
        </Card>
        <Card gap={8}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T s={16} w={600}>Aylık bağış</T>
            <T s={13} w={600} c={c.gtx}>+%62 · 12 ay</T>
          </View>
          <T s={13} c={c.ink3}>Eylül 2026: {nf(MONTHLY_DONATIONS[11])} bağış</T>
          <LineChart values={MONTHLY_DONATIONS} />
        </Card>
        <Card gap={12}>
          <T s={16} w={600}>İhtiyaçların kan grubu dağılımı</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <Donut slices={DONUT} />
            <View style={{ gap: 7, flex: 1 }}>
              {DONUT.map((d) => (
                <View key={d.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.c }} />
                  <T s={13} style={{ flex: 1 }}>{d.l}</T>
                  <T s={13} w={600}>%{d.p}</T>
                </View>
              ))}
            </View>
          </View>
        </Card>
        <Card gap={12}>
          <T s={16} w={600}>En fazla bağış yapılan iller</T>
          {byDon.map((p) => <HBar key={p.n} label={p.n} value={nf(p.donation)} pct={Math.round((p.donation / byDon[0].donation) * 100)} />)}
        </Card>
      </Body>
    </Screen>
  );
}
