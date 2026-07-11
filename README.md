<div align="center">

# 🎯 Career Copilot — Frontend

**Yapay zekâ destekli kariyer asistanı — React arayüzü**

CV yükle, iş ilanlarıyla uyumunu gör, en uygun ilanları keşfet, kişiye özel motivasyon mektubu üret.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

**🌐 Canlı demo:** [career-copilot-frontend-3ntf.onrender.com](https://career-copilot-frontend-3ntf.onrender.com)

<sub>Ücretsiz Render katmanında çalışır — backend 15 dk hareketsizlikte uyur, ilk istek ~50 sn sürebilir.</sub>

</div>

---

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Mimari](#mimari)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Testler](#testler)
- [Docker](#docker)
- [Öne Çıkan Teknik Kararlar](#öne-çıkan-teknik-kararlar)

---

## Genel Bakış

Bu depo, [Career Copilot](https://github.com/nisanuraltayy/career-copilot) backend API'sinin React tabanlı arayüzüdür. Kullanıcı kayıt olur/giriş yapar, CV'sini yükler, yapay zekânın çıkardığı becerileri görür, iş ilanlarıyla uyumunu ölçer ve kişiselleştirilmiş motivasyon mektubu üretir.

Backend ayrı bir depodadır: **[career-copilot](https://github.com/nisanuraltayy/career-copilot)** (FastAPI + PostgreSQL/pgvector + Google Gemini).

## Özellikler

| Sayfa | Açıklama |
|-------|----------|
| 🔐 **Giriş / Kayıt** | JWT tabanlı kimlik doğrulama; oturum access+refresh token ile sürdürülür. |
| 📄 **CV Analizi** | PDF yükle, AI'ın çıkardığı beceri/deneyim/eğitimi gör. |
| 📋 **İş İlanı Analizi** | İlan metnini yapıştır, gerekli/tercih edilen becerileri çıkar. |
| 🎯 **Uyum Analizi** | CV ↔ ilan uyumunu V1 (kelime eşleştirme) + V2 (LLM semantik) olarak gör. |
| 🔎 **Öneriler** | Bir CV'ye en uygun ilanları benzerlik skoruna göre sıralı listele. |
| ✍️ **Motivasyon Mektubu** | Seçilen CV + ilana özel mektup üret, kopyala. |
| 🕘 **Geçmiş** | Tüm CV/ilan/analiz/mektup kayıtlarına sekmeli erişim. |

## Teknoloji Yığını

- **React 19 + React Router 7** — SPA, client-side routing
- **Vite 8** — build/dev sunucusu
- **Vitest + jsdom** — birim testleri
- **@fontsource/inter** — self-hosted font (CDN bağımlılığı yok)
- **Docker (nginx)** — production'da statik servis + `/api` reverse proxy

Harici bir UI kütüphanesi/CSS framework'ü **kullanılmaz** — stiller inline + `index.css`'teki CSS değişkenleri (design token) ile yönetilir; bağımlılık yüzeyi minimal tutulur.

## Mimari

```
src/
├── lib/
│   ├── api.js          # Merkezi API istemcisi — TEK yer tüm backend çağrıları için
│   ├── api.test.js      # api.js birim testleri (vitest)
│   └── auth.jsx         # AuthProvider context — oturum durumu, token yönetimi
├── components/
│   ├── Layout.jsx        # Header/nav + Outlet (korumalı sayfaların çerçevesi)
│   ├── ProtectedRoute.jsx # Kimliksiz erişimi /login'e yönlendirir
│   ├── ErrorBoundary.jsx  # Beklenmeyen render hatalarında beyaz ekranı önler
│   └── GradientBlobs.jsx  # Dekoratif arka plan
├── pages/                 # Her özellik kendi sayfasında (CVYukle, IsIlani, UyumAnalizi, ...)
├── App.jsx                # Route tanımları (public: /login, /register — korumalı: geri kalanı)
├── index.css              # Design token'lar (renk/yüzey/kenarlık), global a11y stilleri
└── main.jsx                # Giriş noktası, font importları
```

### `api.js` — merkezi API katmanı

Tüm `fetch` çağrıları tek dosyadan geçer:

- **Base URL** `VITE_API_URL` env'inden — hardcoded host yok.
- **Tutarlı hata sözleşmesi** — backend'in `{error:{code,message}}` gövdesini `ApiError`'a çevirir; sayfalar sadece `error.message` gösterir.
- **Token yönetimi** — `Authorization: Bearer` header'ı otomatik eklenir.
- **401'de otomatik yenileme** — access token süresi dolarsa refresh token ile **bir kez** yenilenir ve istek sessizce tekrar denenir (kullanıcı fark etmez); yenileme de başarısızsa oturum temizlenir ve `/login`'e düşülür.

### Auth akışı

`AuthProvider` (`lib/auth.jsx`) uygulama açılışında saklı token'ı `/auth/me` ile doğrular. `ProtectedRoute`, kimliksiz erişimi `/login`'e yönlendirir. Token'lar `localStorage`'da tutulur (access + refresh ayrı anahtarlarda).

## Hızlı Başlangıç

**Gereksinimler:** Node.js 20+, çalışan bir [backend](https://github.com/nisanuraltayy/career-copilot) (lokalde veya canlıda).

```bash
git clone https://github.com/nisanuraltayy/career-copilot-frontend.git
cd career-copilot-frontend
npm install

cp .env.example .env          # VITE_API_URL'i backend adresine ayarla
npm run dev                   # http://localhost:5173
```

> Backend'i de lokalde çalıştırıyorsan, ikisini birlikte ayağa kaldırmanın en kolay yolu backend reposundaki `docker compose up` — bu durumda frontend nginx üzerinden `/api` proxy ile CORS'suz çalışır (bkz. [Docker](#docker)).

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|-----------|----------|
| `VITE_API_URL` | `http://127.0.0.1:8000` | Backend API adresi (build-time'da bundle'a gömülür) |

`.env.example` dosyasını `.env` olarak kopyala ve doldur.

## Testler

```bash
npm test          # vitest — api.js: hata parse, token ekleme, 401 yenileme, ağ hatası
npm run lint       # eslint
npm run build      # production build (dist/)
```

Testler gerçek backend'e vurmaz — `fetch` mock'lanır (`vi.fn()`); token davranışı ve hata dönüşümü izole test edilir.

## Docker

```bash
docker build -t career-copilot-frontend --build-arg VITE_API_URL=/api .
docker run -p 8080:80 career-copilot-frontend
```

Multi-stage build: Node ile derlenir, **nginx** ile statik servis edilir. `nginx.conf`:

- SPA fallback — bilinmeyen yol → `index.html` (client-side routing çalışsın diye).
- `/api/*` → backend'e reverse proxy (Docker Compose ağında `app:8000`) — **CORS gerekmez**, tarayıcı tek origin görür.

Backend reposundaki `docker-compose.yml` bu servisi otomatik dahil eder — tam yığın (frontend+backend+DB) için oradan `docker compose up --build`.

## Öne Çıkan Teknik Kararlar

- **Merkezi API istemcisi** — 7 sayfadaki dağınık `fetch` çağrıları tek `api.js`'e toplandı; hata sözleşmesi, base URL ve auth header'ı tek yerden yönetilir.
- **Sessiz token yenileme** — kullanıcı access token'ın süresi dolduğunu fark etmez; `api.js` refresh token ile otomatik yeniler ve isteği tekrar dener (eşzamanlı 401'lerde tek bir yenileme çağrısı — paylaşılan promise).
- **Design token'lar** — renkler `index.css`'te CSS değişkenleri olarak tanımlı; marka rengini değiştirmek tek dosyadan yapılır.
- **Erişilebilirlik** — global `:focus-visible` halkası, buton hover/active geri bildirimi, `prefers-reduced-motion` desteği (inline stilin yapamadığı pseudo-class/media query'ler global CSS'te).
- **Self-hosted font** — Inter, CDN'e bağımlı olmadan `@fontsource` ile bundle'a gömülü; offline/Docker'da da doğru render olur.
- **ErrorBoundary** — render sırasında beklenmeyen bir hata tüm uygulamayı beyaz ekrana düşürmez; kullanıcıya "yeniden dene" seçeneği sunulur.
- **CORS'suz production** — nginx `/api` reverse proxy ile frontend ve backend tarayıcı gözünde aynı origin; CORS yapılandırması sadeleşir.

---

<div align="center">
<sub>MIT lisansı · Senior frontend pratiklerini sergilemek için geliştirilmiş portfolyo projesi</sub>
</div>
