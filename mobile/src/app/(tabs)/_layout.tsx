import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../store';
import { isIOSChrome } from '../../theme';
import { Icon, PATHS, T, Tap } from '../../ui';

const TABS = [
  ['home', 'Ana Sayfa'],
  ['needs', 'İhtiyaçlar'],
  ['donations', 'Bağışlarım'],
  ['impact', 'Etki'],
  ['profile', 'Profil'],
] as const;

type TabBarProps = { state: { index: number; routes: { name: string; key: string }[] }; navigation: { navigate: (n: string) => void; emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean } } };

function TabBar({ state, navigation }: TabBarProps) {
  const c = useColors();
  const pad = Math.max(30, useSafeAreaInsets().bottom);
  const cur = state.routes[state.index]?.name;
  const press = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!e.defaultPrevented) navigation.navigate(name);
  };
  if (isIOSChrome)
    return (
      <View accessibilityRole="tablist" style={{ backgroundColor: c.bar, borderTopWidth: 1, borderTopColor: c.line, flexDirection: 'row', paddingTop: 6, paddingHorizontal: 4, paddingBottom: pad }}>
        {TABS.map(([k, l]) => {
          const on = cur === k;
          const col = on ? c.red : c.ink4;
          return (
            <Tap key={k} onPress={() => press(k)} accessibilityRole="tab" accessibilityState={{ selected: on }} scale={1} dim={0.6} style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 }}>
              <Icon d={PATHS[k]} size={26} color={col} sw={on ? 2.1 : 1.7} />
              <T s={11} w={on ? 600 : 500} c={col}>{l}</T>
            </Tap>
          );
        })}
      </View>
    );
  return (
    <View accessibilityRole="tablist" style={{ backgroundColor: c.tabbg, flexDirection: 'row', paddingTop: 12, paddingHorizontal: 4, paddingBottom: pad }}>
      {TABS.map(([k, l]) => {
        const on = cur === k;
        return (
          <Tap key={k} onPress={() => press(k)} accessibilityRole="tab" accessibilityState={{ selected: on }} scale={1} dim={0.7} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={{ width: 60, height: 32, borderRadius: 16, backgroundColor: on ? c.pill : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={PATHS[k]} size={22} color={on ? c.redtx : c.ink2} sw={1.9} />
            </View>
            <T s={12} w={on ? 600 : 500}>{l}</T>
          </Tap>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, animation: 'none' }} tabBar={(p) => <TabBar {...(p as unknown as TabBarProps)} />}>
      {TABS.map(([k]) => (
        <Tabs.Screen key={k} name={k} />
      ))}
    </Tabs>
  );
}
