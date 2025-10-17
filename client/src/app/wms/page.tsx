'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign,
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  Warehouse,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Filter,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function WMSPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const wmsStats = [
    {
      title: 'Toplam Ürün',
      value: '1,247',
      change: '+12%',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Aktif Lokasyon',
      value: '89',
      change: '+5%',
      icon: MapPin,
      color: 'bg-green-500',
    },
    {
      title: 'Günlük Sevkiyat',
      value: '156',
      change: '+18%',
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      title: 'Depo Doluluk',
      value: '78%',
      change: '+3%',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ]

  const recentOperations = [
    { id: '1', type: 'Alım', product: 'Laptop 15"', quantity: 50, location: 'A-01-02-03', status: 'completed', time: '2 saat önce' },
    { id: '2', type: 'Sevkiyat', product: 'Telefon', quantity: 25, location: 'B-02-01-01', status: 'in_progress', time: '1 saat önce' },
    { id: '3', type: 'Transfer', product: 'Tablet', quantity: 15, location: 'C-01-03-02', status: 'pending', time: '30 dk önce' },
    { id: '4', type: 'Sayım', product: 'Kulaklık', quantity: 100, location: 'A-03-01-01', status: 'completed', time: '45 dk önce' },
  ]

  const alerts = [
    { type: 'Kritik', message: 'A Bölgesi %95 dolu', icon: AlertTriangle, color: 'text-red-500' },
    { type: 'Uyarı', message: '3 ürün minimum stok seviyesinde', icon: Bell, color: 'text-yellow-500' },
    { type: 'Bilgi', message: 'Sayım işlemi tamamlandı', icon: CheckCircle, color: 'text-green-500' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner 
          variant="gradient" 
          size="large" 
          tip="WMS Dashboard yükleniyor..." 
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
                className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Warehouse className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">WMS - Depo Yönetimi</h1>
                <p className="text-sm text-gray-500 font-medium">Warehouse Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ürün, lokasyon ara..."
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
                  {user?.name?.charAt(0).toUpperCase() || 'W'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'warehouse'}</p>
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
              <h2 className="text-lg font-semibold text-gray-900">WMS Modülleri</h2>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {[
                { name: 'Dashboard', href: '/wms', icon: BarChart3, current: true },
                { name: 'Stok Yönetimi', href: '/wms/inventory', icon: Package },
                { name: 'Lokasyon Yönetimi', href: '/wms/locations', icon: MapPin },
                { name: 'Alım İşlemleri', href: '/wms/receiving', icon: ShoppingCart },
                { name: 'Sevkiyat İşlemleri', href: '/wms/shipping', icon: Truck },
                { name: 'Sayım İşlemleri', href: '/wms/counting', icon: CheckCircle },
                { name: 'Transfer İşlemleri', href: '/wms/transfer', icon: TrendingUp },
                { name: 'Raporlar', href: '/wms/reports', icon: BarChart3 },
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </motion.a>
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
                Depo operasyonlarınızı yönetin ve stok durumunu takip edin
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {wmsStats.map((stat, index) => (
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
                              {stat.change} geçen haftaya göre
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
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Operations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Son Operasyonlar</CardTitle>
                        <CardDescription>
                          Depo işlemlerinin güncel durumu
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-white/50">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOperations.map((operation, index) => (
                        <motion.div 
                          key={operation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              operation.status === 'completed' ? 'bg-green-100 text-green-600' :
                              operation.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {operation.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                               operation.status === 'in_progress' ? <Clock className="h-5 w-5" /> :
                               <AlertTriangle className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{operation.type} - {operation.product}</p>
                              <p className="text-sm text-gray-500">{operation.quantity} adet • {operation.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{operation.time}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                              operation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {operation.status === 'completed' ? 'Tamamlandı' :
                               operation.status === 'in_progress' ? 'Devam Ediyor' :
                               'Beklemede'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Depo Uyarıları</CardTitle>
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
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
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
                            <span className="text-xs">Detay</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}