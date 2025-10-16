'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  MapPin, 
  Users, 
  Package, 
  Clock,
  TrendingUp,
  Fuel,
  Wrench,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Route
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTMSAccess } from '@/components/ProtectedRoute'

export default function TMSDashboard() {
  const { canRead, canWrite, canRoutePlanning, canVehicleManagement, canShipmentTracking } = useTMSAccess()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - gerçek uygulamada API'den gelecek
  const tmsStats = {
    totalVehicles: 28,
    activeVehicles: 22,
    totalDrivers: 35,
    onDutyDrivers: 18,
    pendingShipments: 45,
    inTransitShipments: 23,
    deliveredShipments: 156,
    averageDeliveryTime: 4.2,
    fuelConsumption: 1250,
    maintenanceAlerts: 5,
    routeOptimizationSavings: 15.3
  }

  const recentActivities = [
    { id: '1', type: 'delivery', shipment: 'SHP-2024-001', driver: 'Ahmet Yılmaz', location: 'Kadıköy', time: '14:30', status: 'completed' },
    { id: '2', type: 'pickup', shipment: 'PKP-2024-002', driver: 'Mehmet Kaya', location: 'Beşiktaş', time: '14:15', status: 'in_progress' },
    { id: '3', type: 'maintenance', vehicle: '34 ABC 123', type: 'inspection', time: '13:45', status: 'scheduled' },
    { id: '4', type: 'route', route: 'Rota-İstanbul-Ankara', driver: 'Ali Demir', time: '13:30', status: 'completed' }
  ]

  const alerts = [
    { id: '1', type: 'maintenance', severity: 'warning', message: '34 ABC 123 plakalı araç bakım zamanı', time: '15:00' },
    { id: '2', type: 'fuel', severity: 'info', message: '34 DEF 456 yakıt seviyesi düşük', time: '14:45' },
    { id: '3', type: 'delay', severity: 'critical', message: 'SHP-2024-003 teslimat gecikmesi', time: '14:30' },
    { id: '4', type: 'route', severity: 'info', message: 'Yeni rota optimizasyonu hazır', time: '14:15' }
  ]

  const quickActions = [
    { title: 'Rota Planlama', description: 'AI destekli rota optimizasyonu', icon: Route, href: '/tms/routes', color: 'bg-blue-500', canAccess: canRoutePlanning },
    { title: 'Araç Yönetimi', description: 'Araç ve sürücü atamaları', icon: Truck, href: '/tms/vehicles', color: 'bg-green-500', canAccess: canVehicleManagement },
    { id: '3', title: 'Sevkiyat Takibi', description: 'Gerçek zamanlı takip', icon: Package, href: '/tms/shipments', color: 'bg-purple-500', canAccess: canShipmentTracking },
    { id: '4', title: 'Konteyner', description: 'Konteyner yönetimi', icon: Package, href: '/tms/containers', color: 'bg-orange-500', canAccess: canWrite }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pickup':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-orange-500" />
      case 'route':
        return <Route className="h-4 w-4 text-purple-500" />
      default:
        return <Truck className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-orange-500" />
      case 'fuel':
        return <Fuel className="h-4 w-4 text-blue-500" />
      case 'delay':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'route':
        return <Route className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (!canRead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">TMS modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="tms:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TMS - Nakliye Yönetimi</h1>
                <p className="text-gray-600">Araç, rota, konteyner ve milkrun operasyonları</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Plaka, sürücü, sevkiyat ara..."
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
                title: 'Aktif Araçlar',
                value: `${tmsStats.activeVehicles}/${tmsStats.totalVehicles}`,
                change: '+2.1%',
                icon: Truck,
                color: 'bg-blue-500'
              },
              {
                title: 'Görevdeki Sürücüler',
                value: `${tmsStats.onDutyDrivers}/${tmsStats.totalDrivers}`,
                change: '+5.3%',
                icon: Users,
                color: 'bg-green-500'
              },
              {
                title: 'Yolda Sevkiyat',
                value: tmsStats.inTransitShipments.toString(),
                change: '+12.5%',
                icon: Package,
                color: 'bg-orange-500'
              },
              {
                title: 'Ortalama Teslimat',
                value: `${tmsStats.averageDeliveryTime}h`,
                change: '-8.2%',
                icon: Clock,
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
                    Sık kullanılan TMS operasyonları
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
                    Nakliye hareket geçmişi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'delivery' ? `${activity.shipment} - ${activity.driver}` :
                             activity.type === 'pickup' ? `${activity.shipment} - ${activity.driver}` :
                             activity.type === 'maintenance' ? `${activity.vehicle} - ${activity.type}` :
                             `${activity.route} - ${activity.driver}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.location || activity.type} • {activity.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status === 'completed' ? 'Tamamlandı' :
                           activity.status === 'in_progress' ? 'Devam Ediyor' :
                           'Planlandı'}
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
                          <p className="text-sm text-gray-900">
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
                          {alert.severity === 'critical' ? 'Kritik' :
                           alert.severity === 'warning' ? 'Uyarı' : 'Bilgi'}
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
              { title: 'Bekleyen Sevkiyat', value: tmsStats.pendingShipments, icon: Package },
              { title: 'Teslim Edilen', value: tmsStats.deliveredShipments, icon: CheckCircle },
              { title: 'Yakıt Tüketimi (L)', value: tmsStats.fuelConsumption, icon: Fuel },
              { title: 'Rota Tasarrufu (%)', value: `${tmsStats.routeOptimizationSavings}%`, icon: TrendingUp }
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
