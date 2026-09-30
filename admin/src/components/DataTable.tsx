import type { ReactNode } from 'react';

export type Cell =
  | { kind: 'text'; v: ReactNode; fw?: number; mono?: boolean; fg?: string }
  | { kind: 'badge'; v: ReactNode; bg: string; fg: string; bd?: string };

export const tx = (v: ReactNode, o: { fw?: number; mono?: boolean; fg?: string } = {}): Cell => ({ kind: 'text', v, ...o });
export const badge = (v: ReactNode, bg: string, fg: string, bd?: string): Cell => ({ kind: 'badge', v, bg, fg, bd });
/** Blood-group pill. */
export const bl = (b: string) => badge(b, '#FCEEEF', '#A01223');

export interface Row {
  key: string;
  cells: Cell[];
  onClick?: () => void;
  selected?: boolean;
}

interface Props {
  cols: string;
  heads: string[];
  rows: Row[];
}

export function Pill({ children, bg, fg, bd }: { children: ReactNode; bg: string; fg: string; bd?: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '4px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: bg, color: fg, border: `1px solid ${bd || bg}` }}>{children}</span>
  );
}

export function DataTable({ cols, heads, rows }: Props) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 18, overflow: 'hidden' }} role="table">
      <div role="row" style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '12px 20px', background: '#FAFAFA', borderBottom: '1px solid #E4E4E7', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', color: '#52525B', textTransform: 'uppercase' }}>
        {heads.map((h) => <span role="columnheader" key={h}>{h}</span>)}
      </div>
      {rows.map((r) => (
        <div
          key={r.key}
          role="row"
          className="kb-row"
          tabIndex={r.onClick ? 0 : undefined}
          onClick={r.onClick}
          onKeyDown={r.onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r.onClick!(); } } : undefined}
          style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, alignItems: 'center', padding: '0 20px', minHeight: 52, borderBottom: '1px solid #F1F1F3', fontSize: 14, cursor: r.onClick ? 'pointer' : 'default', background: r.selected ? '#FAFAFA' : '#FFFFFF' }}
        >
          {r.cells.map((c, i) => (
            <div
              role="cell"
              key={i}
              style={{
                minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                fontWeight: c.kind === 'text' ? c.fw ?? 400 : 400,
                fontFamily: c.kind === 'text' && c.mono ? "'JetBrains Mono',monospace" : 'inherit',
                color: c.kind === 'text' ? c.fg ?? '#18181B' : '#18181B',
              }}
            >
              {c.kind === 'badge' ? <Pill bg={c.bg} fg={c.fg} bd={c.bd}>{c.v}</Pill> : c.v}
            </div>
          ))}
        </div>
      ))}
      {!rows.length && <div style={{ padding: 32, textAlign: 'center', color: '#52525B', fontSize: 14 }}>Bu filtreye uygun kayıt yok.</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', fontSize: 13, color: '#52525B' }}>
        <span>{rows.length} kayıt</span>
        <span>Sayfa 1 / 1</span>
      </div>
    </div>
  );
}

/** Tabs + optional note + table, the shared layout of every list view. */
export function TableLayout({ tabs, note, children }: { tabs?: ReactNode; note?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {tabs}
      {note && <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#3F3F46' }}>{note}</div>}
      {children}
    </div>
  );
}
