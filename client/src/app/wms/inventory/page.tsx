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
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  BarChart3,
  Zap,
  Thermometer,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useWMSAccess } from '@/components/ProtectedRoute'

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  location: string
  warehouse: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minStock: number
  maxStock: number
  status: 'active' | 'inactive' | 'discontinued'
  fifo: boolean
  fefo: boolean
  temperature?: 'ambient' | 'cold' | 'frozen'
  hazardous: boolean
  fragile: boolean
  expiryDate?: string
  lastMovement: string
  value: number
}

export default function InventoryPage() {
  const { canInventory, canWrite } = useWMSAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      sku: 'ABC-001',
      name: 'Laptop Bilgisayar',
      category: 'Elektronik',
      location: 'A-01-01-01',
      warehouse: 'Ana Depo',
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      minStock: 10,
      maxStock: 100,
      status: 'active',
      fifo: true,
      fefo: false,
      hazardous: false,
      fragile: true,
      lastMovement: '2024-01-15',
      value: 250000
    },
    {
      id: '2',
      sku: 'XYZ-002',
      name: 'Gıda Ürünü',
      category: 'Gıda',
      location: 'B-02-03-02',
      warehouse: 'Soğuk Depo',
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      minStock: 15,
      maxStock: 50,
      status: 'active',
      fifo: true,
      fefo: true,
      temperature: 'cold',
      hazardous: false,
      fragile: false,
      expiryDate: '2024-02-15',
      lastMovement: '2024-01-16',
      value: 1500
    },
    {
      id: '3',
      sku: 'DEF-003',
      name: 'Kimyasal Temizlik Ürünü',
      category: 'Kimyasal',
      location: 'C-01-02-01',
      warehouse: 'Ana Depo',
      currentStock: 25,
      reservedStock: 0,
      availableStock: 25,
      minStock: 5,
      maxStock: 30,
      status: 'active',
      fifo: false,
      fefo: true,
      hazardous: true,
      fragile: false,
      lastMovement: '2024-01-14',
      value: 750
    },
    {
      id: '4',
      sku: 'GHI-004',
      name: 'Tekstil Ürünü',
      category: 'Tekstil',
      location: 'A-03-01-03',
      warehouse: 'Ana Depo',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      minStock: 20,
      maxStock: 100,
      status: 'active',
      fifo: true,
      fefo: false,
      hazardous: false,
      fragile: false,
      lastMovement: '2024-01-10',
      value: 0
    }
  ]

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: 'out_of_stock', color: 'bg-red-100 text-red-800' }
    if (item.currentStock <= item.minStock) return { status: 'low_stock', color: 'bg-yellow-100 text-yellow-800' }
    if (item.currentStock >= item.maxStock * 0.9) return { status: 'overstock', color: 'bg-blue-100 text-blue-800' }
    return { status: 'normal', color: 'bg-green-100 text-green-800' }
  }

  const getStockIcon = (item: InventoryItem) => {
    const stockStatus = getStockStatus(item)
    switch (stockStatus.status) {
      case 'out_of_stock':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'low_stock':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'overstock':
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    let matchesStock = true
    if (stockFilter === 'low') {
      matchesStock = item.currentStock <= item.minStock
    } else if (stockFilter === 'out') {
      matchesStock = item.currentStock === 0
    } else if (stockFilter === 'over') {
      matchesStock = item.currentStock >= item.maxStock * 0.9
    }
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock
  })

  const stats = {
    totalItems: inventoryItems.length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.value, 0),
    lowStockItems: inventoryItems.filter(item => item.currentStock <= item.minStock).length,
    outOfStockItems: inventoryItems.filter(item => item.currentStock === 0).length,
    overstockItems: inventoryItems.filter(item => item.currentStock >= item.maxStock * 0.9).length,
    fifoItems: inventoryItems.filter(item => item.fifo).length,
    fefoItems: inventoryItems.filter(item => item.fefo).length,
    hazardousItems: inventoryItems.filter(item => item.hazardous).length
  }

  if (!canInventory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Stok yönetimi modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="wms:inventory">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h1>
                <p className="text-gray-600">FIFO/FEFO takibi, lot yönetimi ve stok optimizasyonu</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="SKU, ürün adı, konum ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Kategoriler</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Gıda">Gıda</option>
                  <option value="Kimyasal">Kimyasal</option>
                  <option value="Tekstil">Tekstil</option>
                </select>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Stok Durumları</option>
                  <option value="low">Düşük Stok</option>
                  <option value="out">Stokta Yok</option>
                  <option value="over">Aşırı Stok</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Stok Güncelle
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-8">
            {[
              {
                title: 'Toplam Ürün',
                value: stats.totalItems,
                icon: Package,
                color: 'bg-blue-500'
              },
              {
                title: 'Toplam Değer',
                value: `₺${(stats.totalValue / 1000).toFixed(0)}K`,
                icon: BarChart3,
                color: 'bg-green-500'
              },
              {
                title: 'Düşük Stok',
                value: stats.lowStockItems,
                icon: AlertTriangle,
                color: 'bg-yellow-500'
              },
              {
                title: 'Stokta Yok',
                value: stats.outOfStockItems,
                icon: AlertTriangle,
                color: 'bg-red-500'
              },
              {
                title: 'Aşırı Stok',
                value: stats.overstockItems,
                icon: Package,
                color: 'bg-blue-500'
              },
              {
                title: 'FIFO Ürünler',
                value: stats.fifoItems,
                icon: Clock,
                color: 'bg-indigo-500'
              },
              {
                title: 'FEFO Ürünler',
                value: stats.fefoItems,
                icon: Calendar,
                color: 'bg-purple-500'
              },
              {
                title: 'Tehlikeli Madde',
                value: stats.hazardousItems,
                icon: Shield,
                color: 'bg-red-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Stok Envanteri</CardTitle>
              <CardDescription>
                FIFO/FEFO takibi ile detaylı stok bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Durum</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ürün Adı</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Kategori</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Konum</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Mevcut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Rezerve</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Kullanılabilir</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Min/Max</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Özellikler</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Değer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => {
                      const stockStatus = getStockStatus(item)
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getStockIcon(item)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                {stockStatus.status === 'out_of_stock' ? 'Stokta Yok' :
                                 stockStatus.status === 'low_stock' ? 'Düşük Stok' :
                                 stockStatus.status === 'overstock' ? 'Aşırı Stok' : 'Normal'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">{item.sku}</td>
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{item.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{item.currentStock}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-orange-600">{item.reservedStock}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-green-600 font-medium">{item.availableStock}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-600">
                              {item.minStock}/{item.maxStock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {item.fifo && (
                                <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                  FIFO
                                </span>
                              )}
                              {item.fefo && (
                                <span className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                  FEFO
                                </span>
                              )}
                              {item.temperature && (
                                <span className="px-1 py-0.5 bg-cyan-100 text-cyan-800 rounded text-xs">
                                  <Thermometer className="h-2 w-2 inline mr-1" />
                                  {item.temperature}
                                </span>
                              )}
                              {item.hazardous && (
                                <span className="px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                  <Shield className="h-2 w-2 inline mr-1" />
                                  Tehlikeli
                                </span>
                              )}
                              {item.fragile && (
                                <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  Kırılabilir
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₺{item.value.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              {canWrite && (
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
