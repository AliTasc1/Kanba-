import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { BLOODS, ONBOARDING, TOTALS, nf } from '@shared';
import { useApp } from '../store';
import { Btn, Drop, FadeUp, Grid, LinkBtn, Pill, Screen, T } from '../ui';

export default function Onboarding() {
  const { c } = useApp();
  const [i, setI] = useState(0);
  const toLogin = () => router.replace('/login');
  const chip = (l: string) => <Pill key={l} label={l} bg={c.fill} fg={c.ink2} s={13} w={600} ls={0} px={12} py={6} />;

  const art = [
    <View key={0} style={{ gap: 18, width: '100%' }}>
      <Grid cols={4}>
        {BLOODS.map((b, k) => {
          const on = [0, 3, 6].includes(k);
          return (
            <View key={b} style={{ height: 64, borderRadius: 16, backgroundColor: on ? c.red : c.soft, alignItems: 'center', justifyContent: 'center' }}>
              <T s={19} w={800} c={on ? '#FFFFFF' : c.redtx}>{b}</T>
            </View>
          );
        })}
      </Grid>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {[chip('81 il'), chip(nf(TOTALS.vol) + ' gönüllü'), chip('tamamen ücretsiz')]}
      </View>
    </View>,
    <View key={1} style={{ width: '100%', gap: 10 }}>
      <View style={{ backgroundColor: c.bg, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 3 }}>
        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: c.red, alignItems: 'center', justifyContent: 'center' }}><Drop size={14} color="#FFFFFF" /></View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T s={12} w={700} c={c.ink2}>KANBAĞ</T>
            <T s={12} c={c.ink4}>şimdi</T>
          </View>
          <T s={15} w={600}>● Acil Kan İhtiyacı</T>
          <T s={13} c={c.ink3}>Yakınında A+ kan grubuna ihtiyaç var · Başiskele · 2,4 km</T>
        </View>
      </View>
      <View style={{ backgroundColor: c.bg, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, opacity: 0.6, transform: [{ scale: 0.95 }] }}>
        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: c.fill }} />
        <View style={{ flex: 1, gap: 2 }}>
          <T s={14} w={600}>İlan güncellendi</T>
          <T s={13} c={c.ink3}>0 Rh+ ihtiyacında 2 / 4 ünite karşılandı.</T>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <Pill label="Konumla" fg={c.ink} bd={c.line2} s={13} w={600} ls={0} px={12} py={6} />
        <T s={13} c={c.ink4}>veya</T>
        <Pill label="İl / ilçe seçerek" fg={c.ink} bd={c.line2} s={13} w={600} ls={0} px={12} py={6} />
      </View>
    </View>,
    <View key={2} style={{ width: '100%' }}>
      {[
        ['30 Eylül 2026', '1 Ünite · 0+ ihtiyacı', 'Kocaeli Üniversitesi Hastanesi', c.red, false],
        ['18 Haziran 2026', '1 Ünite · A+ ihtiyacı', 'Kocaeli Şehir Hastanesi', '#177A4E', true],
        ['04 Mart 2026', '1 Ünite · 0+ ihtiyacı', 'Gebze Fatih Devlet Hastanesi', '#177A4E', true],
      ].map(([d, h, p, dot, v], k) => (
        <View key={k} style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ width: 12, alignItems: 'center', paddingTop: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dot as string }} />
            {k < 2 ? <View style={{ width: 2, flex: 1, backgroundColor: c.line }} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: k < 2 ? 16 : 0 }}>
            <T s={12} c={c.ink4}>{d as string}</T>
            <T s={15} w={600}>{h as string}</T>
            <T s={13} c={c.ink3}>{p as string}</T>
          </View>
          {v ? <Pill label="✓ DOĞRULANMIŞ" bg={c.gsoft} fg={c.gtx} s={10} ls={0} px={7} /> : <Pill label="BEYAN" fg={c.ink} bd={c.line2} s={10} ls={0} px={7} />}
        </View>
      ))}
    </View>,
    <View key={3} style={{ width: '100%', gap: 10 }}>
      <View style={{ backgroundColor: c.hero, borderRadius: 18, padding: 18 }}>
        <T s={40} w={800} ls={-0.03} c="#FFFFFF">{nf(TOTALS.don)}</T>
        <T s={12} w={700} ls={0.06} c="#C9C9CF">TOPLAM BAĞIŞ</T>
      </View>
      <Grid cols={2}>
        <View style={{ backgroundColor: c.soft, borderRadius: 18, padding: 16 }}>
          <T s={26} w={800} c={c.redtx}>{nf(TOTALS.met)}</T>
          <T s={11} w={700} ls={0.06} c={c.redtx}>KARŞILANAN İHTİYAÇ</T>
        </View>
        <View style={{ backgroundColor: c.fill, borderRadius: 18, padding: 16 }}>
          <T s={26} w={800}>81</T>
          <T s={11} w={700} ls={0.06} c={c.ink3}>İL</T>
        </View>
      </Grid>
    </View>,
  ];

  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 4, paddingHorizontal: 24, paddingBottom: 44, gap: 26 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 1, 2, 3].map((k) => <View key={k} style={{ height: 6, width: k === i ? 22 : 6, borderRadius: 3, backgroundColor: k === i ? c.red : c.line2 }} />)}
          </View>
          <LinkBtn label="Atla" color={c.ink3} onPress={toLogin} />
        </View>
        <View style={{ height: 340, borderRadius: 28, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
          <FadeUp key={i} dy={0} style={{ width: '100%' }}>{art[i]}</FadeUp>
        </View>
        <View style={{ gap: 10 }}>
          <T s={28} w={700} ls={-0.025} accessibilityRole="header">{ONBOARDING[i].t}</T>
          <T s={16} lh={1.5} c={c.ink3}>{ONBOARDING[i].s}</T>
        </View>
        <Btn label={i === 3 ? 'Başlayalım' : 'Devam'} style={{ marginTop: 'auto' }} onPress={() => (i < 3 ? setI(i + 1) : toLogin())} />
      </View>
    </Screen>
  );
}
