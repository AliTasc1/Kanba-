// Shared, syncable Kanbağ database: one data model for the mobile app, the admin
// panel and the sync server, plus the reducer every side uses to apply actions.
// The server is the source of truth; clients apply actions optimistically with
// the same reducer, then adopt the server's snapshot.
import { DONATIONS, NEEDS, nf, type Blood, type NeedStatus } from './data';

// ---------- model ----------
/** Listing lifecycle as moderated in the admin panel. */
export type AdminStatus = 'bekliyor' | 'aktif' | 'kismen' | 'karsilandi' | 'suresi' | 'iptal' | 'askida';
/** Urgency shown to donors (the mobile "● ACİL / ÖNCELİKLİ / AKTİF" badge). */
export type Urgency = 'acil' | 'oncelikli' | 'aktif';

export interface HistEntry { t: string; who: string; a: string }

export interface DbNeed {
  id: string;
  blood: Blood;
  units: number;
  met: number;
  going: number;
  committers: string[];
  status: AdminStatus;
  urgency: Urgency;
  verified: boolean;
  hospital: string;
  dept: string;
  district: string;
  city: string;
  dist: number;
  created: string;
  mins: number;
  deadline: string;
  forName: string;
  cond: string;
  /** Contact person shown to moderators. */
  owner: string;
  /** App user who created the listing (the demo user is "Ali Y."). */
  createdBy?: string;
  reports: number;
  hist: HistEntry[];
}

export type DonationState = 'Beyan' | 'Doğrulanmış';
export interface DbDonation {
  id: string;
  donor: string;
  donorBlood: Blood;
  needId: string | null;
  needBlood: Blood | null;
  hospital: string;
  place: string;
  /** "30 Eylül 2026" */
  date: string;
  units: number;
  status: DonationState;
}

export interface DbPayment { id: string; amount: number; method: string; date: string; status: 'Başarılı' | 'İade edildi'; by?: string }

export type ReportStatus = 'Yeni' | 'İnceleniyor' | 'Çözüldü';
export interface DbReport {
  id: string;
  need: string;
  reason: string;
  reasons: [string, number][];
  count: number;
  time: string;
  st: ReportStatus;
  note: string;
}

export interface Db { needs: DbNeed[]; donations: DbDonation[]; reports: DbReport[]; payments: DbPayment[]; rev: number }

export type Action =
  | { type: 'need.create'; need: DbNeed }
  | { type: 'need.setStatus'; id: string; status: AdminStatus; label: string; who: string; at: string; met?: number }
  | { type: 'need.commit'; id: string; user: string; at: string }
  | { type: 'donation.record'; donation: DbDonation; at: string }
  | { type: 'donation.verify'; id: string; who: string; at: string }
  | { type: 'report.create'; id: string; need: string; reason: string }
  | { type: 'report.update'; id: string; st: ReportStatus }
  | { type: 'payment.create'; payment: DbPayment };

/** The demo app user. */
export const ME = 'Ali Y.';
export const MODERATOR = 'S. Aydın (Moderatör)';

// ---------- dates ----------
const MON_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const MON_LONG = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const p2 = (n: number) => String(n).padStart(2, '0');
/** "30 Eyl 14:12" */
export const stamp = (d = new Date()) => `${d.getDate()} ${MON_SHORT[d.getMonth()]} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
/** "30 Eylül 2026" */
export const longDate = (d = new Date()) => `${d.getDate()} ${MON_LONG[d.getMonth()]} ${d.getFullYear()}`;
/** "30 Eyl 2026 14:08" */
export const stampYear = (d = new Date()) => `${d.getDate()} ${MON_SHORT[d.getMonth()]} ${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
/** Short random suffix for client-generated ids. */
export const rid = (digits: number) => String(Math.floor(Math.random() * 10 ** digits)).padStart(digits, '0');

// ---------- seed ----------
type NeedRow = [string, string, string, string, string, number, number, AdminStatus, string, number, number, string];

/** Admin prototype listings (KB-41-21008 is left out: the demo user creates it in the app). */
const N0: NeedRow[] = [
  ['KB-41-21008', '0-', 'Kocaeli Şehir Hastanesi', 'Başiskele', 'Kocaeli', 2, 0, 'bekliyor', '30 Eyl 14:06', 2, 0, 'Can K.'],
  ['KB-34-88412', 'A+', 'Başakşehir Çam ve Sakura Şehir Hastanesi', 'Başakşehir', 'İstanbul', 4, 0, 'bekliyor', '30 Eyl 14:02', 6, 0, 'Derya Ş.'],
  ['KB-06-55190', 'B-', 'Ankara Bilkent Şehir Hastanesi', 'Çankaya', 'Ankara', 2, 0, 'bekliyor', '30 Eyl 13:57', 11, 0, 'Murat E.'],
  ['KB-35-41277', '0+', 'İzmir Tepecik Eğitim ve Araştırma Hastanesi', 'Konak', 'İzmir', 3, 0, 'bekliyor', '30 Eyl 13:49', 19, 1, 'Gül A.'],
  ['KB-41-20960', 'AB+', 'Darıca Farabi Eğitim ve Araştırma Hastanesi', 'Darıca', 'Kocaeli', 2, 0, 'bekliyor', '30 Eyl 13:59', 9, 0, 'Zeynep A.'],
  ['KB-41-20947', 'A+', 'Kocaeli Şehir Hastanesi', 'Başiskele', 'Kocaeli', 3, 1, 'kismen', '30 Eyl 13:50', 18, 0, 'Mehmet Y.'],
  ['KB-41-20931', '0+', 'Kocaeli Üniversitesi Araştırma ve Uygulama Hastanesi', 'İzmit', 'Kocaeli', 4, 2, 'kismen', '30 Eyl 13:33', 35, 0, 'Ayşe T.'],
  ['KB-16-30218', 'A-', 'Bursa Şehir Hastanesi', 'Nilüfer', 'Bursa', 2, 0, 'aktif', '30 Eyl 12:40', 88, 0, 'Onur P.'],
  ['KB-27-19002', 'B+', 'Gaziantep Dr. Ersin Arslan Eğitim ve Araştırma Hastanesi', 'Şahinbey', 'Gaziantep', 2, 0, 'aktif', '30 Eyl 11:15', 173, 3, 'Hakan G.'],
  ['KB-01-22871', '0+', 'Adana Şehir Hastanesi', 'Yüreğir', 'Adana', 3, 3, 'karsilandi', '30 Eyl 08:20', 348, 0, 'Emine D.'],
  ['KB-54-10432', '0+', 'Sakarya Eğitim ve Araştırma Hastanesi', 'Adapazarı', 'Sakarya', 3, 1, 'kismen', '30 Eyl 10:48', 200, 0, 'Kemal B.'],
  ['KB-34-88107', 'A+', 'Dr. Lütfi Kırdar Şehir Hastanesi', 'Kartal', 'İstanbul', 2, 2, 'karsilandi', '29 Eyl 19:02', 1144, 0, 'Burak N.'],
  ['KB-07-17745', 'AB-', 'Antalya Eğitim ve Araştırma Hastanesi', 'Muratpaşa', 'Antalya', 1, 0, 'suresi', '28 Eyl 09:10', 3176, 0, 'Seda Y.'],
  ['KB-42-12093', '0-', 'Konya Şehir Hastanesi', 'Karatay', 'Konya', 2, 0, 'iptal', '28 Eyl 16:25', 2741, 1, 'İsmail K.'],
];

const mkHist = (r: NeedRow): HistEntry[] => {
  const h: HistEntry[] = [{ t: r[8], who: 'Sistem', a: 'İlan oluşturuldu · ' + r[11] }];
  if (r[7] !== 'bekliyor' && r[7] !== 'iptal')
    h.push({ t: r[8].replace(/\d\d$/, (m) => String(Math.min(59, +m + 7)).padStart(2, '0')), who: MODERATOR, a: 'Doğrulandı · hastane teyit edildi' });
  if (r[6] > 0) h.push({ t: '30 Eyl 13:58', who: 'Sistem', a: r[6] + ' ünite karşılandı (ilan sahibi onayı)' });
  if (r[7] === 'karsilandi') h.push({ t: '30 Eyl 14:01', who: 'İlan sahibi', a: 'İhtiyaç karşılandı olarak işaretlendi' });
  if (r[7] === 'suresi') h.push({ t: '29 Eyl 09:10', who: 'Sistem', a: 'Son ihtiyaç zamanı geçti' });
  if (r[7] === 'iptal') h.push({ t: '28 Eyl 18:02', who: MODERATOR, a: 'İptal edildi · yinelenen ilan' });
  return h.reverse();
};

const minsToStamp = (m: number) => {
  const t = 14 * 60 + 12 - m;
  const day = t >= 0 ? 30 : 29;
  const tt = (t + 1440) % 1440;
  return `${day} Eyl ${p2(Math.floor(tt / 60))}:${p2(tt % 60)}`;
};

const seedNeeds = (): DbNeed[] => {
  const mobile = new Map(NEEDS.map((n) => [n.id, n]));
  const rows = N0.filter((r) => r[0] !== 'KB-41-21008');
  // Listings that only exist in the mobile prototype get admin fields here.
  for (const n of NEEDS) {
    if (rows.some((r) => r[0] === n.id)) continue;
    const st: AdminStatus = n.status === 'karsilandi' ? 'karsilandi' : n.status === 'bekliyor' ? 'bekliyor' : n.met > 0 ? 'kismen' : 'aktif';
    rows.push([n.id, n.blood, n.hospital, n.district, n.city, n.units, n.met, st, minsToStamp(n.mins), n.mins, 0, n.forName]);
  }
  return rows.map((r) => {
    const m = mobile.get(r[0]);
    const urgency: Urgency = m && (m.status === 'acil' || m.status === 'oncelikli' || m.status === 'aktif') ? m.status : r[9] < 60 ? 'acil' : r[9] < 240 ? 'oncelikli' : 'aktif';
    return {
      id: r[0], blood: r[1] as Blood, units: r[5], met: r[6], going: m?.going ?? (r[6] > 0 ? 1 : 0), committers: [],
      status: r[7], urgency, verified: r[7] !== 'bekliyor', hospital: r[2], dept: m?.dept ?? 'Acil Servis', district: r[3], city: r[4],
      dist: m?.dist ?? 0, created: r[8], mins: r[9], deadline: m?.deadline ?? (urgency === 'acil' ? 'Bugün 23:59’a kadar' : 'Yarın 23:59’a kadar'),
      forName: m?.forName ?? r[11], cond: m?.cond ?? 'Acil tedavi', owner: r[11], reports: r[10], hist: mkHist(r),
    };
  });
};

type DonRow = [string, string, string, string, string, string, string, DonationState];
/** Other volunteers' donations from the admin prototype (Ali's are added from the app history below). */
const DONS: DonRow[] = [
  ['BG-260930-118', 'Ali Y.', '0+', 'KB-41-20931', 'Kocaeli Üniversitesi Hastanesi', 'İzmit / Kocaeli', '30 Eyl 2026', 'Beyan'],
  ['BG-260930-117', 'Oğuz B.', '0+', 'KB-54-10432', 'Sakarya EAH', 'Adapazarı / Sakarya', '30 Eyl 2026', 'Doğrulanmış'],
  ['BG-260930-114', 'Nur G.', '0+', 'KB-01-22871', 'Adana Şehir Hastanesi', 'Yüreğir / Adana', '30 Eyl 2026', 'Doğrulanmış'],
  ['BG-260930-109', 'Selma T.', 'A-', 'KB-41-20947', 'Kocaeli Şehir Hastanesi', 'Başiskele / Kocaeli', '30 Eyl 2026', 'Beyan'],
  ['BG-260929-402', 'Elif K.', 'A+', 'KB-34-88107', 'Dr. Lütfi Kırdar Şehir Hastanesi', 'Kartal / İstanbul', '29 Eyl 2026', 'Doğrulanmış'],
  ['BG-260929-398', 'Mert D.', 'B+', 'KB-06-54988', 'Ankara Bilkent Şehir Hastanesi', 'Çankaya / Ankara', '29 Eyl 2026', 'Doğrulanmış'],
];

const seedDonations = (needs: DbNeed[]): DbDonation[] => {
  const shortToLong = (s: string) => s.replace(/^(\d+) (\S+) (\d+)$/, (_x, d, m, y) => `${d} ${MON_LONG[MON_SHORT.indexOf(m)]} ${y}`);
  const others: DbDonation[] = DONS.filter((d) => d[1] !== ME).map((d) => ({
    id: d[0], donor: d[1], donorBlood: d[2] as Blood, needId: d[3], needBlood: (needs.find((n) => n.id === d[3])?.blood ?? null),
    hospital: d[4], place: d[5], date: shortToLong(d[6]), units: 1, status: d[7],
  }));
  const ids = ['BG-260618-204', 'BG-260304-117', 'BG-251121-088', 'BG-250809-051', 'BG-250414-019'];
  const mine: DbDonation[] = DONATIONS.map((d, i) => ({
    id: ids[i], donor: ME, donorBlood: '0+', needId: null, needBlood: d.need, hospital: d.hospital, place: d.place,
    date: d.date, units: d.units, status: d.st === 'v' ? 'Doğrulanmış' : 'Beyan',
  }));
  return [...others, ...mine];
};

type PayRow = [string, string, string, string, DbPayment['status']];
const PAYS: PayRow[] = [
  ['KBD-260930-4821', '100 TL', 'Apple Pay', '30 Eyl 2026 14:08', 'Başarılı'],
  ['KBD-260930-4817', '10 TL', 'Google Pay', '30 Eyl 2026 13:51', 'Başarılı'],
  ['KBD-260930-4809', '1.000 TL', 'Banka kartı', '30 Eyl 2026 12:22', 'Başarılı'],
  ['KBD-260929-4777', '250 TL', 'Apple Pay', '29 Eyl 2026 21:40', 'Başarılı'],
  ['KBD-260929-4760', '100 TL', 'Banka kartı', '29 Eyl 2026 18:03', 'İade edildi'],
  ['KBD-260928-4702', '10.000 TL', 'Banka kartı', '28 Eyl 2026 10:17', 'Başarılı'],
];

const seedReports = (): DbReport[] => [
  { id: 'ŞK-1042', need: 'KB-27-19002', reason: 'Şüpheli ilan', reasons: [['Şüpheli ilan', 2], ['Yanlış hastane', 1]], count: 3, time: '1 sa önce', st: 'Yeni', note: 'Kullanıcı notu: Hastanenin kan merkezi bu ilan için kayıt bulunmadığını söyledi. İlan sahibi 3 farklı ilde benzer ilan açmış.' },
  { id: 'ŞK-1041', need: 'KB-35-41277', reason: 'Artık ihtiyaç yok', reasons: [['Artık ihtiyaç yok', 1]], count: 1, time: '3 sa önce', st: 'İnceleniyor', note: 'Kullanıcı notu: Hasta yakını ihtiyacın dün karşılandığını belirtti.' },
  { id: 'ŞK-1039', need: 'KB-42-12093', reason: 'Taciz / kötüye kullanım', reasons: [['Taciz / kötüye kullanım', 1]], count: 1, time: '5 sa önce', st: 'Yeni', note: 'Kullanıcı notu: Uygulama içi mesajlarda bağış karşılığında ücret talep edildi.' },
  { id: 'ŞK-1036', need: 'KB-34-88107', reason: 'Yanlış kan grubu', reasons: [['Yanlış kan grubu', 2]], count: 2, time: 'Dün', st: 'Çözüldü', note: 'Çözüm: İlan sahibi kan grubunu A− yerine A+ olarak düzeltti.' },
];

export const seedDb = (): Db => {
  const needs = seedNeeds();
  return {
    needs,
    donations: seedDonations(needs),
    reports: seedReports(),
    payments: PAYS.map((p) => ({ id: p[0], amount: Number(p[1].replace(/\D/g, '')), method: p[2], date: p[3], status: p[4] })),
    rev: 0,
  };
};

// ---------- reducer ----------
const upd = <T extends { id: string }>(xs: T[], id: string, f: (x: T) => T) => xs.map((x) => (x.id === id ? f(x) : x));

/** Apply one action. Pure: returns a new Db (same object if the action does nothing). */
export function applyAction(db: Db, a: Action): Db {
  const next = (p: Partial<Db>): Db => ({ ...db, ...p, rev: db.rev + 1 });
  switch (a.type) {
    case 'need.create':
      if (db.needs.some((n) => n.id === a.need.id)) return db;
      return next({ needs: [a.need, ...db.needs] });
    case 'need.setStatus':
      return next({
        needs: upd(db.needs, a.id, (n) => ({
          ...n, status: a.status, met: a.met ?? n.met, verified: n.verified || a.status === 'aktif',
          hist: [{ t: a.at, who: a.who, a: a.label }, ...n.hist],
        })),
      });
    case 'need.commit':
      return next({
        needs: upd(db.needs, a.id, (n) => n.committers.includes(a.user) ? n : ({
          ...n, going: n.going + 1, committers: [...n.committers, a.user],
          hist: [{ t: a.at, who: a.user, a: 'Bağış planı oluşturdu · hastaneye gidiyor' }, ...n.hist],
        })),
      });
    case 'donation.record': {
      const d = a.donation;
      if (db.donations.some((x) => x.id === d.id)) return db;
      return next({
        donations: [d, ...db.donations],
        needs: d.needId ? upd(db.needs, d.needId, (n) => ({ ...n, hist: [{ t: a.at, who: d.donor, a: `Bağış beyanı · ${d.units} ünite (onay bekliyor)` }, ...n.hist] })) : db.needs,
      });
    }
    case 'donation.verify': {
      const d = db.donations.find((x) => x.id === a.id);
      if (!d || d.status === 'Doğrulanmış') return db;
      return next({
        donations: upd(db.donations, a.id, (x) => ({ ...x, status: 'Doğrulanmış' })),
        needs: d.needId
          ? upd(db.needs, d.needId, (n) => {
              const met = Math.min(n.units, n.met + d.units);
              const status: AdminStatus = met >= n.units ? 'karsilandi' : n.status === 'aktif' ? 'kismen' : n.status;
              return { ...n, met, status, hist: [{ t: a.at, who: a.who, a: `${d.units} ünite karşılandı · ${d.donor} bağışı doğrulandı` }, ...n.hist] };
            })
          : db.needs,
      });
    }
    case 'report.create': {
      const open = db.reports.find((r) => r.need === a.need && r.st !== 'Çözüldü');
      const reports = open
        ? upd(db.reports, open.id, (r) => {
            const has = r.reasons.some(([x]) => x === a.reason);
            const reasons: [string, number][] = has ? r.reasons.map(([x, c]) => [x, x === a.reason ? c + 1 : c]) : [...r.reasons, [a.reason, 1]];
            return { ...r, count: r.count + 1, time: 'Az önce', reasons };
          })
        : [{ id: a.id, need: a.need, reason: a.reason, reasons: [[a.reason, 1]] as [string, number][], count: 1, time: 'Az önce', st: 'Yeni' as const, note: 'Kullanıcı notu: Mobil uygulamadan anonim bildirim.' }, ...db.reports];
      return next({ reports, needs: upd(db.needs, a.need, (n) => ({ ...n, reports: n.reports + 1 })) });
    }
    case 'report.update':
      return next({ reports: upd(db.reports, a.id, (r) => ({ ...r, st: a.st })) });
    case 'payment.create':
      if (db.payments.some((p) => p.id === a.payment.id)) return db;
      return next({ payments: [a.payment, ...db.payments] });
  }
  return db;
}

// ---------- views ----------
/** Mobile-facing badge status, or null when the listing is hidden from donors (expired, cancelled, suspended). */
export const donorStatus = (n: DbNeed): NeedStatus | null =>
  n.status === 'bekliyor' ? 'bekliyor' : n.status === 'karsilandi' ? 'karsilandi' : n.status === 'aktif' || n.status === 'kismen' ? n.urgency : null;

export const paymentLabel = (p: DbPayment) => nf(p.amount) + ' TL';

// ---------- wire protocol ----------
export type ClientMsg = { type: 'hello'; role: 'admin' | 'mobile'; client: string } | { type: 'action'; action: Action; client: string };
export type ServerMsg =
  | { type: 'state'; db: Db }
  | { type: 'applied'; action: Action; origin: string; db: Db };

export const SYNC_PORT = 4000;
