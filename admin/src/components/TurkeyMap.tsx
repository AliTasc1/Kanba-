import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { PROVINCE_COORDS } from '@shared/coords';
import { TURKEY_GEOJSON } from '@shared/turkeyOutline';
import { provinceStats } from '@shared/data';

export type MapMetric = 'need' | 'donation';

interface Props {
  metric: MapMetric;
  selected: string;
  onSelect: (province: string) => void;
  height: number;
  theme?: 'light' | 'dark';
}

/** React port of project/kb-map.js (<kb-turkey-map>): Türkiye outline + 81 province dots. */
export function TurkeyMap({ metric, selected, onSelect, height, theme = 'light' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = height;
  const geo = useMemo(() => {
    if (!W) return null;
    const proj = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], TURKEY_GEOJSON);
    const land = geoPath(proj)(TURKEY_GEOJSON) || '';
    const dots = PROVINCE_COORDS.map(([n, la, lo]) => {
      const [x, y] = proj([lo, la]) as [number, number];
      return { n, x, y };
    });
    return { land, dots };
  }, [W, H]);

  const key = metric === 'donation' ? 'donation' : 'active';
  const vals = useMemo(() => PROVINCE_COORDS.map(([n]) => provinceStats(n)[key]), [key]);
  const mx = Math.max(...vals);
  const dark = theme === 'dark';

  const dots = geo
    ? geo.dots.map((d, i) => ({ ...d, t: Math.sqrt(vals[i] / mx) }))
    : [];
  // Selected province is drawn last so its ring sits on top.
  const ordered = [...dots.filter((d) => d.n !== selected), ...dots.filter((d) => d.n === selected)];

  return (
    <div ref={ref} style={{ width: '100%', height: H }}>
      {geo && (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Türkiye il bazlı yoğunluk haritası" style={{ display: 'block' }}>
          <path d={geo.land} strokeWidth={1} fill={dark ? '#232327' : '#EDEDEF'} stroke={dark ? '#3A3A40' : '#DADADD'} />
          {ordered.map((d) => {
            const on = d.n === selected;
            return (
              <g key={d.n} style={{ cursor: 'pointer' }} onClick={() => onSelect(d.n)}>
                <circle cx={d.x} cy={d.y} r={9} fill="transparent" />
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={(2.4 + d.t * 8.5).toFixed(1)}
                  fill={dark ? '#E0404F' : '#C4162A'}
                  fillOpacity={(0.28 + 0.72 * d.t).toFixed(2)}
                  stroke={on ? (dark ? '#F4F4F5' : '#18181B') : dark ? '#18181B' : '#FFFFFF'}
                  strokeWidth={on ? 2.5 : 1}
                />
                <title>{d.n}</title>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
