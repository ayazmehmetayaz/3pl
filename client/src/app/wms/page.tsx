'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useWMSAccess } from '@/components/ProtectedRoute'

export default function WMSDashboard() {
  const { user } = useAuth()
  const { canRead, canWrite, canReceiving, canShipping, canInventory } = useWMSAccess()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - gerçek uygulamada API'den gelecek
  const wmsStats = {
    totalProducts: 1247,
    totalLocations: 342,
    occupiedLocations: 289,
    utilizationRate: 84.5,
    pendingReceipts: 23,
    pendingShipments: 45,
    activePickingTasks: 12,
    cycleCountVariance: 2.3,
    fulfillmentOrders: 156,
    crossdockOrders: 34
  }

  const recentActivities = [
    { id: '1', type: 'receipt', product: 'ABC-001', quantity: 100, location: 'A-01-01', time: '10:30', status: 'completed' },
    { id: '2', type: 'shipment', product: 'XYZ-002', quantity: 50, location: 'B-02-03', time: '10:15', status: 'in_progress' },
    { id: '3', type: 'transfer', product: 'DEF-003', quantity: 25, location: 'C-01-02', time: '09:45', status: 'pending' },
    { id: '4', type: 'cycle_count', product: 'GHI-004', quantity: 200, location: 'A-03-01', time: '09:30', status: 'completed' }
  ]

  const alerts = [
    { id: '1', type: 'low_stock', severity: 'critical', product: 'ABC-001', message: 'Stok seviyesi kritik: 5 adet', time: '11:00' },
    { id: '2', type: 'expiry', severity: 'warning', product: 'XYZ-002', message: 'Son kullanma tarihi yaklaşıyor: 3 gün', time: '10:45' },
    { id: '3', type: 'location_full', severity: 'info', product: 'DEF-003', message: 'A-01-01 lokasyonu %95 dolu', time: '10:30' }
  ]

  const quickActions = [
    { title: 'Mal Kabul', description: 'Yeni mal kabul işlemi başlat', icon: Package, href: '/wms/receiving', color: 'bg-blue-500', canAccess: canReceiving },
    { title: 'Sevkiyat', description: 'Sevkiyat emri oluştur', icon: Truck, href: '/wms/shipping', color: 'bg-green-500', canAccess: canShipping },
    { title: 'Stok Sayımı', description: 'Cycle count başlat', icon: BarChart3, href: '/wms/count', color: 'bg-purple-500', canAccess: canInventory },
    { title: 'Transfer', description: 'Depo/konum transferi', icon: MapPin, href: '/wms/transfer', color: 'bg-orange-500', canAccess: canWrite }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'expiry':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'location_full':
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <Package className="h-4 w-4 text-green-500" />
      case 'shipment':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'transfer':
        return <MapPin className="h-4 w-4 text-orange-500" />
      case 'cycle_count':
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  if (!canRead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">WMS modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="wms:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">WMS - Depo Yönetimi</h1>
                <p className="text-gray-600">FIFO/FEFO, lot takibi ve fulfillment operasyonları</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Ürün, lot veya konum ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni İşlem
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Toplam Ürün',
                value: wmsStats.totalProducts.toLocaleString(),
                change: '+5.2%',
                icon: Package,
                color: 'bg-blue-500'
              },
              {
                title: 'Lokasyon Kullanımı',
                value: `${wmsStats.utilizationRate}%`,
                change: '+2.1%',
                icon: MapPin,
                color: 'bg-green-500'
              },
              {
                title: 'Bekleyen Sevkiyat',
                value: wmsStats.pendingShipments.toString(),
                change: '-8.3%',
                icon: Truck,
                color: 'bg-orange-500'
              },
              {
                title: 'Aktif Toplama',
                value: wmsStats.activePickingTasks.toString(),
                change: '+12.5%',
                icon: Users,
                color: 'bg-purple-500'
              }
            ].map((stat, index) => (
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
                          {stat.change} geçen haftaya göre
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                  <CardDescription>
                    Sık kullanılan WMS operasyonları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action) => (
                      <div
                        key={action.title}
                        className={`p-3 rounded-lg border transition-colors ${
                          action.canAccess 
                            ? 'hover:bg-gray-50 cursor-pointer border-gray-200' 
                            : 'opacity-50 cursor-not-allowed border-gray-100'
                        }`}
                        onClick={() => action.canAccess && (window.location.href = action.href)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                            <action.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{action.title}</p>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                  <CardDescription>
                    Depo hareket geçmişi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.product} - {activity.quantity} adet
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.location} • {activity.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Uyarılar</CardTitle>
                  <CardDescription>
                    Dikkat edilmesi gereken durumlar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.product}
                          </p>
                          <p className="text-xs text-gray-600">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Fulfillment Siparişler', value: wmsStats.fulfillmentOrders, icon: CheckCircle },
              { title: 'Crossdock İşlemler', value: wmsStats.crossdockOrders, icon: TrendingUp },
              { title: 'Bekleyen Mal Kabul', value: wmsStats.pendingReceipts, icon: Package },
              { title: 'Sayım Varyansı', value: `${wmsStats.cycleCountVariance}%`, icon: BarChart3 }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      {stat.title}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
