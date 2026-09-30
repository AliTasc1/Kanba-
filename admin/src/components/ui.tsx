import type { CSSProperties, ReactNode } from 'react';

/** White rounded panel used throughout the dashboard. */
export function Card({ children, style, pad = 20 }: { children: ReactNode; style?: CSSProperties; pad?: number | string }) {
  return <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 18, padding: pad, ...style }}>{children}</div>;
}

export const CardTitle = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 16, fontWeight: 700 }}>{children}</div>;

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 13, fontWeight: 700, color: '#52525B', letterSpacing: '.04em' }}>{children}</div>
);

/** Horizontal bar list ("En fazla aktif ihtiyaç" etc.). */
export function BarList({ items, color, valueWidth = 40 }: { items: { n: string; v: string; w: string }[]; color: string; valueWidth?: number }) {
  return (
    <>
      {items.map((p) => (
        <div key={p.n} style={{ display: 'grid', gridTemplateColumns: `100px 1fr ${valueWidth}px`, alignItems: 'center', gap: 10, fontSize: 13 }}>
          <span>{p.n}</span>
          <div style={{ height: 10, borderRadius: 5, background: '#F1F1F3', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: p.w, background: color, borderRadius: 5 }} />
          </div>
          <span style={{ textAlign: 'right', fontWeight: 600 }}>{p.v}</span>
        </div>
      ))}
    </>
  );
}
