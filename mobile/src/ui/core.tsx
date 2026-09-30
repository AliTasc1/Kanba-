import React, { useState } from 'react';
import {
  Platform, Pressable, Text, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '../store';
import { BRAND, fontFamily, type Weight } from '../theme';

// ---------- text ----------
export interface TProps {
  s?: number; w?: Weight; c?: string; ls?: number; lh?: number; mono?: boolean; center?: boolean; right?: boolean;
  lines?: number; upper?: boolean; underline?: boolean; style?: StyleProp<TextStyle>; children?: React.ReactNode;
  accessibilityRole?: 'header' | 'text' | 'alert';
}
/** Text in Onest (or JetBrains Mono). `ls` is letter-spacing in em, `lh` a line-height multiplier, like the CSS. */
export function T({ s = 15, w = 400, c, ls, lh, mono, center, right, lines, upper, underline, style, children, accessibilityRole }: TProps) {
  const col = useColors();
  return (
    <Text
      numberOfLines={lines}
      accessibilityRole={accessibilityRole}
      style={[
        {
          fontFamily: fontFamily(w, mono), fontSize: s, color: c ?? col.ink,
          letterSpacing: ls ? ls * s : undefined, lineHeight: lh ? Math.round(lh * s) : undefined,
          textAlign: center ? 'center' : right ? 'right' : undefined,
          textTransform: upper ? 'uppercase' : undefined,
          textDecorationLine: underline ? 'underline' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ---------- layout ----------
export const Row = ({ style, children, gap, ...p }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode; gap?: number } & Omit<React.ComponentProps<typeof View>, 'style'>) => (
  <View {...p} style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>
);
export const Col = ({ style, children, gap, ...p }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode; gap?: number } & Omit<React.ComponentProps<typeof View>, 'style'>) => (
  <View {...p} style={[{ gap }, style]}>{children}</View>
);

/** Pressable with a subtle press state (scale / dim), used for every tappable surface. */
export function Tap({ style, children, scale = 0.985, dim = 0.85, ...p }: PressableProps & { style?: StyleProp<ViewStyle>; scale?: number; dim?: number; children?: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole={p.accessibilityRole ?? 'button'}
      {...p}
      style={({ pressed }) => [style, pressed && { transform: [{ scale }], opacity: dim }]}
    >
      {children}
    </Pressable>
  );
}

export function Card({ style, children, r = 20, pad = 16, gap, onPress, accessibilityLabel }: { style?: StyleProp<ViewStyle>; children?: React.ReactNode; r?: number; pad?: number; gap?: number; onPress?: () => void; accessibilityLabel?: string }) {
  const c = useColors();
  const base: ViewStyle = { backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: r, padding: pad, gap };
  if (onPress) return <Tap onPress={onPress} accessibilityLabel={accessibilityLabel} style={[base, style]} scale={0.99} dim={1}>{children}</Tap>;
  return <View style={[base, style]}>{children}</View>;
}

/** Card whose children are separated by hairlines (lists, settings groups). */
export function ListCard({ children, r = 18, style }: { children: React.ReactNode; r?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: r, overflow: 'hidden' }, style]}>
      {items.map((ch, i) => (
        <View key={i} style={{ borderBottomWidth: i === items.length - 1 ? 0 : 1, borderBottomColor: c.line }}>{ch}</View>
      ))}
    </View>
  );
}

// ---------- icons ----------
export const PATHS = {
  home: 'M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4z',
  needs: 'M12 3.5c3.5 4.2 6 7.5 6 10.5a6 6 0 0 1-12 0c0-3 2.5-6.3 6-10.5z',
  donations: 'M5 6h14v14H5zM9 3.5v4M15 3.5v4M5 10.5h14',
  impact: 'M5 20v-7M12 20V5M19 20v-10',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1.2-3.8 4-5.8 7.5-5.8s6.3 2 7.5 5.8',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  share: 'M12 4v11M8 8l4-4 4 4M5 13v6h14v-6',
};
export function Icon({ d, size = 20, color, sw = 1.8 }: { d: string; size?: number; color: string; sw?: number | string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={Number(sw)} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** The Kanbağ drop mark: a square with three rounded corners, rotated 45°. */
export function Drop({ size, color }: { size: number; color: string }) {
  const r = size / 2;
  return (
    <View
      style={{
        width: size, height: size, backgroundColor: color, transform: [{ rotate: '-45deg' }],
        borderTopLeftRadius: r, borderTopRightRadius: 0, borderBottomRightRadius: r, borderBottomLeftRadius: r,
      }}
    />
  );
}

// ---------- buttons ----------
type BtnKind = 'primary' | 'secondary' | 'outline' | 'dark' | 'fill' | 'disabled';
export function Btn({ label, onPress, kind = 'primary', h = 56, r = 16, s = 17, style, flex, accessibilityLabel }: { label: string; onPress?: () => void; kind?: BtnKind; h?: number; r?: number; s?: number; style?: StyleProp<ViewStyle>; flex?: boolean; accessibilityLabel?: string }) {
  const c = useColors();
  const k = {
    primary: { bg: c.red, fg: BRAND.white, bd: c.red },
    secondary: { bg: c.card, fg: c.ink, bd: c.line },
    outline: { bg: c.card, fg: c.ink, bd: c.line2 },
    dark: { bg: c.ink, fg: c.card, bd: c.ink },
    fill: { bg: c.fill, fg: c.ink, bd: c.fill },
    disabled: { bg: c.line, fg: c.ink4, bd: c.line },
  }[kind];
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[{ height: h, borderRadius: r, backgroundColor: k.bg, borderWidth: 1, borderColor: k.bd, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }, flex && { flex: 1 }, style]}
    >
      <T s={s} w={600} c={k.fg}>{label}</T>
    </Tap>
  );
}

/** Small bordered button (Değiştir, Düzenle, Hatırlat…). */
export function SmallBtn({ label, onPress, h = 40, color, bd }: { label: string; onPress?: () => void; h?: number; color?: string; bd?: string }) {
  const c = useColors();
  return (
    <Tap onPress={onPress} style={{ height: h, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: bd ?? c.line, backgroundColor: c.card, justifyContent: 'center' }}>
      <T s={14} w={600} c={color}>{label}</T>
    </Tap>
  );
}

export function LinkBtn({ label, onPress, s = 15, w = 600, color, h = 44 }: { label: string; onPress?: () => void; s?: number; w?: Weight; color?: string; h?: number }) {
  const c = useColors();
  return (
    <Tap onPress={onPress} style={{ height: h, justifyContent: 'center' }} scale={1} dim={0.6}>
      <T s={s} w={w} c={color ?? c.link}>{label}</T>
    </Tap>
  );
}

// ---------- chips / segmented / toggles ----------
export function Chip({ label, on, red, onPress, h = 38, s = 14, w = 500, r = 999, pad = 14, style }: { label: string; on: boolean; red?: boolean; onPress: () => void; h?: number; s?: number; w?: Weight; r?: number; pad?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const bg = on ? (red ? c.red : c.sel) : c.card;
  const fg = on ? (red ? BRAND.white : c.selfg) : c.ink;
  const bd = on ? (red ? c.red : c.sel) : c.line;
  return (
    <Tap
      onPress={onPress}
      accessibilityState={{ selected: on }}
      style={[{ height: h, paddingHorizontal: pad, borderRadius: r, borderWidth: 1, borderColor: bd, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <T s={s} w={w} c={fg}>{label}</T>
    </Tap>
  );
}

/** Big selectable tile (blood group grids etc.) with a 1.5px border. */
export function Tile({ on, red = true, onPress, h, r, children, style, bw = 1.5 }: { on: boolean; red?: boolean; onPress: () => void; h: number; r: number; children: (fg: string) => React.ReactNode; style?: StyleProp<ViewStyle>; bw?: number }) {
  const c = useColors();
  const bg = on ? (red ? c.red : c.sel) : c.card;
  const fg = on ? (red ? BRAND.white : c.selfg) : c.ink;
  const bd = on ? (red ? c.red : c.sel) : c.line;
  return (
    <Tap onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} style={[{ height: h, borderRadius: r, borderWidth: bw, borderColor: bd, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}>
      {children(fg)}
    </Tap>
  );
}

export interface SegItem { label: string; on: boolean; onPress: () => void }
export function Seg({ items, h = 38, bg }: { items: SegItem[]; h?: number; bg?: string }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: bg ?? c.fill, borderRadius: 12, padding: 3, gap: 2 }}>
      {items.map((o) => (
        <Tap
          key={o.label}
          onPress={o.onPress}
          accessibilityRole="tab"
          accessibilityState={{ selected: o.on }}
          scale={1}
          style={[
            { flex: 1, height: h, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: o.on ? c.card : 'transparent' },
            o.on && { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
          ]}
        >
          <T s={14} w={o.on ? 600 : 500}>{o.label}</T>
        </Tap>
      ))}
    </View>
  );
}

export function Switch({ on }: { on: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: on ? c.red : c.line2 }}>
      <View style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 }} />
    </View>
  );
}

export function Radio({ on }: { on: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? c.red : '#A1A1AA', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: on ? c.red : 'transparent' }} />
    </View>
  );
}

export function Check({ on }: { on: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: on ? c.red : '#A1A1AA', backgroundColor: on ? c.red : c.card, alignItems: 'center', justifyContent: 'center' }}>
      {on ? <T s={14} w={700} c="#FFFFFF">✓</T> : null}
    </View>
  );
}

export function CheckRow({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <Tap onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: on }} scale={1} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 4 }}>
      <Check on={on} />
      <T s={14} lh={1.45} style={{ flex: 1 }}>{label}</T>
    </Tap>
  );
}

// ---------- pills ----------
export function Pill({ label, bg, fg, bd, s = 11, w = 700, ls = 0.06, px = 8, py = 3, style }: { label: string; bg?: string; fg: string; bd?: string; s?: number; w?: Weight; ls?: number; px?: number; py?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ paddingHorizontal: px, paddingVertical: py, borderRadius: 999, backgroundColor: bg ?? 'transparent', borderWidth: bd ? 1 : 0, borderColor: bd, alignSelf: 'flex-start' }, style]}>
      <T s={s} w={w} ls={ls} c={fg}>{label}</T>
    </View>
  );
}

// ---------- key/value rows ----------
export type KV = [k: string, v: string, mono?: boolean];
export function KVRows({ rows, py = 13, vw = 500, bg, r = 20, bordered = true, kFlexNone = true }: { rows: KV[]; py?: number; vw?: Weight; bg?: string; r?: number; bordered?: boolean; kFlexNone?: boolean }) {
  const c = useColors();
  return (
    <View style={{ backgroundColor: bg ?? c.card, borderWidth: bordered ? 1 : 0, borderColor: c.line, borderRadius: r, paddingHorizontal: 16, paddingVertical: 2 }}>
      {rows.map(([k, v, mono], i) => (
        <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: py, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: c.fill }}>
          <T s={14} c={c.ink3} style={kFlexNone ? { flexShrink: 0 } : undefined}>{k}</T>
          <T s={14} w={vw} right mono={mono} style={{ flexShrink: 1 }}>{v}</T>
        </View>
      ))}
    </View>
  );
}

// ---------- progress ----------
export function Bar({ pct, color, h = 6, track }: { pct: number; color: string; h?: number; track?: string }) {
  const c = useColors();
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }} style={{ height: h, borderRadius: h / 2, backgroundColor: track ?? c.fill, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color, borderRadius: h / 2 }} />
    </View>
  );
}

export function StepBars({ n, cur, gap = 4 }: { n: number; cur: number; gap?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < cur ? c.red : c.line }} />
      ))}
    </View>
  );
}

// ---------- inputs ----------
export function Field({ h = 56, style, prefix, px = 16, s = 16, ...p }: TextInputProps & { h?: number; prefix?: string; px?: number; s?: number }) {
  const c = useColors();
  const [focus, setFocus] = useState(false);
  const input = (
    <TextInput
      placeholderTextColor={c.ink4}
      {...p}
      onFocus={(e) => { setFocus(true); p.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); p.onBlur?.(e); }}
      style={[
        { flex: prefix ? 1 : undefined, height: '100%', paddingHorizontal: prefix ? 14 : px, fontFamily: fontFamily(400), fontSize: s, color: c.ink, minWidth: 0 },
        Platform.OS === 'web' && ({ outlineStyle: 'none' } as object),
        style,
      ]}
    />
  );
  return (
    <View style={{ height: h, borderRadius: 14, borderWidth: 1, borderColor: focus ? c.ink : c.line, backgroundColor: c.card, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
      {prefix ? (
        <View style={{ height: '100%', justifyContent: 'center', paddingLeft: 16, paddingRight: 12, borderRightWidth: 1, borderRightColor: c.line }}>
          <T s={16} c={c.ink3}>{prefix}</T>
        </View>
      ) : null}
      {input}
    </View>
  );
}

export function SearchField({ value, onChangeText, placeholder, h = 48, s = 15, onClear, onPress }: { value?: string; onChangeText?: (v: string) => void; placeholder: string; h?: number; s?: number; onClear?: () => void; onPress?: () => void }) {
  const c = useColors();
  const box: ViewStyle = { height: h, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 14, paddingRight: onClear ? 8 : 14 };
  if (onPress)
    return (
      <Tap onPress={onPress} style={box} scale={1}>
        <Icon d={PATHS.search} size={18} color="#71717A" sw={2} />
        <T s={s} c={c.ink4}>{placeholder}</T>
      </Tap>
    );
  return (
    <View style={box}>
      <Icon d={PATHS.search} size={18} color="#71717A" sw={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        placeholderTextColor={c.ink4}
        style={[{ flex: 1, height: '100%', fontFamily: fontFamily(400), fontSize: s, color: c.ink, minWidth: 0 }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
      />
      {onClear && value ? (
        <Tap onPress={onClear} accessibilityLabel="Aramayı temizle" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
          <T s={16} c={c.ink2}>×</T>
        </Tap>
      ) : null}
    </View>
  );
}

export function Label({ children, optional }: { children: string; optional?: boolean }) {
  const c = useColors();
  return (
    <T s={14} w={600}>
      {children}
      {optional ? <T s={14} c={c.ink3}> (opsiyonel)</T> : null}
    </T>
  );
}

/** Tinted note block ("!" warnings, lock notes, info). */
export function Note({ children, bg, fg, icon, r = 16 }: { children: React.ReactNode; bg: string; fg: string; icon?: React.ReactNode; r?: number }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: r, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      {icon}
      <View style={{ flex: 1 }}>{typeof children === 'string' ? <T s={13} lh={1.45} c={fg}>{children}</T> : children}</View>
    </View>
  );
}

export function LockNote({ text, r = 16 }: { text: string; r?: number }) {
  const c = useColors();
  return <Note bg={c.fill} fg={c.ink2} r={r} icon={<Icon d={PATHS.lock} size={18} color={c.ink2} />}>{text}</Note>;
}

/** "✓ text" bullet rows (support, location permission). */
export function CheckLine({ text, s = 14, color }: { text: string; s?: number; color?: string }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <T s={s} w={700} c={c.gtx}>✓</T>
      <T s={s} lh={1.4} c={color ?? c.ink} style={{ flex: 1 }}>{text}</T>
    </View>
  );
}

/** CSS-grid-like equal columns: children are chunked into rows of `cols` equal-width cells. */
export function Grid({ cols, gap = 10, rowGap, children }: { cols: number; gap?: number; rowGap?: number; children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return (
    <View style={{ gap: rowGap ?? gap }}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap }}>
          {r.map((ch, j) => <View key={j} style={{ flex: 1, minWidth: 0 }}>{ch}</View>)}
          {Array.from({ length: cols - r.length }, (_, k) => <View key={'e' + k} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}
