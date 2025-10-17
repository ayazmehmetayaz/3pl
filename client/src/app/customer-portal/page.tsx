'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, DollarSign, Clock, CheckCircle, AlertCircle, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CustomerPortalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock data
  const orders = [
    {
      id: 'ORD001',
      date: '2023-11-20',
      status: 'delivered',
      items: ['Ürün A', 'Ürün B'],
      total: 1500,
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD002', 
      date: '2023-11-18',
      status: 'in_transit',
      items: ['Ürün C'],
      total: 750,
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD003',
      date: '2023-11-15',
      status: 'pending',
      items: ['Ürün D', 'Ürün E', 'Ürün F'],
      total: 2300,
      trackingNumber: 'TRK456789123'
    }
  ]

  const invoices = [
    {
      id: 'INV001',
      date: '2023-11-20',
      amount: 1500,
      status: 'paid',
      dueDate: '2023-12-20'
    },
    {
      id: 'INV002',
      date: '2023-11-18', 
      amount: 750,
      status: 'pending',
      dueDate: '2023-12-18'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_transit': return <Truck className="h-4 w-4 text-blue-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Teslim Edildi'
      case 'in_transit': return 'Yolda'
      case 'pending': return 'Hazırlanıyor'
      default: return 'Bilinmiyor'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100'
      case 'in_transit': return 'text-blue-700 bg-blue-100'
      case 'pending': return 'text-yellow-700 bg-yellow-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Müşteri Portalı
            </h1>
            <p className="text-gray-600">
              Siparişlerinizi takip edin, faturalarınızı görüntüleyin
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Bu ay
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bekleyen Fatura</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₺{invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ödenmemiş
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Devam Eden</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(order => order.status === 'in_transit' || order.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sipariş
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Siparişlerim</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Sipariş
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Sipariş ara..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders
                      .filter(order => 
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{order.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{order.date}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <div>Ürünler: {order.items.join(', ')}</div>
                            <div>Takip No: {order.trackingNumber}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">₺{order.total}</span>
                            <Button variant="outline" size="sm">
                              Detay
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Invoices */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Faturalarım</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{invoice.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-yellow-700 bg-yellow-100'
                          }`}>
                            {invoice.status === 'paid' ? 'Ödendi' : 'Beklemede'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div>Tarih: {invoice.date}</div>
                          <div>Vade: {invoice.dueDate}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">₺{invoice.amount}</span>
                          <Button variant="outline" size="sm">
                            İndir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}