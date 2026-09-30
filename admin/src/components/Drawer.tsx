import { useEffect } from 'react';
import { DRAWER_ACTIONS, ST, type AdminNeed, type AdminStatus } from '../data';
import { SectionLabel } from './ui';

interface Props {
  need: AdminNeed;
  onClose: () => void;
  onAction: (to: AdminStatus, label: string) => void;
  onBlocked: () => void;
}

/** Right-side "İlan yönetimi" drawer for a need. */
export function Drawer({ need, onClose, onAction, onBlocked }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const [sl, sbg, sfg, sbd] = ST[need.status];
  const rows: [string, string][] = [
    ['Hastane', need.hospital],
    ['İl / İlçe', need.district + ' / ' + need.city],
    ['İlan sahibi', need.owner + ' · tel. SMS doğrulandı'],
    ['Oluşturma', need.created],
    ['Şikayet', need.reports ? need.reports + ' bildirim' : 'Yok'],
    ['Hasta bilgisi', 'Baş harfler · sağlık bilgisi yok'],
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,16,.3)', animation: 'kbFade .2s', zIndex: 10 }} />
      <div role="dialog" aria-modal="true" aria-label={'İlan yönetimi · ' + need.id} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 460, background: '#FFFFFF', boxShadow: '-20px 0 40px rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column', animation: 'kbIn .22s ease-out', zIndex: 11 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F1F1F3' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#52525B' }}>{need.id}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>İlan yönetimi</div>
          </div>
          <button onClick={onClose} aria-label="Kapat" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#F1F1F3', fontSize: 20, cursor: 'pointer', color: '#18181B' }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FCEEEF', color: '#A01223', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800, flex: 'none' }}>{need.blood}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: sbg, color: sfg, border: `1px solid ${sbd}` }}>{sl}</span>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>{need.met} / {need.units} ünite karşılandı</div>
            </div>
          </div>
          <div style={{ border: '1px solid #F1F1F3', borderRadius: 14, padding: '2px 16px' }}>
            {rows.map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: `1px solid ${i === rows.length - 1 ? 'transparent' : '#F1F1F3'}`, fontSize: 14 }}>
                <span style={{ color: '#52525B' }}>{k}</span>
                <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel>İŞLEMLER</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DRAWER_ACTIONS.map(([l, to, lab, allowed, col]) => {
                const ok = allowed.includes(need.status);
                const primary = ok && col;
                return (
                  <button
                    key={l}
                    aria-disabled={!ok}
                    onClick={() => (ok ? onAction(to, lab) : onBlocked())}
                    style={{
                      height: 42, borderRadius: 10, border: `1px solid ${primary ? col : '#E4E4E7'}`, background: primary ? col : '#FFFFFF',
                      color: primary ? '#FFFFFF' : l === 'Reddet' || l === 'İptal et' ? '#A01223' : '#18181B',
                      fontSize: 14, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.4,
                    }}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionLabel>İŞLEM GEÇMİŞİ</SectionLabel>
            {need.hist.map((h, i, a) => (
              <div key={a.length - i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10, paddingTop: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#C4162A' : '#D4D4D8', flex: 'none' }} />
                  <span style={{ width: 2, flex: 1, background: i === a.length - 1 ? 'transparent' : '#E4E4E7' }} />
                </div>
                <div style={{ paddingBottom: 14, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{h.a}</div>
                  <div style={{ fontSize: 12, color: '#52525B' }}>{h.who} · {h.t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
