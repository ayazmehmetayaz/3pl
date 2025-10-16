'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Package,
  MapPin,
  Users,
  Calendar,
  FileText,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useWMSAccess } from '@/components/ProtectedRoute'

interface ShippingOrder {
  id: string
  orderNumber: string
  customerName: string
  warehouseName: string
  type: 'customer' | 'transfer' | 'return'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'picking' | 'picked' | 'packed' | 'shipped' | 'delivered'
  itemsCount: number
  totalQuantity: number
  pickedQuantity: number
  packedQuantity: number
  progress: number
  requestedDate: string
  shippedDate?: string
  deliveryDate?: string
  carrier?: string
  trackingNumber?: string
  notes?: string
  createdBy: string
  createdAt: string
}

export default function ShippingPage() {
  const { canShipping, canWrite } = useWMSAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Mock data
  const shippingOrders: ShippingOrder[] = [
    {
      id: '1',
      orderNumber: 'SHP-2024-001',
      customerName: 'ABC E-ticaret Ltd.',
      warehouseName: 'Ana Depo',
      type: 'customer',
      priority: 'high',
      status: 'shipped',
      itemsCount: 25,
      totalQuantity: 150,
      pickedQuantity: 150,
      packedQuantity: 150,
      progress: 100,
      requestedDate: '2024-01-15',
      shippedDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      carrier: 'Aras Kargo',
      trackingNumber: 'AR123456789',
      notes: 'Kırılabilir ürünler var',
      createdBy: 'Müşteri Hizmetleri',
      createdAt: '2024-01-14'
    },
    {
      id: '2',
      orderNumber: 'SHP-2024-002',
      customerName: 'XYZ Mağaza A.Ş.',
      warehouseName: 'Ana Depo',
      type: 'customer',
      priority: 'normal',
      status: 'picking',
      itemsCount: 12,
      totalQuantity: 80,
      pickedQuantity: 45,
      packedQuantity: 0,
      progress: 56,
      requestedDate: '2024-01-16',
      notes: 'Hızlı teslimat',
      createdBy: 'Satış Ekibi',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      orderNumber: 'SHP-2024-003',
      customerName: 'DEF Lojistik Merkezi',
      warehouseName: 'Soğuk Depo',
      type: 'transfer',
      priority: 'urgent',
      status: 'packed',
      itemsCount: 8,
      totalQuantity: 40,
      pickedQuantity: 40,
      packedQuantity: 40,
      progress: 80,
      requestedDate: '2024-01-17',
      notes: 'Soğuk zincir önemli',
      createdBy: 'Operasyon',
      createdAt: '2024-01-16'
    },
    {
      id: '4',
      orderNumber: 'SHP-2024-004',
      customerName: 'GHI Müşteri Hizmetleri',
      warehouseName: 'Ana Depo',
      type: 'return',
      priority: 'low',
      status: 'pending',
      itemsCount: 3,
      totalQuantity: 15,
      pickedQuantity: 0,
      packedQuantity: 0,
      progress: 0,
      requestedDate: '2024-01-18',
      notes: 'İade işlemi',
      createdBy: 'Müşteri Hizmetleri',
      createdAt: '2024-01-17'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'packed':
        return 'bg-purple-100 text-purple-800'
      case 'picked':
        return 'bg-indigo-100 text-indigo-800'
      case 'picking':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'packed':
        return <Package className="h-4 w-4 text-purple-500" />
      case 'picked':
        return <CheckCircle className="h-4 w-4 text-indigo-500" />
      case 'picking':
        return <Users className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-green-100 text-green-800'
      case 'transfer':
        return 'bg-blue-100 text-blue-800'
      case 'return':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = shippingOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (!canShipping) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Sevkiyat modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="wms:shipping">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sevkiyat Yönetimi</h1>
                <p className="text-gray-600">FIFO/FEFO ile müşteri siparişlerinin sevkiyat işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Sipariş no, müşteri, takip no ara..."
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
                  <option value="picking">Toplama</option>
                  <option value="picked">Toplandı</option>
                  <option value="packed">Paketlendi</option>
                  <option value="shipped">Kargoya Verildi</option>
                  <option value="delivered">Teslim Edildi</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Öncelikler</option>
                  <option value="urgent">Acil</option>
                  <option value="high">Yüksek</option>
                  <option value="normal">Normal</option>
                  <option value="low">Düşük</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[
              {
                title: 'Bekleyen',
                value: shippingOrders.filter(o => o.status === 'pending').length,
                icon: Clock,
                color: 'bg-gray-500'
              },
              {
                title: 'Toplama',
                value: shippingOrders.filter(o => o.status === 'picking').length,
                icon: Users,
                color: 'bg-yellow-500'
              },
              {
                title: 'Paketleme',
                value: shippingOrders.filter(o => o.status === 'picked' || o.status === 'packed').length,
                icon: Package,
                color: 'bg-indigo-500'
              },
              {
                title: 'Kargoda',
                value: shippingOrders.filter(o => o.status === 'shipped').length,
                icon: Truck,
                color: 'bg-blue-500'
              },
              {
                title: 'Teslim Edildi',
                value: shippingOrders.filter(o => o.status === 'delivered').length,
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

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Sevkiyat Siparişleri</CardTitle>
              <CardDescription>
                FIFO/FEFO takibi ile müşteri siparişlerinin sevkiyat süreçleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                              {order.priority === 'urgent' ? 'Acil' :
                               order.priority === 'high' ? 'Yüksek' :
                               order.priority === 'normal' ? 'Normal' : 'Düşük'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}>
                              {order.type === 'customer' ? 'Müşteri' :
                               order.type === 'transfer' ? 'Transfer' : 'İade'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.customerName} • {order.warehouseName}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-xs text-blue-600 mt-1">
                              Takip No: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Talep Tarihi</p>
                          <p className="font-medium">{order.requestedDate}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">İlerleme</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {order.pickedQuantity}/{order.totalQuantity}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Ürün Sayısı</p>
                          <p className="font-medium">{order.itemsCount}</p>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' ? 'Bekleyen' :
                             order.status === 'picking' ? 'Toplama' :
                             order.status === 'picked' ? 'Toplandı' :
                             order.status === 'packed' ? 'Paketlendi' :
                             order.status === 'shipped' ? 'Kargoda' :
                             'Teslim Edildi'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {order.carrier && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-1" />
                              {order.carrier}
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {canWrite && order.status !== 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <strong>Not:</strong> {order.notes}
                        </p>
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
