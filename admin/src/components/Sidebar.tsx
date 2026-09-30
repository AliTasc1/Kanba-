import { NAV, type View } from '../data';

interface Props {
  view: View;
  badges: Partial<Record<View, number>>;
  onNav: (v: View) => void;
}

export function Sidebar({ view, badges, onNav }: Props) {
  return (
    <aside style={{ width: 248, flex: 'none', background: '#18181B', color: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 22px' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50% 0 50% 50%', transform: 'rotate(-45deg)', background: '#C4162A' }} />
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.03em' }}>Kanbağ</span>
        <span style={{ font: "600 10px 'JetBrains Mono',monospace", padding: '3px 6px', borderRadius: 4, background: '#2A2A2E', color: '#C9C9CF', marginLeft: 'auto' }}>ADMIN</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(([k, l]) => {
          const on = view === k;
          const badge = badges[k];
          return (
            <a
              key={k}
              href={'#/' + k}
              className="kb-nav"
              aria-current={on ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); onNav(k); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 12px', borderRadius: 10, border: 'none',
                background: on ? '#2A2A2E' : 'transparent', color: on ? '#FFFFFF' : '#C9C9CF', fontSize: 14, fontWeight: on ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', textDecoration: 'none',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: on ? '#C4162A' : '#3F3F46' }} />
              <span style={{ flex: 1 }}>{l}</span>
              {!!badge && (
                <span style={{ minWidth: 22, height: 20, padding: '0 6px', borderRadius: 10, background: '#C4162A', color: '#FFFFFF', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center', boxSizing: 'border-box' }}>{badge}</span>
              )}
            </a>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, background: '#222226' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3A161B', color: '#FF8F9A', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>SA</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Selin Aydın</div>
          <div style={{ fontSize: 12, color: '#A1A1AA' }}>Moderatör · Marmara</div>
        </div>
      </div>
    </aside>
  );
}
