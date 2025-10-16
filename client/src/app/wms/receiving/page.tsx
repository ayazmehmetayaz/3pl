'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Truck,
  FileText,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useWMSAccess } from '@/components/ProtectedRoute'

interface ReceivingOrder {
  id: string
  orderNumber: string
  supplierName: string
  warehouseName: string
  expectedDate: string
  actualDate?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  itemsCount: number
  totalQuantity: number
  receivedQuantity: number
  progress: number
  documents: string[]
  notes?: string
  createdBy: string
  createdAt: string
}

export default function ReceivingPage() {
  const { canReceiving, canWrite } = useWMSAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const receivingOrders: ReceivingOrder[] = [
    {
      id: '1',
      orderNumber: 'RCV-2024-001',
      supplierName: 'ABC Tedarik A.Ş.',
      warehouseName: 'Ana Depo',
      expectedDate: '2024-01-15',
      actualDate: '2024-01-15',
      status: 'completed',
      itemsCount: 15,
      totalQuantity: 500,
      receivedQuantity: 500,
      progress: 100,
      documents: ['fatura.pdf', 'irsaliye.pdf'],
      notes: 'Kargo ile geldi',
      createdBy: 'Depo Sorumlusu',
      createdAt: '2024-01-14'
    },
    {
      id: '2',
      orderNumber: 'RCV-2024-002',
      supplierName: 'XYZ Lojistik Ltd.',
      warehouseName: 'Soğuk Depo',
      expectedDate: '2024-01-16',
      status: 'in_progress',
      itemsCount: 8,
      totalQuantity: 200,
      receivedQuantity: 150,
      progress: 75,
      documents: ['fatura.pdf'],
      notes: 'Kısmi teslimat',
      createdBy: 'Operasyon Müdürü',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      orderNumber: 'RCV-2024-003',
      supplierName: 'DEF Üretim San.',
      warehouseName: 'Ana Depo',
      expectedDate: '2024-01-17',
      status: 'pending',
      itemsCount: 12,
      totalQuantity: 300,
      receivedQuantity: 0,
      progress: 0,
      documents: [],
      notes: 'Bekleniyor',
      createdBy: 'Satın Alma',
      createdAt: '2024-01-16'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredOrders = receivingOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canReceiving) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Mal kabul modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="wms:receiving">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mal Kabul</h1>
                <p className="text-gray-600">FIFO/FEFO ile gelen malların depoya kayıt işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Sipariş no, tedarikçi ara..."
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
                  <option value="in_progress">Devam Eden</option>
                  <option value="completed">Tamamlanan</option>
                  <option value="cancelled">İptal</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Mal Kabul
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
                title: 'Bekleyen Siparişler',
                value: receivingOrders.filter(o => o.status === 'pending').length,
                icon: Clock,
                color: 'bg-yellow-500'
              },
              {
                title: 'Devam Eden',
                value: receivingOrders.filter(o => o.status === 'in_progress').length,
                icon: Package,
                color: 'bg-blue-500'
              },
              {
                title: 'Tamamlanan (Gün)',
                value: receivingOrders.filter(o => o.status === 'completed').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'Toplam Miktar',
                value: receivingOrders.reduce((sum, o) => sum + o.receivedQuantity, 0),
                icon: Truck,
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
                          {stat.value.toLocaleString()}
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
              <CardTitle>Mal Kabul Siparişleri</CardTitle>
              <CardDescription>
                FIFO/FEFO takibi ile gelen malların kayıt işlemleri
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
                          <h3 className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.supplierName} • {order.warehouseName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Beklenen Tarih</p>
                          <p className="font-medium">{order.expectedDate}</p>
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
                            {order.receivedQuantity}/{order.totalQuantity}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Ürün Sayısı</p>
                          <p className="font-medium">{order.itemsCount}</p>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' ? 'Bekleyen' :
                             order.status === 'in_progress' ? 'Devam Eden' :
                             order.status === 'completed' ? 'Tamamlandı' :
                             'İptal'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {order.documents.length > 0 && (
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              {order.documents.length}
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {canWrite && order.status !== 'completed' && (
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
