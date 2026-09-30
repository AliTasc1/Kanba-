import { ARCHIVED_NEED, RST, ST, type AdminNeed, type Report } from '../data';
import { SectionLabel } from '../components/ui';

interface Props {
  reports: Report[];
  index: number;
  needs: AdminNeed[];
  onSelect: (i: number) => void;
  onOpenNeed: (id: string) => void;
  onSuspend: () => void;
  onWarn: () => void;
  onReject: () => void;
}

const btn = { height: 42, padding: '0 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' } as const;
const ghost = { ...btn, border: '1px solid #E4E4E7', background: '#FFFFFF', color: '#18181B' };

export function ReportsView({ reports, index, needs, onSelect, onOpenNeed, onSuspend, onWarn, onReject }: Props) {
  const r0 = reports[index];
  const rn = needs.find((n) => n.id === r0.need) || ARCHIVED_NEED;
  const [sbg, sfg] = RST[r0.st];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '420px minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 18, overflow: 'hidden' }}>
        {reports.map((r, i) => {
          const [bg, fg] = RST[r.st];
          const on = i === index;
          return (
            <button key={r.id} onClick={() => onSelect(i)} aria-pressed={on} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', padding: '16px 20px', border: 'none', borderBottom: '1px solid #F1F1F3', background: on ? '#FAFAFA' : '#FFFFFF', textAlign: 'left', cursor: 'pointer', color: '#18181B', borderLeft: `3px solid ${on ? '#C4162A' : 'transparent'}` }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>{r.id} · {r.need}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: bg, color: fg }}>{r.st}</span>
              </span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{r.reason}</span>
              <span style={{ fontSize: 13, color: '#52525B' }}>{r.count} bildirim · {r.time}</span>
            </button>
          );
        })}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#52525B' }}>{r0.id}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{r0.reason}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: sbg, color: sfg }}>{r0.st}</span>
        </div>
        <div style={{ background: '#F6F6F7', borderRadius: 14, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#FCEEEF', color: '#A01223', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 800 }}>{rn.blood}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{rn.hospital}</div>
            <div style={{ fontSize: 13, color: '#52525B' }}>{r0.need} · {rn.district} / {rn.city} · {(ST[rn.status] || ST.aktif)[0]}</div>
          </div>
          <button onClick={() => onOpenNeed(r0.need)} style={{ height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E4E4E7', background: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#18181B' }}>İlanı aç</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>BİLDİRİM NEDENLERİ</SectionLabel>
          {r0.reasons.map(([l, n]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid #F1F1F3' }}>
              <span>{l}</span>
              <b>{n}</b>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, color: '#3F3F46', lineHeight: 1.5, background: '#FAFAFA', border: '1px solid #F1F1F3', borderRadius: 12, padding: '12px 14px' }}>{r0.note}</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={onSuspend} style={{ ...btn, border: 'none', background: '#C4162A', color: '#FFFFFF' }}>İlanı askıya al</button>
          <button onClick={onWarn} style={ghost}>İlan sahibini uyar</button>
          <button onClick={onReject} style={ghost}>Şikayeti reddet</button>
        </div>
      </div>
    </div>
  );
}
