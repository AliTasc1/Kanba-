import { useCallback, useEffect, useRef, useState } from 'react';
import { nf } from '@shared/data';
import { stamp, type Action } from '@shared/sync';
import { LATER, MOD, TITLES, type AdminStatus, type NeedTab, type View } from './data';
import { useSync, useSyncEvents } from './sync';
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

  const { db, status, dispatch } = useSync();
  const { needs, reports } = db;
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

  /** Apply a moderation action to a need (synced to every connected app): status + history + toast. */
  const act = (id: string, to: AdminStatus, label: string, met?: number) => {
    dispatch({ type: 'need.setStatus', id, status: to, label, who: MOD, at: stamp(), met });
    toast(id + ' · ' + label);
  };

  // Live activity from the mobile app.
  useSyncEvents(useCallback(({ action, mine }: { action: Action; mine: boolean }) => {
    if (mine) return;
    const msg = describe(action);
    if (msg) toast(msg);
  }, [toast]));

  const goTo = (v: View, opts: { tab?: NeedTab; sel?: string } = {}) => go({ view: v, ...opts });

  const pendingCount = needs.filter((n) => n.status === 'bekliyor').length;
  const openReps = reports.filter((r) => r.st !== 'Çözüldü').length;

  // Reports: the selected report comes from the URL (#/reports/ŞK-1041) or the last one viewed.
  const repFromUrl = view === 'reports' && sel ? reports.findIndex((r) => r.id === sel) : -1;
  const repIdx = Math.min(repFromUrl >= 0 ? repFromUrl : lastRep, reports.length - 1);
  useEffect(() => { if (repFromUrl >= 0) setLastRep(repFromUrl); }, [repFromUrl]);

  const setRep = (st: 'Yeni' | 'İnceleniyor' | 'Çözüldü', msg: string) => {
    const r = reports[repIdx];
    if (r) dispatch({ type: 'report.update', id: r.id, st });
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
          onVerify={(id) => act(id, 'aktif', 'Doğrulandı · hastane teyit edildi')}
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
    case 'dons': body = <DonationsView q={q} donations={db.donations} onVerify={(id) => { dispatch({ type: 'donation.verify', id, who: MOD, at: stamp() }); toast(id + ' · bağış doğrulandı'); }} />; break;
    case 'payments': body = <PaymentsView q={q} payments={db.payments} />; break;
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
            setRep('Çözüldü', 'İlan askıya alındı, şikayet çözüldü.');
          }}
          onWarn={() => setRep('İnceleniyor', 'İlan sahibine uyarı gönderildi.')}
          onReject={() => setRep('Çözüldü', 'Şikayet reddedildi.')}
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
        <Topbar title={title} subtitle={subtitle} q={q} onQ={setQ} onExport={() => toast('CSV dışa aktarımı hazırlanıyor.')} live={status} />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 32px 32px' }}>{body}</div>
      </main>
      {drawerNeed && (
        <Drawer
          need={drawerNeed}
          onClose={closeDrawer}
          onAction={(to, label) => act(drawerNeed.id, to, label, to === 'karsilandi' ? drawerNeed.units : undefined)}
          onBlocked={() => toast('Bu işlem mevcut durumda kullanılamaz.')}
        />
      )}
      <Toast msg={toastMsg} />
    </div>
  );
}

/** Toast text for activity coming from other clients (the mobile app). */
function describe(a: Action): string | null {
  switch (a.type) {
    case 'need.create': return `Yeni ilan: ${a.need.id} · ${a.need.blood} · ${a.need.hospital} — doğrulama bekliyor`;
    case 'need.commit': return `${a.id}: ${a.user} bağış planı oluşturdu`;
    case 'donation.record': return `Yeni bağış beyanı: ${a.donation.donor} · ${a.donation.id}`;
    case 'report.create': return `Yeni şikayet: ${a.need} · ${a.reason}`;
    case 'payment.create': return `Yeni destek ödemesi: ${nf(a.payment.amount)} TL · ${a.payment.method}`;
    default: return null;
  }
}
