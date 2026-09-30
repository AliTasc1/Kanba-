import React, { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, View } from 'react-native';
import { BLOODS, DISTRICTS, PROVINCES, type Blood, type NeedStatus } from '@shared';
import { DEFAULT_FILTERS, useApp } from '../store';
import { Btn, Chip, Grid, LinkBtn, Seg, Sheet, Switch, T, Tap, useBottomPad } from '../ui';
import { useFilteredNeeds } from './useFilteredNeeds';

/** Bottom sheet with every needs-list filter (prototype sheet "filters"). */
export function FiltersSheet({ open, onClose, onApply }: { open: boolean; onClose: () => void; onApply: () => void }) {
  const { st, set, c } = useApp();
  const f = st.f;
  const pad = useBottomPad();
  const [picker, setPicker] = useState(false);
  const count = useFilteredNeeds().length;
  const setF = (p: Partial<typeof f>) => set((s) => ({ f: { ...s.f, ...p } }));
  const tog = <K extends 'bloods' | 'urg'>(k: K, v: K extends 'bloods' ? Blood : NeedStatus) =>
    set((s) => {
      const arr = s.f[k] as string[];
      return { f: { ...s.f, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] } };
    });
  const dists = DISTRICTS[f.city] || [];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      footer={
        <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: pad, borderTopWidth: 1, borderTopColor: c.line }}>
          <Btn label={count ? `${count} ilanı göster` : 'Sonuç yok · yine de uygula'} onPress={onApply} />
        </View>
      }
    >
      <View style={{ paddingTop: 2, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T s={21} w={700}>Filtreler</T>
        <LinkBtn label="Temizle" onPress={() => set({ f: DEFAULT_FILTERS, search: '' })} />
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 18, gap: 22 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>İl</T>
          <Tap onPress={() => setPicker(true)} accessibilityLabel="İl seç" scale={1} style={{ height: 52, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, paddingLeft: 14, paddingRight: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <T s={16}>{f.city}</T>
            <T s={11} c={c.ink3}>▼</T>
          </Tap>
          <T s={12} c={c.ink3}>81 il · listeyi açıp harfle arayabilirsin</T>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>İlçe</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Tümü', ...dists].map((d) => <Chip key={d} label={d} on={f.district === d} onPress={() => setF({ district: d })} />)}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Kan grubu</T>
          <Grid cols={4} gap={8}>
            {BLOODS.map((b) => (
              <Chip key={b} label={b} red on={f.bloods.includes(b)} onPress={() => tog('bloods', b)} h={44} r={12} s={16} w={700} />
            ))}
          </Grid>
          <Tap onPress={() => setF({ compat: !f.compat })} accessibilityRole="switch" accessibilityState={{ checked: f.compat }} scale={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
            <T s={15} style={{ flex: 1 }}>Yalnızca kan grubuma (0+) uygun olanlar</T>
            <Switch on={f.compat} />
          </Tap>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Mesafe</T>
          <Seg items={([[5, '5 km'], [10, '10 km'], [25, '25 km'], [50, '50 km'], [0, 'Tümü']] as const).map(([v, l]) => ({ label: l, on: f.dist === v, onPress: () => setF({ dist: v }) }))} />
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Aciliyet</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {([['acil', 'Acil'], ['oncelikli', 'Öncelikli'], ['aktif', 'Aktif']] as const).map(([k, l]) => (
              <Chip key={k} label={l} on={f.urg.includes(k)} onPress={() => tog('urg', k)} />
            ))}
          </View>
        </View>
        <Tap onPress={() => setF({ open: !f.open })} accessibilityRole="switch" accessibilityState={{ checked: f.open }} scale={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2 }}>
            <T s={15} w={600}>Hâlâ ihtiyaç var</T>
            <T s={13} c={c.ink3}>Karşılanan ilanları gizle</T>
          </View>
          <Switch on={f.open} />
        </Tap>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Sıralama</T>
          <Seg items={([['yeni', 'En yeni'], ['yakin', 'En yakın'], ['acil', 'En acil']] as const).map(([k, l]) => ({ label: l, on: f.sort === k, onPress: () => setF({ sort: k }) }))} />
        </View>
      </ScrollView>

      <Modal visible={picker} transparent animationType="fade" onRequestClose={() => setPicker(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15,15,16,0.45)', justifyContent: 'center', padding: 24 }}>
          <Pressable onPress={() => setPicker(false)} accessibilityLabel="Kapat" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ backgroundColor: c.card, borderRadius: 20, maxHeight: '75%', overflow: 'hidden' }}>
            <FlatList
              data={PROVINCES}
              keyExtractor={(p) => p}
              initialScrollIndex={Math.max(0, PROVINCES.indexOf(f.city) - 3)}
              getItemLayout={(_, i) => ({ length: 50, offset: 50 * i, index: i })}
              renderItem={({ item }) => (
                <Tap onPress={() => { setF({ city: item, district: 'Tümü' }); setPicker(false); }} scale={1} style={{ height: 50, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: c.line }}>
                  <T s={16} w={item === f.city ? 600 : 400}>{item}</T>
                  {item === f.city ? <T s={16} w={700} c={c.link}>✓</T> : null}
                </Tap>
              )}
            />
          </View>
        </View>
      </Modal>
    </Sheet>
  );
}
