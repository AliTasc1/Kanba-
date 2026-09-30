import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { DEFAULT_FILTERS, nav, useApp } from '../../store';
import { isIOSChrome } from '../../theme';
import { Body, Chip, Icon, PATHS, Screen, SearchField, T, Tap } from '../../ui';
import { NeedCard, NeedSkeleton } from '../../ui/need';
import { FiltersSheet } from '../../components/FiltersSheet';
import { activeFilterCount, useFilteredNeeds } from '../../components/useFilteredNeeds';

export default function Needs() {
  const { st, set, c } = useApp();
  const f = st.f;
  const list = useFilteredNeeds();
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  // Every visit to the tab shows the skeleton briefly, as data would be refetched.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 650);
      return () => clearTimeout(t);
    }, []),
  );

  const setF = (p: Partial<typeof f>) => set((s) => ({ f: { ...s.f, ...p } }));
  const fc = activeFilterCount(f);
  const startCreate = () => { set({ step: 1 }); nav.go('/create'); };
  const q = st.search.trim();

  return (
    <Screen
      tabbed
      overlay={
        <>
          {!isIOSChrome && !loading ? (
            <Tap
              onPress={startCreate}
              style={{ position: 'absolute', right: 16, bottom: 16, height: 56, paddingLeft: 16, paddingRight: 20, borderRadius: 16, backgroundColor: c.red, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#C4162A', shadowOpacity: 0.32, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}
            >
              <T s={24} c="#FFFFFF" style={{ lineHeight: 26 }}>+</T>
              <T s={15} w={600} c="#FFFFFF">İhtiyaç Oluştur</T>
            </Tap>
          ) : null}
          <FiltersSheet open={sheet} onClose={() => setSheet(false)} onApply={() => setSheet(false)} />
        </>
      }
    >
      <Body pt={4} pb={120} gap={14}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <View>
            <T s={32} w={700} ls={-0.025} accessibilityRole="header">Kan İhtiyaçları</T>
            <T s={14} c={c.ink3} style={{ marginTop: 2 }}>{`${f.city}${f.district !== 'Tümü' ? ' · ' + f.district : ''} · ${list.length} ilan`}</T>
          </View>
          {isIOSChrome ? (
            <Tap onPress={startCreate} accessibilityLabel="Kan ihtiyacı oluştur" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.red, alignItems: 'center', justifyContent: 'center' }}>
              <T s={26} c="#FFFFFF" style={{ lineHeight: 28 }}>+</T>
            </Tap>
          ) : null}
        </View>
        <SearchField value={st.search} onChangeText={(v) => set({ search: v })} onClear={() => set({ search: '' })} placeholder="Hastane, ilçe veya kan grubu ara" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          <Chip label={fc ? `Filtreler · ${fc}` : 'Filtreler'} on={fc > 0} onPress={() => setSheet(true)} />
          <Chip label="Bana uygun" red on={f.compat} onPress={() => setF({ compat: !f.compat })} />
          <Chip label="Hâlâ ihtiyaç var" on={f.open} onPress={() => setF({ open: !f.open })} />
          <Chip label="Acil" red on={f.urg.includes('acil')} onPress={() => setF({ urg: f.urg.includes('acil') ? f.urg.filter((x) => x !== 'acil') : [...f.urg, 'acil'] })} />
          <Chip label="En yakın" on={f.sort === 'yakin'} onPress={() => setF({ sort: f.sort === 'yakin' ? 'yeni' : 'yakin' })} />
        </ScrollView>

        {loading ? (
          <View accessibilityLabel="İlanlar yükleniyor" style={{ gap: 12 }}>
            <NeedSkeleton /><NeedSkeleton /><NeedSkeleton />
          </View>
        ) : list.length ? (
          <View style={{ gap: 12 }}>{list.map((n) => <NeedCard key={n.id} n={n} />)}</View>
        ) : (
          <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 24, paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center', gap: 10, marginTop: 8 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <Icon d={PATHS.needs} size={28} color="#8A8A93" />
            </View>
            <T s={18} w={600} center>{q ? `“${q}” için sonuç bulunamadı.` : 'Şu anda bulunduğun bölgede aktif bir kan ihtiyacı bulunmuyor.'}</T>
            <T s={14} c={c.ink3} center>Yeni bir ihtiyaç olduğunda seni bilgilendireceğiz.</T>
            <Tap onPress={() => set({ f: DEFAULT_FILTERS, search: '' })} style={{ marginTop: 8, height: 44, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, justifyContent: 'center' }}>
              <T s={15} w={600}>Filtreleri temizle</T>
            </Tap>
          </View>
        )}
      </Body>
    </Screen>
  );
}

