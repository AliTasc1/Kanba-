import React from 'react';
import { View } from 'react-native';
import { ago, canDonateTo, km, unitLabel, type Need, type NeedStatus } from '@shared';
import { useApp, useColors } from '../store';
import type { Palette } from '../theme';
import { Bar, Card, Pill, Pulse, T } from './index';

/** Badge colours and headline per listing status (prototype `ST`). */
export const statusStyle = (s: NeedStatus, c: Palette) =>
  ({
    acil: { l: '● ACİL', bg: c.red, fg: '#FFFFFF', bd: c.red, t: 'ACİL KAN İHTİYACI', tc: c.redtx },
    oncelikli: { l: 'ÖNCELİKLİ', bg: c.asoft, fg: c.atx, bd: c.line, t: 'ÖNCELİKLİ KAN İHTİYACI', tc: c.atx },
    aktif: { l: 'AKTİF', bg: c.fill, fg: c.ink2, bd: c.line, t: 'KAN İHTİYACI', tc: c.ink2 },
    karsilandi: { l: '✓ KARŞILANDI', bg: c.gsoft, fg: c.gtx, bd: c.line, t: 'KARŞILANAN İHTİYAÇ', tc: c.gtx },
    bekliyor: { l: 'DOĞRULAMA BEKLİYOR', bg: c.card, fg: c.ink3, bd: c.line2, t: 'KAN İHTİYACI', tc: c.ink3 },
  })[s];

export function StatusPill({ status, s = 11, px = 8, py = 3 }: { status: NeedStatus; s?: number; px?: number; py?: number }) {
  const c = useColors();
  const st = statusStyle(status, c);
  return <Pill label={st.l} bg={st.bg} fg={st.fg} bd={st.bd} s={s} px={px} py={py} />;
}

export function NeedCard({ n }: { n: Need }) {
  const c = useColors();
  const { openNeed } = useApp();
  const st = statusStyle(n.status, c);
  const open = n.status !== 'karsilandi';
  const ok = canDonateTo(n.blood);
  const act = open && ok && !n.mine && n.status !== 'bekliyor';
  const cTxt = n.mine ? 'Senin ilanın' : !open ? 'Teşekkürler, karşılandı' : ok ? '✓ Kan grubunla uyumlu' : 'Kan grubunla uyumlu değil';
  const cC = n.mine ? c.redtx : !open || ok ? c.gtx : c.ink3;
  return (
    <Card
      onPress={() => openNeed(n.id)}
      accessibilityLabel={`${st.l.replace('● ', '')} ${n.blood} kan ihtiyacı, ${n.hospital}, ${n.district}. ${n.met} / ${n.units} ünite karşılandı.`}
      gap={14}
      style={{ opacity: open ? 1 : 0.8 }}
    >
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: open ? c.soft : c.fill, alignItems: 'center', justifyContent: 'center' }}>
          <T s={20} w={800} ls={-0.02} c={open ? c.redtx : c.ink3}>{n.blood}</T>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
            <Pill label={st.l} bg={st.bg} fg={st.fg} bd={st.bd} />
            {n.verified ? <T s={12} w={600} c={c.gtx}>✓ Doğrulanmış</T> : null}
            <T s={12} c={c.ink4} style={{ marginLeft: 'auto' }}>{ago(n.mins)}</T>
          </View>
          <T s={16} w={600}>{n.blood} Kan İhtiyacı</T>
          <T s={14} c={c.ink2} lines={1}>{n.hospital}</T>
          <T s={13} c={c.ink4}>{n.district + ' / ' + n.city + (n.mine ? '' : ' · ' + km(n.dist))}</T>
        </View>
      </View>
      <View style={{ gap: 7 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T s={13} c={c.ink3}>Gönüllü desteği</T>
          <T s={13} w={600}>{n.met + ' / ' + unitLabel(n.units)}</T>
        </View>
        <Bar pct={(n.met / Math.max(1, n.units)) * 100} color={open ? c.red : '#177A4E'} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <T s={13} w={500} c={cC}>{cTxt}</T>
        <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 12, backgroundColor: act ? c.red : c.fill, justifyContent: 'center' }}>
          <T s={14} w={600} c={act ? '#FFFFFF' : c.ink}>{act ? 'Destek Ol' : 'Detay'}</T>
        </View>
      </View>
    </Card>
  );
}

export function NeedSkeleton() {
  const c = useColors();
  const b = (w: `${number}%`, h: number) => <View style={{ width: w, height: h, borderRadius: h / 2, backgroundColor: c.fill }} />;
  return (
    <Pulse>
      <Card gap={14}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c.fill }} />
          <View style={{ flex: 1, gap: 8, paddingTop: 2 }}>{b('40%', 12)}{b('75%', 14)}{b('55%', 12)}</View>
        </View>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: c.fill }} />
      </Card>
    </Pulse>
  );
}
