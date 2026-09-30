import React, { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { BLOODS, DONOR, NEEDS, REPORT_REASONS, ago, canDonateTo, km, longBlood } from '@shared';
import { nav, useApp } from '../../../store';
import { Bar, Btn, Card, Icon, KVRows, LockNote, PATHS, Pill, Radio, Screen, Sheet, T, Tap, type KV } from '../../../ui';
import { statusStyle } from '../../../ui/need';

export default function NeedDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, allNeeds, dbNeeds, toast, committed: isCommitted, commit: commitTo, report } = useApp();
  const found = allNeeds.find((x) => x.id === id);
  const n = found || allNeeds[0] || NEEDS[1];
  const [sheet, setSheet] = useState<null | 'confirm' | 'report'>(null);
  const [reason, setReason] = useState('');

  const open = n.status !== 'karsilandi';
  const ok = canDonateTo(n.blood);
  const committed = isCommitted(n.id);
  const sd = statusStyle(n.status, c);
  const going = n.going;
  const pct = Math.round((n.met / Math.max(1, n.units)) * 100);
  const donorsFor = BLOODS.filter((b) => DONOR[b].includes(n.blood)).join(', ');

  const compat = n.mine
    ? { i: '●', t: 'Bu senin ilanın', s: n.status === 'bekliyor' ? 'Doğrulama tamamlanınca yayına alınır ve uyumlu gönüllülere bildirilir.' : 'Bağış planı yapan gönüllüler burada görünür.', bg: c.soft, fg: c.redtx }
    : !open
      ? { i: '✓', t: 'Tüm üniteler karşılandı', s: 'Bu ilana destek olan herkese teşekkürler.', bg: c.gsoft, fg: c.gtx }
      : ok
        ? { i: '✓', t: 'Kan grubun (0 Rh+) bu ihtiyaç için uygun', s: 'Son bağışının üzerinden 104 gün geçti; bağış yapabilirsin.', bg: c.gsoft, fg: c.gtx }
        : { i: 'i', t: 'Kan grubun bu ihtiyaçla uyumlu değil', s: `${longBlood(n.blood)} için yalnızca ${donorsFor} grupları bağış yapabilir. İlanı çevrenle paylaşabilirsin.`, bg: c.fill, fg: c.ink2 };

  const rows: KV[] = [
    ['Hasta / ihtiyaç sahibi', n.forName + ' için'], ['Hastane', n.hospital], ['Servis / bölüm', n.dept],
    ['İlçe / İl', n.district + ' / ' + n.city], ['Mesafe', n.mine ? '—' : km(n.dist) + ' uzaklıkta'],
    ['Son ihtiyaç zamanı', n.deadline], ['İlan oluşturulma', ago(n.mins)], ['İlan ID', n.id, true],
  ];

  const share = () => toast('Paylaşım bağlantısı kopyalandı. Kişisel bilgiler paylaşılmaz.');
  type BarSpec = { l: string; on: () => void; kind: 'primary' | 'outline' | 'fill'; note?: string; noteC?: string; muted?: boolean };
  let bar: BarSpec;
  if (n.mine) bar = { l: 'İlanı Paylaş', on: share, kind: 'outline', note: 'Senin ilanın · telefon numaran gizli', noteC: c.ink3 };
  else if (!open) bar = { l: 'Benzer ihtiyaçları gör', on: () => nav.tab('needs'), kind: 'outline', note: 'Bu ihtiyaç karşılandı.', noteC: c.gtx };
  else if (n.status === 'bekliyor') bar = { l: 'Doğrulama bekleniyor', on: () => toast('İlan doğrulandıktan sonra bağış planı oluşturabilirsin.'), kind: 'fill', muted: true, note: 'Bu ilan henüz doğrulanmadı.', noteC: c.ink3 };
  else if (!ok) bar = { l: 'İlanı Paylaş', on: share, kind: 'outline', note: 'Kan grubun (0 Rh+) bu ihtiyaçla uyumlu değil.', noteC: c.ink3 };
  else if (committed) bar = { l: 'Bağış Yaptım', on: () => nav.go(`/need/${n.id}/record`), kind: 'primary', note: '✓ Bağış planın ilan sahibine iletildi.', noteC: c.gtx };
  else bar = { l: 'Kan Bağışında Bulunacağım', on: () => setSheet('confirm'), kind: 'primary' };

  const commit = () => {
    commitTo(n.id);
    setSheet(null);
    toast('Planın ilan sahibine iletildi. Hastaneye gittiğinde İlan ID’sini belirt.');
  };
  const submitReport = () => {
    if (!reason) return toast('Bir bildirim nedeni seç.');
    report(n.id, reason);
    setSheet(null);
    setReason('');
    toast('Bildirimin alındı. İlan incelemeye alındı.');
  };

  // Suspended, cancelled or expired (e.g. by a moderator while the user was looking at it).
  if (!found && dbNeeds.some((x) => x.id === id)) return <Redirect href="/error/inactive" />;

  return (
    <Screen
      title="İhtiyaç Detayı"
      right={n.mine ? undefined : { label: '⋯', onPress: () => setSheet('report') }}
      barBg={c.bar}
      bar={
        <View style={{ gap: 10 }}>
          {bar.note ? <T s={13} w={500} c={bar.noteC} center>{bar.note}</T> : null}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tap onPress={share} accessibilityLabel="İlanı paylaş" style={{ width: 56, height: 56, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={PATHS.share} size={20} color={c.ink} />
            </Tap>
            {bar.muted ? (
              <Tap onPress={bar.on} style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
                <T s={17} w={600} c={c.ink4}>{bar.l}</T>
              </Tap>
            ) : (
              <Btn label={bar.l} onPress={bar.on} kind={bar.kind} flex />
            )}
          </View>
        </View>
      }
      overlay={
        <>
          <Sheet open={sheet === 'confirm'} onClose={() => setSheet(null)}>
            <View style={{ paddingTop: 8, paddingHorizontal: 24, paddingBottom: 34, gap: 18 }}>
              <View style={{ gap: 8 }}>
                <T s={22} w={700} ls={-0.015}>Bu ihtiyaç için gerçekten bağış yapmayı planlıyor musun?</T>
                <T s={15} lh={1.45} c={c.ink3}>Onayladığında ilan sahibine bir gönüllünün yolda olduğu bildirilir. Planın değişirse geri alabilirsin.</T>
              </View>
              <KVRows bg={c.bg} r={18} py={12} bordered={false} rows={[['İhtiyaç', `${longBlood(n.blood)} · ${n.forName} için`], ['Hastane', n.hospital], ['Konum', n.district + ' / ' + n.city], ['Son zaman', n.deadline], ['Senin bağışın', '1 ünite tam kan']]} />
              <T s={13} lh={1.45} c={c.ink2}>Gitmeden önce bağış koşullarını hatırla: 18–65 yaş, en az 50 kg, son tam kan bağışından bu yana erkeklerde 90, kadınlarda 120 gün.</T>
              <View style={{ gap: 10 }}>
                <Btn label="Evet, bağış yapacağım" onPress={commit} />
                <Btn label="Vazgeç" kind="fill" h={52} s={16} onPress={() => setSheet(null)} />
              </View>
            </View>
          </Sheet>
          <Sheet open={sheet === 'report'} onClose={() => setSheet(null)}>
            <View style={{ paddingTop: 8, paddingHorizontal: 24, paddingBottom: 34, gap: 14 }}>
              <View style={{ gap: 6 }}>
                <T s={22} w={700}>Bu ilanı bildir</T>
                <T s={14} lh={1.45} c={c.ink3}>Bildirimin anonimdir. İlan, inceleme ekibi tarafından kontrol edilir.</T>
              </View>
              <View accessibilityRole="radiogroup" accessibilityLabel="Bildirim nedeni">
                {REPORT_REASONS.map((l) => (
                  <Tap key={l} onPress={() => setReason(l)} accessibilityRole="radio" accessibilityState={{ checked: reason === l }} scale={1} dim={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, borderBottomWidth: 1, borderBottomColor: c.line }}>
                    <Radio on={reason === l} />
                    <T s={15}>{l}</T>
                  </Tap>
                ))}
              </View>
              <Tap onPress={submitReport} style={{ height: 56, borderRadius: 16, backgroundColor: reason ? c.sel : c.fill, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                <T s={17} w={600} c={reason ? c.selfg : c.ink4}>Bildir</T>
              </Tap>
            </View>
          </Sheet>
        </>
      }
    >
      <View style={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 190, gap: 14 }}>
        <Card r={24} pad={20} gap={18}>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Pill label={sd.l} bg={sd.bg} fg={sd.fg} bd={sd.bd} s={12} px={10} py={4} />
            {n.verified ? <Pill label="✓ Doğrulanmış İhtiyaç" bg={c.gsoft} fg={c.gtx} s={12} w={600} ls={0} px={10} py={4} /> : null}
          </View>
          <View style={{ gap: 6 }}>
            <T s={12} w={700} ls={0.08} c={sd.tc}>{sd.t}</T>
            <T s={64} w={800} ls={-0.04} lh={1.05}>{longBlood(n.blood)}</T>
            <T s={15} c={c.ink3}>{`${n.forName} için · ${n.cond}`}</T>
          </View>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <T s={28} w={700}>{n.met}<T s={16} c={c.ink3}>{` / ${n.units} ünite karşılandı`}</T></T>
              <T s={15} w={600}>%{pct}</T>
            </View>
            <Bar pct={pct} color={open ? c.red : '#177A4E'} h={10} />
            <T s={13} c={c.ink3}>{open ? `${Math.max(0, n.units - n.met)} ünite daha gerekli · ${going} gönüllü bağışa gidiyor` : 'Tüm üniteler karşılandı'}</T>
          </View>
        </Card>
        <View style={{ borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: compat.bg }}>
          <T s={16} w={700} c={compat.fg} style={{ width: 18 }}>{compat.i}</T>
          <View style={{ gap: 3, flex: 1 }}>
            <T s={15} w={600} c={compat.fg}>{compat.t}</T>
            <T s={13} lh={1.45} c={compat.fg}>{compat.s}</T>
          </View>
        </View>
        <KVRows rows={rows} />
        <LockNote r={18} text="Hasta adı ve iletişim bilgileri gizlidir. Bağış planını onayladığında, hastanedeki kayıt için gereken bilgiler ilan sahibi tarafından yalnızca seninle paylaşılır." />
        <Card gap={12}>
          <T s={15} w={600}>Hastanede nasıl ilerlenir?</T>
          {['Hastanenin kan merkezine veya bağış birimine başvur.', `İlan ID’sini (${n.id}) ve ilan sahibinin paylaştığı hasta bilgisini ilet.`, 'Bağıştan sonra uygulamada kaydını oluştur.'].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
                <T s={12} w={700} c={c.redtx}>{i + 1}</T>
              </View>
              <T s={14} lh={1.45} c={c.ink2} style={{ flex: 1 }}>{t}</T>
            </View>
          ))}
        </Card>
        <Tap onPress={() => setSheet('report')} scale={1} dim={0.6} style={{ alignSelf: 'center', height: 44, justifyContent: 'center' }}>
          <T s={14} c={c.ink3} underline>Bu ilanı bildir</T>
        </Tap>
      </View>
    </Screen>
  );
}
