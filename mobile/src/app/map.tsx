import React, { useState } from 'react';
import { View } from 'react-native';
import { PROVINCES, nf, provinceStats } from '@shared';
import { nav, useApp } from '../store';
import { Card, FadeUp, Grid, Screen, Seg, T, Tap } from '../ui';
import { TurkeyMap } from '../ui/charts';

export default function MapScreen() {
  const { st, set, c } = useApp();
  const [metric, setMetric] = useState<'need' | 'donation'>('need');
  const sel = st.mapSel;
  const s = provinceStats(sel);
  const key = metric === 'donation' ? 'donation' : 'active';
  const top = PROVINCES.map((p) => ({ n: p, v: provinceStats(p)[key] })).sort((a, b) => b.v - a.v).slice(0, 5);
  const dot = (d: number, o: number) => <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: c.red, opacity: o }} />;

  return (
    <Screen title="Türkiye Haritası">
      <View style={{ paddingTop: 14, paddingHorizontal: 20, paddingBottom: 32, gap: 14 }}>
        <Seg items={([['need', 'İhtiyaç yoğunluğu'], ['donation', 'Bağış yoğunluğu']] as const).map(([k, l]) => ({ label: l, on: metric === k, onPress: () => setMetric(k) }))} />
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 8, gap: 6 }}>
          <TurkeyMap height={200} metric={metric} selected={sel} onSelect={(n) => set({ mapSel: n })} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
            <T s={12} c={c.ink3}>81 il · bir ile dokun</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T s={12} c={c.ink3}>Az</T>{dot(6, 0.35)}{dot(10, 0.65)}{dot(14, 1)}<T s={12} c={c.ink3}>Çok</T>
            </View>
          </View>
        </View>
        <FadeUp key={sel} dy={0}>
          <Card gap={14}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <T s={24} w={700} ls={-0.02}>{sel}</T>
              <Tap onPress={() => nav.go('/city')} style={{ height: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.red, justifyContent: 'center' }}>
                <T s={14} w={600} c="#FFFFFF">İl detayı ›</T>
              </Tap>
            </View>
            <Grid cols={2} gap={16} rowGap={12}>
              {[[s.active, 'Aktif ihtiyaç'], [s.met, 'Karşılanan ihtiyaç'], [s.donation, 'Toplam bağış'], [s.vol, 'Gönüllü']].map(([v, l]) => (
                <View key={l as string}>
                  <T s={22} w={800}>{nf(v as number)}</T>
                  <T s={13} c={c.ink3}>{l as string}</T>
                </View>
              ))}
            </Grid>
          </Card>
        </FadeUp>
        <T s={14} w={600} c={c.ink3} style={{ paddingHorizontal: 4 }}>En yoğun 5 il</T>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, overflow: 'hidden' }}>
          {top.map((p, i) => (
            <Tap key={p.n} onPress={() => set({ mapSel: p.n })} scale={1} dim={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingHorizontal: 16, borderBottomWidth: i === 4 ? 0 : 1, borderBottomColor: c.line, backgroundColor: p.n === sel ? c.soft : 'transparent' }}>
              <T s={13} w={700} c={c.ink4} style={{ width: 22 }}>{i + 1}</T>
              <T s={15} w={500} style={{ flex: 1 }}>{p.n}</T>
              <T s={13} c={c.ink3}>{nf(p.v) + (key === 'active' ? ' aktif ihtiyaç' : ' bağış')}</T>
            </Tap>
          ))}
        </View>
      </View>
    </Screen>
  );
}
