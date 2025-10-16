# Ayaz 3PL - Lojistik Entegre Yönetim Sistemi

## 🚀 Proje Özeti

**Ayaz 3PL ERP + WMS + TMS** sistemi, 3PL lojistik firmaları için özel olarak tasarlanmış kapsamlı bir entegre yönetim sistemidir.

## 🏗️ Sistem Mimarisi

### 📱 **Frontend (Next.js 14)**
- **Framework:** Next.js 14 + App Router
- **UI:** Tailwind CSS + shadcn/ui
- **Animasyon:** Framer Motion
- **İkonlar:** Lucide React
- **State:** React Context + LocalStorage
- **Offline:** Service Worker + IndexedDB

### 🖥️ **Backend (Node.js)**
- **Framework:** Express.js + TypeScript
- **Database:** PostgreSQL + Knex.js
- **Cache:** Redis
- **Queue:** RabbitMQ
- **Auth:** JWT + RBAC

### 📱 **Mobile (React Native)**
- **Framework:** React Native + Expo
- **Navigation:** React Navigation
- **Offline:** SQLite + Sync Service
- **Camera:** Barcode Scanner
- **GPS:** Location Tracking

## 🎯 Ana Modüller

### 🏢 **WMS - Depo Yönetim Sistemi**
- ✅ FIFO/FEFO Stok Takibi
- ✅ Lot & Serial Numarası
- ✅ Mal Kabul & Sevkiyat
- ✅ Lokasyon Yönetimi
- ✅ Crossdock Operasyonları
- ✅ El Terminali Entegrasyonu

### 🚛 **TMS - Nakliye Yönetim Sistemi**
- ✅ Araç & Şoför Yönetimi
- ✅ Rota Optimizasyonu (AI)
- ✅ Container Yönetimi
- ✅ Milkrun Operasyonları
- ✅ GPS Takip
- ✅ Yakıt Tüketim Takibi

### 💰 **Finans & Muhasebe**
- ✅ 3PL Hizmet Faturalama
- ✅ Otomatik Ödeme Takibi
- ✅ Cari Hesap Yönetimi
- ✅ E-fatura Entegrasyonu
- ✅ Mali Raporlama

### 👥 **İnsan Kaynakları**
- ✅ Çalışan Yönetimi
- ✅ İzin Takibi
- ✅ Performans Değerlendirme
- ✅ Eğitim Modülü
- ✅ Bordro Yönetimi

### 🌐 **B2B Müşteri Portalı**
- ✅ Sipariş Yönetimi
- ✅ Stok Durumu Görüntüleme
- ✅ Fatura Takibi
- ✅ Kamera Görüntüleri
- ✅ Real-time Bildirimler

### 📊 **Raporlama & Analytics**
- ✅ Operasyonel Dashboard
- ✅ Finans Raporları
- ✅ Performans Analizi
- ✅ Müşteri Memnuniyeti
- ✅ AI Destekli Öngörüler

## 👤 Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| **Admin** | Tüm modüllere tam erişim |
| **Operasyon** | WMS, TMS, Raporlama |
| **Depo** | WMS modülü tam erişim |
| **Nakliye** | TMS modülü tam erişim |
| **Muhasebe** | Finans modülü tam erişim |
| **İK** | HR modülü tam erişim |
| **Müşteri** | Portal erişimi |
| **Satış** | Müşteri yönetimi |
| **Yönetim** | Raporlama + Finans |

## 🔧 Kurulum

### 📋 **Gereksinimler**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- RabbitMQ 3.8+

### 🚀 **Hızlı Başlangıç**

```bash
# Repository'yi klonla
git clone https://github.com/kocayazbey/ayaz-3pl-erp.git
cd ayaz-3pl-erp

# Tüm bağımlılıkları yükle
npm run install:all

# Veritabanını hazırla
npm run db:migrate
npm run db:seed

# Docker ile servisleri başlat
npm run docker:up

# Geliştirme sunucularını başlat
npm run dev
```

### 🌐 **Production Deploy**

```bash
# Build al
npm run build

# Production sunucularını başlat
npm run start
```

## 📱 **Demo Hesapları**

| Email | Şifre | Rol |
|-------|-------|-----|
| admin@ayaz3pl.com | 123456 | Admin |
| ops@ayaz3pl.com | 123456 | Operasyon |
| warehouse@ayaz3pl.com | 123456 | Depo |
| transport@ayaz3pl.com | 123456 | Nakliye |
| finance@ayaz3pl.com | 123456 | Muhasebe |
| customer@abc.com | 123456 | Müşteri |

## 🔄 **Offline Çalışma**

Sistem tam offline çalışma desteği sunar:

- **Web:** Service Worker + IndexedDB
- **Mobile:** SQLite + Background Sync
- **Otomatik Senkronizasyon:** Online olduğunda
- **Conflict Resolution:** Son yazma kazanır

## 🎨 **Tema Özelleştirme**

- **Dinamik Renkler:** 6 farklı tema
- **Font Seçenekleri:** 6 profesyonel font
- **Layout Ayarları:** Border radius, shadow, density
- **Hızlı Presetler:** 4 hazır tema

## 📊 **Performans**

- **First Load:** < 2 saniye
- **Route Navigation:** < 500ms
- **Offline Sync:** < 5 saniye
- **Mobile Performance:** 60 FPS
- **Bundle Size:** < 2MB (gzipped)

## 🔐 **Güvenlik**

- **JWT Authentication:** Secure token management
- **RBAC:** Role-based access control
- **HTTPS Only:** SSL/TLS encryption
- **Input Validation:** XSS/CSRF protection
- **Audit Trail:** Tüm işlemler loglanır

## 📈 **Ölçeklenebilirlik**

- **Microservices:** Modüler mimari
- **Database Sharding:** Horizontal scaling
- **CDN Ready:** Static asset optimization
- **Load Balancing:** Multiple server support
- **Caching:** Redis + Browser cache

## 🤝 **Katkıda Bulunma**

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 **Lisans**

Bu proje özel lisans altındadır. Ticari kullanım için izin gereklidir.

## 📞 **İletişim**

- **Email:** info@ayaz3pl.com
- **Website:** https://ayaz3pl.com
- **GitHub:** https://github.com/kocayazbey/ayaz-3pl-erp

## 🎯 **Roadmap**

### ✅ **Tamamlanan (v1.0)**
- [x] Temel sistem mimarisi
- [x] WMS modülü
- [x] TMS modülü
- [x] Finans modülü
- [x] HR modülü
- [x] Müşteri portalı
- [x] Raporlama
- [x] Offline sync
- [x] Mobile app

### 🚧 **Geliştirme Aşamasında (v1.1)**
- [ ] AI destekli rota optimizasyonu
- [ ] Gelişmiş analytics
- [ ] Multi-language support
- [ ] Advanced reporting

### 🔮 **Gelecek (v2.0)**
- [ ] IoT sensor integration
- [ ] Blockchain tracking
- [ ] Machine learning predictions
- [ ] Voice commands
- [ ] AR/VR warehouse management

---

**Ayaz 3PL ERP Sistemi** - Modern lojistik yönetimi için tasarlandı! 🚀
