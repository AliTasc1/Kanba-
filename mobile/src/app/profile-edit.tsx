import React, { useState } from 'react';
import { View } from 'react-native';
import { BLOODS, fmtDob } from '@shared';
import { nav, useApp } from '../store';
import { Chip, Field, Grid, Label, LinkBtn, Screen, T, Tap } from '../ui';

export default function ProfileEdit() {
  const { st, set, c, toast } = useApp();
  const [pe, setPe] = useState(st.pe);
  const upd = (p: Partial<typeof pe>) => setPe((x) => ({ ...x, ...p }));
  const ok = !!(pe.first.trim() && pe.last.trim());
  const save = () => {
    if (!ok) return toast('Ad ve soyad gerekli.');
    set({ pe });
    nav.back();
    toast('Profilin güncellendi.');
  };
  return (
    <Screen
      title="Profili Düzenle"
      bar={
        <Tap onPress={save} style={{ height: 56, borderRadius: 16, backgroundColor: ok ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={17} w={600} c={ok ? '#FFFFFF' : c.ink4}>Kaydet</T>
        </Tap>
      }
    >
      <View style={{ paddingTop: 18, paddingHorizontal: 20, paddingBottom: 150, gap: 18 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <T s={30} w={800} c={c.redtx}>AY</T>
          </View>
          <LinkBtn label="Fotoğrafı değiştir" h={40} onPress={() => toast('Fotoğraf seçici açılıyor.')} />
        </View>
        <Grid cols={2}>
          <View style={{ gap: 8 }}><Label>Ad</Label><Field h={52} px={14} value={pe.first} onChangeText={(v) => upd({ first: v })} /></View>
          <View style={{ gap: 8 }}><Label>Soyad</Label><Field h={52} px={14} value={pe.last} onChangeText={(v) => upd({ last: v })} /></View>
        </Grid>
        <View style={{ gap: 8 }}>
          <Label>Doğum tarihi</Label>
          <Field h={52} px={14} value={pe.dob} keyboardType="number-pad" onChangeText={(v) => upd({ dob: fmtDob(v.replace(/\D/g, '').slice(0, 8)) })} />
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Telefon</T>
          <View style={{ height: 52, borderRadius: 14, backgroundColor: c.fill, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 }}>
            <T s={16}>+90 532 418 27 90</T>
            <T s={13} w={600} c={c.gtx}>✓ Doğrulandı</T>
          </View>
          <T s={12} c={c.ink3}>Numara değişikliği için yeniden SMS doğrulaması gerekir.</T>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Kan grubu</T>
          <Grid cols={4} gap={8}>
            {BLOODS.map((b) => <Chip key={b} label={b} red on={pe.blood === b} onPress={() => upd({ blood: b })} h={46} r={12} s={16} w={700} />)}
          </Grid>
        </View>
        <Tap onPress={() => nav.go('/settings/location')} scale={1} style={{ height: 56, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <T s={12} c={c.ink3}>Bölge</T>
            <T s={15} w={500}>Başiskele / Kocaeli</T>
          </View>
          <T s={14} w={600} c={c.link}>Değiştir</T>
        </Tap>
      </View>
    </Screen>
  );
}
