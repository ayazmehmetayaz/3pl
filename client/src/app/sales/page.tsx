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
  const [showNewProposal, setShowNewProposal] = useState(false)
  const [newProposal, setNewProposal] = useState({
    customer: '',
    proposal: '',
    value: '',
    probability: 50,
    description: '',
    // Yeni alanlar
    companyType: 'B2B',
    contractDuration: 12,
    monthlyFee: '',
    perUnitFee: '',
    discount: 0,
    services: [],
    specialConditions: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    taxNumber: '',
    creditLimit: '',
    paymentTerms: '30',
    // Teklif türü detayları
    proposalType: '', // 'depo', 'nakliye', 'fulfillment', 'karma'
    // Depo detayları
    warehouseArea: '',
    warehouseType: '', // 'normal', 'soğuk', 'tehlikeli'
    storageMethod: '', // 'fifo', 'fefo', 'lifo'
    handlingType: '', // 'manuel', 'otomatik', 'yarı-otomatik'
    crossdock: false,
    // Nakliye detayları
    transportType: '', // 'mikro', 'kargo', 'paletli', 'full_arac'
    vehicleType: '', // 'kamyon', 'tır', 'van', 'konteyner'
    routeType: '', // 'şehir_içi', 'şehirler_arası', 'uluslararası'
    // Fulfillment detayları
    fulfillmentType: '', // 'e_ticaret', 'b2b', 'karma'
    packaging: false,
    labeling: false,
    returnManagement: false
  })

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleNewProposal = () => {
    // Boş form ile başla
    setNewProposal({
      customer: '',
      proposal: '',
      value: '',
      probability: 50,
      description: '',
      companyType: 'B2B',
      contractDuration: 12,
      monthlyFee: '',
      perUnitFee: '',
      discount: 0,
      services: [],
      specialConditions: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      taxNumber: '',
      creditLimit: '',
      paymentTerms: '30',
      // Teklif türü detayları
      proposalType: '',
      // Depo detayları
      warehouseArea: '',
      warehouseType: '',
      storageMethod: '',
      handlingType: '',
      crossdock: false,
      // Nakliye detayları
      transportType: '',
      vehicleType: '',
      routeType: '',
      // Fulfillment detayları
      fulfillmentType: '',
      packaging: false,
      labeling: false,
      returnManagement: false
    })
    setShowNewProposal(true)
  }

  const handleSaveProposal = () => {
    // Burada gerçek API çağrısı yapılacak
    console.log('Yeni teklif kaydediliyor:', newProposal)
    setShowNewProposal(false)
    setNewProposal({
      customer: '',
      proposal: '',
      value: '',
      probability: 50,
      description: '',
      companyType: 'B2B',
      contractDuration: 12,
      monthlyFee: '',
      perUnitFee: '',
      discount: 0,
      services: [],
      specialConditions: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      taxNumber: '',
      creditLimit: '',
      paymentTerms: '30'
    })
    // Başarı mesajı göster
    alert('Teklif başarıyla kaydedildi!')
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-white/50"
                        onClick={handleNewProposal}
                      >
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

      {/* Yeni Teklif Modal - Profesyonel Tasarım */}
      {showNewProposal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl w-full max-w-6xl mx-auto shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header - Profesyonel */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Profesyonel Teklif Hazırlama</h2>
                    <p className="text-blue-100 text-lg">Ayaz Lojistik - 3PL Hizmetleri</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNewProposal(false)}
                  className="hover:bg-white/20 text-white border border-white/30"
                >
                  <span className="text-2xl">×</span>
                </Button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="p-8 space-y-8">
                {/* Teklif Türü Seçimi - Premium Tasarım */}
                <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Hangi Hizmet Türü İçin Teklif Hazırlıyoruz?</h3>
                    <p className="text-gray-600">Müşterinizin ihtiyacına göre en uygun çözümü seçin</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        id: 'depo', 
                        name: 'Depo Hizmetleri', 
                        icon: Warehouse, 
                        color: 'from-blue-500 to-cyan-500',
                        description: 'Depo kiralama, stok yönetimi, FIFO/FEFO',
                        features: ['Depo Kiralama', 'Stok Yönetimi', 'Crossdock', 'Elleçleme']
                      },
                      { 
                        id: 'nakliye', 
                        name: 'Nakliye Hizmetleri', 
                        icon: Truck, 
                        color: 'from-green-500 to-emerald-500',
                        description: 'Mikro dağıtım, kargo, paletli, full araç',
                        features: ['Mikro Dağıtım', 'Kargo', 'Paletli', 'Full Araç']
                      },
                      { 
                        id: 'fulfillment', 
                        name: 'Fulfillment', 
                        icon: Package, 
                        color: 'from-orange-500 to-red-500',
                        description: 'E-ticaret, B2B, paketleme, etiketleme',
                        features: ['E-ticaret', 'B2B', 'Paketleme', 'Etiketleme']
                      },
                      { 
                        id: 'karma', 
                        name: 'Karma Çözüm', 
                        icon: BarChart3, 
                        color: 'from-purple-500 to-pink-500',
                        description: 'Depo + Nakliye + Fulfillment entegrasyonu',
                        features: ['Entegre Çözüm', 'End-to-End', 'Optimizasyon', 'AI Destekli']
                      }
                    ].map((type) => (
                      <motion.label 
                        key={type.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative cursor-pointer group ${
                          newProposal.proposalType === type.id 
                            ? 'ring-4 ring-blue-500 ring-opacity-50' 
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="proposalType"
                          value={type.id}
                          checked={newProposal.proposalType === type.id}
                          onChange={(e) => setNewProposal({...newProposal, proposalType: e.target.value})}
                          className="sr-only"
                        />
                        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          newProposal.proposalType === type.id 
                            ? 'border-blue-500 bg-blue-50 shadow-xl' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                        }`}>
                          <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <type.icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 text-center mb-2">{type.name}</h4>
                          <p className="text-sm text-gray-600 text-center mb-4">{type.description}</p>
                          <div className="space-y-1">
                            {type.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          {newProposal.proposalType === type.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

              {/* Müşteri Bilgileri */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Müşteri Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı *
                    </label>
                    <Input
                      value={newProposal.customer}
                      onChange={(e) => setNewProposal({...newProposal, customer: e.target.value})}
                      placeholder="Şirket adını girin"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Tipi
                    </label>
                    <select
                      value={newProposal.companyType}
                      onChange={(e) => setNewProposal({...newProposal, companyType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="B2B">B2B - Kurumsal</option>
                      <option value="B2C">B2C - Bireysel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İletişim Kişisi
                    </label>
                    <Input
                      value={newProposal.contactPerson}
                      onChange={(e) => setNewProposal({...newProposal, contactPerson: e.target.value})}
                      placeholder="İletişim kişisi adı"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <Input
                      value={newProposal.phone}
                      onChange={(e) => setNewProposal({...newProposal, phone: e.target.value})}
                      placeholder="+90 212 555 0123"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <Input
                      value={newProposal.email}
                      onChange={(e) => setNewProposal({...newProposal, email: e.target.value})}
                      placeholder="ornek@email.com"
                      type="email"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vergi No
                    </label>
                    <Input
                      value={newProposal.taxNumber}
                      onChange={(e) => setNewProposal({...newProposal, taxNumber: e.target.value})}
                      placeholder="1234567890"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Teklif Detayları */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Teklif Detayları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teklif Başlığı *
                    </label>
                    <Input
                      value={newProposal.proposal}
                      onChange={(e) => setNewProposal({...newProposal, proposal: e.target.value})}
                      placeholder="Teklif başlığını girin"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sözleşme Süresi (ay)
                    </label>
                    <Input
                      value={newProposal.contractDuration}
                      onChange={(e) => setNewProposal({...newProposal, contractDuration: parseInt(e.target.value)})}
                      placeholder="12"
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Değer (₺) *
                    </label>
                    <Input
                      value={newProposal.value}
                      onChange={(e) => setNewProposal({...newProposal, value: e.target.value})}
                      placeholder="0"
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başarı Oranı (%)
                    </label>
                    <Input
                      value={newProposal.probability}
                      onChange={(e) => setNewProposal({...newProposal, probability: parseInt(e.target.value)})}
                      placeholder="50"
                      type="number"
                      min="0"
                      max="100"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aylık Sabit Ücret (₺)
                    </label>
                    <Input
                      value={newProposal.monthlyFee}
                      onChange={(e) => setNewProposal({...newProposal, monthlyFee: e.target.value})}
                      placeholder="0"
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birim Ücret (₺)
                    </label>
                    <Input
                      value={newProposal.perUnitFee}
                      onChange={(e) => setNewProposal({...newProposal, perUnitFee: e.target.value})}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Hizmetler ve Özel Koşullar */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Hizmetler ve Koşullar
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teklif Açıklaması
                    </label>
                    <textarea
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                      placeholder="Teklif detaylarını açıklayın..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özel Koşullar
                    </label>
                    <textarea
                      value={newProposal.specialConditions}
                      onChange={(e) => setNewProposal({...newProposal, specialConditions: e.target.value})}
                      placeholder="Özel koşullar ve indirimler..."
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Adres Bilgileri */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-indigo-600" />
                  Adres Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <Input
                      value={newProposal.address}
                      onChange={(e) => setNewProposal({...newProposal, address: e.target.value})}
                      placeholder="Tam adres bilgisi"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir
                    </label>
                    <Input
                      value={newProposal.city}
                      onChange={(e) => setNewProposal({...newProposal, city: e.target.value})}
                      placeholder="İstanbul"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kredi Limiti (₺)
                    </label>
                    <Input
                      value={newProposal.creditLimit}
                      onChange={(e) => setNewProposal({...newProposal, creditLimit: e.target.value})}
                      placeholder="0"
                      type="number"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Hizmet Seçimi */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  Hizmet Seçimi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'depo', name: 'Depo Kiralama', icon: Warehouse },
                    { id: 'nakliye', name: 'Nakliye', icon: Truck },
                    { id: 'fulfillment', name: 'Fulfillment', icon: Package },
                    { id: 'crossdock', name: 'Crossdock', icon: BarChart3 }
                  ].map((service) => (
                    <label key={service.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProposal.services.includes(service.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProposal({...newProposal, services: [...newProposal.services, service.name]})
                          } else {
                            setNewProposal({...newProposal, services: newProposal.services.filter(s => s !== service.name)})
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <service.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ödeme Koşulları */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Ödeme Koşulları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ödeme Vadesi (gün)
                    </label>
                    <select
                      value={newProposal.paymentTerms}
                      onChange={(e) => setNewProposal({...newProposal, paymentTerms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">Peşin</option>
                      <option value="15">15 Gün</option>
                      <option value="30">30 Gün</option>
                      <option value="45">45 Gün</option>
                      <option value="60">60 Gün</option>
                      <option value="90">90 Gün</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Oranı (%)
                    </label>
                    <Input
                      value={newProposal.discount}
                      onChange={(e) => setNewProposal({...newProposal, discount: parseInt(e.target.value)})}
                      placeholder="0"
                      type="number"
                      min="0"
                      max="100"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewProposal(false)}
                    className="hover:bg-gray-50"
                  >
                    <span className="mr-2">←</span>
                    İptal
                  </Button>
                  <Button 
                    onClick={handleSaveProposal}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Taslak Kaydet
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => window.print()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF İndir
                  </Button>
                  <Button 
                    onClick={handleSaveProposal}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-6 py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Teklif Gönder
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
