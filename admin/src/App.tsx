import { useCallback, useEffect, useRef, useState } from 'react';
import {
  INITIAL_NEEDS, INITIAL_REPORTS, LATER, MOD, NOW_STAMP, TITLES,
  type AdminNeed, type AdminStatus, type NeedTab, type Report, type View,
} from './data';
import { useHashRoute } from './route';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Drawer } from './components/Drawer';
import { Toast } from './components/Toast';
import type { MapMetric } from './components/TurkeyMap';
import { Dashboard } from './views/Dashboard';
import { NeedsView } from './views/NeedsView';
import { UsersView } from './views/UsersView';
import { DonationsView } from './views/DonationsView';
import { PaymentsView } from './views/PaymentsView';
import { CitiesView } from './views/CitiesView';
import { StatsView } from './views/StatsView';
import { ReportsView } from './views/ReportsView';
import { LaterView } from './views/LaterView';

export default function App() {
  const { route, go } = useHashRoute();
  const { view, sel, tab } = route;

  const [needs, setNeeds] = useState<AdminNeed[]>(INITIAL_NEEDS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [lastRep, setLastRep] = useState(0);
  const [q, setQ] = useState('');
  const [mapMetric, setMapMetric] = useState<MapMetric>('need');
  const [mapSel, setMapSel] = useState('Kocaeli');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2400);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /** Apply a moderation action to a need: change status, prepend history, toast. */
  const act = useCallback((id: string, status: AdminStatus, label: string, extra?: Partial<AdminNeed>) => {
    setNeeds((ns) => ns.map((n) => (n.id !== id ? n : { ...n, status, ...extra, hist: [{ t: NOW_STAMP, who: MOD, a: label }, ...n.hist] })));
    toast(id + ' · ' + label);
  }, [toast]);

  const goTo = (v: View, opts: { tab?: NeedTab; sel?: string } = {}) => go({ view: v, ...opts });

  const pendingCount = needs.filter((n) => n.status === 'bekliyor').length;
  const openReps = reports.filter((r) => r.st !== 'Çözüldü').length;

  // Reports: the selected report comes from the URL (#/reports/ŞK-1041) or the last one viewed.
  const repFromUrl = view === 'reports' && sel ? reports.findIndex((r) => r.id === sel) : -1;
  const repIdx = Math.min(repFromUrl >= 0 ? repFromUrl : lastRep, reports.length - 1);
  useEffect(() => { if (repFromUrl >= 0) setLastRep(repFromUrl); }, [repFromUrl]);

  const setRep = (patch: Partial<Report>, msg: string) => {
    setReports((rs) => rs.map((r, i) => (i === repIdx ? { ...r, ...patch } : r)));
    toast(msg);
  };
  const hasNeed = (id: string) => needs.some((n) => n.id === id);

  const drawerNeed = (view === 'needs' || view === 'verify') && sel ? needs.find((n) => n.id === sel) : undefined;
  const closeDrawer = useCallback(() => go({ view, tab }), [go, view, tab]);

  const [title, subtitle] = TITLES[view];

  let body: JSX.Element;
  switch (view) {
    case 'dash':
      body = (
        <Dashboard
          needs={needs}
          openReports={openReps}
          mapMetric={mapMetric}
          mapSel={mapSel}
          onMapMetric={setMapMetric}
          onMapSel={setMapSel}
          go={goTo}
          onVerify={(id) => act(id, 'aktif', 'Doğrulandı · hastane teyit edildi', { verified: true })}
        />
      );
      break;
    case 'needs':
    case 'verify':
      body = (
        <NeedsView
          mode={view}
          needs={needs}
          tab={tab}
          q={q}
          sel={sel}
          onTab={(t) => goTo('needs', { tab: t })}
          onOpen={(id) => goTo(view, { tab, sel: id })}
        />
      );
      break;
    case 'users': body = <UsersView q={q} />; break;
    case 'dons': body = <DonationsView q={q} />; break;
    case 'payments': body = <PaymentsView q={q} />; break;
    case 'cities': body = <CitiesView q={q} onPick={(p) => { setMapSel(p); goTo('dash'); }} />; break;
    case 'stats': body = <StatsView />; break;
    case 'reports': {
      const r0 = reports[repIdx];
      body = (
        <ReportsView
          reports={reports}
          index={repIdx}
          needs={needs}
          onSelect={(i) => { setLastRep(i); goTo('reports', { sel: reports[i].id }); }}
          onOpenNeed={(id) => (hasNeed(id) ? goTo('needs', { sel: id }) : toast('Bu ilan arşivde.'))}
          onSuspend={() => {
            if (hasNeed(r0.need)) act(r0.need, 'askida', 'Askıya alındı · şikayet ' + r0.id);
            setRep({ st: 'Çözüldü' }, 'İlan askıya alındı, şikayet çözüldü.');
          }}
          onWarn={() => setRep({ st: 'İnceleniyor' }, 'İlan sahibine uyarı gönderildi.')}
          onReject={() => setRep({ st: 'Çözüldü' }, 'Şikayet reddedildi.')}
        />
      );
      break;
    }
    default:
      body = <LaterView text={LATER[view] || ''} />;
  }

  return (
    <div style={{ width: '100%', minWidth: 1280, height: '100vh', minHeight: 640, display: 'flex', background: '#F4F4F5', color: '#18181B', position: 'relative', overflow: 'hidden' }}>
      <Sidebar
        view={view}
        badges={{ verify: pendingCount, reports: openReps }}
        onNav={(v) => { setQ(''); goTo(v); }}
      />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} subtitle={subtitle} q={q} onQ={setQ} onExport={() => toast('CSV dışa aktarımı hazırlanıyor.')} />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 32px 32px' }}>{body}</div>
      </main>
      {drawerNeed && (
        <Drawer
          need={drawerNeed}
          onClose={closeDrawer}
          onAction={(to, label) => act(drawerNeed.id, to, label, to === 'karsilandi' ? { met: drawerNeed.units } : undefined)}
          onBlocked={() => toast('Bu işlem mevcut durumda kullanılamaz.')}
        />
      )}
      <Toast msg={toastMsg} />
    </div>
  );
}
