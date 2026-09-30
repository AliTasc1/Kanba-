import React from 'react';
import { View } from 'react-native';
import { useColors } from '../store';
import { Seg, Switch, T, Tap, type SegItem } from '../ui';

/** Settings-style grouped rows used by Profile and every settings page (prototype `rw`/`tg`/`sg`). */
export type SetItem =
  | { kind: 'row'; l: string; v?: string; on?: () => void; danger?: boolean }
  | { kind: 'toggle'; l: string; sub?: string; value: boolean; on: () => void }
  | { kind: 'seg'; l: string; segs: SegItem[] };
export interface SetGroup { t?: string; note?: string; items: SetItem[] }

export const row = (l: string, v?: string, on?: () => void, danger?: boolean): SetItem => ({ kind: 'row', l, v, on, danger });
export const toggle = (l: string, sub: string, value: boolean, on: () => void): SetItem => ({ kind: 'toggle', l, sub, value, on });
export const seg = <K extends string | number>(l: string, opts: [K, string][], cur: K, fn: (k: K) => void): SetItem => ({
  kind: 'seg', l, segs: opts.map(([k, lab]) => ({ label: lab, on: cur === k, onPress: () => fn(k) })),
});

export function SettingsGroups({ groups }: { groups: SetGroup[] }) {
  const c = useColors();
  return (
    <>
      {groups.map((g, gi) => (
        <View key={gi} style={{ gap: 8 }}>
          {g.t ? <T s={13} w={600} c={c.ink3} style={{ paddingHorizontal: 4 }}>{g.t}</T> : null}
          <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, overflow: 'hidden' }}>
            {g.items.map((it, i) => {
              const bd = { borderBottomWidth: i === g.items.length - 1 ? 0 : 1, borderBottomColor: c.line };
              if (it.kind === 'toggle')
                return (
                  <Tap key={it.l} onPress={it.on} accessibilityRole="switch" accessibilityState={{ checked: it.value }} scale={1} dim={0.7} style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingVertical: 10, paddingHorizontal: 16 }, bd]}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T s={15} w={500}>{it.l}</T>
                      {it.sub ? <T s={13} lh={1.4} c={c.ink3}>{it.sub}</T> : null}
                    </View>
                    <Switch on={it.value} />
                  </Tap>
                );
              if (it.kind === 'seg')
                return (
                  <View key={it.l} style={[{ paddingVertical: 14, paddingHorizontal: 16, gap: 10 }, bd]}>
                    <T s={15} w={500}>{it.l}</T>
                    <Seg items={it.segs} />
                  </View>
                );
              return (
                <Tap key={it.l} onPress={it.on} disabled={!it.on} scale={1} dim={0.7} style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 16 }, bd]}>
                  <T s={15} w={500} c={it.danger ? c.link : c.ink} style={{ flex: 1 }}>{it.l}</T>
                  {it.v ? <T s={14} c={c.ink3} right>{it.v}</T> : null}
                  <T s={20} c={c.ink4} style={{ width: 8 }}>{it.on ? '›' : ''}</T>
                </Tap>
              );
            })}
          </View>
          {g.note ? <T s={12} lh={1.45} c={c.ink3} style={{ paddingHorizontal: 4 }}>{g.note}</T> : null}
        </View>
      ))}
    </>
  );
}
