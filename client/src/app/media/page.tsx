'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Image,
  Video,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Play,
  Pause,
  Volume2,
  Share,
  Tag,
  Calendar,
  User,
  Star,
  Heart,
  Bookmark,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function MediaPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('gallery')
  const [viewMode, setViewMode] = useState('grid')
  const [showUpload, setShowUpload] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const mediaItems = [
    {
      id: 'MED-001',
      title: 'Depo Tanıtım Videosu',
      type: 'video',
      size: '45.2 MB',
      duration: '3:24',
      uploadDate: '2024-02-15',
      author: 'Ahmet Yılmaz',
      tags: ['depo', 'tanıtım', 'video'],
      views: 1250,
      likes: 89,
      status: 'published'
    },
    {
      id: 'MED-002',
      title: 'Forklift Güvenlik Eğitimi',
      type: 'video',
      size: '78.5 MB',
      duration: '8:15',
      uploadDate: '2024-02-10',
      author: 'Fatma Demir',
      tags: ['güvenlik', 'eğitim', 'forklift'],
      views: 890,
      likes: 67,
      status: 'published'
    },
    {
      id: 'MED-003',
      title: 'Şirket Logosu - Vektör',
      type: 'image',
      size: '2.1 MB',
      duration: null,
      uploadDate: '2024-01-20',
      author: 'Mehmet Kaya',
      tags: ['logo', 'vektör', 'marka'],
      views: 2100,
      likes: 45,
      status: 'published'
    },
    {
      id: 'MED-004',
      title: 'Müşteri Başarı Hikayesi',
      type: 'video',
      size: '120.3 MB',
      duration: '12:45',
      uploadDate: '2024-02-05',
      author: 'Ayşe Yılmaz',
      tags: ['müşteri', 'başarı', 'hikaye'],
      views: 567,
      likes: 23,
      status: 'draft'
    }
  ]

  const campaigns = [
    {
      id: 'CAMP-001',
      title: '2024 Q1 Tanıtım Kampanyası',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      mediaCount: 15,
      reach: 12500,
      engagement: 8.5
    },
    {
      id: 'CAMP-002',
      title: 'Güvenlik Eğitim Serisi',
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2024-01-31',
      mediaCount: 8,
      reach: 8900,
      engagement: 12.3
    }
  ]

  const stats = [
    { title: 'Toplam Medya', value: '1,247', icon: Image, color: 'text-blue-600' },
    { title: 'Toplam Görüntülenme', value: '45.2K', icon: Eye, color: 'text-green-600' },
    { title: 'Aktif Kampanyalar', value: '3', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Depolama Kullanımı', value: '2.1TB', icon: BarChart3, color: 'text-orange-600' }
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
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medya Modülü</h1>
                    <p className="text-sm text-gray-600">DAM ve içerik yönetimi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Yükle
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
                  { id: 'gallery', name: 'Medya Galerisi', icon: Grid },
                  { id: 'campaigns', name: 'Kampanyalar', icon: TrendingUp },
                  { id: 'analytics', name: 'Analitik', icon: BarChart3 },
                  { id: 'settings', name: 'Ayarlar', icon: FileText }
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
          {activeTab === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Medya Galerisi</CardTitle>
                      <CardDescription>
                        Tüm medya dosyaları, görüntülenme istatistikleri ve etiketleme
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Medya ara..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {mediaItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                        >
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {item.type === 'video' ? (
                              <div className="relative">
                                <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-3" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {item.duration}
                                </div>
                              </div>
                            ) : (
                              <Image className="h-12 w-12 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status === 'published' ? 'Yayında' : 'Taslak'}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                              <div className="flex justify-between">
                                <span>Boyut:</span>
                                <span>{item.size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Görüntülenme:</span>
                                <span>{item.views.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Beğeni:</span>
                                <span>{item.likes}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                              )}
                            </div>

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
                                <Button size="sm" variant="ghost" className="hover:bg-red-50">
                                  <Heart className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                  <Share className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mediaItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                item.type === 'video' ? 'bg-red-100' : 'bg-blue-100'
                              }`}>
                                {item.type === 'video' ? <Video className="h-6 w-6 text-red-600" /> : <Image className="h-6 w-6 text-blue-600" />}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.id} - {item.author}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Boyut</p>
                              <p className="font-medium">{item.size}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Görüntülenme</p>
                              <p className="font-medium">{item.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Beğeni</p>
                              <p className="font-medium">{item.likes}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Durum</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status === 'published' ? 'Yayında' : 'Taslak'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'campaigns' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Kampanya Yönetimi</CardTitle>
                      <CardDescription>
                        Medya kampanyaları, erişim analizi ve performans takibi
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Kampanya
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign, index) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-green-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                              <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                              <p className="text-sm text-gray-600">{campaign.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Başlangıç</p>
                            <p className="font-medium">{campaign.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Bitiş</p>
                            <p className="font-medium">{campaign.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Medya Sayısı</p>
                            <p className="font-medium">{campaign.mediaCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Erişim</p>
                            <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {campaign.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Etkileşim: %{campaign.engagement}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <Share className="h-4 w-4" />
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
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medya Yükle</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUpload(false)}
                  className="hover:bg-gray-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Dosyaları buraya sürükleyin</p>
                  <p className="text-sm text-gray-600 mb-4">veya</p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Dosya Seç
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, MP4, MOV dosyaları desteklenir</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık
                    </label>
                    <Input placeholder="Medya başlığı" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Tanıtım</option>
                      <option>Eğitim</option>
                      <option>Güvenlik</option>
                      <option>Operasyon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler
                  </label>
                  <Input placeholder="etiket1, etiket2, etiket3" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Medya açıklaması..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpload(false)}
                  >
                    İptal
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Yükle
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
