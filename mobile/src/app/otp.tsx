import React, { useEffect, useRef, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { nav, useApp } from '../store';
import { Grid, Screen, T, Tap } from '../ui';

/** 6-digit SMS code. Any code is accepted in the demo; `000000` shows the error state. */
export default function Otp() {
  const { st, c, toast } = useApp();
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState(false);
  const input = useRef<TextInput>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const lp = st.login.replace(/\D/g, '');
  const masked = lp ? `${lp.slice(0, 3)} *** ** ${lp.slice(8)}` : '5xx *** ** xx';

  const onChange = (raw: string) => {
    const v = raw.replace(/\D/g, '').slice(0, 6);
    setOtp(v);
    setErr(false);
    clearTimeout(t.current);
    if (v.length === 6) {
      if (v === '000000') setErr(true);
      else t.current = setTimeout(() => nav.go('/register'), 300);
    }
  };

  return (
    <Screen title="Doğrulama">
      <View style={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 40, gap: 22 }}>
        <View style={{ gap: 8 }}>
          <T s={26} w={700} ls={-0.02} accessibilityRole="header">Kodu gir</T>
          <T s={15} lh={1.45} c={c.ink3}>+90 {masked} numarasına gönderdiğimiz 6 haneli kodu gir.</T>
        </View>
        <Tap onPress={() => input.current?.focus()} scale={1} dim={1} accessibilityLabel="6 haneli doğrulama kodu">
          <Grid cols={6} gap={8}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={{ height: 60, borderRadius: 14, borderWidth: 1.5, borderColor: err ? c.red : i === otp.length ? c.ink : c.line2, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}>
                <T s={24} w={700} mono>{otp[i] || ''}</T>
              </View>
            ))}
          </Grid>
          <TextInput
            ref={input}
            value={otp}
            onChangeText={onChange}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            autoFocus
            caretHidden
            style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, fontSize: 16 }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
          />
        </Tap>
        {err ? (
          <View accessibilityRole="alert" style={{ backgroundColor: c.soft, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 }}>
            <T s={14} w={500} c={c.redtx}>Kod hatalı. Lütfen tekrar dene · 2 deneme hakkın kaldı.</T>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <T s={14} c={c.ink3}>Kod gelmedi mi?</T>
          <Tap onPress={() => toast('Yeni doğrulama kodu gönderildi.')} scale={1} dim={0.6} style={{ height: 44, justifyContent: 'center' }}>
            <T s={14} w={600} c={c.link}>Tekrar gönder · 0:42</T>
          </Tap>
        </View>
      </View>
    </Screen>
  );
}
