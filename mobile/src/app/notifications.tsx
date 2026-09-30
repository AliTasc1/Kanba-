import React, { useState } from 'react';
import { View } from 'react-native';
import { NOTIFICATIONS, type AppNotification } from '@shared';
import { nav, useApp } from '../store';
import type { Palette } from '../theme';
import { Card, Screen, Seg, T } from '../ui';

const icon = (t: AppNotification['type'], c: Palette): [string, string, string] =>
  ({
    acil: ['!', c.red, '#FFFFFF'],
    status: ['1/3', c.soft, c.redtx],
    remind: ['90g', c.gsoft, c.gtx],
    history: ['✓', c.gsoft, c.gtx],
    vol: ['+64', c.fill, c.ink2],
    news: ['Yeni', c.fill, c.ink2],
  })[t] as [string, string, string];

export default function Notifications() {
  const { st, set, c } = useApp();
  const [tab, setTab] = useState<'all' | 'acil' | 'mine'>('all');
  const items = NOTIFICATIONS.filter((x) => tab === 'all' || (tab === 'acil' ? x.type === 'acil' : ['status', 'remind', 'history'].includes(x.type)));
  const groups: { t: string; items: AppNotification[] }[] = [];
  items.forEach((x) => {
    let g = groups.find((g) => g.t === x.g);
    if (!g) groups.push((g = { t: x.g, items: [] }));
    g.items.push(x);
  });
  const open = (x: AppNotification) => {
    set((s) => ({ readN: { ...s.readN, [x.id]: true } }));
    if (x.need) nav.go('/need/' + x.need);
    else if (x.go) nav.go('/' + x.go);
  };

  return (
    <Screen title="Bildirimler" right={{ label: 'Ayarlar', onPress: () => nav.go('/settings/notifications') }}>
      <View style={{ paddingTop: 14, paddingHorizontal: 20, paddingBottom: 32, gap: 16 }}>
        <Seg items={([['all', 'Tümü'], ['acil', 'Acil'], ['mine', 'Bağışlarım']] as const).map(([k, l]) => ({ label: l, on: tab === k, onPress: () => setTab(k) }))} />
        {groups.map((g) => (
          <View key={g.t} style={{ gap: 10 }}>
            <T s={13} w={600} c={c.ink3} style={{ paddingHorizontal: 4 }}>{g.t}</T>
            {g.items.map((x) => {
              const [ic, ibg, ifg] = icon(x.type, c);
              const dot = x.unread && !st.readN[x.id];
              return (
                <Card key={x.id} r={18} pad={14} onPress={() => open(x)} style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: ibg, alignItems: 'center', justifyContent: 'center' }}>
                    <T s={13} w={800} c={ifg}>{ic}</T>
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                        {dot ? <View accessibilityLabel="Okunmadı" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.red }} /> : null}
                        <T s={15} w={600} style={{ flexShrink: 1 }}>{x.t}</T>
                      </View>
                      <T s={12} c={c.ink4}>{x.time}</T>
                    </View>
                    <T s={14} lh={1.4} c={c.ink2}>{x.b}</T>
                    {x.meta ? <T s={13} c={c.ink4}>{x.meta}</T> : null}
                    {x.cta ? (
                      <View style={{ marginTop: 6, alignSelf: 'flex-start', height: 34, paddingHorizontal: 12, borderRadius: 10, backgroundColor: c.red, justifyContent: 'center' }}>
                        <T s={13} w={600} c="#FFFFFF">{x.cta}</T>
                      </View>
                    ) : null}
                  </View>
                </Card>
              );
            })}
          </View>
        ))}
        {!groups.length ? <T s={15} c={c.ink3} center style={{ paddingVertical: 40, paddingHorizontal: 20 }}>Bu kategoride bildirim yok.</T> : null}
      </View>
    </Screen>
  );
}
