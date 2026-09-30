// Admin-only demo data and helpers, ported from project/KanbagAdmin.dc.html.
// Province figures, months and monthly donations come from @shared so the
// admin panel and the mobile app always show the same numbers.
import { hash01 } from '@shared/data';
import { MODERATOR, type AdminStatus, type DbNeed, type DbReport, type ReportStatus } from '@shared/sync';

export type View =
  | 'dash' | 'verify' | 'needs' | 'dons' | 'users' | 'reports'
  | 'cities' | 'stats' | 'notifs' | 'payments' | 'settings';

export type { AdminStatus } from '@shared/sync';

export const ST: Record<AdminStatus, [string, string, string, string]> = {
  bekliyor: ['Doğrulama Bekliyor', '#FFFFFF', '#52525B', '#D4D4D8'],
  aktif: ['Aktif', '#EFEFF1', '#3F3F46', '#E4E4E7'],
  kismen: ['Kısmen Karşılandı', '#FBF0DC', '#6B3F00', '#F1DDB5'],
  karsilandi: ['Karşılandı', '#E4F2EA', '#135E3D', '#CDE7D8'],
  suresi: ['Süresi Doldu', '#F4F4F5', '#52525B', '#E4E4E7'],
  iptal: ['İptal Edildi', '#F4F4F5', '#52525B', '#E4E4E7'],
  askida: ['Askıya Alındı', '#FCEEEF', '#A01223', '#F2B8BF'],
};

export const MOD = MODERATOR;

export type { HistEntry } from '@shared/sync';
/** Admin views read listings straight from the synced database. */
export type AdminNeed = DbNeed;

export const agoTxt = (m: number) =>
  m < 60 ? m + ' dk önce' : m < 1440 ? Math.floor(m / 60) + ' sa önce' : Math.floor(m / 1440) + ' gün önce';

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

export type { ReportStatus } from '@shared/sync';
export type Report = DbReport;

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
