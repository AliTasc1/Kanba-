import React, { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { nav, useApp } from '../../store';
import { fontFamily } from '../../theme';
import { Screen, T, Tap } from '../../ui';

const AMOUNTS = [10, 100, 1000, 10000];

export default function SupportAmount() {
  const { st, set, c, toast } = useApp();
  const [v, setV] = useState(AMOUNTS.includes(st.amt) ? '' : String(st.amt));
  const n = parseInt(v || '0', 10);
  const ok = n >= 5 && n <= 50000;
  const bad = !!v && !ok;
  return (
    <Screen
      title="Farklı Tutar"
      bar={
        <Tap onPress={() => (ok ? (set({ amt: n }), nav.back()) : toast('5 TL ile 50.000 TL arasında bir tutar gir.'))} style={{ height: 56, borderRadius: 16, backgroundColor: ok ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={17} w={600} c={ok ? '#FFFFFF' : c.ink4}>Devam</T>
        </Tap>
      }
    >
      <View style={{ paddingTop: 40, paddingHorizontal: 20, paddingBottom: 150, alignItems: 'center', gap: 16 }}>
        <T s={15} c={c.ink3}>Destek tutarı</T>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, borderBottomWidth: 2, borderBottomColor: c.ink, paddingHorizontal: 8, paddingBottom: 6 }}>
          <TextInput
            value={v}
            onChangeText={(t) => setV(t.replace(/\D/g, '').slice(0, 5))}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={c.ink4}
            accessibilityLabel="Destek tutarı (TL)"
            autoFocus
            style={[{ width: 180, fontFamily: fontFamily(800), fontSize: 56, letterSpacing: -1.7, textAlign: 'right', color: c.ink, padding: 0 }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
          />
          <T s={28} w={700}>TL</T>
        </View>
        <T s={13} c={bad ? c.redtx : c.ink3}>{bad ? '5 TL ile 50.000 TL arasında bir tutar gir.' : 'En az 5 TL · en fazla 50.000 TL'}</T>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[25, 50, 250, 500].map((q) => (
            <Tap key={q} onPress={() => setV(String(q))} style={{ height: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, justifyContent: 'center' }}>
              <T s={14} w={600}>{q} TL</T>
            </Tap>
          ))}
        </View>
      </View>
    </Screen>
  );
}
