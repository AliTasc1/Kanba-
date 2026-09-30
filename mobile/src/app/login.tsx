import React from 'react';
import { View } from 'react-native';
import { fmtPhone } from '@shared';
import { nav, useApp } from '../store';
import { Btn, Drop, Field, Screen, T, Tap } from '../ui';

export default function Login() {
  const { st, set, c, toast } = useApp();
  const ok = st.login.replace(/\D/g, '').length === 10;
  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 20, paddingHorizontal: 24, paddingBottom: 44, gap: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Drop size={26} color={c.red} />
          <T s={22} w={800} ls={-0.03}>Kanbağ</T>
        </View>
        <View style={{ gap: 8, marginTop: 20 }}>
          <T s={28} w={700} ls={-0.025} accessibilityRole="header">Telefon numaranla devam et</T>
          <T s={15} lh={1.45} c={c.ink3}>Sana tek kullanımlık bir doğrulama kodu göndereceğiz.</T>
        </View>
        <Field
          prefix="TR +90"
          value={st.login}
          onChangeText={(v) => set({ login: fmtPhone(v.replace(/\D/g, '').slice(0, 10)) })}
          keyboardType="phone-pad"
          placeholder="5xx xxx xx xx"
          accessibilityLabel="Telefon numarası"
          s={17}
        />
        <Tap
          onPress={() => (ok ? nav.go('/otp') : toast('10 haneli telefon numaranı gir.'))}
          style={{ height: 56, borderRadius: 16, backgroundColor: ok ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}
        >
          <T s={17} w={600} c={ok ? '#FFFFFF' : c.ink4}>Kod Gönder</T>
        </Tap>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
          <T s={13} c={c.ink4}>veya</T>
          <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
        </View>
        <View style={{ gap: 10 }}>
          <Btn label="Apple ile devam et" kind="dark" onPress={() => { toast('Apple hesabınla giriş yapıldı.'); nav.go('/register'); }} />
          <Btn label="Google ile devam et" kind="outline" onPress={() => { toast('Google hesabınla giriş yapıldı.'); nav.go('/register'); }} />
        </View>
        <T s={12} lh={1.5} c={c.ink3} center style={{ marginTop: 'auto' }}>
          Devam ederek Kullanım Koşulları’nı ve KVKK Aydınlatma Metni’ni okuduğunu kabul edersin. Numaran hiçbir zaman herkese açık gösterilmez.
        </T>
      </View>
    </Screen>
  );
}
