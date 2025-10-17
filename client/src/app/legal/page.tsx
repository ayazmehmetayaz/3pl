'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  Send,
  Bell,
  Shield,
  Gavel,
  FileSignature,
  Archive,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function LegalPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('contracts')
  const [showNewContract, setShowNewContract] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const contracts = [
    {
      id: 'CNT-2024-001',
      customer: 'ABC Tekstil A.Ş.',
      type: 'Depo Kiralama',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      value: '₺2.500.000',
      renewalDate: '2024-11-15',
      risk: 'low'
    },
    {
      id: 'CNT-2024-002', 
      customer: 'XYZ Lojistik Ltd.',
      type: 'Nakliye Hizmeti',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      value: '₺1.800.000',
      renewalDate: '2024-12-01',
      risk: 'medium'
    },
    {
      id: 'CNT-2024-003',
      customer: 'DEF E-ticaret',
      type: 'Fulfillment',
      status: 'expired',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      value: '₺950.000',
      renewalDate: '2024-04-01',
      risk: 'high'
    }
  ]

  const legalCases = [
    {
      id: 'CASE-2024-001',
      title: 'ABC Tekstil - Ödeme Gecikmesi',
      status: 'active',
      court: 'İstanbul Ticaret Mahkemesi',
      nextHearing: '2024-03-15',
      amount: '₺125.000',
      priority: 'high'
    },
    {
      id: 'CASE-2024-002',
      title: 'XYZ Lojistik - Sözleşme İhlali',
      status: 'pending',
      court: 'Ankara Asliye Ticaret',
      nextHearing: '2024-04-20',
      amount: '₺75.000',
      priority: 'medium'
    }
  ]

  const stats = [
    { title: 'Aktif Sözleşmeler', value: '24', icon: FileText, color: 'text-blue-600' },
    { title: 'Bekleyen Onaylar', value: '8', icon: Clock, color: 'text-yellow-600' },
    { title: 'Aktif Davalar', value: '3', icon: Gavel, color: 'text-red-600' },
    { title: 'Riskli Sözleşmeler', value: '5', icon: AlertTriangle, color: 'text-orange-600' }
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
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hukuk Modülü</h1>
                    <p className="text-sm text-gray-600">Sözleşme ve dava yönetimi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowNewContract(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Sözleşme
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
                  { id: 'contracts', name: 'Sözleşmeler', icon: FileText },
                  { id: 'cases', name: 'Davalar', icon: Gavel },
                  { id: 'documents', name: 'Belgeler', icon: Archive },
                  { id: 'reports', name: 'Raporlar', icon: TrendingUp }
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
          {activeTab === 'contracts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Sözleşme Yönetimi</CardTitle>
                      <CardDescription>
                        Aktif sözleşmeler, yenileme tarihleri ve risk analizi
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Sözleşme ara..."
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contracts.map((contract, index) => (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              contract.status === 'active' ? 'bg-green-500' :
                              contract.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{contract.customer}</h3>
                              <p className="text-sm text-gray-600">{contract.id} - {contract.type}</p>
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
                            <p className="text-sm text-gray-600">Başlangıç</p>
                            <p className="font-medium">{contract.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Bitiş</p>
                            <p className="font-medium">{contract.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Değer</p>
                            <p className="font-medium text-green-600">{contract.value}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Risk</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contract.risk === 'low' ? 'bg-green-100 text-green-800' :
                              contract.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {contract.risk === 'low' ? 'Düşük' :
                               contract.risk === 'medium' ? 'Orta' : 'Yüksek'}
                            </span>
                          </div>
                        </div>

                        {contract.status === 'expired' && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-700">
                                Bu sözleşme süresi dolmuş. Yenileme gerekli.
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'cases' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass bg-white/95 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Dava Takibi</CardTitle>
                      <CardDescription>
                        Aktif davalar, duruşma tarihleri ve hukuki süreçler
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Dava
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {legalCases.map((case_, index) => (
                      <motion.div
                        key={case_.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-r from-white to-red-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              case_.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                              <p className="text-sm text-gray-600">{case_.id} - {case_.court}</p>
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Sonraki Duruşma</p>
                            <p className="font-medium">{case_.nextHearing}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tutar</p>
                            <p className="font-medium text-red-600">{case_.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Öncelik</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              case_.priority === 'high' ? 'bg-red-100 text-red-800' :
                              case_.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {case_.priority === 'high' ? 'Yüksek' :
                               case_.priority === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durum</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              case_.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {case_.status === 'active' ? 'Aktif' : 'Beklemede'}
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

        {/* Yeni Sözleşme Modal */}
        {showNewContract && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Sözleşme Oluştur</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewContract(false)}
                  className="hover:bg-gray-100"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müşteri
                    </label>
                    <Input placeholder="Müşteri seçin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sözleşme Türü
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Depo Kiralama</option>
                      <option>Nakliye Hizmeti</option>
                      <option>Fulfillment</option>
                      <option>Karma Çözüm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sözleşme Değeri
                    </label>
                    <Input placeholder="₺0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ödeme Vadesi
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>30 Gün</option>
                      <option>60 Gün</option>
                      <option>90 Gün</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özel Şartlar
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Özel şartları buraya yazın..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewContract(false)}
                  >
                    İptal
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <FileSignature className="h-4 w-4 mr-2" />
                    Sözleşme Oluştur
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
