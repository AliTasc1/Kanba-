import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { NEEDS } from '@shared';
import { makeDonation, nav, useApp } from '../../../store';
import { Card, CheckRow, Pill, Screen, Seg, T, Tap } from '../../../ui';

export default function Record() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { set, c, allNeeds, toast, recordDonation } = useApp();
  const n = allNeeds.find((x) => x.id === id) || NEEDS[1];
  const [rec, setRec] = useState({ day: 0, units: 1, doc: false, ok: false });
  const upd = (p: Partial<typeof rec>) => setRec((r) => ({ ...r, ...p }));

  const save = () => {
    if (!rec.ok) return toast('Kaydetmek için beyan kutusunu işaretle.');
    const dn = makeDonation(n, rec.units, rec.day);
    recordDonation(dn);
    set({ lastDon: { date: dn.date, units: dn.units, need: dn.needBlood, hospital: dn.hospital, place: dn.place, st: 'p', id: dn.id } });
    nav.reset('/home');
    nav.go('/donation-success');
  };
  const stepBtn = (label: string, a11y: string, on: () => void) => (
    <Tap onPress={on} accessibilityLabel={a11y} style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
      <T s={22}>{label}</T>
    </Tap>
  );

  return (
    <Screen
      title="Bağış Kaydı"
      bar={
        <Tap onPress={save} style={{ height: 56, borderRadius: 16, backgroundColor: rec.ok ? c.red : c.line, alignItems: 'center', justifyContent: 'center' }}>
          <T s={17} w={600} c={rec.ok ? '#FFFFFF' : c.ink4}>Bağışı Kaydet</T>
        </Tap>
      }
    >
      <View style={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 170, gap: 18 }}>
        <T s={15} lh={1.45} c={c.ink3}>Bağışını kaydet. İlan sahibi onayladığında kaydın “Doğrulanmış bağış” olarak işaretlenir.</T>
        <Card gap={12}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
              <T s={17} w={800} c={c.redtx}>{n.blood}</T>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <T s={16} w={600}>{`${n.forName} için ${n.blood} ihtiyacı`}</T>
              <T s={13} c={c.ink3} lines={1}>{n.hospital}</T>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: c.line, paddingTop: 12 }}>
            <T s={13} c={c.ink3}>{n.district + ' / ' + n.city}</T>
            <T s={13} mono>{n.id}</T>
          </View>
        </Card>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Bağış tarihi</T>
          <Seg h={42} items={['Bugün · 30 Eyl', 'Dün · 29 Eyl'].map((l, i) => ({ label: l, on: rec.day === i, onPress: () => upd({ day: i }) }))} />
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Bağış miktarı</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 14, padding: 6 }}>
            {stepBtn('−', 'Azalt', () => upd({ units: Math.max(1, rec.units - 1) }))}
            <T s={18} w={700}>{rec.units} ünite</T>
            {stepBtn('+', 'Artır', () => upd({ units: Math.min(2, rec.units + 1) }))}
          </View>
          <T s={12} c={c.ink3}>Standart tam kan bağışı 1 ünitedir.</T>
        </View>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Bağış belgesi <T s={14} c={c.ink3}>(opsiyonel)</T></T>
          <Tap onPress={() => upd({ doc: !rec.doc })} scale={1} style={{ minHeight: 56, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: rec.doc ? '#177A4E' : c.line2, backgroundColor: rec.doc ? c.gsoft : c.card, paddingHorizontal: 16, justifyContent: 'center' }}>
            <T s={14} w={500} c={rec.doc ? c.gtx : c.ink2}>{rec.doc ? '✓ bagis-belgesi.jpg eklendi · kaldır' : '+ Belge veya fotoğraf ekle'}</T>
          </Tap>
          <T s={12} lh={1.45} c={c.ink3}>Belge yalnızca ilan sahibinin doğrulaması için kullanılır, profilinde gösterilmez.</T>
        </View>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 4 }}>
          <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.line }}>
            <Pill label="BEYAN" fg={c.ink2} bd={c.line2} ls={0.05} />
            <T s={13} lh={1.45} c={c.ink2} style={{ flex: 1 }}>Senin kaydın. Kanbağ bağışı otomatik olarak doğrulamaz.</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 12 }}>
            <Pill label="✓ DOĞRULANMIŞ" bg={c.gsoft} fg={c.gtx} ls={0.05} />
            <T s={13} lh={1.45} c={c.ink2} style={{ flex: 1 }}>İlan sahibi veya hastane bağışını onayladıktan sonra.</T>
          </View>
        </View>
        <CheckRow on={rec.ok} onPress={() => upd({ ok: !rec.ok })} label="Bu bağışı gerçekten yaptığımı beyan ederim." />
      </View>
    </Screen>
  );
}
