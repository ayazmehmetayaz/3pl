'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Route, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  Zap,
  TrendingUp,
  Truck,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTMSAccess } from '@/components/ProtectedRoute'

interface RouteData {
  id: string
  name: string
  type: 'delivery' | 'pickup' | 'milkrun'
  status: 'planned' | 'active' | 'completed'
  stops: number
  distance: number
  duration: number
  vehicle?: string
  driver?: string
  optimization: number
  createdAt: string
}

export default function RoutesPage() {
  const { canRoutePlanning, canWrite } = useTMSAccess()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const routes: RouteData[] = [
    {
      id: '1',
      name: 'İstanbul-Ankara Express',
      type: 'delivery',
      status: 'completed',
      stops: 3,
      distance: 454,
      duration: 320,
      vehicle: '34 ABC 123',
      driver: 'Ahmet Yılmaz',
      optimization: 15.2,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Marmara Milkrun',
      type: 'milkrun',
      status: 'active',
      stops: 8,
      distance: 280,
      duration: 420,
      vehicle: '34 DEF 456',
      driver: 'Mehmet Kaya',
      optimization: 22.8,
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      name: 'Ege Bölgesi Pickup',
      type: 'pickup',
      status: 'planned',
      stops: 5,
      distance: 180,
      duration: 240,
      vehicle: undefined,
      driver: undefined,
      optimization: 8.5,
      createdAt: '2024-01-17'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pickup':
        return <MapPin className="h-4 w-4 text-blue-500" />
      case 'milkrun':
        return <Route className="h-4 w-4 text-purple-500" />
      default:
        return <Route className="h-4 w-4 text-gray-500" />
    }
  }

  if (!canRoutePlanning) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Rota planlama modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="tms:route_planning">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rota Planlama</h1>
                <p className="text-gray-600">AI destekli rota optimizasyonu ve milkrun operasyonları</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rota adı, şehir ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Optimize Et
                </Button>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Rota
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Toplam Rota',
                value: routes.length,
                icon: Route,
                color: 'bg-blue-500'
              },
              {
                title: 'Aktif Rota',
                value: routes.filter(r => r.status === 'active').length,
                icon: Navigation,
                color: 'bg-green-500'
              },
              {
                title: 'Ortalama Tasarruf',
                value: '18.2%',
                icon: TrendingUp,
                color: 'bg-purple-500'
              },
              {
                title: 'Toplam KM',
                value: routes.reduce((sum, r) => sum + r.distance, 0),
                icon: MapPin,
                color: 'bg-orange-500'
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

          {/* Routes List */}
          <Card>
            <CardHeader>
              <CardTitle>Rota Listesi</CardTitle>
              <CardDescription>
                AI destekli rota optimizasyonu ve performans takibi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(route.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {route.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {route.stops} durak • {route.distance} km • {route.duration} dk
                          </p>
                          {route.vehicle && route.driver && (
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <Truck className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{route.vehicle}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{route.driver}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Optimizasyon</p>
                          <span className="text-lg font-bold text-green-600">
                            {route.optimization}%
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(route.status)}`}>
                            {route.status === 'completed' ? 'Tamamlandı' :
                             route.status === 'active' ? 'Aktif' : 'Planlandı'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canWrite && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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
        </div>
      </div>
    </ProtectedRoute>
  )
}
