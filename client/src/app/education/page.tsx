'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Award,
  Play,
  Download,
  Upload,
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  BarChart3,
  Target,
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

export default function EducationPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('courses')
  const [showNewCourse, setShowNewCourse] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const courses = [
    {
      id: 'EDU-001',
      title: 'Forklift Operatörlüğü',
      type: 'video',
      duration: '4 saat',
      participants: 24,
      completion: 85,
      status: 'active',
      category: 'Güvenlik',
      instructor: 'Ahmet Yılmaz',
      nextSession: '2024-03-15'
    },
    {
      id: 'EDU-002',
      title: 'Depo Yönetim Sistemi',
      type: 'interactive',
      duration: '6 saat',
      participants: 18,
      completion: 92,
      status: 'active',
      category: 'Teknik',
      instructor: 'Fatma Demir',
      nextSession: '2024-03-20'
    },
    {
      id: 'EDU-003',
      title: 'Müşteri Hizmetleri',
      type: 'document',
      duration: '3 saat',
      participants: 32,
      completion: 78,
      status: 'completed',
      category: 'Hizmet',
      instructor: 'Mehmet Kaya',
      nextSession: '2024-04-01'
    }
  ]

  const certificates = [
    {
      id: 'CERT-001',
      employee: 'Ali Veli',
      course: 'Forklift Operatörlüğü',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'valid',
      score: 95
    },
    {
      id: 'CERT-002',
      employee: 'Ayşe Yılmaz',
      course: 'Depo Yönetim Sistemi',
      issueDate: '2024-02-10',
      expiryDate: '2025-02-10',
      status: 'valid',
      score: 88
    }
  ]

  const stats = [
    { title: 'Aktif Kurslar', value: '12', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Kayıtlı Katılımcı', value: '156', icon: Users, color: 'text-green-600' },
    { title: 'Verilen Sertifika', value: '89', icon: Award, color: 'text-purple-600' },
    { title: 'Tamamlanma Oranı', value: '%87', icon: TrendingUp, color: 'text-orange-600' }
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
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Eğitim Modülü</h1>
                    <p className="text-sm text-gray-600">LMS ve sertifikasyon sistemi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowNewCourse(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Kurs
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
                  { id: 'courses', name: 'Kurslar', icon: BookOpen },
                  { id: 'certificates', name: 'Sertifikalar', icon: Award },
                  { id: 'sessions', name: 'Eğitim Oturumları', icon: Calendar },
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
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Kurs Yönetimi</CardTitle>
                      <CardDescription>
                        Eğitim içerikleri, katılımcılar ve ilerleme takibi
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Kurs ara..."
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              course.type === 'video' ? 'bg-red-100' :
                              course.type === 'interactive' ? 'bg-green-100' :
                              'bg-blue-100'
                            }`}>
                              {course.type === 'video' ? <Video className="h-6 w-6 text-red-600" /> :
                               course.type === 'interactive' ? <Play className="h-6 w-6 text-green-600" /> :
                               <FileText className="h-6 w-6 text-blue-600" />}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                              <p className="text-sm text-gray-600">{course.id} - {course.category}</p>
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Süre</p>
                            <p className="font-medium">{course.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Katılımcı</p>
                            <p className="font-medium">{course.participants}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Eğitmen</p>
                            <p className="font-medium">{course.instructor}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sonraki Oturum</p>
                            <p className="font-medium">{course.nextSession}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === 'active' ? 'bg-green-100 text-green-800' :
                              course.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status === 'active' ? 'Aktif' :
                               course.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                            </span>
                            <span className="text-sm text-gray-600">
                              {course.type === 'video' ? 'Video' :
                               course.type === 'interactive' ? 'İnteraktif' : 'Doküman'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{course.completion}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Sertifika Yönetimi</CardTitle>
                      <CardDescription>
                        Verilen sertifikalar, geçerlilik süreleri ve yenileme takibi
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                      <Award className="h-4 w-4 mr-2" />
                      Sertifika Oluştur
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-green-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{cert.employee}</h3>
                              <p className="text-sm text-gray-600">{cert.course}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-green-50">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Veriliş Tarihi</p>
                            <p className="font-medium">{cert.issueDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Geçerlilik</p>
                            <p className="font-medium">{cert.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Puan</p>
                            <p className="font-medium text-green-600">{cert.score}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durum</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cert.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {cert.status === 'valid' ? 'Geçerli' : 'Süresi Dolmuş'}
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

        {/* Yeni Kurs Modal */}
        {showNewCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Kurs Oluştur</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewCourse(false)}
                  className="hover:bg-gray-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kurs Adı
                    </label>
                    <Input placeholder="Kurs adını girin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Güvenlik</option>
                      <option>Teknik</option>
                      <option>Hizmet</option>
                      <option>Yönetim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eğitmen
                    </label>
                    <Input placeholder="Eğitmen adı" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Süre
                    </label>
                    <Input placeholder="Saat cinsinden" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kurs Türü
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Video</option>
                      <option>İnteraktif</option>
                      <option>Doküman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maksimum Katılımcı
                    </label>
                    <Input placeholder="Kişi sayısı" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs Açıklaması
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Kurs açıklamasını buraya yazın..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewCourse(false)}
                  >
                    İptal
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Kurs Oluştur
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
