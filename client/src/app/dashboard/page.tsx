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
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const stats = [
    {
      title: 'Aktif Müşteri',
      value: '45',
      change: '+8%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Günlük Sevkiyat',
      value: '234',
      change: '+12%',
      icon: Truck,
      color: 'bg-green-500',
    },
    {
      title: 'Depo Doluluk',
      value: '78%',
      change: '+5%',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Aylık Ciro',
      value: '₺2.4M',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ]

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: TrendingUp, current: true },
    { name: 'WMS - Depo', href: '/wms', icon: Package },
    { name: 'TMS - Nakliye', href: '/tms', icon: Truck },
    { name: 'Müşteri Portalı', href: '/customer-portal', icon: Users },
    { name: 'Finans & Fatura', href: '/finance', icon: DollarSign },
    { name: 'İnsan Kaynakları', href: '/hr', icon: Users },
    { name: 'Raporlama', href: '/reports', icon: TrendingUp },
  ]

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Ayaz 3PL</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ara..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Kullanıcı'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
                  </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0).toUpperCase() || 'K'}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-sm min-h-screen`}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş geldiniz, {user?.name || 'Kullanıcı'}
            </h1>
            <p className="text-gray-600">
              3PL lojistik operasyonlarınızın genel durumunu ve performansını takip edin
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          {stat.change} geçen aya göre
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Son Sevkiyatlar</CardTitle>
                  <CardDescription>
                    En son tamamlanan sevkiyatların listesi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 'SHIP-001', customer: 'ABC Şirketi', destination: 'İstanbul', status: 'Teslim Edildi' },
                      { id: 'SHIP-002', customer: 'XYZ Ltd.', destination: 'Ankara', status: 'Yolda' },
                      { id: 'SHIP-003', customer: 'DEF A.Ş.', destination: 'İzmir', status: 'Depo Çıkışı' },
                    ].map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{shipment.id}</p>
                          <p className="text-sm text-gray-600">{shipment.customer} → {shipment.destination}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600">{shipment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Operasyon Uyarıları</CardTitle>
                  <CardDescription>
                    Dikkat edilmesi gereken operasyon durumları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Depo Doluluk', message: 'A Bölgesi %95 dolu', status: 'Kritik' },
                      { type: 'Nakliye Gecikme', message: '3 sevkiyat 2+ saat gecikmeli', status: 'Uyarı' },
                      { type: 'Fatura Vadesi', message: '5 müşteri fatura vadesi geçti', status: 'Kritik' },
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-gray-900">{alert.type}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.status === 'Kritik' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
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
