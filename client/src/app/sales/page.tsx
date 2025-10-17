'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Phone,
  Mail,
  Calendar,
  Download,
  Upload,
  Edit,
  Eye,
  Plus,
  Send,
  FileSignature,
  Percent,
  Award,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function SalesPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const salesStats = [
    {
      title: 'Aylık Ciro',
      value: '₺2.4M',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Aktif Müşteri',
      value: '45',
      change: '+8%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Bekleyen Teklif',
      value: '12',
      change: '+3',
      icon: FileText,
      color: 'bg-orange-500',
    },
    {
      title: 'Hedef Tamamlama',
      value: '87%',
      change: '+5%',
      icon: Target,
      color: 'bg-purple-500',
    },
  ]

  const recentProposals = [
    { 
      id: '1', 
      customer: 'ABC Şirketi', 
      proposal: 'Lojistik Hizmet Paketi', 
      value: '₺125,000', 
      status: 'pending', 
      date: '2024-01-15',
      probability: 75
    },
    { 
      id: '2', 
      customer: 'XYZ Ltd.', 
      proposal: 'Depo Kiralama', 
      value: '₺85,000', 
      status: 'approved', 
      date: '2024-01-14',
      probability: 90
    },
    { 
      id: '3', 
      customer: 'DEF A.Ş.', 
      proposal: 'Nakliye Hizmetleri', 
      value: '₺200,000', 
      status: 'negotiation', 
      date: '2024-01-13',
      probability: 60
    },
  ]

  const contracts = [
    { 
      id: '1', 
      customer: 'ABC Şirketi', 
      contract: 'LOJ-2024-001', 
      value: '₺125,000', 
      status: 'active', 
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    { 
      id: '2', 
      customer: 'XYZ Ltd.', 
      contract: 'LOJ-2024-002', 
      value: '₺85,000', 
      status: 'pending', 
      startDate: '2024-02-01',
      endDate: '2024-11-30'
    },
  ]

  const alerts = [
    { type: 'Bilgi', message: '3 teklif onay bekliyor', icon: Clock, color: 'text-blue-500' },
    { type: 'Uyarı', message: '2 sözleşme süresi dolmak üzere', icon: AlertTriangle, color: 'text-yellow-500' },
    { type: 'Başarı', message: 'Yeni müşteri sözleşmesi imzalandı', icon: CheckCircle, color: 'text-green-500' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner 
          variant="gradient" 
          size="large" 
          tip="Satış & Pazarlama yükleniyor..." 
        />
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden hover:bg-white/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingUp className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Satış & Pazarlama</h1>
                <p className="text-sm text-gray-500 font-medium">Sales & Marketing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Müşteri, teklif ara..."
                className="pl-10 w-64 bg-white/50 border-white/20 focus:border-white/40"
              />
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-white/50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/50">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'sales'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Satış & Pazarlama</h2>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {[
                { name: 'Genel Bakış', href: '#overview', icon: BarChart3, current: activeTab === 'overview' },
                { name: 'Müşteri Yönetimi', href: '#customers', icon: Users, current: activeTab === 'customers' },
                { name: 'Teklif Yönetimi', href: '#proposals', icon: FileText, current: activeTab === 'proposals' },
                { name: 'Sözleşme Yönetimi', href: '#contracts', icon: FileSignature, current: activeTab === 'contracts' },
                { name: 'Kampanya Yönetimi', href: '#campaigns', icon: Target, current: activeTab === 'campaigns' },
                { name: 'Fiyat Yönetimi', href: '#pricing', icon: DollarSign, current: activeTab === 'pricing' },
                { name: 'Satış Raporları', href: '#reports', icon: TrendingUp, current: activeTab === 'reports' },
                { name: 'Hedef Takibi', href: '#targets', icon: Target, current: activeTab === 'targets' },
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveTab(item.href.replace('#', ''))}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50 hover:text-green-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş geldiniz, {user?.name || 'Kullanıcı'}
              </h1>
              <p className="text-gray-600">
                Müşteri ilişkileri, teklif yönetimi ve satış süreçleri
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {salesStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="card-hover glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl border-0 relative overflow-hidden">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-800 transition-colors">
                            {stat.title}
                          </p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                            {stat.value}
                          </p>
                          <div className="flex items-center">
                            <span className="text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                              {stat.change} geçen aya göre
                            </span>
                          </div>
                        </div>
                        <motion.div 
                          className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <stat.icon className="h-8 w-8 text-white" />
                          {/* Glow Effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                      </div>
                      
                      {/* Bottom Gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Proposals and Contracts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Proposals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Son Teklifler</CardTitle>
                        <CardDescription>
                          Müşteri teklifleri ve durumları
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-white/50">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Teklif
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProposals.map((proposal, index) => (
                        <motion.div 
                          key={proposal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                proposal.status === 'approved' ? 'bg-green-500' :
                                proposal.status === 'pending' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}></div>
                              <span className="font-semibold text-gray-900">{proposal.customer}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Teklif:</span>
                              <span className="font-medium">{proposal.proposal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Değer:</span>
                              <span className="font-medium text-green-600">{proposal.value}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Başarı Oranı:</span>
                              <span className="font-medium">{proposal.probability}%</span>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Başarı Oranı:</span>
                                <span className="font-medium">{proposal.probability}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    proposal.probability >= 80 ? 'bg-green-500' :
                                    proposal.probability >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${proposal.probability}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm mt-3 pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Tarih:</span>
                              <span className="font-medium text-blue-600">{proposal.date}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contracts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Sözleşmeler</CardTitle>
                        <CardDescription>
                          Aktif ve bekleyen sözleşmeler
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-white/50">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Sözleşme
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contracts.map((contract, index) => (
                        <motion.div 
                          key={contract.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                contract.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></div>
                              <span className="font-semibold text-gray-900">{contract.customer}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Sözleşme:</span>
                              <span className="font-medium">{contract.contract}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Değer:</span>
                              <span className="font-medium text-green-600">{contract.value}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Başlangıç:</span>
                              <span className="font-medium">{contract.startDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Bitiş:</span>
                              <span className="font-medium">{contract.endDate}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm mt-3 pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Durum:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {contract.status === 'active' ? 'Aktif' : 'Beklemede'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Satış Uyarıları</CardTitle>
                  <CardDescription>
                    Dikkat edilmesi gereken durumlar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.color} bg-opacity-20`}>
                          <alert.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{alert.type}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-white/50">
                          <span className="text-xs">İncele</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
