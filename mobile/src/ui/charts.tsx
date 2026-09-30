import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';
import { geoMercator, geoPath } from 'd3-geo';
import { MONTHS, PROVINCE_COORDS, TURKEY_GEOJSON, linePath, provinceStats } from '@shared';
import { useApp, useColors } from '../store';
import { T } from './core';

export function LineChart({ values, h = 120, grid = true, r = 5 }: { values: number[]; h?: number; grid?: boolean; r?: number }) {
  const c = useColors();
  const p = useMemo(() => linePath(values), [values]);
  return (
    <View style={{ gap: 8 }}>
      <Svg width="100%" height={h} viewBox="0 0 320 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {grid ? (
          <>
            <Line x1={0} x2={320} y1={40} y2={40} stroke={c.line} strokeDasharray="3 5" />
            <Line x1={0} x2={320} y1={80} y2={80} stroke={c.line} strokeDasharray="3 5" />
          </>
        ) : null}
        <Path d={p.area} fill={c.soft} />
        <Path d={p.line} fill="none" stroke={c.red} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <Circle cx={p.cx} cy={p.cy} r={r} fill={c.card} stroke={c.red} strokeWidth={2.5} />
      </Svg>
      <View style={{ flexDirection: 'row' }}>
        {MONTHS.map((m) => (
          <T key={m} s={10} c={c.ink4} center style={{ flex: 1 }}>{m}</T>
        ))}
      </View>
    </View>
  );
}

export interface DonutSlice { l: string; p: number; c: string }
export function Donut({ slices }: { slices: DonutSlice[] }) {
  const C = 2 * Math.PI * 42;
  let acc = 0;
  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      {slices.map((s) => {
        const len = (C * s.p) / 100;
        // Offset by a quarter turn so the first slice starts at 12 o'clock.
        const el = <Circle key={s.l} cx={60} cy={60} r={42} fill="none" stroke={s.c} strokeWidth={16} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={C / 4 - acc} />;
        acc += len;
        return el;
      })}
    </Svg>
  );
}

/**
 * Türkiye map: Natural Earth outline + one dot per province, sized and shaded by the chosen metric.
 * Same projection and styling as the prototype's <kb-turkey-map> web component.
 */
export function TurkeyMap({ height, metric = 'need', selected, onSelect }: { height: number; metric?: 'need' | 'donation'; selected?: string; onSelect?: (n: string) => void }) {
  const { dark } = useApp();
  const [W, setW] = useState(0);
  const geo = useMemo(() => {
    if (!W) return null;
    const proj = geoMercator().fitExtent([[12, 12], [W - 12, height - 12]], TURKEY_GEOJSON);
    const land = geoPath(proj)(TURKEY_GEOJSON) || '';
    const dots = PROVINCE_COORDS.map(([n, la, lo]) => {
      const [x, y] = proj([lo, la]) || [0, 0];
      return { n, x, y };
    });
    return { land, dots };
  }, [W, height]);
  const key = metric === 'donation' ? 'donation' : 'active';
  const vals = useMemo(() => PROVINCE_COORDS.map(([n]) => provinceStats(n)[key]), [key]);
  const mx = Math.max(...vals);
  // Draw the selected province last so its ring sits on top.
  const order = geo ? [...geo.dots.keys()].sort((a, b) => Number(geo.dots[a].n === selected) - Number(geo.dots[b].n === selected)) : [];
  return (
    <View style={{ height }} onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))} accessibilityLabel="Türkiye il bazlı yoğunluk haritası" accessibilityRole="image">
      {geo ? (
        <Svg width={W} height={height} viewBox={`0 0 ${W} ${height}`}>
          <Path d={geo.land} fill={dark ? '#232327' : '#EDEDEF'} stroke={dark ? '#3A3A40' : '#DADADD'} strokeWidth={1} />
          {order.map((i) => {
            const d = geo.dots[i];
            const t = Math.sqrt(vals[i] / mx);
            const on = d.n === selected;
            return (
              <G key={d.n}>
                <Circle
                  cx={d.x} cy={d.y} r={2.4 + t * 8.5}
                  fill={dark ? '#E0404F' : '#C4162A'} fillOpacity={0.28 + 0.72 * t}
                  stroke={on ? (dark ? '#F4F4F5' : '#18181B') : dark ? '#18181B' : '#FFFFFF'} strokeWidth={on ? 2.5 : 1}
                />
              </G>
            );
          })}
        </Svg>
      ) : null}
      {geo && onSelect
        ? geo.dots.map((d) => (
            <Pressable
              key={d.n}
              onPress={() => onSelect(d.n)}
              accessibilityRole="button"
              accessibilityLabel={d.n}
              hitSlop={2}
              style={{ position: 'absolute', left: d.x - 9, top: d.y - 9, width: 18, height: 18, borderRadius: 9 }}
            />
          ))
        : null}
    </View>
  );
}

export function HBar({ label, value, pct, labelW }: { label: string; value: string; pct: number; labelW?: number }) {
  const c = useColors();
  if (labelW)
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <T s={13} lines={1} style={{ width: labelW }}>{label}</T>
        <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: c.fill, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: c.red, borderRadius: 5 }} />
        </View>
        <T s={13} w={600} right style={{ width: 36 }}>{value}</T>
      </View>
    );
  return (
    <View style={{ gap: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T s={14}>{label}</T>
        <T s={14} w={600}>{value}</T>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: c.fill, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: c.red, borderRadius: 4 }} />
      </View>
    </View>
  );
}
