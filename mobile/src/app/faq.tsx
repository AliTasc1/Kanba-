import React from 'react';
import { ScrollView, View } from 'react-native';
import { FAQ, lc } from '@shared';
import { useApp } from '../store';
import { Body, Chip, FadeUp, Screen, SearchField, T, Tap } from '../ui';

const TOPICS = ['Tümü', 'Kan bağışı', 'İlanlar', 'Gizlilik', 'Hesap'];

export default function Faq() {
  const { st, set, c } = useApp();
  const fq = st.faq;
  const upd = (p: Partial<typeof fq>) => set((s) => ({ faq: { ...s.faq, ...p } }));
  const q = lc(fq.q.trim());
  const list = FAQ.map(([topic, question, a], i) => ({ i, topic, question, a })).filter((f) => (fq.topic === 'Tümü' || f.topic === fq.topic) && (!q || lc(f.question + ' ' + f.a).includes(q)));
  return (
    <Screen title="Sık Sorulan Sorular">
      <Body pt={14} pb={40} gap={12}>
        <SearchField value={fq.q} onChangeText={(v) => upd({ q: v })} placeholder="Soru ara" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {TOPICS.map((t) => <Chip key={t} label={t} on={fq.topic === t} h={36} onPress={() => upd({ topic: t, open: -1 })} />)}
        </ScrollView>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, overflow: 'hidden' }}>
          {list.map((f, k) => {
            const open = fq.open === f.i;
            return (
              <View key={f.i} style={{ borderBottomWidth: k === list.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
                <Tap onPress={() => upd({ open: open ? -1 : f.i })} accessibilityState={{ expanded: open }} scale={1} dim={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 12, paddingHorizontal: 16 }}>
                  <T s={15} w={600} lh={1.35} style={{ flex: 1 }}>{f.question}</T>
                  <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
                    <T s={17}>{open ? '−' : '+'}</T>
                  </View>
                </Tap>
                {open ? (
                  <FadeUp dy={0}>
                    <T s={14} lh={1.55} c={c.ink2} style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{f.a}</T>
                  </FadeUp>
                ) : null}
              </View>
            );
          })}
        </View>
        {!list.length ? (
          <T s={14} c={c.ink3} center style={{ padding: 24 }}>
            Aramana uygun soru bulunamadı. <T s={14} w={700} c={c.ink3}>destek@kanbag.app</T> adresinden bize yazabilirsin.
          </T>
        ) : null}
      </Body>
    </Screen>
  );
}
