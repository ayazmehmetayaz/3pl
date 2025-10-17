'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  Warehouse, 
  Users, 
  DollarSign, 
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showModules, setShowModules] = useState(false)

  const modules = [
    {
      id: 'wms',
      name: 'Depo Yönetimi',
      icon: Warehouse,
      description: 'Envanter, sevkiyat, alım işlemleri',
      color: 'from-blue-500 to-cyan-500',
      features: ['Envanter Takibi', 'Sevkiyat Yönetimi', 'Alım İşlemleri', 'Stok Kontrolü']
    },
    {
      id: 'tms',
      name: 'Taşıma Yönetimi',
      icon: Truck,
      description: 'Araç, sevkiyat, rota planlama',
      color: 'from-green-500 to-emerald-500',
      features: ['Araç Yönetimi', 'Rota Planlama', 'Sevkiyat Takibi', 'Sürücü Yönetimi']
    },
    {
      id: 'finance',
      name: 'Finans',
      icon: DollarSign,
      description: 'Müşteri, fatura, ödeme yönetimi',
      color: 'from-yellow-500 to-orange-500',
      features: ['Müşteri Yönetimi', 'Fatura Sistemi', 'Ödeme Takibi', 'Mali Raporlar']
    },
    {
      id: 'hr',
      name: 'İnsan Kaynakları',
      icon: Users,
      description: 'Personel yönetimi ve işlemler',
      color: 'from-purple-500 to-pink-500',
      features: ['Personel Yönetimi', 'İzin Takibi', 'Maaş Yönetimi', 'Performans Değerlendirme']
    },
    {
      id: 'reports',
      name: 'Raporlama',
      icon: BarChart3,
      description: 'İşletme performans analizleri',
      color: 'from-indigo-500 to-blue-500',
      features: ['Satış Raporları', 'Operasyon Analizi', 'Mali Durum', 'Performans Metrikleri']
    },
    {
      id: 'admin',
      name: 'Yönetim',
      icon: Shield,
      description: 'Sistem yönetimi ve ayarlar',
      color: 'from-red-500 to-rose-500',
      features: ['Kullanıcı Yönetimi', 'Sistem Ayarları', 'Güvenlik', 'Yedekleme']
    }
  ]

  const handleAdminLogin = () => {
    setIsLoggedIn(true)
    setShowModules(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative shadow-xl"
            >
              <Package className="h-16 w-16 text-white" />
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-spin" style={{ animationDuration: '3s' }}></div>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ayaz 3PL ERP
            </h1>
            <p className="text-2xl text-white/80 mb-8">
              Lojistik Entegre Yönetim Sistemi
            </p>
            <p className="text-lg text-white/60 mb-12 max-w-3xl mx-auto">
              Depo, taşıma, finans, insan kaynakları ve raporlama modüllerini tek platformda yönetin.
              Modern, hızlı ve güvenli ERP çözümü.
            </p>

            {!isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdminLogin}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 text-xl rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Shield className="h-6 w-6" />
                  Admin Demo Giriş
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/login'}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 text-xl rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Normal Giriş
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-md"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-xl font-bold text-green-300">Admin Girişi Başarılı</span>
                </div>
                <p className="text-green-200">Tüm modüllere erişim sağlandı</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modules Section */}
      {showModules && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">ERP Modülleri</h2>
            <p className="text-xl text-white/60">Tüm iş süreçlerinizi tek platformda yönetin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 h-full hover:bg-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{module.name}</h3>
                  <p className="text-white/70 mb-6">{module.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/${module.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${module.color} text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      Modüle Git
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Özellikler</h2>
          <p className="text-xl text-white/60">Modern teknoloji ile güçlendirilmiş</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Star, title: 'Modern UI/UX', desc: 'Kullanıcı dostu arayüz' },
            { icon: Shield, title: 'Güvenli', desc: 'End-to-end şifreleme' },
            { icon: BarChart3, title: 'Analitik', desc: 'Gerçek zamanlı raporlar' },
            { icon: Package, title: 'Entegre', desc: 'Tüm modüller bir arada' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>&copy; 2024 Ayaz 3PL ERP. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  )
}