// Kanbağ sync server: holds the shared database in memory and relays every
// action between the mobile app(s) and the admin panel over WebSocket.
//
//   npm start            → ws://<this computer>:4000   (PORT env var overrides)
//   GET  /state          → current database as JSON
//   POST /reset          → back to the demo seed
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { WebSocketServer, type WebSocket } from 'ws';
import { SYNC_PORT, applyAction, seedDb, type ClientMsg, type Db, type ServerMsg } from '../shared/sync';

const PORT = Number(process.env.PORT) || SYNC_PORT;
let db: Db = seedDb();

const clients = new Map<WebSocket, { role: string; client: string }>();
const send = (ws: WebSocket, m: ServerMsg) => ws.readyState === ws.OPEN && ws.send(JSON.stringify(m));
const broadcast = (m: ServerMsg) => clients.forEach((_, ws) => send(ws, m));
const time = () => new Date().toLocaleTimeString('tr-TR');

const http = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/state') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify(db, null, 2));
  }
  if (req.url === '/reset' && req.method === 'POST') {
    db = { ...seedDb(), rev: db.rev + 1 };
    broadcast({ type: 'state', db });
    console.log(`[${time()}] veriler sıfırlandı`);
    return res.end('ok');
  }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(`Kanbağ sync server · ${clients.size} bağlı istemci · rev ${db.rev}\n`);
});

const wss = new WebSocketServer({ server: http });
wss.on('connection', (ws, req) => {
  clients.set(ws, { role: '?', client: '?' });
  send(ws, { type: 'state', db });
  ws.on('message', (raw) => {
    let m: ClientMsg;
    try {
      m = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (m.type === 'hello') {
      clients.set(ws, { role: m.role, client: m.client });
      console.log(`[${time()}] + ${m.role} bağlandı (${req.socket.remoteAddress}) · toplam ${clients.size}`);
      return;
    }
    if (m.type === 'action') {
      const before = db.rev;
      db = applyAction(db, m.action);
      if (db.rev === before) return send(ws, { type: 'state', db });
      console.log(`[${time()}] ${clients.get(ws)?.role ?? '?'} → ${m.action.type}`);
      broadcast({ type: 'applied', action: m.action, origin: m.client, db });
    }
  });
  ws.on('close', () => {
    const c = clients.get(ws);
    clients.delete(ws);
    console.log(`[${time()}] - ${c?.role ?? '?'} ayrıldı · toplam ${clients.size}`);
  });
});

http.listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i!.address);
  console.log(`\nKanbağ sync server çalışıyor · port ${PORT}`);
  console.log(`  Bu bilgisayar:  ws://localhost:${PORT}`);
  ips.forEach((ip) => console.log(`  Aynı Wi-Fi:     ws://${ip}:${PORT}`));
  console.log('');
});
