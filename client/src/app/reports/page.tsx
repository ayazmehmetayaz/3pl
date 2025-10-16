'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  FileText,
  DollarSign,
  Package,
  Truck,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface ReportData {
  id: string
  name: string
  type: 'financial' | 'operational' | 'performance' | 'custom'
  category: string
  description: string
  lastGenerated: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  status: 'generated' | 'generating' | 'failed'
  size: string
  format: 'pdf' | 'excel' | 'csv'
}

export default function ReportsPage() {
  const { hasPermission } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data
  const reports: ReportData[] = [
    {
      id: '1',
      name: 'Aylık Finans Raporu',
      type: 'financial',
      category: 'Muhasebe',
      description: 'Gelir-gider, kar-zarar, nakit akış raporu',
      lastGenerated: '2024-01-15',
      frequency: 'monthly',
      status: 'generated',
      size: '2.3 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'Depo Performans Raporu',
      type: 'operational',
      category: 'WMS',
      description: 'Stok hareketleri, lokasyon kullanımı, verimlilik',
      lastGenerated: '2024-01-14',
      frequency: 'weekly',
      status: 'generated',
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      name: 'Nakliye Analizi',
      type: 'performance',
      category: 'TMS',
      description: 'Rota optimizasyonu, yakıt tüketimi, teslimat süreleri',
      lastGenerated: '2024-01-13',
      frequency: 'weekly',
      status: 'generated',
      size: '3.1 MB',
      format: 'pdf'
    },
    {
      id: '4',
      name: 'Müşteri Memnuniyeti',
      type: 'custom',
      category: 'Müşteri',
      description: 'Sipariş tamamlama oranları, gecikme analizi',
      lastGenerated: '2024-01-12',
      frequency: 'monthly',
      status: 'generating',
      size: '-',
      format: 'pdf'
    }
  ]

  const quickStats = {
    totalRevenue: 2450000,
    totalOrders: 1247,
    averageDeliveryTime: 4.2,
    customerSatisfaction: 94.5,
    warehouseUtilization: 78.3,
    fuelConsumption: 1250,
    maintenanceCost: 45000,
    employeeCount: 156
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="h-5 w-5 text-green-500" />
      case 'operational':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'performance':
        return <Truck className="h-5 w-5 text-orange-500" />
      case 'custom':
        return <BarChart3 className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'generating':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (!hasPermission('reporting:read')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Raporlama modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="reporting:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Raporlama & Analytics</h1>
                <p className="text-gray-600">Finans, operasyon ve performans raporları</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="quarterly">Çeyrek Yıllık</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Kategoriler</option>
                  <option value="Muhasebe">Muhasebe</option>
                  <option value="WMS">WMS</option>
                  <option value="TMS">TMS</option>
                  <option value="Müşteri">Müşteri</option>
                </select>
                {hasPermission('reporting:write') && (
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Yeni Rapor
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Toplam Ciro',
                value: `₺${(quickStats.totalRevenue / 1000000).toFixed(1)}M`,
                change: '+8.7%',
                icon: TrendingUp,
                color: 'bg-green-500',
                trend: 'up'
              },
              {
                title: 'Toplam Sipariş',
                value: quickStats.totalOrders.toLocaleString(),
                change: '+12.5%',
                icon: Package,
                color: 'bg-blue-500',
                trend: 'up'
              },
              {
                title: 'Ortalama Teslimat',
                value: `${quickStats.averageDeliveryTime}h`,
                change: '-15.3%',
                icon: Clock,
                color: 'bg-orange-500',
                trend: 'down'
              },
              {
                title: 'Müşteri Memnuniyeti',
                value: `${quickStats.customerSatisfaction}%`,
                change: '+2.1%',
                icon: Users,
                color: 'bg-purple-500',
                trend: 'up'
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
                        <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} geçen döneme göre
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Aylık Ciro Trendi</CardTitle>
                  <CardDescription>
                    Son 12 ayın gelir analizi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600">Grafik burada görünecek</p>
                      <p className="text-sm text-gray-500">Chart.js veya Recharts entegrasyonu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Operasyon Performansı</CardTitle>
                  <CardDescription>
                    WMS ve TMS performans metrikleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Pasta grafik burada görünecek</p>
                      <p className="text-sm text-gray-500">Performans dağılımı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Hazır Raporlar</CardTitle>
              <CardDescription>
                Finans, operasyon ve performans raporları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(report.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {report.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {report.category} • {report.frequency}
                            </span>
                            <span className="text-xs text-gray-500">
                              Son güncelleme: {report.lastGenerated}
                            </span>
                            {report.status === 'generated' && (
                              <span className="text-xs text-gray-500">
                                Boyut: {report.size} • {report.format.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">
                              {report.status === 'generated' ? 'Hazır' :
                               report.status === 'generating' ? 'Hazırlanıyor' : 'Hata'}
                            </span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {report.status === 'generated' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {hasPermission('reporting:write') && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { title: 'Depo Kullanım Oranı', value: `${quickStats.warehouseUtilization}%`, icon: Package },
              { title: 'Yakıt Tüketimi (L)', value: quickStats.fuelConsumption.toLocaleString(), icon: Truck },
              { title: 'Bakım Maliyeti', value: `₺${quickStats.maintenanceCost.toLocaleString()}`, icon: DollarSign }
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <metric.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      {metric.title}
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
