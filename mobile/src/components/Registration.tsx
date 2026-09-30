import React from 'react';
import { View } from 'react-native';
import { lc } from '@shared';
import { useApp } from '../store';
import { Screen, SearchField, StepBars, T, Tap } from '../ui';

/** Progress header shared by the 4 registration steps. */
export function RegProgress({ idx }: { idx: number }) {
  const { c } = useApp();
  return (
    <View style={{ gap: 10 }}>
      <StepBars n={4} cur={idx} />
      <T s={13} w={600} c={c.ink3}>Adım {idx} / 4</T>
    </View>
  );
}

/** Searchable single-choice list (province / district pickers). */
export function PickList({ title, heading, sub, query, setQuery, placeholder, items, selected, onPick, emptyText }: {
  title: string; heading?: string; sub?: string; query: string; setQuery: (v: string) => void; placeholder: string;
  items: string[]; selected: string; onPick: (v: string) => void; emptyText?: string;
}) {
  const { c } = useApp();
  const list = items.filter((p) => lc(p).includes(lc(query.trim())));
  return (
    <Screen title={title}>
      <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: 32, gap: 14 }}>
        {heading ? (
          <View>
            <T s={26} w={700} ls={-0.02}>{heading}</T>
            {sub ? <T s={14} c={c.ink3} style={{ marginTop: 2 }}>{sub}</T> : null}
          </View>
        ) : null}
        <SearchField value={query} onChangeText={setQuery} placeholder={placeholder} s={16} />
        {list.length ? (
          <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, overflow: 'hidden' }}>
            {list.map((p, i) => (
              <Tap key={p} onPress={() => onPick(p)} scale={1} dim={0.7} style={{ minHeight: 50, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: i === list.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
                <T s={16} w={selected === p ? 600 : 400}>{p}</T>
                {selected === p ? <T s={16} w={700} c={c.link}>✓</T> : null}
              </Tap>
            ))}
          </View>
        ) : emptyText ? (
          <T s={14} c={c.ink3} center style={{ padding: 20 }}>{emptyText}</T>
        ) : null}
      </View>
    </Screen>
  );
}
