// Framework-free sync client used by the mobile app and the admin panel.
// Actions are applied locally right away (optimistic) and sent to the server;
// every server broadcast replaces the local database. Without a server the
// client keeps working on its local copy and reconnects in the background.
import { applyAction, seedDb, type Action, type ClientMsg, type Db, type ServerMsg } from './sync';

export type SyncStatus = 'connecting' | 'online' | 'offline';

export interface SyncEvent { action: Action; mine: boolean }

export class SyncClient {
  db: Db = seedDb();
  status: SyncStatus = 'connecting';
  readonly id = Math.random().toString(36).slice(2, 10);
  private ws: WebSocket | null = null;
  private retry: ReturnType<typeof setTimeout> | undefined;
  private closed = false;
  private listeners = new Set<() => void>();
  private eventListeners = new Set<(e: SyncEvent) => void>();

  constructor(private url: string, private role: 'admin' | 'mobile') {
    this.connect();
  }

  private emit() {
    this.listeners.forEach((f) => f());
  }

  private setStatus(s: SyncStatus) {
    if (this.status !== s) {
      this.status = s;
      this.emit();
    }
  }

  private connect() {
    if (this.closed) return;
    let ws: WebSocket;
    try {
      ws = new WebSocket(this.url);
    } catch {
      return this.scheduleRetry();
    }
    this.ws = ws;
    ws.onopen = () => {
      const hello: ClientMsg = { type: 'hello', role: this.role, client: this.id };
      ws.send(JSON.stringify(hello));
      this.setStatus('online');
    };
    ws.onmessage = (ev) => {
      let m: ServerMsg;
      try {
        m = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      this.db = m.db;
      if (m.type === 'applied') this.eventListeners.forEach((f) => f({ action: m.action, mine: m.origin === this.id }));
      this.emit();
    };
    ws.onclose = () => {
      this.ws = null;
      this.setStatus('offline');
      this.scheduleRetry();
    };
    ws.onerror = () => ws.close();
  }

  private scheduleRetry() {
    clearTimeout(this.retry);
    if (!this.closed) this.retry = setTimeout(() => this.connect(), 2000);
  }

  dispatch(action: Action) {
    this.db = applyAction(this.db, action);
    this.emit();
    if (this.ws && this.ws.readyState === 1) {
      const m: ClientMsg = { type: 'action', action, client: this.id };
      this.ws.send(JSON.stringify(m));
    } else {
      // Offline: nobody else will see it, but the local app stays usable.
      this.eventListeners.forEach((f) => f({ action, mine: true }));
    }
  }

  subscribe(f: () => void) {
    this.listeners.add(f);
    return () => void this.listeners.delete(f);
  }

  onEvent(f: (e: SyncEvent) => void) {
    this.eventListeners.add(f);
    return () => void this.eventListeners.delete(f);
  }

  close() {
    this.closed = true;
    clearTimeout(this.retry);
    this.ws?.close();
  }
}
