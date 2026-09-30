// Admin-only demo data and helpers, ported from project/KanbagAdmin.dc.html.
// Province figures, months and monthly donations come from @shared so the
// admin panel and the mobile app always show the same numbers.
import { hash01 } from '@shared/data';

export type View =
  | 'dash' | 'verify' | 'needs' | 'dons' | 'users' | 'reports'
  | 'cities' | 'stats' | 'notifs' | 'payments' | 'settings';

export type AdminStatus = 'bekliyor' | 'aktif' | 'kismen' | 'karsilandi' | 'suresi' | 'iptal' | 'askida';

/** label, background, foreground, border */
export const ST: Record<AdminStatus, [string, string, string, string]> = {
  bekliyor: ['Doğrulama Bekliyor', '#FFFFFF', '#52525B', '#D4D4D8'],
  aktif: ['Aktif', '#EFEFF1', '#3F3F46', '#E4E4E7'],
  kismen: ['Kısmen Karşılandı', '#FBF0DC', '#6B3F00', '#F1DDB5'],
  karsilandi: ['Karşılandı', '#E4F2EA', '#135E3D', '#CDE7D8'],
  suresi: ['Süresi Doldu', '#F4F4F5', '#52525B', '#E4E4E7'],
  iptal: ['İptal Edildi', '#F4F4F5', '#52525B', '#E4E4E7'],
  askida: ['Askıya Alındı', '#FCEEEF', '#A01223', '#F2B8BF'],
};

export const MOD = 'S. Aydın (Moderatör)';
/** Fixed "now" used for new history entries in the demo. */
export const NOW_STAMP = '30 Eyl 14:12';

export interface HistEntry { t: string; who: string; a: string }

export interface AdminNeed {
  id: string;
  blood: string;
  hospital: string;
  district: string;
  city: string;
  units: number;
  met: number;
  status: AdminStatus;
  created: string;
  mins: number;
  reports: number;
  owner: string;
  hist: HistEntry[];
  verified?: boolean;
}

type NeedRow = [string, string, string, string, string, number, number, AdminStatus, string, number, number, string];

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

export const agoTxt = (m: number) =>
  m < 60 ? m + ' dk önce' : m < 1440 ? Math.floor(m / 60) + ' sa önce' : Math.floor(m / 1440) + ' gün önce';

const mkHist = (r: NeedRow): HistEntry[] => {
  const h: HistEntry[] = [{ t: r[8], who: 'Sistem', a: 'İlan oluşturuldu · ' + r[11] }];
  if (r[7] !== 'bekliyor' && r[7] !== 'iptal')
    h.push({ t: r[8].replace(/\d\d$/, (m) => String(Math.min(59, +m + 7)).padStart(2, '0')), who: MOD, a: 'Doğrulandı · hastane teyit edildi' });
  if (r[6] > 0) h.push({ t: '30 Eyl 13:58', who: 'Sistem', a: r[6] + ' ünite karşılandı (ilan sahibi onayı)' });
  if (r[7] === 'karsilandi') h.push({ t: '30 Eyl 14:01', who: 'İlan sahibi', a: 'İhtiyaç karşılandı olarak işaretlendi' });
  if (r[7] === 'suresi') h.push({ t: '29 Eyl 09:10', who: 'Sistem', a: 'Son ihtiyaç zamanı geçti' });
  if (r[7] === 'iptal') h.push({ t: '28 Eyl 18:02', who: MOD, a: 'İptal edildi · yinelenen ilan' });
  return h.reverse();
};

export const INITIAL_NEEDS: AdminNeed[] = N0.map((r) => ({
  id: r[0], blood: r[1], hospital: r[2], district: r[3], city: r[4], units: r[5], met: r[6],
  status: r[7], created: r[8], mins: r[9], reports: r[10], owner: r[11], hist: mkHist(r),
}));

/** Name, blood, il, ilçe, total donations, activity, registered, notifications */
export const USERS: [string, string, string, string, number, string, string, string][] = [
  ['Ali Y.', '0+', 'Kocaeli', 'Başiskele', 5, 'Son 7 gün', 'Nis 2025', 'Açık'],
  ['Elif K.', 'A+', 'İstanbul', 'Kadıköy', 3, 'Son 7 gün', 'Oca 2025', 'Açık'],
  ['Mert D.', 'B+', 'Ankara', 'Çankaya', 7, 'Son 30 gün', 'Eki 2024', 'Açık'],
  ['Zehra A.', '0-', 'İzmir', 'Bornova', 2, 'Son 7 gün', 'Mar 2026', 'Açık'],
  ['Can Ö.', 'AB+', 'Bursa', 'Nilüfer', 1, 'Pasif', 'Haz 2025', 'Kapalı'],
  ['Selma T.', 'A-', 'Kocaeli', 'Gebze', 4, 'Son 30 gün', 'Ağu 2025', 'Açık'],
  ['Oğuz B.', '0+', 'Sakarya', 'Serdivan', 6, 'Son 7 gün', 'Kas 2024', 'Açık'],
  ['Hatice Y.', 'B-', 'Konya', 'Selçuklu', 0, 'Son 30 gün', 'Eyl 2026', 'Açık'],
  ['Emre Ş.', 'A+', 'Antalya', 'Muratpaşa', 2, 'Pasif', 'Şub 2025', 'Kapalı'],
  ['Nur G.', '0+', 'Adana', 'Seyhan', 3, 'Son 7 gün', 'May 2025', 'Açık'],
  ['Kaan E.', 'AB-', 'Gaziantep', 'Şahinbey', 1, 'Son 30 gün', 'Tem 2026', 'Açık'],
  ['İrem S.', 'B+', 'Kocaeli', 'İzmit', 2, 'Son 7 gün', 'Ara 2025', 'Açık'],
];

/** Donation id, donor, blood, need id, hospital, place, date, status */
export const DONS: [string, string, string, string, string, string, string, 'Beyan' | 'Doğrulanmış'][] = [
  ['BG-260930-118', 'Ali Y.', '0+', 'KB-41-20931', 'Kocaeli Üniversitesi Hastanesi', 'İzmit / Kocaeli', '30 Eyl 2026', 'Beyan'],
  ['BG-260930-117', 'Oğuz B.', '0+', 'KB-54-10432', 'Sakarya EAH', 'Adapazarı / Sakarya', '30 Eyl 2026', 'Doğrulanmış'],
  ['BG-260930-114', 'Nur G.', '0+', 'KB-01-22871', 'Adana Şehir Hastanesi', 'Yüreğir / Adana', '30 Eyl 2026', 'Doğrulanmış'],
  ['BG-260930-109', 'Selma T.', 'A-', 'KB-41-20947', 'Kocaeli Şehir Hastanesi', 'Başiskele / Kocaeli', '30 Eyl 2026', 'Beyan'],
  ['BG-260929-402', 'Elif K.', 'A+', 'KB-34-88107', 'Dr. Lütfi Kırdar Şehir Hastanesi', 'Kartal / İstanbul', '29 Eyl 2026', 'Doğrulanmış'],
  ['BG-260929-398', 'Mert D.', 'B+', 'KB-06-54988', 'Ankara Bilkent Şehir Hastanesi', 'Çankaya / Ankara', '29 Eyl 2026', 'Doğrulanmış'],
];

/** Transaction no, amount, method, date, status */
export const PAYS: [string, string, string, string, string][] = [
  ['KBD-260930-4821', '100 TL', 'Apple Pay', '30 Eyl 2026 14:08', 'Başarılı'],
  ['KBD-260930-4817', '10 TL', 'Google Pay', '30 Eyl 2026 13:51', 'Başarılı'],
  ['KBD-260930-4809', '1.000 TL', 'Banka kartı', '30 Eyl 2026 12:22', 'Başarılı'],
  ['KBD-260929-4777', '250 TL', 'Apple Pay', '29 Eyl 2026 21:40', 'Başarılı'],
  ['KBD-260929-4760', '100 TL', 'Banka kartı', '29 Eyl 2026 18:03', 'İade edildi'],
  ['KBD-260928-4702', '10.000 TL', 'Banka kartı', '28 Eyl 2026 10:17', 'Başarılı'],
];

export type ReportStatus = 'Yeni' | 'İnceleniyor' | 'Çözüldü';
export interface Report {
  id: string;
  need: string;
  reason: string;
  reasons: [string, number][];
  count: number;
  time: string;
  st: ReportStatus;
  note: string;
}

export const INITIAL_REPORTS: Report[] = [
  { id: 'ŞK-1042', need: 'KB-27-19002', reason: 'Şüpheli ilan', reasons: [['Şüpheli ilan', 2], ['Yanlış hastane', 1]], count: 3, time: '1 sa önce', st: 'Yeni', note: 'Kullanıcı notu: Hastanenin kan merkezi bu ilan için kayıt bulunmadığını söyledi. İlan sahibi 3 farklı ilde benzer ilan açmış.' },
  { id: 'ŞK-1041', need: 'KB-35-41277', reason: 'Artık ihtiyaç yok', reasons: [['Artık ihtiyaç yok', 1]], count: 1, time: '3 sa önce', st: 'İnceleniyor', note: 'Kullanıcı notu: Hasta yakını ihtiyacın dün karşılandığını belirtti.' },
  { id: 'ŞK-1039', need: 'KB-42-12093', reason: 'Taciz / kötüye kullanım', reasons: [['Taciz / kötüye kullanım', 1]], count: 1, time: '5 sa önce', st: 'Yeni', note: 'Kullanıcı notu: Uygulama içi mesajlarda bağış karşılığında ücret talep edildi.' },
  { id: 'ŞK-1036', need: 'KB-34-88107', reason: 'Yanlış kan grubu', reasons: [['Yanlış kan grubu', 2]], count: 2, time: 'Dün', st: 'Çözüldü', note: 'Çözüm: İlan sahibi kan grubunu A− yerine A+ olarak düzeltti.' },
];

/** background, foreground */
export const RST: Record<ReportStatus, [string, string]> = {
  Yeni: ['#FCEEEF', '#A01223'],
  İnceleniyor: ['#FBF0DC', '#6B3F00'],
  Çözüldü: ['#E4F2EA', '#135E3D'],
};

export const MONTHLY_NEEDS = [260, 275, 290, 318, 301, 330, 352, 361, 344, 372, 389, 402];

/** Line path used by the prototype's admin charts (differs slightly from shared linePath). */
export const chartPath = (vals: number[], W: number, H: number, pad: number, mn?: number, mx?: number) => {
  const lo = mn ?? Math.min(...vals);
  const hi = mx ?? Math.max(...vals);
  return 'M' + vals
    .map((v, i) => (pad + (i * (W - pad - 4)) / (vals.length - 1)).toFixed(1) + ' ' + (H - 12 - ((v - lo) / (hi - lo || 1)) * (H - 28)).toFixed(1))
    .join(' L');
};

/** Last-30-day demo series (donations, needs). */
export const DAILY_DONATIONS: number[] = [];
export const DAILY_NEEDS: number[] = [];
for (let i = 0; i < 30; i++) {
  DAILY_DONATIONS.push(Math.round(96 + 18 * Math.sin(i / 4 + 1) + i * 0.6 + 12 * hash01('d', i)));
  DAILY_NEEDS.push(Math.round(32 + 7 * Math.sin(i / 3) + i * 0.2 + 6 * hash01('n', i)));
}

export const NAV: [View, string][] = [
  ['dash', 'Dashboard'], ['verify', 'Doğrulama Bekleyenler'], ['needs', 'İhtiyaçlar'], ['dons', 'Bağışlar'],
  ['users', 'Kullanıcılar'], ['reports', 'Şikayetler'], ['cities', 'İller ve İlçeler'], ['stats', 'İstatistikler'],
  ['notifs', 'Bildirimler'], ['payments', 'Destek Ödemeleri'], ['settings', 'Sistem Ayarları'],
];

export const VIEWS = NAV.map((n) => n[0]);

export const TITLES: Record<View, [string, string]> = {
  dash: ['Dashboard', 'Bugün · Türkiye geneli'],
  verify: ['Doğrulama Bekleyenler', 'Yayına alınmadan önce hastane ve iletişim bilgilerini kontrol et'],
  needs: ['İhtiyaçlar', 'Tüm ilanlar ve durumları'],
  dons: ['Bağışlar', 'Beyan edilen ve doğrulanmış bağışlar'],
  users: ['Kullanıcılar', 'Kayıtlı gönüllüler'],
  reports: ['Şikayetler', 'Kullanıcı bildirimleri'],
  cities: ['İller ve İlçeler', '81 il · il bazlı özet'],
  stats: ['İstatistikler', 'Sosyal etki ve operasyon metrikleri'],
  notifs: ['Bildirimler', 'Toplu ve bölgesel bildirimler'],
  payments: ['Destek Ödemeleri', 'Gönüllü geliştirici destekleri · hiçbir özellik açmaz'],
  settings: ['Sistem Ayarları', 'Doğrulama kuralları, roller, entegrasyonlar'],
};

export const LATER: Partial<Record<View, string>> = {
  notifs: 'Toplu bildirim oluşturma (il, ilçe, kan grubu hedefleme), zamanlanmış bildirimler ve gönderim raporları.',
  settings: 'Doğrulama kuralları, moderatör rolleri ve bölge yetkileri, SMS ve ödeme sağlayıcısı entegrasyonları, denetim kayıtları.',
};

export type NeedTab = 'all' | 'bekliyor' | 'aktif' | 'kismen' | 'karsilandi' | 'suresi' | 'iptal';
export const NEED_TABS: [NeedTab, string][] = [
  ['all', 'Tümü'], ['bekliyor', 'Doğrulama Bekliyor'], ['aktif', 'Aktif'], ['kismen', 'Kısmen Karşılandı'],
  ['karsilandi', 'Karşılandı'], ['suresi', 'Süresi Doldu'], ['iptal', 'İptal / Askıda'],
];
export const inTab = (n: AdminNeed, k: NeedTab) => k === 'all' || n.status === k || (k === 'iptal' && n.status === 'askida');

/** Drawer actions: label, target status, history label, allowed-from statuses, primary color */
export const DRAWER_ACTIONS: [string, AdminStatus, string, AdminStatus[], string | null][] = [
  ['Doğrula', 'aktif', 'Doğrulandı · hastane teyit edildi', ['bekliyor'], '#177A4E'],
  ['Reddet', 'iptal', 'Reddedildi · bilgi doğrulanamadı', ['bekliyor'], null],
  ['Askıya al', 'askida', 'Askıya alındı', ['aktif', 'kismen', 'bekliyor'], null],
  ['Karşılandı işaretle', 'karsilandi', 'Karşılandı olarak işaretlendi', ['aktif', 'kismen'], null],
  ['İptal et', 'iptal', 'İptal edildi', ['aktif', 'kismen', 'askida', 'bekliyor'], null],
  ['Yeniden etkinleştir', 'aktif', 'Yeniden etkinleştirildi', ['askida'], null],
];

/** Blood-group share of needs (label, percent, color). */
export const DONUT: [string, number, string][] = [
  ['A+', 38, '#C4162A'], ['0+', 29, '#E26A76'], ['B+', 14, '#F2B8BF'], ['AB+', 7, '#8A8A93'], ['Rh− (tümü)', 12, '#D4D4D8'],
];

/** Fallback shown in a report when its need is not in the list. */
export const ARCHIVED_NEED = { hospital: 'Ankara Bilkent Şehir Hastanesi', blood: 'A-', district: 'Çankaya', city: 'Ankara', status: 'aktif' as AdminStatus };
