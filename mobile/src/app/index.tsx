import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { router } from 'expo-router';
import { BRAND } from '../theme';
import { Drop, FadeUp, PopIn, T } from '../ui';

/** Splash: brand mark, then onboarding after ~1.9 s. */
export default function Splash() {
  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    const t = setTimeout(() => router.replace('/onboarding'), 1900);
    return () => { loop.stop(); clearTimeout(t); };
  }, [slide]);
  return (
    <View style={{ flex: 1, backgroundColor: BRAND.red, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <PopIn>
        <View style={{ width: 96, height: 96 }}>
          <View style={{ position: 'absolute', left: 14, top: 18 }}><Drop size={68} color="#FFFFFF" /></View>
          <View style={{ position: 'absolute', left: 37, top: 46 }}><Drop size={22} color={BRAND.red} /></View>
        </View>
      </PopIn>
      <FadeUp delay={150}><T s={42} w={800} ls={-0.035} c="#FFFFFF">Kanbağ</T></FadeUp>
      <FadeUp delay={300}><T s={17} c="#FFE4E7">Bir Bağış, Bir Hayat.</T></FadeUp>
      <View style={{ position: 'absolute', bottom: 96, width: 56, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
        <Animated.View style={{ width: '40%', height: '100%', backgroundColor: '#FFFFFF', transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-22, 58] }) }] }} />
      </View>
    </View>
  );
}
