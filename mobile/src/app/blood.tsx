import React from 'react';
import { View } from 'react-native';
import { BLOODS } from '@shared';
import { nav, useApp } from '../store';
import { Grid, Screen, T, Tap, Tile } from '../ui';
import { RegProgress } from '../components/Registration';

export default function BloodStep() {
  const { st, set, c, toast } = useApp();
  const blood = st.reg.blood;
  const toProvince = () => nav.go('/province');
  return (
    <Screen
      title="Profil Oluştur"
      bar={
        <Tap onPress={() => (blood ? toProvince() : toast('Kan grubunu seç veya “Bilmiyorum” de.'))} style={{ height: 56, borderRadius: 16, backgroundColor: blood ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={17} w={600} c={blood ? '#FFFFFF' : c.ink4}>Devam</T>
        </Tap>
      }
    >
      <View style={{ paddingTop: 12, paddingHorizontal: 24, paddingBottom: 150, gap: 20 }}>
        <RegProgress idx={2} />
        <View style={{ gap: 6 }}>
          <T s={26} w={700} ls={-0.02} accessibilityRole="header">Kan grubun</T>
          <T s={15} lh={1.45} c={c.ink3}>Sana uygun ihtiyaçları göstermek için kullanılır. Daha sonra profilinden değiştirebilirsin.</T>
        </View>
        <Grid cols={4}>
          {BLOODS.map((b) => (
            <Tile key={b} on={blood === b} onPress={() => set((s) => ({ reg: { ...s.reg, blood: b } }))} h={72} r={18}>{(fg) => <T s={22} w={800} c={fg}>{b}</T>}</Tile>
          ))}
        </Grid>
        <Tap onPress={() => { set((s) => ({ reg: { ...s.reg, blood: '?' } })); toProvince(); }} style={{ height: 52, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: c.line2, alignItems: 'center', justifyContent: 'center' }}>
          <T s={15} w={600}>Kan grubumu bilmiyorum</T>
        </Tap>
        <T s={13} lh={1.45} c={c.ink3}>Kan grubunu bilmiyorsan ilk bağışında öğrenebilirsin. O zamana kadar tüm ihtiyaçları görürsün.</T>
      </View>
    </Screen>
  );
}
