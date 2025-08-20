# CRM Sistemi Frontend Dokümantasyonu

## 🚀 Teknolojiler

- **React 18** - Modern UI geliştirme
- **TypeScript** - Tip güvenliği
- **Redux Toolkit** - State yönetimi
- **Material UI v5** - UI framework
- **React Router v6** - Routing
- **Formik & Yup** - Form yönetimi ve validasyon
- **Chart.js** - Grafikler
- **Axios** - API istekleri
- **Date-fns** - Tarih işlemleri

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Store ve hook konfigürasyonları
├── components/            # Yeniden kullanılabilir bileşenler
│   ├── auth/             # Kimlik doğrulama bileşenleri
│   ├── dashboard/        # Dashboard widget'ları
│   └── layout/           # Layout bileşenleri
├── features/             # Redux toolkit slice'ları
│   ├── auth/
│   ├── customers/
│   └── tasks/
├── pages/                # Sayfa bileşenleri
├── services/            # API servisleri
└── styles/              # Ortak stiller
```

## 🔐 Kimlik Doğrulama ve Yetkilendirme

### Login/Register Sistemi
- JWT tabanlı kimlik doğrulama
- Token yönetimi ve yenileme
- Oturum kontrolü
- Güvenli şifre yönetimi

### Rol Yönetimi
- Admin ve User rolleri
- Role dayalı sayfa erişimi
- Yetkisiz erişim kontrolü
- Rol bazlı içerik filtreleme

## 📊 Dashboard

### İstatistik Kartları
- Toplam müşteri sayısı
- Toplam görev sayısı
- Tamamlanan görevler
- Bekleyen görevler

### Grafikler
- Görev durumu dağılımı (Pie Chart)
- Görev trendi (Line Chart)
- Role göre özelleştirilmiş görünüm

## 👥 Müşteri Yönetimi

### Müşteri Listeleme
- Sayfalama
- Sıralama
- Filtreleme
- Arama
- Durum göstergeleri

### Müşteri İşlemleri
- Yeni müşteri ekleme
- Müşteri bilgilerini düzenleme
- Müşteri silme (soft delete)
- Müşteri detay görüntüleme

## ✅ Görev Yönetimi

### Görev Listeleme
- Role göre filtreleme (Admin/User)
- Durum filtreleme
- Tarih bazlı sıralama
- Müşteriye göre filtreleme

### Görev İşlemleri
- Yeni görev oluşturma
- Görev düzenleme
- Durum güncelleme
- Görev atama

### Form Validasyonları
- Başlık (min: 3, max: 100 karakter)
- Açıklama (min: 10, max: 500 karakter)
- Geçmiş tarih kontrolü
- Zorunlu alan kontrolleri
- Türkçe hata mesajları

### Yetkilendirme Kontrolleri
- Admin tüm görevleri yönetebilir
- Kullanıcılar kendi görevlerini görebilir/düzenleyebilir
- Yetkisiz erişimde hata mesajları
- Role göre buton/form kontrolü

## 🎨 UI/UX Özellikleri

### Responsive Tasarım
- Mobil uyumlu layout
- Breakpoint bazlı grid sistemi
- Esnek form tasarımı
- Touch-friendly bileşenler

### Kullanıcı Deneyimi
- Loading durumları
- Error handling
- Success mesajları
- Form reset/iptal
- Sayfa geçiş animasyonları

### Stil ve Tema
- Material Design
- Tutarlı renk paleti
- Tipografi sistemi
- Özelleştirilmiş bileşenler
- Light/Dark tema desteği (planlanan)

## 🔄 State Yönetimi

### Redux Store
- Merkezi state yönetimi
- Slice bazlı modüler yapı
- TypeScript tip desteği
- Redux DevTools entegrasyonu

### Form State
- Formik form yönetimi
- Yup validasyon şemaları
- Form state persistence
- Error/touched state yönetimi

## 🔒 Güvenlik

### Input Güvenliği
- XSS koruması
- Input sanitization
- CSRF koruması
- Rate limiting

### Erişim Kontrolü
- Route koruması
- Role-based access control
- JWT token validasyonu
- Session yönetimi

## 🚦 API Entegrasyonu

### Servis Katmanı
- Axios instance
- İstek/yanıt interceptor'ları
- Error handling
- Mock data desteği

### Veri Yönetimi
- CRUD operasyonları
- Async thunk'lar
- Loading state'leri
- Cache yönetimi

## 📱 Progressive Web App (Planlanan)

- Offline çalışma
- Push notifications
- App-like deneyim
- Hızlı yükleme

## 🌐 Uluslararasılaştırma (Planlanan)

- Çoklu dil desteği
- RTL desteği
- Yerel tarih/saat formatları
- Dinamik içerik çevirisi

## 📊 Performans Optimizasyonları (Planlanan)

- Code splitting
- Lazy loading
- Bundle size optimizasyonu
- Memoization
- Virtual scrolling

## 🧪 Test (Planlanan)

- Unit testler
- Integration testler
- E2E testler
- Performance testleri

## 📦 Build ve Deployment

- Vite build sistemi
- Environment konfigürasyonu
- Docker desteği
- CI/CD pipeline (planlanan)

## 🔄 Versiyon Kontrolü

- Git flow
- Semantic versioning
- Changelog yönetimi
- Pull request template'leri