# Rol Yönetimi Dokümantasyonu

## Roller ve İzinler

### 1. Admin Rolü
- Tüm müşterileri görüntüleme
- Tüm görevleri görüntüleme
- Yeni müşteri ekleme
- Yeni görev oluşturma
- Tüm görevleri düzenleme
- Dashboard'da tüm istatistikleri görme
- Kullanıcı yönetimi

### 2. Kullanıcı (Müşteri) Rolü
- Sadece kendi görevlerini görüntüleme
- Kendi görevlerinin durumunu güncelleme
- Kısıtlı dashboard görüntüleme
  - Sadece kendi görev istatistikleri
  - Sadece kendi tamamlanmamış görevleri
  - Profil bilgileri

## Uygulama İçi Rol Kontrolü

### Redux Store'da Rol Yönetimi
```typescript
// src/features/auth/authSlice.ts
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    role: 'ADMIN' | 'USER';
  } | null;
}
```

### Korumalı Route Yapısı
```typescript
// src/components/auth/ProtectedRoute.tsx
const ProtectedRoute = ({ 
  element, 
  allowedRoles 
}: {
  element: JSX.Element;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" />;
  }
  
  return element;
};
```

### Sayfa İçi Rol Kontrolü
```typescript
// Örnek kullanım:
const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div>
      {isAdmin ? (
        // Admin dashboard içeriği
        <AdminDashboard />
      ) : (
        // Kullanıcı dashboard içeriği
        <UserDashboard />
      )}
    </div>
  );
};
```

## Örnek Kullanım Senaryoları

### 1. Dashboard Erişimi
- **Admin:** Tüm istatistikleri ve listeleri görür
- **Kullanıcı:** Sadece kendi görevlerini ve istatistiklerini görür

### 2. Görev Yönetimi
- **Admin:** 
  - Tüm görevleri listeler
  - Yeni görev oluşturur
  - Herhangi bir görevi düzenler
- **Kullanıcı:**
  - Sadece kendine atanan görevleri görür
  - Sadece kendi görevlerinin durumunu günceller

### 3. Müşteri Yönetimi
- **Admin:**
  - Tüm müşterileri listeler
  - Yeni müşteri ekler
  - Müşteri bilgilerini düzenler
- **Kullanıcı:**
  - Müşteri yönetimi sayfasına erişemez

## Uygulama Akışı

1. Kullanıcı giriş yapar
2. Backend'den rol bilgisi alınır
3. Redux store'da rol bilgisi saklanır
4. ProtectedRoute bileşeni sayfa erişimlerini kontrol eder
5. Sayfa içi görünüm kullanıcının rolüne göre özelleştirilir

## Güvenlik Notları

1. Rol kontrolü hem frontend hem backend'de yapılmalıdır
2. Frontend rol kontrolü sadece UI için yapılır
3. Tüm kritik işlemler backend'de tekrar doğrulanmalıdır
4. JWT token'da rol bilgisi saklanabilir

## Test Senaryoları

### Admin Testi
1. Admin olarak giriş yap
2. Tüm sayfalara erişimi kontrol et
3. Tüm CRUD işlemlerini dene

### Kullanıcı Testi
1. Normal kullanıcı olarak giriş yap
2. Kısıtlı sayfalara erişimi kontrol et
3. İzin verilmeyen sayfalara yönlendirmeyi dene
4. Sadece kendi görevlerini görüntülemeyi test et