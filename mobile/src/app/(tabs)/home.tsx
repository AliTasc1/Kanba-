import React, { useState } from 'react';
import { View } from 'react-native';
import { STATUS_RANK, canDonateTo } from '@shared';
import { nav, useApp } from '../../store';
import { Body, Icon, LinkBtn, PATHS, Pill, Screen, T, Tap } from '../../ui';
import { NeedCard, statusStyle } from '../../ui/need';
import { FiltersSheet } from '../../components/FiltersSheet';

export default function Home() {
  const { st, set, c, allNeeds } = useApp();
  const near = allNeeds.filter((n) => n.city === 'Kocaeli' && !n.mine && n.dist <= 25 && n.status !== 'karsilandi');
  const acil = near.filter((n) => n.status === 'acil').length;
  const compat = near.filter((n) => canDonateTo(n.blood)).length;
  const homeNeeds = near.slice().sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.dist - b.dist).slice(0, 3);
  const openK = allNeeds.filter((n) => n.city === 'Kocaeli' && n.status !== 'karsilandi').length;
  const quick = [
    { l: 'Yakınımdaki İhtiyaçlar', sub: openK + ' açık ilan', d: PATHS.pin, go: () => nav.tab('needs') },
    { l: 'Bağışlarım', sub: st.dons.length + ' bağış', d: PATHS.donations, go: () => nav.tab('donations') },
    { l: 'Etki Alanımız', sub: '81 il', d: PATHS.impact, go: () => nav.tab('impact') },
  ];
  const [filters, setFilters] = useState(false);
  const mn = st.myNeed;
  const ms = mn ? (mn.status === 'bekliyor' ? 1 : mn.status === 'karsilandi' ? 3 : 2) : 0;

  return (
    <Screen tabbed overlay={<FiltersSheet open={filters} onClose={() => setFilters(false)} onApply={() => { setFilters(false); nav.tab('needs'); }} />}>
      <Body pt={4} pb={28} gap={20}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tap
            onPress={() => setFilters(true)}
            accessibilityLabel="Bölge: Başiskele, Kocaeli. Değiştir"
            style={{ height: 40, paddingLeft: 12, paddingRight: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#FCE3E6', alignItems: 'center', justifyContent: 'center', marginHorizontal: -3 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.red }} />
            </View>
            <T s={14} w={500}>Başiskele, Kocaeli</T>
            <T s={11} c={c.ink4}>▼</T>
          </Tap>
          <Tap
            onPress={() => nav.go('/notifications')}
            accessibilityLabel="Bildirimler, 2 yeni"
            style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon d={PATHS.bell} size={20} color={c.ink} />
            <View style={{ position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: c.red, borderWidth: 2, borderColor: c.card }} />
          </Tap>
        </View>

        <View style={{ gap: 6 }}>
          <T s={30} w={700} ls={-0.025} accessibilityRole="header">Merhaba Ali</T>
          <T s={16} c={c.ink3}>Bugün yakınında birinin sana ihtiyacı olabilir.</T>
        </View>

        <View style={{ backgroundColor: c.hero, borderRadius: 24, padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ gap: 4, flex: 1 }}>
              <T s={13} w={500} c="#C9C9CF">Şu an 25 km içinde</T>
              <T s={26} w={700} ls={-0.02} c="#FFFFFF">{acil} acil ihtiyaç</T>
              <T s={14} c="#D4D4D8">{`Toplam ${near.length} ihtiyaç · ${compat} tanesi kan grubunla uyumlu`}</T>
            </View>
            <View style={{ backgroundColor: '#2A2A2E', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' }}>
              <T s={18} w={800} c="#FFFFFF">0+</T>
              <T s={11} c="#B4B4BB">Kan grubun</T>
            </View>
          </View>
          <Tap
            onPress={() => { set((s) => ({ f: { ...s.f, compat: true, open: true } })); nav.tab('needs'); }}
            style={{ height: 48, borderRadius: 14, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}
          >
            <T s={15} w={600}>Sana uygun ihtiyaçları gör</T>
          </Tap>
        </View>

        <Tap
          onPress={() => { set({ step: 1 }); nav.go('/create'); }}
          style={{ backgroundColor: c.red, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <T s={28} c="#FFFFFF" style={{ lineHeight: 30 }}>+</T>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <T s={17} w={700} c="#FFFFFF">Acil Kan İhtiyacı Oluştur</T>
            <T s={13} c="#FFE4E7">Adım adım, yaklaşık 2 dakika</T>
          </View>
          <T s={24} c="#FFFFFF">›</T>
        </Tap>

        {mn ? (
          <Tap onPress={() => nav.go('/need/' + mn.id)} scale={0.99} dim={1} style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <T s={13} w={600} c={c.ink3}>İLANIN</T>
              <Pill {...pillFor(mn.status, c)} />
            </View>
            <T s={16} w={600}>{`${mn.blood} Kan İhtiyacı · ${mn.hospital}`}</T>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {['Oluşturuldu', 'Doğrulama', 'Yayında', 'Karşılandı'].map((l, i) => (
                <View key={l} style={{ flex: 1, gap: 6 }}>
                  <View style={{ height: 4, borderRadius: 2, backgroundColor: i < ms ? c.red : i === ms ? c.soft2 : c.fill }} />
                  <T s={11} w={600} c={i <= ms ? c.ink : c.ink4}>{l}</T>
                </View>
              ))}
            </View>
            <T s={13} c={c.ink3}>
              {mn.status === 'bekliyor'
                ? 'Doğrulandığında çevrendeki uyumlu gönüllülere bildirim gönderilecek.'
                : `Yayında · ${mn.going} gönüllü bağışa gidiyor, ${mn.units - mn.met} ünite kaldı.`}
            </T>
          </Tap>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {quick.map((q) => (
            <Tap key={q.l} onPress={q.go} style={{ flex: 1, minHeight: 108, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 12, gap: 10 }}>
              <Icon d={q.d} size={22} color="#C4162A" />
              <T s={13} w={600} lh={1.25}>{q.l}</T>
              <T s={12} c={c.ink3} style={{ marginTop: 'auto' }}>{q.sub}</T>
            </Tap>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <T s={20} w={700} ls={-0.01}>Yakınımdaki İhtiyaçlar</T>
          <LinkBtn label="Tümü ›" onPress={() => nav.tab('needs')} />
        </View>
        <View style={{ gap: 12, marginTop: -10 }}>
          {homeNeeds.map((n) => <NeedCard key={n.id} n={n} />)}
        </View>
      </Body>
    </Screen>
  );
}

const pillFor = (status: Parameters<typeof statusStyle>[0], c: Parameters<typeof statusStyle>[1]) => {
  const s = statusStyle(status, c);
  return { label: s.l, bg: s.bg, fg: s.fg, bd: s.bd };
};
