'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Package, Truck, Calculator, BarChart3, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeEditor from '@/components/ThemeEditor'

const modules = [
  {
    title: 'Depo Yönetimi (WMS)',
    description: 'FIFO/FEFO, lot takibi, fulfillment ve crossdock operasyonları',
    icon: Package,
    color: 'bg-blue-500',
    features: ['FIFO/FEFO Yönetimi', 'Lot & Seri Takibi', 'Fulfillment', 'Crossdock']
  },
  {
    title: 'Nakliye Yönetimi (TMS)',
    description: 'Rota optimizasyonu, araç takibi ve milkrun lojistik',
    icon: Truck,
    color: 'bg-green-500',
    features: ['Rota Optimizasyonu', 'Araç Takibi', 'Milkrun', 'Konteyner Yönetimi']
  },
  {
    title: 'Müşteri Portalı',
    description: 'B2B müşteri self-servis, sipariş takibi ve kamera erişimi',
    icon: Users,
    color: 'bg-purple-500',
    features: ['Sipariş Yönetimi', 'Stok İzleme', 'Kamera Erişimi', 'Fatura Takibi']
  },
  {
    title: 'Finans & Faturalama',
    description: 'Otomatik faturalama, tahsilat ve sözleşme yönetimi',
    icon: Calculator,
    color: 'bg-orange-500',
    features: ['Otomatik Faturalama', 'Tahsilat Yönetimi', 'Sözleşme Takibi', 'Mali Raporlar']
  },
  {
    title: 'İnsan Kaynakları',
    description: 'Puantaj, vardiya, bordro ve performans yönetimi',
    icon: Users,
    color: 'bg-pink-500',
    features: ['Puantaj Sistemi', 'Vardiya Planlama', 'Bordro Yönetimi', 'Performans Takibi']
  },
  {
    title: 'Raporlama & BI',
    description: 'Gerçek zamanlı dashboard, KPI takibi ve karar destek sistemi',
    icon: BarChart3,
    color: 'bg-indigo-500',
    features: ['Gerçek Zamanlı Dashboard', 'KPI Takibi', 'AI Destekli Analiz', 'Karar Destek Sistemi']
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              3PL Lojistik
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Entegre Yönetim Sistemi
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Müşteri sözleşmesinden operasyona, taşımadan faturalamaya, 
              raporlamadan insan kaynağına kadar hatasız 3PL hizmet zinciri.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-animate">
                Demo Talep Et
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-animate"
                onClick={() => window.location.href = '/login'}
              >
                Giriş Yap
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kapsamlı Modül Yapısı
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İşletmenizin tüm ihtiyaçlarını karşılayan entegre modüller
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full card-hover border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Ayaz 3PL Lojistik Sistemi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Offline çalışabilen, AI destekli planlama ve otomatik uyarı sistemi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Offline Çalışma',
                description: 'İnternet kesilse bile operasyonlar devam eder',
                icon: '🔄'
              },
              {
                title: 'AI Destekli Planlama',
                description: 'Yapay zeka ile rota ve stok optimizasyonu',
                icon: '🤖'
              },
              {
                title: 'Otomatik Uyarılar',
                description: 'Hata payı bırakmadan süreç kontrolü',
                icon: '⚡'
              },
              {
                title: '3PL Entegrasyon',
                description: 'Müşteri sözleşmesinden faturalamaya tam zincir',
                icon: '🔗'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Canlı Demo Deneyimi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistemi kendiniz deneyin ve işletmenize nasıl katkı sağlayacağını görün
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Demo Özellikleri</h3>
                <ul className="space-y-4">
                  {[
                    '3PL müşteri portalı deneyimi',
                    'Depo WMS operasyon simülasyonu',
                    'Nakliye TMS rota planlama',
                    'Otomatik faturalama süreci',
                    'AI destekli raporlama araçları'
                  ].map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button size="lg" className="w-full mt-8 btn-animate">
                  Demo Başlat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">1,234</div>
                    <div className="text-sm opacity-90">Aktif Kullanıcı</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">89%</div>
                    <div className="text-sm opacity-90">Memnuniyet</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Destek</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-3xl font-bold">99.9%</div>
                    <div className="text-sm opacity-90">Uptime</div>
                  </div>
                </div>
                <p className="text-lg opacity-90">
                  "Ayaz 3PL sistemi ile müşteri hizmetlerimizde hata oranını %95 azalttık. 
                  Offline çalışma sayesinde hiç operasyon kaybetmedik."
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mehmet Özkan</div>
                    <div className="text-sm opacity-80">Operasyon Müdürü, XYZ Kargo</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Esnek Fiyatlandırma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İşletmenizin büyüklüğüne uygun plan seçin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Başlangıç',
                price: '₺2,500',
                period: '/ay',
                features: [
                  '10 kullanıcı',
                  'Temel modüller',
                  'E-posta destek',
                  '5GB veri depolama',
                  'Aylık raporlar'
                ],
                popular: false
              },
              {
                name: 'Profesyonel',
                price: '₺5,000',
                period: '/ay',
                features: [
                  '50 kullanıcı',
                  'Tüm modüller',
                  'Telefon + E-posta destek',
                  '50GB veri depolama',
                  'Gerçek zamanlı raporlar',
                  'API erişimi'
                ],
                popular: true
              },
              {
                name: 'Kurumsal',
                price: 'Özel',
                period: '',
                features: [
                  'Sınırsız kullanıcı',
                  'Özelleştirilmiş modüller',
                  '7/24 destek',
                  'Sınırsız veri depolama',
                  'Özel raporlar',
                  'Dedicated server'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      En Popüler
                    </span>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-blue-500 shadow-xl' : 'shadow-lg'}`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Plan Seç
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hemen Başlayın
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Uzman ekibimiz size özel çözümler sunmak için hazır. 
                İletişime geçin ve işletmenizi dijitalleştirin.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📧</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">E-posta</div>
                    <div className="text-gray-600">info@ayazerp.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <div className="text-gray-600">+90 212 555 0123</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📍</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Adres</div>
                    <div className="text-gray-600">İstanbul, Türkiye</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Demo Talep Formu</CardTitle>
                  <CardDescription>
                    Bilgilerinizi bırakın, size ulaşalım
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şirket
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Şirket adınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mesaj
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="İhtiyaçlarınızı belirtin..."
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 btn-animate"
                    >
                      Demo Talebi Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ThemeEditor />
    </div>
  )
}
