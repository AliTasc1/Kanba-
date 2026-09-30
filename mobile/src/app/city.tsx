import React from 'react';
import { View } from 'react-native';
import { cityDistrictDonations, cityMonthly, nf, provinceStats } from '@shared';
import { DEFAULT_FILTERS, nav, useApp } from '../store';
import { Btn, Card, Grid, Screen, T } from '../ui';
import { HBar, LineChart } from '../ui/charts';

export default function City() {
  const { st, set, c } = useApp();
  const cn = st.mapSel;
  const cs = provinceStats(cn);
  const dist = cityDistrictDonations(cn);
  const max = dist.length ? dist[0][1] : 1;
  return (
    <Screen title="İl Detayı">
      <View style={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}>
        <View>
          <T s={12} w={700} ls={0.08} c={c.ink3}>İL İSTATİSTİĞİ</T>
          <T s={36} w={800} ls={-0.03} accessibilityRole="header">{cn}</T>
        </View>
        <Grid cols={2}>
          {[[cs.donation, 'Toplam bağış'], [cs.met, 'Karşılanan ihtiyaç'], [cs.active, 'Aktif ihtiyaç'], [cs.vol, 'Gönüllü']].map(([v, l]) => (
            <Card key={l as string} r={18}>
              <T s={28} w={800} ls={-0.02}>{nf(v as number)}</T>
              <T s={13} w={500} c={c.ink3}>{l as string}</T>
            </Card>
          ))}
        </Grid>
        <Card gap={12}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T s={16} w={600}>İlçe dağılımı</T>
            <T s={12} c={c.ink3}>toplam bağış</T>
          </View>
          {dist.length ? (
            <View style={{ gap: 9 }}>
              {dist.map(([d, v]) => <HBar key={d} label={d} value={nf(v)} pct={Math.round((v / max) * 100)} labelW={92} />)}
            </View>
          ) : (
            <T s={14} c={c.ink3}>Bu il için ilçe kırılımı bu demoda gösterilmiyor.</T>
          )}
        </Card>
        <Card gap={8}>
          <T s={16} w={600}>Aylık bağış trendi</T>
          <LineChart values={cityMonthly(cn)} h={110} grid={false} r={4.5} />
        </Card>
        <Btn label={`${cn} ihtiyaçlarını gör`} onPress={() => { set({ f: { ...DEFAULT_FILTERS, city: cn }, search: '' }); nav.tab('needs'); }} />
      </View>
    </Screen>
  );
}
