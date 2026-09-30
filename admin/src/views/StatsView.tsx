import { MONTHLY_DONATIONS, MONTHS, nf, PROVINCES, provinceStats, TOTALS } from '@shared/data';
import { chartPath, DONUT, MONTHLY_NEEDS } from '../data';
import { BarList, Card, CardTitle } from '../components/ui';
import { topNeedProvinces } from './Dashboard';

const STAT_KPIS: [string, string][] = [
  ['Toplam kullanıcı', nf(Math.round(TOTALS.vol * 1.6))],
  ['Aktif kullanıcı (30 gün)', nf(TOTALS.vol)],
  ['Toplam bağışçı', nf(Math.round(TOTALS.don * 0.62))],
  ['Toplam ihtiyaç', nf(Math.round(TOTALS.met * 1.29))],
  ['Karşılanan ihtiyaç', nf(TOTALS.met)],
  ['Karşılanma oranı', '%77'],
  ['Toplam ünite', nf(Math.round(TOTALS.don * 1.03))],
  ['Ortalama cevap süresi', '2 sa 14 dk'],
];

const M_LINE = chartPath(MONTHLY_DONATIONS, 520, 180, 6);
const M_AREA = M_LINE + ' L516 180 L6 180 Z';
const N_MAX = Math.max(...MONTHLY_NEEDS);

const C = 2 * Math.PI * 42;
const DONUT_SEGS = (() => {
  let acc = 0;
  return DONUT.map(([l, p, c]) => {
    const len = (C * p) / 100;
    const o = { l, p: '%' + p, c, da: len.toFixed(2) + ' ' + (C - len).toFixed(2), off: (-acc).toFixed(2) };
    acc += len;
    return o;
  });
})();

const topDonationProvinces = () => {
  const td = PROVINCES.map((n) => ({ n, ...provinceStats(n) })).sort((a, b) => b.donation - a.donation).slice(0, 6);
  return td.map((p) => ({ n: p.n, v: nf(p.donation), w: Math.round((p.donation / td[0].donation) * 100) + '%' }));
};

const MonthAxis = ({ gap }: { gap?: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap, fontSize: 11, color: '#71717A', textAlign: 'center' }}>
    {MONTHS.map((m) => <span key={m}>{m}</span>)}
  </div>
);

export function StatsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14 }}>
        {STAT_KPIS.map(([l, v]) => (
          <div key={l} style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, color: '#52525B', fontWeight: 500 }}>{l}</span>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CardTitle>Aylık bağış trendi</CardTitle>
          <svg viewBox="0 0 520 180" width="100%" height="190" style={{ display: 'block' }} role="img" aria-label="Aylık bağış trendi">
            <path d={M_AREA} fill="#FCEEEF" />
            <path d={M_LINE} fill="none" stroke="#C4162A" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
          <MonthAxis />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CardTitle>Aylık ihtiyaç trendi</CardTitle>
          <div style={{ height: 190, display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 8, alignItems: 'end' }}>
            {MONTHLY_NEEDS.map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 10, color: '#52525B' }}>{v}</span>
                <div style={{ width: '100%', height: Math.round((v / N_MAX) * 160), background: '#18181B', borderRadius: '6px 6px 2px 2px' }} />
              </div>
            ))}
          </div>
          <MonthAxis gap={8} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CardTitle>En fazla ihtiyaç bulunan iller</CardTitle>
          <BarList items={topNeedProvinces()} color="#18181B" />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CardTitle>En fazla bağış yapılan iller</CardTitle>
          <BarList items={topDonationProvinces()} color="#C4162A" valueWidth={48} />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CardTitle>Kan grubu dağılımı (ihtiyaç)</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <svg viewBox="0 0 120 120" width="140" height="140" style={{ flex: 'none' }} role="img" aria-label="Kan grubu dağılımı">
              <g transform="rotate(-90 60 60)">
                {DONUT_SEGS.map((d) => (
                  <circle key={d.l} cx="60" cy="60" r="42" fill="none" strokeWidth="16" style={{ stroke: d.c, strokeDasharray: d.da, strokeDashoffset: d.off }} />
                ))}
              </g>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {DONUT_SEGS.map((d) => (
                <div key={d.l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: d.c }} />
                  <span style={{ flex: 1 }}>{d.l}</span>
                  <b>{d.p}</b>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
