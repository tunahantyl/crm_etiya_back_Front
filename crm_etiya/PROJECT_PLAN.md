# CRM Projesi Geliştirme Planı

## Proje Amacı
Kullanıcıların müşteri bilgilerini ve görevlerini yönetebileceği, Clean Architecture prensipleriyle geliştirilmiş modüler bir CRM sistemi oluşturmak.

## Teknoloji Stack
- Backend: Java 17, Spring Boot
- Frontend: React + TypeScript
- Database: PostgreSQL
- Containerization: Docker
- Version Control: Git

## Haftalık Plan

### Hafta 0: Proje Altyapısı ve Docker Kurulumu (1-2 gün)

#### Ekip Çalışması Hazırlıkları
- [ ] Git repository kurulumu
- [ ] Branch stratejisi belirleme
  - main (production)
  - develop (development)
  - feature/* (özellik geliştirme)
  - bugfix/* (hata düzeltme)
- [ ] Docker yapılandırması
  ```
  /
  ├── docker-compose.yml      # PostgreSQL ve pgAdmin için
  ├── backend/
  │   └── Dockerfile         # Spring Boot uygulaması için
  └── frontend/
      └── Dockerfile        # React uygulaması için
  ```
- [ ] Ekip üyeleri arasında görev dağılımı
- [ ] Geliştirme standartlarının belirlenmesi
  - Code style
  - Commit message format
  - PR review süreci

### Hafta 1: Temel Altyapı ve Kullanıcı Yönetimi

#### Backend
- [ ] Spring Boot proje kurulumu
- [ ] PostgreSQL bağlantı konfigürasyonu
- [ ] Docker entegrasyonu
  - Development ortamı için docker-compose
  - PostgreSQL (port: 5432)
  - pgAdmin (port: 5050)
- [ ] User entity ve ilgili katmanlar
  - Entity
  - Repository
  - Service
  - Controller
- [ ] JWT authentication implementasyonu
- [ ] Rol tabanlı yetkilendirme (ADMIN/USER)

#### Frontend
- [ ] React + TypeScript proje kurulumu
- [ ] Docker development ortamı
- [ ] Routing altyapısı (React Router)
- [ ] Redux Toolkit kurulumu
- [ ] Login/Register sayfaları
- [ ] Temel layout ve navigation
- [ ] Authentication state yönetimi

### Hafta 2: Müşteri Yönetimi

#### Backend
- [ ] Customer entity ve ilgili katmanlar
- [ ] CRUD operasyonları için REST endpoint'leri
- [ ] Validation ve exception handling
- [ ] Unit testlerin yazılması
- [ ] Docker test ortamı

#### Frontend
- [ ] Müşteri listeleme sayfası
- [ ] Müşteri ekleme/düzenleme formları
- [ ] Müşteri silme işlemi
- [ ] Form validasyonları
- [ ] Pagination ve filtreleme
- [ ] Docker build optimizasyonları

### Hafta 3: Görev Yönetimi

#### Backend
- [ ] Task entity ve ilgili katmanlar
- [ ] Task CRUD operasyonları
- [ ] Task status yönetimi
- [ ] Müşteri-görev ilişkisi
- [ ] Integration testler
- [ ] Docker production build

#### Frontend
- [ ] Görev listeleme sayfası
- [ ] Görev oluşturma/düzenleme formları
- [ ] Görev durumu güncelleme
- [ ] Müşteriye görev atama
- [ ] Görev filtreleme ve arama
- [ ] Production Docker yapılandırması

### Hafta 4: Dashboard ve Deployment

#### Backend & Frontend
- [ ] Dashboard istatistikleri için endpoint'ler
- [ ] Dashboard tasarımı ve implementasyonu
- [ ] İstatistik grafikleri (Chart.js)
- [ ] Rol bazlı görünüm kontrolü
- [ ] UI/UX iyileştirmeleri
- [ ] Performance optimizasyonları
- [ ] Production environment hazırlığı
- [ ] Docker production deployment
- [ ] Son testler ve bug fixes

## Veritabanı Şeması

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    assigned_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoint'leri

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{id}
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/status

GET    /api/dashboard/stats
GET    /api/dashboard/recent-customers
GET    /api/dashboard/pending-tasks
```

## Environment Variables

### Backend
```
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
```

### Frontend
```
REACT_APP_API_URL
REACT_APP_ENV
```

## Docker Konfigürasyonları

### Development Ortamı
- PostgreSQL: localhost:5432
- pgAdmin: localhost:5050
- Backend API: localhost:8080
- Frontend: localhost:3000

### Test/Staging Ortamı
- Backend API: test.api.crm.etiya.com
- Frontend: test.crm.etiya.com

## Deployment Checklist

- [ ] Environment variables kontrolü
- [ ] Docker image build ve test
- [ ] Database migration kontrolü
- [ ] Smoke testleri
- [ ] Rollback planı

## Ekip Çalışması Kuralları

1. Her özellik için ayrı branch açılacak
2. Commit mesajları açıklayıcı olacak
3. PR'lar diğer ekip üyesi tarafından review edilecek
4. Daily standup toplantıları yapılacak
5. Her sprint sonu demo yapılacak 