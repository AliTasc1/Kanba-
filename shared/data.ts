// Kanbağ demo data and pure helpers, ported from the Claude Design prototype
// (project/KanbagApp.dc.html). Shared by the mobile app and the admin panel.

export type Blood = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
export type NeedStatus = 'acil' | 'oncelikli' | 'aktif' | 'bekliyor' | 'karsilandi';

export interface Need {
  id: string;
  blood: Blood;
  units: number;
  met: number;
  going: number;
  status: NeedStatus;
  /** Status the listing takes once verified (only on user-created needs). */
  final?: NeedStatus;
  verified: boolean;
  hospital: string;
  dept: string;
  district: string;
  city: string;
  dist: number;
  mins: number;
  deadline: string;
  forName: string;
  cond: string;
  mine?: boolean;
}

/** v = doğrulanmış, b = beyan, p = beyan · onay bekliyor */
export type DonationStatus = 'v' | 'b' | 'p';

export interface Donation {
  date: string;
  units: number;
  need: Blood | null;
  hospital: string;
  place: string;
  st: DonationStatus;
  id?: string;
}

/** Demo user Ali is 0 Rh+. */
export const USER_BLOOD: Blood = '0+';

/** Red-cell donor compatibility: donor group → recipient groups it can give to. */
export const DONOR: Record<Blood, Blood[]> = {
  '0-': ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  '0+': ['0+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const BLOODS: Blood[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

export const canDonateTo = (need: Blood, donor: Blood = USER_BLOOD) => DONOR[donor].includes(need);

export const NEEDS: Need[] = [
  { id: 'KB-41-20947', blood: 'A+', units: 3, met: 1, going: 1, status: 'acil', verified: true, hospital: 'Kocaeli Şehir Hastanesi', dept: 'Yoğun Bakım Ünitesi', district: 'Başiskele', city: 'Kocaeli', dist: 2.4, mins: 18, deadline: 'Bugün 21:00’e kadar', forName: 'Mehmet Y.', cond: 'Yoğun bakım' },
  { id: 'KB-41-20931', blood: '0+', units: 4, met: 2, going: 2, status: 'acil', verified: true, hospital: 'Kocaeli Üniversitesi Araştırma ve Uygulama Hastanesi', dept: 'Genel Cerrahi', district: 'İzmit', city: 'Kocaeli', dist: 7.8, mins: 35, deadline: 'Bugün 18:00’e kadar', forName: 'Ayşe T.', cond: 'Ameliyat' },
  { id: 'KB-41-20899', blood: 'B+', units: 4, met: 2, going: 1, status: 'oncelikli', verified: true, hospital: 'Derince Eğitim ve Araştırma Hastanesi', dept: 'Hematoloji', district: 'Derince', city: 'Kocaeli', dist: 12.1, mins: 75, deadline: 'Yarın 12:00’ye kadar', forName: 'Hasan D.', cond: 'Acil tedavi' },
  { id: 'KB-41-20952', blood: '0-', units: 2, met: 0, going: 0, status: 'acil', verified: true, hospital: 'Gebze Fatih Devlet Hastanesi', dept: 'Acil Servis', district: 'Gebze', city: 'Kocaeli', dist: 44.6, mins: 42, deadline: 'Şimdi · 3 saat içinde', forName: 'Elif K.', cond: 'Acil tedavi' },
  { id: 'KB-41-20918', blood: 'B-', units: 2, met: 1, going: 0, status: 'aktif', verified: true, hospital: 'Gölcük Necati Çelik Devlet Hastanesi', dept: 'Ortopedi', district: 'Gölcük', city: 'Kocaeli', dist: 14.3, mins: 160, deadline: '3 Ekim, 10:00', forName: 'Mustafa Ö.', cond: 'Ameliyat' },
  { id: 'KB-41-20960', blood: 'AB+', units: 2, met: 0, going: 0, status: 'bekliyor', verified: false, hospital: 'Darıca Farabi Eğitim ve Araştırma Hastanesi', dept: 'Kadın Doğum', district: 'Darıca', city: 'Kocaeli', dist: 49.2, mins: 9, deadline: 'Yarın 18:00’e kadar', forName: 'Zeynep A.', cond: 'Ameliyat' },
  { id: 'KB-41-20811', blood: 'A-', units: 1, met: 1, going: 0, status: 'karsilandi', verified: true, hospital: 'İzmit Seka Devlet Hastanesi', dept: 'Dahiliye', district: 'İzmit', city: 'Kocaeli', dist: 8.5, mins: 320, deadline: 'Bugün 14:00’e kadar', forName: 'Fatma S.', cond: 'Acil tedavi' },
  { id: 'KB-54-10432', blood: '0+', units: 3, met: 1, going: 1, status: 'aktif', verified: true, hospital: 'Sakarya Eğitim ve Araştırma Hastanesi', dept: 'Onkoloji', district: 'Adapazarı', city: 'Sakarya', dist: 38.4, mins: 190, deadline: 'Yarın 20:00’ye kadar', forName: 'Kemal B.', cond: 'Acil tedavi' },
];

export const HOSPITALS: { n: string; d: string }[] = [
  { n: 'Kocaeli Şehir Hastanesi', d: 'Başiskele' },
  { n: 'Kocaeli Üniversitesi Araştırma ve Uygulama Hastanesi', d: 'İzmit' },
  { n: 'Derince Eğitim ve Araştırma Hastanesi', d: 'Derince' },
  { n: 'Gebze Fatih Devlet Hastanesi', d: 'Gebze' },
  { n: 'Darıca Farabi Eğitim ve Araştırma Hastanesi', d: 'Darıca' },
  { n: 'İzmit Seka Devlet Hastanesi', d: 'İzmit' },
  { n: 'Gölcük Necati Çelik Devlet Hastanesi', d: 'Gölcük' },
  { n: 'Körfez Devlet Hastanesi', d: 'Körfez' },
  { n: 'Kandıra Devlet Hastanesi', d: 'Kandıra' },
  { n: 'Karamürsel Devlet Hastanesi', d: 'Karamürsel' },
];

export const DONATIONS: Donation[] = [
  { date: '18 Haziran 2026', units: 1, need: 'A+', hospital: 'Kocaeli Şehir Hastanesi', place: 'Başiskele / Kocaeli', st: 'v' },
  { date: '04 Mart 2026', units: 1, need: '0+', hospital: 'Gebze Fatih Devlet Hastanesi', place: 'Gebze / Kocaeli', st: 'v' },
  { date: '21 Kasım 2025', units: 1, need: 'B+', hospital: 'Sakarya Eğitim ve Araştırma Hastanesi', place: 'Adapazarı / Sakarya', st: 'b' },
  { date: '09 Ağustos 2025', units: 1, need: 'AB+', hospital: 'Derince Eğitim ve Araştırma Hastanesi', place: 'Derince / Kocaeli', st: 'v' },
  { date: '14 Nisan 2025', units: 1, need: null, hospital: 'Kan Bağış Merkezi, İzmit', place: 'İzmit / Kocaeli', st: 'b' },
];

export const PROVINCES = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

/** District lists exist only for five provinces in the demo. */
export const DISTRICTS: Record<string, string[]> = {
  Kocaeli: ['İzmit', 'Gebze', 'Darıca', 'Çayırova', 'Dilovası', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Gölcük', 'Karamürsel', 'Kandıra'],
  Sakarya: ['Adapazarı', 'Akyazı', 'Arifiye', 'Erenler', 'Ferizli', 'Geyve', 'Hendek', 'Karapürçek', 'Karasu', 'Kaynarca', 'Kocaali', 'Pamukova', 'Sapanca', 'Serdivan', 'Söğütlü', 'Taraklı'],
  İstanbul: ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  Ankara: ['Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan', 'Kalecik', 'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'],
  İzmir: ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
};

export const STATUS_RANK: Record<NeedStatus, number> = { acil: 0, oncelikli: 1, aktif: 2, bekliyor: 3, karsilandi: 4 };
export const URGENCY_FOR_WHEN: Record<string, NeedStatus> = { Şimdi: 'acil', Bugün: 'acil', Yarın: 'oncelikli', Belirli: 'oncelikli' };

export const REPORT_REASONS = ['Yanlış bilgi', 'Şüpheli ilan', 'Artık ihtiyaç yok', 'Yanlış hastane', 'Yanlış kan grubu', 'Taciz / kötüye kullanım', 'Diğer'];

// ---------- formatting ----------
export const km = (d: number) => d.toFixed(1).replace('.', ',') + ' km';
export const ago = (m: number) => (m < 1 ? 'Az önce' : m < 60 ? m + ' dk önce' : Math.floor(m / 60) + ' sa önce');
/** "0+" → "0 Rh+", "A-" → "A Rh−" */
export const longBlood = (b?: string | null) =>
  b ? b.replace(/^(0|A|B|AB)([+-])$/, (_x, g, r) => g + ' Rh' + (r === '+' ? '+' : '−')) : '';
export const lc = (s?: string) => (s || '').toLocaleLowerCase('tr');
export const shortName = (s: string) => {
  const p = (s || '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '';
  if (p.length === 1) return p[0];
  return p[0] + ' ' + p[p.length - 1][0].toLocaleUpperCase('tr') + '.';
};
export const unitLabel = (u: number) => (u >= 5 ? '5+ ünite' : u + ' ünite');
export const nf = (v: number) => Number(v).toLocaleString('tr-TR');
export const fmtPhone = (digits: string) =>
  [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(' ');
export const fmtDob = (digits: string) => [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.');

// ---------- per-province demo stats ----------
const WGT: Record<string, number> = { İstanbul: 9, Ankara: 4.6, İzmir: 3.8, Bursa: 2.8, Antalya: 2.4, Konya: 2.1, Adana: 2.1, Gaziantep: 1.9, Şanlıurfa: 1.8, Mersin: 1.8, Diyarbakır: 1.6, Hatay: 1.5, Kayseri: 1.4, Manisa: 1.3, Samsun: 1.3, Sakarya: 1.2, Balıkesir: 1.1, Kahramanmaraş: 1.1, Van: 1.1, Tekirdağ: 1.0, Denizli: 1.0, Eskişehir: 1.0, Aydın: 1.0, Malatya: 0.9, Trabzon: 0.9, Muğla: 0.9, Erzurum: 0.8, Mardin: 0.8, Ordu: 0.7, Afyonkarahisar: 0.7, Elazığ: 0.6, Batman: 0.6, Sivas: 0.6, Adıyaman: 0.6, Tokat: 0.55, Zonguldak: 0.55, Çorum: 0.5, Osmaniye: 0.5, Kütahya: 0.5, Aksaray: 0.45, Isparta: 0.45, Düzce: 0.45, Yalova: 0.35 };

/** Deterministic 0..1 hash (FNV-1a) so demo figures are stable everywhere. */
export const hash01 = (s: string, k: number) => {
  let x = 2166136261 ^ k;
  for (const ch of s) {
    x ^= ch.charCodeAt(0);
    x = Math.imul(x, 16777619);
  }
  return ((x >>> 0) % 10000) / 10000;
};

export interface ProvinceStats { active: number; met: number; donation: number; vol: number }

export const provinceStats = (n: string): ProvinceStats => {
  if (n === 'Kocaeli') return { active: 12, met: 145, donation: 428, vol: 1284 };
  const w = WGT[n] ?? 0.18 + 0.2 * hash01(n, 1);
  const donation = Math.round(190 * w * (0.9 + 0.2 * hash01(n, 2)));
  return {
    active: Math.max(1, Math.round(5 * w * (0.6 + 0.8 * hash01(n, 3)))),
    met: Math.round(donation * (0.3 + 0.08 * hash01(n, 4))),
    donation,
    vol: Math.round(donation * (2.8 + 0.6 * hash01(n, 5))),
  };
};

export const TOTALS = PROVINCES.reduce(
  (a, p) => {
    const s = provinceStats(p);
    a.don += s.donation;
    a.met += s.met;
    a.vol += s.vol;
    a.active += s.active;
    return a;
  },
  { don: 0, met: 0, vol: 0, active: 0 },
);

export const MONTHS = ['Eki', 'Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl'];
export const MONTHLY_DONATIONS = [812, 856, 905, 1010, 968, 1042, 1120, 1164, 1098, 1205, 1262, 1318];

export const KOCAELI_DISTRICT_DONATIONS: [string, number][] = [['İzmit', 118], ['Gebze', 96], ['Darıca', 41], ['Çayırova', 33], ['Kartepe', 29], ['Gölcük', 27], ['Derince', 24], ['Körfez', 22], ['Başiskele', 19], ['Karamürsel', 8], ['Kandıra', 7], ['Dilovası', 4]];

/** District donation distribution for a province (top 8, largest first). */
export const cityDistrictDonations = (city: string): [string, number][] => {
  if (city === 'Kocaeli') return KOCAELI_DISTRICT_DONATIONS.slice(0, 8);
  const ds = DISTRICTS[city];
  if (!ds) return [];
  const w = ds.map((d) => [d, 0.3 + hash01(city + d, 7)] as [string, number]);
  const sum = w.reduce((a, x) => a + x[1], 0);
  const total = provinceStats(city).donation;
  return w
    .map(([d, x]) => [d, Math.max(1, Math.round((total * x) / sum))] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
};

export const cityMonthly = (city: string) => MONTHLY_DONATIONS.map((v, i) => Math.round(v * (0.8 + 0.4 * hash01(city, i + 10))));

/** SVG path for a small line/area chart (same geometry as the prototype). */
export const linePath = (vals: number[], W = 320, H = 120, pad = 10) => {
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const pts = vals.map((v, i) => [pad + (i * (W - 2 * pad)) / (vals.length - 1), H - pad - ((v - mn) / (mx - mn || 1)) * (H - 2 * pad - 14)]);
  const line = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  const L = pts[pts.length - 1];
  return { line, area: line + ' L' + L[0].toFixed(1) + ' ' + H + ' L' + pts[0][0].toFixed(1) + ' ' + H + ' Z', cx: L[0], cy: L[1] };
};

// ---------- content ----------
export const ONBOARDING = [
  { t: 'Bir İhtiyaç, Binlerce Gönüllü', s: 'Türkiye’nin 81 ilindeki kan ihtiyaçlarını gönüllü bağışçılarla bir araya getiriyoruz.' },
  { t: 'Yakınındaki İhtiyaçlardan Haberdar Ol', s: 'Konumun veya seçtiğin il ve ilçeye göre, kan grubuna uygun ihtiyaçları gösteririz.' },
  { t: 'Bağışlarını Takip Et', s: 'Ne zaman, hangi ihtiyaç için ve ne kadar kan bağışladığını tek yerde kayıt altında tut.' },
  { t: 'Dayanışmanın Etkisini Gör', s: 'Toplam bağışları, karşılanan ihtiyaçları ve birlikte oluşturduğumuz etkiyi takip et.' },
];

export type NotifType = 'acil' | 'status' | 'remind' | 'history' | 'vol' | 'news';
export interface AppNotification { id: number; g: string; type: NotifType; t: string; b: string; meta?: string; time: string; cta?: string; need?: string; unread?: boolean; go?: string }

export const NOTIFICATIONS: AppNotification[] = [
  { id: 1, g: 'Bugün', type: 'acil', t: 'Acil Kan İhtiyacı', b: 'Yakınında A+ kan grubuna ihtiyaç var.', meta: 'Başiskele / Kocaeli · 2,4 km', time: '18 dk', cta: 'Detayları Gör', need: 'KB-41-20947', unread: true },
  { id: 2, g: 'Bugün', type: 'acil', t: 'Acil Kan İhtiyacı', b: 'Kan grubuna (0 Rh+) uygun bir ihtiyaç var.', meta: 'İzmit / Kocaeli · 7,8 km', time: '35 dk', cta: 'Detayları Gör', need: 'KB-41-20931', unread: true },
  { id: 3, g: 'Bugün', type: 'status', t: 'Destek olduğun ilan güncellendi', b: 'Mehmet Y. için A+ ihtiyacında 1 / 3 ünite karşılandı.', time: '2 sa', need: 'KB-41-20947' },
  { id: 4, g: 'Bu hafta', type: 'remind', t: 'Yeniden bağış yapabilirsin', b: 'Son bağışının üzerinden 90 gün geçti. Uygun ihtiyaçlar seni bekliyor.', time: 'Pzt' },
  { id: 5, g: 'Bu hafta', type: 'history', t: 'Bağışın doğrulandı', b: '18 Haziran 2026 tarihli bağışın ilan sahibi tarafından onaylandı.', time: 'Paz' },
  { id: 6, g: 'Bu hafta', type: 'vol', t: 'Kocaeli’de bu hafta', b: '64 gönüllü toplam 71 ünite kan bağışladı.', time: 'Cmt' },
  { id: 7, g: 'Daha önce', type: 'news', t: 'Yeni: İl bazlı etki haritası', b: '81 ilde ihtiyaç ve bağış yoğunluğunu haritada gör.', time: '22 Eyl', go: 'map' },
];

export const FAQ: [topic: string, q: string, a: string][] = [
  ['Kan bağışı', 'Kan bağışı nasıl yapılır?', 'Kimliğinle bir kan bağış merkezine veya hastanenin kan merkezine başvurursun. Kısa bir sağlık sorgulaması ve ön muayeneden sonra yaklaşık 10–15 dakikada yaklaşık 450 ml kan alınır.'],
  ['Kan bağışı', 'Kimler kan bağışlayabilir?', 'Genel olarak 18–65 yaş arası, en az 50 kg ve sağlıklı kişiler bağış yapabilir. Son tam kan bağışından sonra erkeklerde 90, kadınlarda 120 gün beklenir. Nihai karar bağış merkezindeki hekime aittir.'],
  ['Kan bağışı', 'Kan bağışı yaptıktan sonra ne yapmalıyım?', 'Bol sıvı al, birkaç saat ağır fiziksel aktiviteden kaçın ve bağış yerindeki bandı bir süre çıkarma. Baş dönmesi olursa otur ya da uzan.'],
  ['İlanlar', 'Acil kan ihtiyacı nasıl oluşturulur?', 'Ana sayfadaki “Acil Kan İhtiyacı Oluştur” butonuyla 6 adımda: kan grubu ve miktar, hasta bilgisi, hastane, zaman, iletişim ve onay.'],
  ['İlanlar', 'İlan nasıl doğrulanır?', 'İlanlar yayına alınmadan önce hastane ve iletişim bilgileri kontrol edilir. Doğrulanan ilanlarda “✓ Doğrulanmış İhtiyaç” etiketi görünür.'],
  ['Gizlilik', 'Konum bilgilerim nasıl kullanılır?', 'Yalnızca izin verirsen ve yalnızca mesafe hesaplamak için kullanılır; kimseyle paylaşılmaz. İzin vermezsen seçtiğin il ve ilçe kullanılır.'],
  ['Gizlilik', 'Telefon numaram kimlere görünür?', 'Hiç kimseye herkese açık gösterilmez. Telefonla iletişimi seçersen, numaran yalnızca bağış planını onaylayan gönüllülere gösterilir.'],
  ['Hesap', 'Bağış geçmişimi nasıl görebilirim?', 'Alt menüdeki “Bağışlarım” sekmesinden tüm bağışlarını, durumlarını ve toplam istatistiklerini görebilirsin.'],
  ['İlanlar', 'Yanlış oluşturulan ilanı nasıl bildiririm?', 'İlan detayındaki “Bu ilanı bildir” bağlantısından bir neden seçerek bildirebilirsin. Bildirimin anonimdir.'],
  ['Hesap', 'Uygulama hangi illerde kullanılabilir?', 'Kanbağ, Türkiye’nin 81 ilinin tamamında kullanılabilir.'],
];
