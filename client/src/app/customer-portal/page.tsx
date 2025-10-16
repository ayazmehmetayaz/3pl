'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck,
  Search,
  Filter,
  Eye,
  Download,
  Camera,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  User,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useCustomerAccess } from '@/components/ProtectedRoute'

interface Order {
  id: string
  orderNumber: string
  type: 'fulfillment' | 'storage' | 'transport'
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  totalValue: number
  orderDate: string
  expectedDate: string
  actualDate?: string
  trackingNumber?: string
  warehouse: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  paidDate?: string
  services: string[]
}

interface StockItem {
  id: string
  sku: string
  name: string
  category: string
  currentStock: number
  reservedStock: number
  availableStock: number
  location: string
  lastMovement: string
  value: number
}

export default function CustomerPortal() {
  const { canRead, canOrderManagement, canStockView, canCameraAccess, canInvoiceView } = useCustomerAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('orders')

  // Mock data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      type: 'fulfillment',
      status: 'delivered',
      items: 25,
      totalValue: 45000,
      orderDate: '2024-01-10',
      expectedDate: '2024-01-15',
      actualDate: '2024-01-14',
      trackingNumber: 'TRK123456789',
      warehouse: 'Ana Depo'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      type: 'storage',
      status: 'processing',
      items: 150,
      totalValue: 28000,
      orderDate: '2024-01-12',
      expectedDate: '2024-01-18',
      warehouse: 'Soğuk Depo'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      type: 'transport',
      status: 'shipped',
      items: 8,
      totalValue: 12000,
      orderDate: '2024-01-14',
      expectedDate: '2024-01-16',
      trackingNumber: 'TRK987654321',
      warehouse: 'Ana Depo'
    }
  ]

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'FAT-2024-001',
      amount: 45000,
      currency: 'TRY',
      status: 'paid',
      issueDate: '2024-01-01',
      dueDate: '2024-01-31',
      paidDate: '2024-01-25',
      services: ['Depo Hizmeti', 'Sevkiyat', 'Paketleme']
    },
    {
      id: '2',
      invoiceNumber: 'FAT-2024-002',
      amount: 32000,
      currency: 'TRY',
      status: 'sent',
      issueDate: '2024-01-05',
      dueDate: '2024-02-05',
      services: ['Nakliye', 'Gümrük']
    }
  ]

  const stockItems: StockItem[] = [
    {
      id: '1',
      sku: 'ABC-001',
      name: 'Laptop Bilgisayar',
      category: 'Elektronik',
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      location: 'A-01-01-01',
      lastMovement: '2024-01-15',
      value: 250000
    },
    {
      id: '2',
      sku: 'XYZ-002',
      name: 'Gıda Ürünü',
      category: 'Gıda',
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      location: 'B-02-03-02',
      lastMovement: '2024-01-16',
      value: 1500
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fulfillment':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'storage':
        return <Package className="h-4 w-4 text-green-500" />
      case 'transport':
        return <Truck className="h-4 w-4 text-orange-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatus = (item: StockItem) => {
    if (item.availableStock === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800' }
    if (item.availableStock <= 10) return { status: 'low_stock', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'available', color: 'bg-green-100 text-green-800' }
  }

  if (!canRead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Müşteri portalına erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="customer:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Müşteri Portalı</h1>
                <p className="text-gray-600">Siparişlerim, stok durumu, faturalarım ve kamera görüntüleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Sipariş, fatura, ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                {canCameraAccess && (
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Kamera Görüntüleri
                  </Button>
                )}
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Bildirimler
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Toplam Sipariş',
                value: orders.length,
                icon: Package,
                color: 'bg-blue-500'
              },
              {
                title: 'Aktif Sipariş',
                value: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
                icon: Clock,
                color: 'bg-yellow-500'
              },
              {
                title: 'Toplam Stok Değeri',
                value: `₺${stockItems.reduce((sum, s) => sum + s.value, 0).toLocaleString()}`,
                icon: DollarSign,
                color: 'bg-green-500'
              },
              {
                title: 'Bekleyen Fatura',
                value: invoices.filter(i => i.status === 'sent').length,
                icon: AlertTriangle,
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

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'orders', name: 'Siparişlerim', icon: Package, canAccess: canOrderManagement },
                  { id: 'stock', name: 'Stok Durumu', icon: BarChart3, canAccess: canStockView },
                  { id: 'invoices', name: 'Faturalarım', icon: DollarSign, canAccess: canInvoiceView }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => tab.canAccess && setActiveTab(tab.id)}
                    disabled={!tab.canAccess}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : tab.canAccess
                        ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        : 'border-transparent text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'orders' && canOrderManagement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Siparişlerim</CardTitle>
                  <CardDescription>
                    3PL hizmet siparişleri ve takip bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getTypeIcon(order.type)}
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.type === 'fulfillment' ? 'Fulfillment' :
                                 order.type === 'storage' ? 'Depo Hizmeti' : 'Nakliye'} • {order.items} ürün
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">{order.warehouse}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Sipariş: {order.orderDate}</span>
                                </div>
                                {order.trackingNumber && (
                                  <span className="text-xs text-blue-600">
                                    Takip: {order.trackingNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Tutar</p>
                              <p className="font-bold text-gray-900">₺{order.totalValue.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Beklenen</p>
                              <p className="text-sm font-medium">{order.expectedDate}</p>
                            </div>
                            
                            <div className="text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'delivered' ? 'Teslim Edildi' :
                                 order.status === 'shipped' ? 'Kargoya Verildi' :
                                 order.status === 'processing' ? 'İşleniyor' :
                                 order.status === 'pending' ? 'Bekliyor' : 'İptal'}
                              </span>
                              {order.actualDate && (
                                <p className="text-xs text-green-600 mt-1">
                                  Teslim: {order.actualDate}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.trackingNumber && (
                                <Button variant="outline" size="sm">
                                  <Truck className="h-4 w-4" />
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
            </motion.div>
          )}

          {activeTab === 'stock' && canStockView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stok Durumu</CardTitle>
                  <CardDescription>
                    Gerçek zamanlı stok bilgileri ve konum takibi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockItems.map((item, index) => {
                      const stockStatus = getStockStatus(item)
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {item.sku} - {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.category} • Konum: {item.location}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-600">
                                  Son hareket: {item.lastMovement}
                                </span>
                                <span className="text-xs text-gray-600">
                                  Değer: ₺{item.value.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Mevcut</p>
                                <p className="font-bold text-gray-900">{item.currentStock}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Rezerve</p>
                                <p className="font-medium text-orange-600">{item.reservedStock}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Kullanılabilir</p>
                                <p className="font-medium text-green-600">{item.availableStock}</p>
                              </div>
                              
                              <div className="text-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                                  {stockStatus.status === 'available' ? 'Mevcut' :
                                   stockStatus.status === 'low_stock' ? 'Düşük Stok' : 'Stokta Yok'}
                                </span>
                              </div>
                              
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'invoices' && canInvoiceView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Faturalarım</CardTitle>
                  <CardDescription>
                    3PL hizmet faturaları ve ödeme durumları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Hizmetler: {invoice.services.join(', ')}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-600">
                                Düzenleme: {invoice.issueDate}
                              </span>
                              <span className="text-xs text-gray-600">
                                Vade: {invoice.dueDate}
                              </span>
                              {invoice.paidDate && (
                                <span className="text-xs text-green-600">
                                  Ödeme: {invoice.paidDate}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Tutar</p>
                              <p className="font-bold text-gray-900">₺{invoice.amount.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                                {invoice.status === 'paid' ? 'Ödendi' :
                                 invoice.status === 'sent' ? 'Gönderildi' :
                                 invoice.status === 'overdue' ? 'Vadesi Geçti' : 'Taslak'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
