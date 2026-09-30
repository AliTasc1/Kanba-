import { nf, PROVINCES, provinceStats } from '@shared/data';
import { agoTxt, chartPath, DAILY_DONATIONS, DAILY_NEEDS, type AdminNeed, type NeedTab, type View } from '../data';
import { BarList, Card, CardTitle } from '../components/ui';
import { TurkeyMap, type MapMetric } from '../components/TurkeyMap';

interface Props {
  needs: AdminNeed[];
  openReports: number;
  mapMetric: MapMetric;
  mapSel: string;
  onMapMetric: (m: MapMetric) => void;
  onMapSel: (p: string) => void;
  go: (view: View, opts?: { tab?: NeedTab; sel?: string }) => void;
  onVerify: (id: string) => void;
}

/** Top provinces by active needs (shared by dashboard + statistics). */
export const topNeedProvinces = () => {
  const tn = PROVINCES.map((n) => ({ n, ...provinceStats(n) })).sort((a, b) => b.active - a.active).slice(0, 6);
  return tn.map((p) => ({ n: p.n, v: nf(p.active), w: Math.round((p.active / tn[0].active) * 100) + '%' }));
};

const MN = 0, MX = 140;
const GRID = [0, 35, 70, 105, 140].map((v) => {
  const y = 220 - 12 - ((v - MN) / (MX - MN)) * (220 - 28);
  return { y: y.toFixed(1), ty: (y + 4).toFixed(1), l: String(v) };
});
const D30 = chartPath(DAILY_DONATIONS, 640, 220, 36, MN, MX);
const N30 = chartPath(DAILY_NEEDS, 640, 220, 36, MN, MX);

export function Dashboard({ needs, openReports, mapMetric, mapSel, onMapMetric, onMapSel, go, onVerify }: Props) {
  const pending = needs.filter((n) => n.status === 'bekliyor');
  const acil = needs.filter((n) => n.status === 'aktif' || n.status === 'kismen').length;
  const kpis: { l: string; v: string; d: string; dc: string; c: string; on: () => void }[] = [
    { l: 'Bugünkü ihtiyaçlar', v: '38', d: '+6 dünden', dc: '#135E3D', c: '#18181B', on: () => go('needs') },
    { l: 'Bugünkü bağışlar', v: '112', d: '+14 dünden', dc: '#135E3D', c: '#18181B', on: () => go('dons') },
    { l: 'Aktif acil ilanlar', v: String(58 + acil), d: '81 ilde', dc: '#52525B', c: '#C4162A', on: () => go('needs', { tab: 'aktif' }) },
    { l: 'Karşılanan (bugün)', v: '29', d: '%76 karşılanma', dc: '#135E3D', c: '#18181B', on: () => go('needs', { tab: 'karsilandi' }) },
    { l: 'Doğrulama bekleyen', v: String(pending.length), d: 'ort. bekleme 9 dk', dc: '#6B3F00', c: '#18181B', on: () => go('verify') },
    { l: 'Açık şikayetler', v: String(openReports), d: '1 yüksek öncelik', dc: '#A01223', c: '#18181B', on: () => go('reports') },
  ];
  const ms = provinceStats(mapSel);
  const smallBtn = { height: 32, padding: '0 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 14 }}>
        {kpis.map((k) => (
          <button key={k.l} onClick={k.on} className="kb-kpi" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', color: '#18181B', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, color: '#52525B', fontWeight: 500 }}>{k.l}</span>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.03em', color: k.c }}>{k.v}</span>
            <span style={{ fontSize: 12, color: k.dc, fontWeight: 600 }}>{k.d}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <CardTitle>Son 30 gün</CardTitle>
              <div style={{ fontSize: 13, color: '#52525B' }}>Günlük yeni ihtiyaç ve bağış sayısı</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 3, borderRadius: 2, background: '#C4162A' }} />Bağış</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 3, borderRadius: 2, background: '#18181B' }} />İhtiyaç</span>
            </div>
          </div>
          <svg viewBox="0 0 640 220" width="100%" height="240" style={{ display: 'block' }} role="img" aria-label="Son 30 gün bağış ve ihtiyaç grafiği">
            {GRID.map((g) => (
              <g key={g.l}>
                <line x1="36" x2="640" y1={g.y} y2={g.y} stroke="#EDEDEF" strokeDasharray="3 5" />
                <text x="0" y={g.ty} fontSize="11" fill="#71717A">{g.l}</text>
              </g>
            ))}
            <path d={D30} fill="none" stroke="#C4162A" strokeWidth="2.5" strokeLinejoin="round" />
            <path d={N30} fill="none" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717A', paddingLeft: 36 }}>
            <span>1 Eyl</span><span>8 Eyl</span><span>15 Eyl</span><span>22 Eyl</span><span>30 Eyl</span>
          </div>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>İl bazlı yoğunluk</CardTitle>
            <div role="tablist" style={{ display: 'flex', background: '#F1F1F3', borderRadius: 10, padding: 3, gap: 2 }}>
              {([['need', 'İhtiyaç'], ['donation', 'Bağış']] as [MapMetric, string][]).map(([k, l]) => {
                const on = mapMetric === k;
                return (
                  <button key={k} role="tab" aria-selected={on} onClick={() => onMapMetric(k)} style={{ height: 30, padding: '0 10px', border: 'none', borderRadius: 8, background: on ? '#FFFFFF' : 'transparent', boxShadow: on ? '0 1px 3px rgba(0,0,0,.12)' : 'none', fontSize: 12, fontWeight: 600, color: '#18181B', cursor: 'pointer' }}>{l}</button>
                );
              })}
            </div>
          </div>
          <TurkeyMap metric={mapMetric} selected={mapSel} onSelect={onMapSel} height={200} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F6F6F7', borderRadius: 12, padding: '10px 14px' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{mapSel}</span>
            <span style={{ fontSize: 13, color: '#52525B' }}>{`${nf(ms.active)} aktif · ${nf(ms.donation)} bağış · ${nf(ms.vol)} gönüllü`}</span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20 }}>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <CardTitle>Doğrulama bekleyen ilanlar</CardTitle>
            <button onClick={() => go('verify')} style={{ border: 'none', background: 'none', fontSize: 14, fontWeight: 600, color: '#C4162A', cursor: 'pointer' }}>Tümünü gör ›</button>
          </div>
          {pending.slice(0, 4).map((p) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '120px 52px minmax(0,1fr) 90px 180px', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid #F1F1F3', fontSize: 14 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{p.id}</span>
              <span style={{ height: 26, borderRadius: 8, background: '#FCEEEF', color: '#A01223', fontWeight: 800, display: 'grid', placeItems: 'center', fontSize: 13 }}>{p.blood}</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><b style={{ fontWeight: 600 }}>{p.hospital}</b> · {p.district} / {p.city}</span>
              <span style={{ color: '#52525B', fontSize: 13 }}>{agoTxt(p.mins)}</span>
              <span style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => onVerify(p.id)} style={{ ...smallBtn, border: 'none', background: '#177A4E', color: '#FFFFFF' }}>Doğrula</button>
                <button onClick={() => go('verify', { sel: p.id })} style={{ ...smallBtn, border: '1px solid #E4E4E7', background: '#FFFFFF', color: '#18181B' }}>İncele</button>
              </span>
            </div>
          ))}
          {!pending.length && <div style={{ padding: '24px 20px', borderTop: '1px solid #F1F1F3', color: '#52525B', fontSize: 14 }}>Doğrulama bekleyen ilan yok.</div>}
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CardTitle>En fazla aktif ihtiyaç</CardTitle>
          <BarList items={topNeedProvinces()} color="#C4162A" />
        </Card>
      </div>
    </div>
  );
}
