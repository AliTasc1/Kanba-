interface Props {
  title: string;
  subtitle: string;
  q: string;
  onQ: (q: string) => void;
  onExport: () => void;
  live: 'connecting' | 'online' | 'offline';
}

const LIVE = {
  online: ['Canlı senkron', '#177A4E', '#E4F2EA'],
  connecting: ['Bağlanıyor…', '#6B3F00', '#FBF0DC'],
  offline: ['Sunucu yok · yerel veri', '#A01223', '#FCEEEF'],
} as const;

export function Topbar({ title, subtitle, q, onQ, onExport, live }: Props) {
  const [label, fg, bg] = LIVE[live];
  return (
    <header style={{ height: 72, flex: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px', borderBottom: '1px solid #E4E4E7', background: '#FFFFFF' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexShrink: 1 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>{title}</h1>
        <div style={{ fontSize: 13, color: '#52525B' }}>{subtitle}</div>
      </div>
      <label style={{ marginLeft: 'auto', height: 40, width: 260, flexShrink: 0, borderRadius: 10, border: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#FAFAFA' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20" />
        </svg>
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="İlan ID, hastane, il veya kullanıcı ara"
          aria-label="Ara"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#18181B', minWidth: 0 }}
        />
      </label>
      <div role="status" title="Mobil uygulama ile gerçek zamanlı bağlantı (sync server, port 4000)" style={{ height: 40, padding: '0 14px', borderRadius: 10, background: bg, color: fg, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: fg }} />{label}
      </div>
      <div style={{ height: 40, padding: '0 14px', borderRadius: 10, border: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', fontSize: 14, color: '#3F3F46', whiteSpace: 'nowrap', flexShrink: 0 }}>30 Eylül 2026</div>
      <button onClick={onExport} style={{ height: 40, padding: '0 16px', borderRadius: 10, border: 'none', background: '#18181B', color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>Dışa aktar</button>
    </header>
  );
}
