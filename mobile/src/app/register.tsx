import React from 'react';
import { View } from 'react-native';
import { fmtDob } from '@shared';
import { nav, useApp, type Registration } from '../store';
import { Field, Grid, Label, Screen, T, Tap } from '../ui';
import { RegProgress } from '../components/Registration';

export default function Register() {
  const { st, set, c, toast } = useApp();
  const rg = st.reg;
  const setReg = (p: Partial<Registration>) => set((s) => ({ reg: { ...s.reg, ...p } }));
  const ok = !!(rg.first.trim() && rg.last.trim() && rg.dob.length === 10);
  return (
    <Screen
      title="Profil Oluştur"
      bar={
        <Tap onPress={() => (ok ? nav.go('/blood') : toast('Ad, soyad ve doğum tarihini gir.'))} style={{ height: 56, borderRadius: 16, backgroundColor: ok ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={17} w={600} c={ok ? '#FFFFFF' : c.ink4}>Devam</T>
        </Tap>
      }
    >
      <View style={{ paddingTop: 12, paddingHorizontal: 24, paddingBottom: 150, gap: 20 }}>
        <RegProgress idx={1} />
        <View style={{ gap: 6 }}>
          <T s={26} w={700} ls={-0.02} accessibilityRole="header">Seni tanıyalım</T>
          <T s={15} lh={1.45} c={c.ink3}>Bu bilgiler yalnızca bağış uygunluğu ve bölge eşleşmesi için kullanılır.</T>
        </View>
        <Grid cols={2}>
          <View style={{ gap: 8 }}>
            <Label>Ad</Label>
            <Field px={14} value={rg.first} onChangeText={(v) => setReg({ first: v })} placeholder="Ad" autoCapitalize="words" />
          </View>
          <View style={{ gap: 8 }}>
            <Label>Soyad</Label>
            <Field px={14} value={rg.last} onChangeText={(v) => setReg({ last: v })} placeholder="Soyad" autoCapitalize="words" />
          </View>
        </Grid>
        <View style={{ gap: 8 }}>
          <Label>Doğum tarihi</Label>
          <Field px={14} value={rg.dob} onChangeText={(v) => setReg({ dob: fmtDob(v.replace(/\D/g, '').slice(0, 8)) })} keyboardType="number-pad" placeholder="GG.AA.YYYY" />
          <T s={12} c={c.ink3}>Kan bağışı için 18–65 yaş aralığında olmalısın. Doğum tarihin kimseyle paylaşılmaz.</T>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Telefon</T>
          <View style={{ height: 56, borderRadius: 14, backgroundColor: c.fill, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 }}>
            <T s={16}>+90 {st.login || '532 418 27 90'}</T>
            <T s={13} w={600} c={c.gtx}>✓ Doğrulandı</T>
          </View>
        </View>
      </View>
    </Screen>
  );
}
