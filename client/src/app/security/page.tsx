'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Camera,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Bell,
  Lock,
  Unlock,
  Key,
  Activity,
  TrendingUp,
  BarChart3,
  MapPin,
  Calendar,
  FileText,
  Video,
  Image
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SecurityPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('cameras')
  const [showNewAlert, setShowNewAlert] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const cameras = [
    {
      id: 'CAM-001',
      name: 'Depo Giriş Kamerası',
      location: 'Depo A - Giriş',
      status: 'online',
      lastActivity: '2024-02-15 14:30',
      resolution: '1080p',
      type: 'Fixed',
      alerts: 0,
      recording: true
    },
    {
      id: 'CAM-002',
      name: 'Forklift Alanı',
      location: 'Depo A - Operasyon',
      status: 'offline',
      lastActivity: '2024-02-15 12:15',
      resolution: '4K',
      type: 'PTZ',
      alerts: 2,
      recording: false
    },
    {
      id: 'CAM-003',
      name: 'Ofis Girişi',
      location: 'Ofis - Ana Giriş',
      status: 'online',
      lastActivity: '2024-02-15 14:45',
      resolution: '1080p',
      type: 'Fixed',
      alerts: 1,
      recording: true
    }
  ]

  const securityEvents = [
    {
      id: 'EVT-001',
      type: 'Unauthorized Access',
      severity: 'high',
      location: 'Depo A - Giriş',
      timestamp: '2024-02-15 14:30:25',
      camera: 'CAM-001',
      description: 'Yetkisiz kişi giriş kapısında tespit edildi',
      status: 'investigating',
      assignedTo: 'Güvenlik Ekibi'
    },
    {
      id: 'EVT-002',
      type: 'Equipment Tampering',
      severity: 'medium',
      location: 'Depo B - Forklift Alanı',
      timestamp: '2024-02-15 13:45:12',
      camera: 'CAM-002',
      description: 'Forklift üzerinde şüpheli hareket',
      status: 'resolved',
      assignedTo: 'Ahmet Yılmaz'
    },
    {
      id: 'EVT-003',
      type: 'After Hours Activity',
      severity: 'low',
      location: 'Ofis - Ana Giriş',
      timestamp: '2024-02-15 02:15:30',
      camera: 'CAM-003',
      description: 'Mesai saatleri dışında hareket tespit edildi',
      status: 'closed',
      assignedTo: 'Güvenlik Ekibi'
    }
  ]

  const accessLogs = [
    {
      id: 'LOG-001',
      person: 'Ali Veli',
      cardId: 'CARD-12345',
      location: 'Depo A - Giriş',
      timestamp: '2024-02-15 08:30:15',
      action: 'Entry',
      status: 'success'
    },
    {
      id: 'LOG-002',
      person: 'Ayşe Yılmaz',
      cardId: 'CARD-67890',
      location: 'Ofis - Ana Giriş',
      timestamp: '2024-02-15 09:15:22',
      action: 'Entry',
      status: 'success'
    },
    {
      id: 'LOG-003',
      person: 'Bilinmeyen',
      cardId: 'CARD-XXXXX',
      location: 'Depo B - Giriş',
      timestamp: '2024-02-15 10:45:33',
      action: 'Entry',
      status: 'failed'
    }
  ]

  const stats = [
    { title: 'Aktif Kameralar', value: '24', icon: Camera, color: 'text-blue-600' },
    { title: 'Açık Olaylar', value: '3', icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Bugün Giriş', value: '156', icon: Users, color: 'text-green-600' },
    { title: 'Güvenlik Skoru', value: '%94', icon: Shield, color: 'text-purple-600' }
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                  <span className="sr-only">Menu aç</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Güvenlik Modülü</h1>
                    <p className="text-sm text-gray-600">Kamera sistemi ve erişim kontrolü</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowNewAlert(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Uyarı
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <span className="mr-2">👋</span>
                  Çıkış
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'cameras', name: 'Kameralar', icon: Camera },
                  { id: 'events', name: 'Güvenlik Olayları', icon: AlertTriangle },
                  { id: 'access', name: 'Erişim Logları', icon: Key },
                  { id: 'reports', name: 'Raporlar', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'cameras' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Kamera Sistemi</CardTitle>
                      <CardDescription>
                        Tüm kameralar, durumları ve canlı görüntüler
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Kamera ara..."
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cameras.map((camera, index) => (
                      <motion.div
                        key={camera.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group relative bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                          {camera.status === 'online' ? (
                            <div className="relative">
                              <Video className="h-12 w-12 text-white bg-black/50 rounded-full p-3" />
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                CANLI
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {camera.resolution}
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <Camera className="h-12 w-12 text-gray-400" />
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                OFFLINE
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{camera.name}</h3>
                              <p className="text-xs text-gray-600">{camera.location}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              camera.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {camera.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex justify-between">
                              <span>Tip:</span>
                              <span>{camera.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Son Aktivite:</span>
                              <span>{camera.lastActivity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Kayıt:</span>
                              <span className={camera.recording ? 'text-green-600' : 'text-red-600'}>
                                {camera.recording ? 'Aktif' : 'Pasif'}
                              </span>
                            </div>
                          </div>

                          {camera.alerts > 0 && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-xs text-red-700">
                                  {camera.alerts} uyarı mevcut
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                <Bell className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                <Activity className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Güvenlik Olayları</CardTitle>
                      <CardDescription>
                        Tespit edilen güvenlik olayları ve müdahale durumları
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Olay
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-red-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              event.severity === 'high' ? 'bg-red-100' :
                              event.severity === 'medium' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              <AlertTriangle className={`h-6 w-6 ${
                                event.severity === 'high' ? 'text-red-600' :
                                event.severity === 'medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{event.type}</h3>
                              <p className="text-sm text-gray-600">{event.id} - {event.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-red-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-red-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Zaman</p>
                            <p className="font-medium">{event.timestamp}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Kamera</p>
                            <p className="font-medium">{event.camera}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Atanan</p>
                            <p className="font-medium">{event.assignedTo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Öncelik</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.severity === 'high' ? 'bg-red-100 text-red-800' :
                              event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {event.severity === 'high' ? 'Yüksek' :
                               event.severity === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Açıklama</p>
                          <p className="text-sm text-gray-900">{event.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                              event.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status === 'investigating' ? 'İnceleniyor' :
                               event.status === 'resolved' ? 'Çözüldü' : 'Kapatıldı'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-red-50">
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-red-50">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'access' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Erişim Logları</CardTitle>
                      <CardDescription>
                        Kart okuma kayıtları, giriş-çıkış takibi
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Rapor İndir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              log.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {log.status === 'success' ? 
                                <CheckCircle className="h-6 w-6 text-green-600" /> :
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                              }
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{log.person}</h3>
                              <p className="text-sm text-gray-600">{log.id} - {log.cardId}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Konum</p>
                            <p className="font-medium">{log.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Zaman</p>
                            <p className="font-medium">{log.timestamp}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">İşlem</p>
                            <p className="font-medium">{log.action}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durum</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {log.status === 'success' ? 'Başarılı' : 'Başarısız'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Yeni Uyarı Modal */}
        {showNewAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Güvenlik Uyarısı</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewAlert(false)}
                  className="hover:bg-gray-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Olay Türü
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Unauthorized Access</option>
                      <option>Equipment Tampering</option>
                      <option>After Hours Activity</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öncelik
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Düşük</option>
                      <option>Orta</option>
                      <option>Yüksek</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konum
                    </label>
                    <Input placeholder="Olay konumu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atanan
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Güvenlik Ekibi</option>
                      <option>Ahmet Yılmaz</option>
                      <option>Fatma Demir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Güvenlik olayı detaylarını buraya yazın..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewAlert(false)}
                  >
                    İptal
                  </Button>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Uyarı Oluştur
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
