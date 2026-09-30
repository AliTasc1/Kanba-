import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { nav, useApp, useColors, useToastOffset } from '../store';
import { isIOSChrome } from '../theme';
import { T, Tap } from './core';

/** Bottom padding for sticky bars/sheets: the prototype's 34px, or the device inset if larger. */
export const useBottomPad = (base = 34) => Math.max(base, useSafeAreaInsets().bottom);

// ---------- header ----------
export function Header({ title, right, onBack }: { title: string; right?: { label: string; onPress: () => void }; onBack?: () => void }) {
  const c = useColors();
  const back = onBack ?? nav.back;
  if (isIOSChrome)
    return (
      <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.line }}>
        <View style={{ width: 96 }}>
          <Tap onPress={back} accessibilityLabel="Geri" scale={1} dim={0.5} style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8 }}>
            <T s={30} c={c.link} style={{ marginTop: -4, lineHeight: 30 }}>‹</T>
            <T s={17} c={c.link}>Geri</T>
          </Tap>
        </View>
        <T s={17} w={600} center lines={1} style={{ flex: 1 }} accessibilityRole="header">{title}</T>
        <View style={{ width: 96, alignItems: 'flex-end' }}>
          {right ? (
            <Tap onPress={right.onPress} scale={1} dim={0.5} style={{ minWidth: 44, height: 44, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
              <T s={17} w={500} c={c.link}>{right.label}</T>
            </Tap>
          ) : null}
        </View>
      </View>
    );
  return (
    <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4, backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.line }}>
      <Tap onPress={back} accessibilityLabel="Geri" scale={1} dim={0.5} style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
        <T s={22}>←</T>
      </Tap>
      <T s={21} w={500} lines={1} style={{ flex: 1 }} accessibilityRole="header">{title}</T>
      {right ? (
        <Tap onPress={right.onPress} scale={1} dim={0.5} style={{ minWidth: 48, height: 48, paddingHorizontal: 12, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
          <T s={15} w={600} c={c.link}>{right.label}</T>
        </Tap>
      ) : null}
    </View>
  );
}

// ---------- screen ----------
export interface ScreenProps {
  title?: string;
  right?: { label: string; onPress: () => void };
  onBack?: () => void;
  topBg?: string;
  /** Rendered between the header and the scroll area (e.g. the create-flow stepper). */
  above?: React.ReactNode;
  /** Sticky bottom bar content. */
  bar?: React.ReactNode;
  barBg?: string;
  /** Absolutely-positioned overlays (FAB, sheets). */
  overlay?: React.ReactNode;
  scroll?: boolean;
  fill?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  scrollRef?: React.Ref<ScrollView>;
  scrollProps?: ScrollViewProps;
  /** Screen sits above the tab bar (moves the toast up). */
  tabbed?: boolean;
  children?: React.ReactNode;
}

export function Screen({ title, right, onBack, topBg, above, bar, barBg, overlay, scroll = true, fill, contentStyle, scrollRef, scrollProps, tabbed, children }: ScreenProps) {
  const c = useColors();
  useToastOffset(tabbed ? 110 : bar ? 130 : 40);
  const insets = useSafeAreaInsets();
  const barPad = useBottomPad();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ height: insets.top, backgroundColor: topBg ?? (title ? c.card : c.bg) }} />
      {title ? <Header title={title} right={right} onBack={onBack} /> : null}
      {above}
      <View style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[fill && { flexGrow: 1 }, contentStyle]}
            {...scrollProps}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
        )}
        {bar ? (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: barBg ?? c.bar2, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 12, paddingHorizontal: 20, paddingBottom: barPad }}>
            {bar}
          </View>
        ) : null}
        {overlay}
      </View>
    </View>
  );
}

/** Content column with the prototype's standard paddings and gaps. */
export function Body({ pt = 4, px = 20, pb = 28, gap = 16, style, children }: { pt?: number; px?: number; pb?: number; gap?: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  return <View style={[{ paddingTop: pt, paddingHorizontal: px, paddingBottom: pb, gap }, style]}>{children}</View>;
}

// ---------- bottom sheet ----------
export function Sheet({ open, onClose, children, footer }: { open: boolean; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  const c = useColors();
  const fade = useRef(new Animated.Value(0)).current;
  const up = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    if (!open) return;
    fade.setValue(0);
    up.setValue(40);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(up, { toValue: 0, duration: 260, useNativeDriver: true, easing: Easing.bezier(0.2, 0.8, 0.2, 1) }),
    ]).start();
  }, [open, fade, up]);
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,15,16,0.45)', opacity: fade }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Kapat" />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={{ backgroundColor: c.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', opacity: fade, transform: [{ translateY: up }] }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 4 }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: c.line2 }} />
          </View>
          {children}
          {footer}
        </Animated.View>
      </View>
      <ToastHost inModal />
    </Modal>
  );
}

// ---------- toast ----------
export function ToastHost({ inModal }: { inModal?: boolean }) {
  const { toastMsg, toastBottom, c } = { ...useApp(), c: useColors() };
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!toastMsg) return;
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
  }, [toastMsg, a]);
  if (!toastMsg) return null;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{
        position: 'absolute', left: 20, right: 20, bottom: inModal ? 40 : toastBottom, zIndex: 60,
        backgroundColor: c.hero, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 30, shadowOffset: { width: 0, height: 10 }, elevation: 8,
        opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
      }}
    >
      <T s={14} lh={1.4} c="#FFFFFF">{toastMsg}</T>
    </Animated.View>
  );
}

// ---------- pop-in (success check marks) ----------
export function PopIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 450, delay, useNativeDriver: true, easing: Easing.bezier(0.2, 0.9, 0.3, 1.2) }).start();
  }, [a, delay]);
  return (
    <Animated.View style={[style, { opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }), transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
      {children}
    </Animated.View>
  );
}

export function FadeUp({ children, delay = 0, dy = 40, style }: { children: React.ReactNode; delay?: number; dy?: number; style?: StyleProp<ViewStyle> }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 600, delay, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
  }, [a, delay]);
  return <Animated.View style={[style, { opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] }) }] }]}>{children}</Animated.View>;
}

/** Pulsing wrapper for skeleton placeholders. */
export function Pulse({ children }: { children: React.ReactNode }) {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(a, { toValue: 0.45, duration: 600, useNativeDriver: true }),
      Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [a]);
  return <Animated.View style={{ opacity: a }}>{children}</Animated.View>;
}

// ---------- success/result layout ----------
export function ResultMark({ outer, inner, mark = '✓', size = 30 }: { outer: string; inner: string; mark?: string; size?: number }) {
  return (
    <PopIn>
      <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: outer, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: inner, alignItems: 'center', justifyContent: 'center' }}>
          <T s={size} w={700} c="#FFFFFF">{mark}</T>
        </View>
      </View>
    </PopIn>
  );
}
