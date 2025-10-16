'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Navigation,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTMSAccess } from '@/components/ProtectedRoute'

interface Shipment {
  id: string
  shipmentNumber: string
  type: 'domestic' | 'international' | 'express'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered'
  origin: string
  destination: string
  customer: string
  vehicle?: string
  driver?: string
  requestedDate: string
  estimatedDelivery: string
  actualDelivery?: string
  trackingNumber?: string
}

export default function ShipmentsPage() {
  const { canShipmentTracking, canWrite } = useTMSAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const shipments: Shipment[] = [
    {
      id: '1',
      shipmentNumber: 'SHP-2024-001',
      type: 'express',
      priority: 'high',
      status: 'delivered',
      origin: 'İstanbul Depo',
      destination: 'Ankara Merkez',
      customer: 'ABC E-ticaret Ltd.',
      vehicle: '34 ABC 123',
      driver: 'Ahmet Yılmaz',
      requestedDate: '2024-01-15',
      estimatedDelivery: '2024-01-16',
      actualDelivery: '2024-01-16',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '2',
      shipmentNumber: 'SHP-2024-002',
      type: 'domestic',
      priority: 'normal',
      status: 'in_transit',
      origin: 'İzmir Depo',
      destination: 'Bursa Fabrika',
      customer: 'XYZ Üretim A.Ş.',
      vehicle: '34 DEF 456',
      driver: 'Mehmet Kaya',
      requestedDate: '2024-01-16',
      estimatedDelivery: '2024-01-17',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '3',
      shipmentNumber: 'SHP-2024-003',
      type: 'international',
      priority: 'urgent',
      status: 'assigned',
      origin: 'İstanbul Liman',
      destination: 'Hamburg Liman',
      customer: 'DEF Lojistik Ltd.',
      vehicle: '34 GHI 789',
      driver: 'Ali Demir',
      requestedDate: '2024-01-17',
      estimatedDelivery: '2024-01-20'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'express':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'international':
        return <Navigation className="h-4 w-4 text-blue-500" />
      case 'domestic':
        return <Package className="h-4 w-4 text-green-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canShipmentTracking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Sevkiyat takibi modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="tms:shipment_tracking">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sevkiyat Takibi</h1>
                <p className="text-gray-600">Gerçek zamanlı sevkiyat takibi ve GPS konum bilgileri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Sevkiyat no, müşteri, takip no ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="pending">Bekleyen</option>
                  <option value="assigned">Atandı</option>
                  <option value="in_transit">Yolda</option>
                  <option value="delivered">Teslim Edildi</option>
                </select>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Sevkiyat
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
                title: 'Bekleyen',
                value: shipments.filter(s => s.status === 'pending').length,
                icon: Clock,
                color: 'bg-gray-500'
              },
              {
                title: 'Atandı',
                value: shipments.filter(s => s.status === 'assigned').length,
                icon: CheckCircle,
                color: 'bg-yellow-500'
              },
              {
                title: 'Yolda',
                value: shipments.filter(s => s.status === 'in_transit').length,
                icon: Truck,
                color: 'bg-blue-500'
              },
              {
                title: 'Teslim Edildi',
                value: shipments.filter(s => s.status === 'delivered').length,
                icon: CheckCircle,
                color: 'bg-green-500'
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

          {/* Shipments List */}
          <Card>
            <CardHeader>
              <CardTitle>Sevkiyat Listesi</CardTitle>
              <CardDescription>
                Gerçek zamanlı takip ve GPS konum bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredShipments.map((shipment, index) => (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(shipment.type)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {shipment.shipmentNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                              {shipment.priority === 'urgent' ? 'Acil' :
                               shipment.priority === 'high' ? 'Yüksek' :
                               shipment.priority === 'normal' ? 'Normal' : 'Düşük'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {shipment.customer}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{shipment.origin} → {shipment.destination}</span>
                            </div>
                            {shipment.trackingNumber && (
                              <span className="text-xs text-blue-600">
                                Takip: {shipment.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Talep Tarihi</p>
                          <span className="text-sm font-medium">{shipment.requestedDate}</span>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Tahmini Teslimat</p>
                          <span className="text-sm font-medium">{shipment.estimatedDelivery}</span>
                        </div>
                        
                        {shipment.vehicle && shipment.driver && (
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Araç/Sürücü</p>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{shipment.vehicle}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{shipment.driver}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                            {shipment.status === 'pending' ? 'Bekleyen' :
                             shipment.status === 'assigned' ? 'Atandı' :
                             shipment.status === 'in_transit' ? 'Yolda' :
                             'Teslim Edildi'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canWrite && shipment.status !== 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {shipment.actualDelivery && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Gerçek Teslimat: {shipment.actualDelivery}
                          </span>
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Başarıyla Teslim Edildi
                          </span>
                        </div>
                      </div>
                    )}
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
