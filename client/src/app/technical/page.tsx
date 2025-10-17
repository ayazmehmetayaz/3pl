'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wrench,
  Settings,
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
  Monitor,
  Server,
  HardDrive,
  Wifi,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TechnicalPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('equipment')
  const [showNewTicket, setShowNewTicket] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const equipment = [
    {
      id: 'EQ-001',
      name: 'Forklift #1',
      type: 'Forklift',
      status: 'operational',
      location: 'Depo A',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      operator: 'Ali Veli',
      hours: 1250,
      issues: 0
    },
    {
      id: 'EQ-002',
      name: 'El Terminali #5',
      type: 'RF Terminal',
      status: 'maintenance',
      location: 'Depo B',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10',
      operator: 'Ayşe Yılmaz',
      hours: 890,
      issues: 1
    },
    {
      id: 'EQ-003',
      name: 'Sunucu #1',
      type: 'Server',
      status: 'critical',
      location: 'IT Odası',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      operator: 'Mehmet Kaya',
      hours: 8760,
      issues: 2
    }
  ]

  const tickets = [
    {
      id: 'TICKET-001',
      title: 'Forklift #1 Motor Arızası',
      priority: 'high',
      status: 'open',
      assignee: 'Ahmet Yılmaz',
      createdDate: '2024-02-15',
      dueDate: '2024-02-17',
      category: 'Equipment',
      description: 'Motor çalışmıyor, acil müdahale gerekli'
    },
    {
      id: 'TICKET-002',
      title: 'El Terminali #5 Ekran Sorunu',
      priority: 'medium',
      status: 'in_progress',
      assignee: 'Fatma Demir',
      createdDate: '2024-02-14',
      dueDate: '2024-02-20',
      category: 'IT',
      description: 'Ekran titriyor, görüntü kalitesi düşük'
    },
    {
      id: 'TICKET-003',
      title: 'Depo A Klima Arızası',
      priority: 'low',
      status: 'resolved',
      assignee: 'Mehmet Kaya',
      createdDate: '2024-02-10',
      dueDate: '2024-02-15',
      category: 'HVAC',
      description: 'Klima çalışmıyor, sıcaklık yüksek'
    }
  ]

  const stats = [
    { title: 'Aktif Ekipman', value: '45', icon: Wrench, color: 'text-blue-600' },
    { title: 'Açık Ticket', value: '12', icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Bu Ay Tamamlanan', value: '28', icon: CheckCircle, color: 'text-green-600' },
    { title: 'Ortalama Çözüm Süresi', value: '2.3 gün', icon: Clock, color: 'text-orange-600' }
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
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teknik Servis</h1>
                    <p className="text-sm text-gray-600">Ekipman yönetimi ve arıza takibi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowNewTicket(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Ticket
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
                  { id: 'equipment', name: 'Ekipman', icon: Wrench },
                  { id: 'tickets', name: 'Ticketlar', icon: AlertTriangle },
                  { id: 'maintenance', name: 'Bakım Planı', icon: Calendar },
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
          {activeTab === 'equipment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Ekipman Yönetimi</CardTitle>
                      <CardDescription>
                        Tüm ekipmanlar, durumları ve bakım takvimi
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Ekipman ara..."
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipment.map((item, index) => (
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
                              item.status === 'operational' ? 'bg-green-100' :
                              item.status === 'maintenance' ? 'bg-yellow-100' :
                              'bg-red-100'
                            }`}>
                              {item.type === 'Forklift' ? <Wrench className="h-6 w-6 text-green-600" /> :
                               item.type === 'RF Terminal' ? <Monitor className="h-6 w-6 text-blue-600" /> :
                               <Server className="h-6 w-6 text-purple-600" />}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.id} - {item.type}</p>
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
                            <p className="text-sm text-gray-600">Konum</p>
                            <p className="font-medium">{item.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Operatör</p>
                            <p className="font-medium">{item.operator}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Çalışma Saati</p>
                            <p className="font-medium">{item.hours.toLocaleString()}h</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sonraki Bakım</p>
                            <p className="font-medium">{item.nextMaintenance}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'operational' ? 'bg-green-100 text-green-800' :
                              item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status === 'operational' ? 'Çalışıyor' :
                               item.status === 'maintenance' ? 'Bakımda' : 'Kritik'}
                            </span>
                            {item.issues > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {item.issues} Sorun
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                              <Activity className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-blue-50">
                              <Bell className="h-4 w-4" />
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

          {activeTab === 'tickets' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Ticket Yönetimi</CardTitle>
                      <CardDescription>
                        Arıza talepleri, atamalar ve çözüm süreçleri
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-red-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              ticket.priority === 'high' ? 'bg-red-100' :
                              ticket.priority === 'medium' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              <AlertTriangle className={`h-6 w-6 ${
                                ticket.priority === 'high' ? 'text-red-600' :
                                ticket.priority === 'medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                              <p className="text-sm text-gray-600">{ticket.id} - {ticket.category}</p>
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
                            <p className="text-sm text-gray-600">Atanan</p>
                            <p className="font-medium">{ticket.assignee}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Oluşturulma</p>
                            <p className="font-medium">{ticket.createdDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Bitiş Tarihi</p>
                            <p className="font-medium">{ticket.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Öncelik</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority === 'high' ? 'Yüksek' :
                               ticket.priority === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Açıklama</p>
                          <p className="text-sm text-gray-900">{ticket.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.status === 'open' ? 'Açık' :
                               ticket.status === 'in_progress' ? 'Devam Ediyor' : 'Çözüldü'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-red-50">
                              <Users className="h-4 w-4" />
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
        </div>

        {/* Yeni Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Ticket Oluştur</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewTicket(false)}
                  className="hover:bg-gray-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık
                    </label>
                    <Input placeholder="Ticket başlığı" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Equipment</option>
                      <option>IT</option>
                      <option>HVAC</option>
                      <option>Electrical</option>
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
                      Atanan
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Ahmet Yılmaz</option>
                      <option>Fatma Demir</option>
                      <option>Mehmet Kaya</option>
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
                    placeholder="Arıza detaylarını buraya yazın..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTicket(false)}
                  >
                    İptal
                  </Button>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Ticket Oluştur
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
