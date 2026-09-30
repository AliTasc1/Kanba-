import { useEffect, useSyncExternalStore } from 'react';
import { SYNC_PORT } from '@shared/sync';
import { SyncClient, type SyncEvent, type SyncStatus } from '@shared/syncClient';

export type { SyncStatus };

/** ws://<same host as the admin page>:4000, or VITE_SYNC_URL. */
const url = (import.meta.env.VITE_SYNC_URL as string | undefined) || `ws://${location.hostname || 'localhost'}:${SYNC_PORT}`;

export const sync = new SyncClient(url, 'admin');

export function useSync() {
  const db = useSyncExternalStore((f) => sync.subscribe(f), () => sync.db);
  const status = useSyncExternalStore((f) => sync.subscribe(f), () => sync.status);
  return { db, status, dispatch: (a: Parameters<typeof sync.dispatch>[0]) => sync.dispatch(a) };
}

export function useSyncEvents(f: (e: SyncEvent) => void) {
  useEffect(() => sync.onEvent(f), [f]);
}
