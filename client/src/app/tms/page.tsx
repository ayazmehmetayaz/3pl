'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  MapPin, 
  Users, 
  TrendingUp, 
  Navigation,
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  Route,
  Clock,
  Fuel,
  Package,
  CheckCircle,
  AlertTriangle,
  Car,
  Calendar,
  Filter,
  Download,
  Eye,
  Play,
  Pause
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TMSPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const tmsStats = [
    {
      title: 'Aktif Araç',
      value: '24',
      change: '+2',
      icon: Truck,
      color: 'bg-blue-500',
    },
    {
      title: 'Bugünkü Rota',
      value: '18',
      change: '+3',
      icon: Route,
      color: 'bg-green-500',
    },
    {
      title: 'Günlük Sevkiyat',
      value: '89',
      change: '+12%',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Ortalama Süre',
      value: '4.2h',
      change: '-15%',
      icon: Clock,
      color: 'bg-orange-500',
    },
  ]

  const activeRoutes = [
    { 
      id: '1', 
      vehicle: '34 ABC 123', 
      driver: 'Ahmet Yılmaz', 
      route: 'İstanbul → Ankara', 
      status: 'in_transit', 
      progress: 65,
      estimatedArrival: '14:30',
      packages: 45
    },
    { 
      id: '2', 
      vehicle: '06 DEF 456', 
      driver: 'Mehmet Kaya', 
      route: 'Ankara → İzmir', 
      status: 'loading', 
      progress: 25,
      estimatedArrival: '16:45',
      packages: 32
    },
    { 
      id: '3', 
      vehicle: '35 GHI 789', 
      driver: 'Ali Demir', 
      route: 'İzmir → Bursa', 
      status: 'completed', 
      progress: 100,
      estimatedArrival: 'Tamamlandı',
      packages: 28
    },
  ]

  const alerts = [
    { type: 'Kritik', message: '2 araç yakıt seviyesi düşük', icon: Fuel, color: 'text-red-500' },
    { type: 'Uyarı', message: '3 rota gecikme riski', icon: Clock, color: 'text-yellow-500' },
    { type: 'Bilgi', message: 'Yeni araç ataması yapıldı', icon: Car, color: 'text-blue-500' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner 
          variant="gradient" 
          size="large" 
          tip="TMS Dashboard yükleniyor..." 
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
                <Truck className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">TMS - Nakliye Yönetimi</h1>
                <p className="text-sm text-gray-500 font-medium">Transportation Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Araç, şoför, rota ara..."
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
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'transport'}</p>
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
              <h2 className="text-lg font-semibold text-gray-900">TMS Modülleri</h2>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {[
                { name: 'Dashboard', href: '/tms', icon: TrendingUp, current: true },
                { name: 'Araç Yönetimi', href: '/tms/vehicles', icon: Truck },
                { name: 'Şoför Yönetimi', href: '/tms/drivers', icon: Users },
                { name: 'Rota Planlama', href: '/tms/routes', icon: Route },
                { name: 'Sevkiyat Takibi', href: '/tms/shipments', icon: Package },
                { name: 'GPS Takip', href: '/tms/tracking', icon: MapPin },
                { name: 'Yakıt Yönetimi', href: '/tms/fuel', icon: Fuel },
                { name: 'Bakım Takibi', href: '/tms/maintenance', icon: Settings },
                { name: 'Raporlar', href: '/tms/reports', icon: TrendingUp },
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
                Nakliye operasyonlarınızı yönetin ve araç filonuzu takip edin
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {tmsStats.map((stat, index) => (
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
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              stat.change.includes('+') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                            }`}>
                              {stat.change} geçen güne göre
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

            {/* Active Routes and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Routes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Aktif Rotalar</CardTitle>
                        <CardDescription>
                          Şu anda devam eden nakliye operasyonları
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-white/50">
                        <Eye className="h-4 w-4 mr-2" />
                        Tümünü Gör
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeRoutes.map((route, index) => (
                        <motion.div 
                          key={route.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                route.status === 'in_transit' ? 'bg-green-500 animate-pulse' :
                                route.status === 'loading' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}></div>
                              <span className="font-semibold text-gray-900">{route.vehicle}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {route.status === 'in_transit' && (
                                <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                  <Pause className="h-3 w-3" />
                                </Button>
                              )}
                              {route.status === 'loading' && (
                                <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="hover:bg-white/50">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Şoför:</span>
                              <span className="font-medium">{route.driver}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Rota:</span>
                              <span className="font-medium">{route.route}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Paket:</span>
                              <span className="font-medium">{route.packages} adet</span>
                            </div>
                            
                            {route.status !== 'completed' && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">İlerleme:</span>
                                  <span className="font-medium">{route.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      route.status === 'in_transit' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}
                                    style={{ width: `${route.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-between text-sm mt-3 pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Tahmini Varış:</span>
                              <span className="font-medium text-blue-600">{route.estimatedArrival}</span>
                            </div>
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
                    <CardTitle className="text-xl font-bold text-gray-900">Nakliye Uyarıları</CardTitle>
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
                            <span className="text-xs">İncele</span>
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