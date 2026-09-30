# Kanbağ · Çalıştırma ve test rehberi

Üç parça birlikte çalışır:

| Klasör | Ne | Nerede çalışır |
| --- | --- | --- |
| `server/` | Canlı senkron sunucusu (WebSocket, port **4000**) | Bilgisayar |
| `admin/` | Yönetim paneli (Vite + React, port **5174**) | Bilgisayardaki tarayıcı |
| `mobile/` | Mobil uygulama (Expo) | Telefonda **Expo Go** ile |

Mobil uygulama ve admin paneli aynı sunucuya bağlanır. Bir taraftaki işlem diğer tarafta anında görünür.

## 0. Gereksinimler

- **Node.js 20 veya üstü** (tercihen 22 LTS): https://nodejs.org
- **Git**
- Telefonda **Expo Go** uygulamasının güncel sürümü (App Store / Google Play). Uygulama Expo SDK 57 kullanır.
- Telefon ve bilgisayar **aynı Wi-Fi ağına** bağlı olmalı.

## 1. Projeyi indir

```bash
git clone https://github.com/AliTasc1/kanba-.git
cd kanba-
```

## 2. Senkron sunucusunu başlat (1. terminal)

```bash
cd server
npm install
npm start
```

Çıktıda bilgisayarın ağ adresi görünür:

```
Kanbağ sync server çalışıyor · port 4000
  Bu bilgisayar:  ws://localhost:4000
  Aynı Wi-Fi:     ws://192.168.1.20:4000
```

Bu terminali açık bırak. Uygulamalar bağlandıkça ve işlem yaptıkça buraya log düşer (`mobile → need.create` gibi).

> **Windows:** İlk çalıştırmada "Node.js ağ erişimi" uyarısı çıkarsa **Özel ağlar** için izin ver. İzin vermezsen telefon sunucuya bağlanamaz.
> **macOS:** "Gelen bağlantılara izin ver" sorusuna **İzin Ver** de.

## 3. Admin panelini başlat (2. terminal)

```bash
cd admin
npm install
npm run dev
```

Tarayıcıda **http://localhost:5174** adresini aç. Sağ üstte yeşil **● Canlı senkron** yazısı sunucuya bağlandığını gösterir. Kırmızı **Sunucu yok** yazıyorsa 2. adımı kontrol et.

## 4. Mobil uygulamayı Expo'da başlat (3. terminal)

```bash
cd mobile
npm install
npx expo start
```

Terminalde bir **QR kod** çıkar.

- **Android:** Expo Go'yu aç → "Scan QR code" → QR'ı okut.
- **iPhone:** Kamera uygulamasıyla QR'ı okut → çıkan bildirime dokun (Expo Go'da açılır).

İlk açılış biraz sürebilir (paket hazırlanıyor). Uygulama splash → onboarding ile başlar. "Atla"/"Devam" ile giriş ekranına geçip telefon numarası gir (herhangi 10 hane). SMS kodu olarak herhangi 6 hane gir (`000000` hata ekranını gösterir). Profil adımlarını tamamlayınca ana sayfa açılır.

Bağlantıyı kontrol etmek için: **Profil → Ayarlar → Canlı bağlantı**. Burada **● Bağlı** yazmalı.

Mobil uygulama, senkron sunucusunun adresini Expo'nun adresinden otomatik bulur. QR'daki IP ile sunucunun IP'si aynı bilgisayardır.

## 5. Canlı senkronu test et

| Mobilde yap | Admin panelinde gör |
| --- | --- |
| Ana Sayfa → **Acil Kan İhtiyacı Oluştur** → 6 adımı doldur → **İhtiyacı Yayınla** | **Doğrulama Bekleyenler** listesinin en üstünde yeni ilan (`KB-41-2xxxx`) ve "Yeni ilan" bildirimi |
| Bir ilanda **Kan Bağışında Bulunacağım → Evet** (örn. İzmit 0 Rh+ ilanı) | İlanın geçmişinde "Bağış planı oluşturdu", gönüllü sayısı +1 |
| **Bağış Yaptım** → beyan kutusu → **Bağışı Kaydet** | **Bağışlar** sayfasında "Beyan" durumunda yeni satır |
| İlan detayı → **Bu ilanı bildir** → neden seç → **Bildir** | **Şikayetler** sayfasında yeni/artan şikayet |
| Profil → Uygulamayı destekle → tutar → ödeme | **Destek Ödemeleri** listesinde yeni ödeme |

| Admin panelinde yap | Mobilde gör |
| --- | --- |
| Doğrulama Bekleyenler → yeni ilana tıkla → **Doğrula** | "İlanın doğrulandı ve yayına alındı." bildirimi; ilan ACİL/ÖNCELİKLİ olarak yayında |
| Aynı ilanda **Reddet** | "İlanın doğrulanamadı…" bildirimi; ilan listeden kalkar |
| Bağışlar → "Beyan" satırındaki **Doğrula** | Bağışlarım'da **✓ DOĞRULANMIŞ**; ilanın karşılanan ünitesi artar |
| İhtiyaçlar → bir ilan → **Askıya al** / **Karşılandı işaretle** | İlan listeden kalkar / "Karşılandı" olur; açık olan detay ekranı "Bu ilan artık aktif değil"e geçer |

Aynı anda birden fazla telefon veya tarayıcı bağlanabilir, hepsi aynı veriyi görür.

## Faydalı komutlar

- Sunucudaki güncel veri: tarayıcıda `http://localhost:4000/state`
- Demo verilerini sıfırla: `curl -X POST http://localhost:4000/reset` (veya sunucuyu durdurup yeniden başlat; veri bellekte tutulur)
- Mobil uygulamayı tarayıcıda denemek: `mobile` klasöründe `npx expo start --web`. Android görünümü için adrese `?os=android`, koyu tema için `?theme=dark` ekle.

## Sorun giderme

- **Mobilde "Çevrimdışı" yazıyor / admin'de değişiklik görünmüyor.**
  1. Telefon ve bilgisayar aynı Wi-Fi'de mi?
  2. Güvenlik duvarı port 4000'i engelliyor mu?
  3. `npx expo start --tunnel` kullanıyorsan senkron çalışmaz; normal (LAN) modda başlat.
  4. Gerekirse adresi elle ver: `EXPO_PUBLIC_SYNC_URL=ws://192.168.1.20:4000 npx expo start` (Windows PowerShell: `$env:EXPO_PUBLIC_SYNC_URL="ws://192.168.1.20:4000"; npx expo start`).
- **Expo Go "incompatible SDK" diyor:** Expo Go'yu mağazadan güncelle.
- **Sunucu kapalıyken:** Uygulamalar yerel veriyle çalışmaya devam eder ve her 2 saniyede bir yeniden bağlanmayı dener. Bu durumda mobilde oluşturulan ilan, demo olarak yaklaşık 8 saniye sonra kendi kendine doğrulanır.
