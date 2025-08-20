# 🐳 CRM Sistemi - Docker Kurulum Rehberi

Bu proje Docker ile tamamen containerized halde çalışmaktadır. Tüm servisleri (PostgreSQL, Spring Boot Backend, React Frontend) tek komutla başlatabilirsiniz.

## 📋 Gereksinimler

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0+)

## 🚀 Hızlı Başlangıç

### 1. Tüm servisleri başlat
```bash
# Ana dizinde
docker-compose up -d
```

### 2. Logları izle
```bash
docker-compose logs -f
```

### 3. Uygulamaya erişim
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **PgAdmin** (isteğe bağlı): http://localhost:5050

## 🔧 Detaylı Komutlar

### Servisleri Yönetme
```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece backend'i başlat
docker-compose up -d backend

# Belirli servisi yeniden başlat
docker-compose restart frontend

# Servisleri durdur
docker-compose stop

# Servisleri tamamen kaldır (veriler korunur)
docker-compose down

# Tüm verileri sil (DİKKAT!)
docker-compose down -v
```

### Logları İzleme
```bash
# Tüm servislerin logları
docker-compose logs -f

# Sadece backend logları
docker-compose logs -f backend

# Son 100 satır
docker-compose logs --tail=100 frontend
```

### Development Modunda Çalıştırma
```bash
# PgAdmin ile birlikte başlat
docker-compose --profile tools up -d
```

## 🏗️ Build İşlemleri

### Tek Servis Build Etme
```bash
# Backend'i yeniden build et
docker-compose build backend

# Frontend'i yeniden build et
docker-compose build frontend

# Cache kullanmadan build et
docker-compose build --no-cache
```

### Manuel Docker Build
```bash
# Backend
cd crm-etiya
docker build -t crm-backend .

# Frontend
cd frontend
docker build -t crm-frontend .
```

## 🔍 Troubleshooting

### Port Çakışması
Eğer portlar kullanılıyorsa, `docker-compose.yml`'de port'ları değiştirin:
```yaml
ports:
  - "3001:80"  # Frontend için
  - "8081:8080"  # Backend için
```

### Database Bağlantı Sorunu
```bash
# PostgreSQL'in hazır olup olmadığını kontrol et
docker-compose exec postgres pg_isready -U postgres

# Database loglarını kontrol et
docker-compose logs postgres
```

### Container'ları Temizleme
```bash
# Kullanılmayan container'ları temizle
docker container prune

# Kullanılmayan image'ları temizle
docker image prune

# Tüm Docker sistemini temizle (DİKKAT!)
docker system prune -a
```

## 📊 Health Check

Tüm servisler health check ile kontrol edilmektedir:
```bash
# Servislerin durumunu kontrol et
docker-compose ps

# Detaylı health durumu
docker inspect crm-backend --format='{{.State.Health.Status}}'
```

## 🔐 Güvenlik

### Production'da Değiştirilmesi Gerekenler
1. **Database şifreleri**: `docker-compose.yml`'deki `POSTGRES_PASSWORD`
2. **JWT Secret**: `JWT_SECRET` environment variable
3. **PgAdmin şifreleri**: `PGADMIN_DEFAULT_PASSWORD`

### Environment Dosyası (.env)
```bash
# .env dosyası oluştur
cat > .env << EOF
POSTGRES_PASSWORD=güçlü_şifre_123
JWT_SECRET=çok_uzun_ve_güvenli_jwt_secret_anahtarı
PGADMIN_PASSWORD=admin_şifresi_456
EOF
```

## 📁 Proje Yapısı

```
crm_etiya/
├── docker-compose.yml          # Ana orchestration dosyası
├── crm-etiya/
│   ├── Dockerfile             # Backend Dockerfile
│   └── .dockerignore          # Backend ignore dosyası
├── frontend/
│   ├── Dockerfile             # Frontend Dockerfile
│   ├── nginx.conf             # Nginx konfigürasyonu
│   └── .dockerignore          # Frontend ignore dosyası
└── docker/
    └── postgres/              # DB init scriptleri
```

## 🎯 Özellikler

- ✅ **Multi-stage builds** - Küçük production image'ları
- ✅ **Health checks** - Servis sağlığı kontrolü
- ✅ **Auto-restart** - Çökme durumunda otomatik restart
- ✅ **Volume persistence** - Veritabanı verilerini koruma
- ✅ **Network isolation** - Güvenli container iletişimi
- ✅ **Production ready** - Nginx + security headers

## 🆘 Destek

Sorun yaşıyorsanız:
1. `docker-compose logs` ile logları kontrol edin
2. `docker-compose ps` ile servis durumlarını görün
3. Port çakışmalarını kontrol edin
4. Docker'ın güncel olduğundan emin olun

---

**Not**: Bu Docker setup'ı mevcut projeyi hiç bozmaz. İstediğiniz zaman `docker-compose down` ile kapatıp normal şekilde çalışmaya devam edebilirsiniz.

