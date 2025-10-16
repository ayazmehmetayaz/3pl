# Ayaz Lojistik ERP Sistemi

## Proje Genel Bakış

Ayaz Lojistik A.Ş. için geliştirilen kapsamlı ERP sistemi. Tüm lojistik süreçleri tek bir yazılım altyapısı üzerinden yönetir.

## Sistem Mimarisi

### Teknoloji Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Redis
- **Frontend**: React + TypeScript
- **Mobile**: React Native
- **Message Queue**: RabbitMQ
- **File Storage**: AWS S3
- **Authentication**: JWT + RBAC

### Modüller
- WMS (Depo Yönetimi)
- TMS (Taşıma Yönetimi)
- Fulfillment
- Muhasebe & Finans
- Pazarlama
- İnsan Kaynakları
- Teknik Servis
- Hukuk
- Eğitim
- Medya
- İdari İşler
- Raporlama

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- RabbitMQ 3.8+

### Geliştirme Ortamı
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start

# Database
docker-compose up -d postgres redis rabbitmq
```

## API Dokümantasyonu
API dokümantasyonu `/docs/api` klasöründe bulunmaktadır.

## Güvenlik
- TLS 1.3 şifreleme
- JWT tabanlı kimlik doğrulama
- RBAC yetki kontrolü
- Audit logging
- KVKK uyumluluğu

## Lisans
Özel yazılım - Ayaz Lojistik A.Ş.