'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFinanceAccess } from '@/components/ProtectedRoute'

export default function FinanceDashboard() {
  const { canRead, canWrite, canInvoiceManagement, canPaymentTracking } = useFinanceAccess()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const financeStats = {
    totalRevenue: 2450000,
    totalExpenses: 1890000,
    netProfit: 560000,
    grossProfit: 890000,
    operatingMargin: 22.9,
    accountsReceivable: 450000,
    accountsPayable: 320000,
    cashBalance: 1250000,
    overdueInvoices: 12,
    overdueAmount: 85000,
    monthlyRevenue: 285000,
    monthlyExpenses: 215000,
    profitGrowth: 15.2,
    revenueGrowth: 8.7,
    expenseGrowth: 5.3
  }

  const recentTransactions = [
    { id: '1', type: 'income', description: 'ABC E-ticaret Ltd. - Depo Hizmeti', amount: 45000, date: '2024-01-15', status: 'completed' },
    { id: '2', type: 'expense', description: 'Yakıt Gideri - 34 ABC 123', amount: 2500, date: '2024-01-15', status: 'completed' },
    { id: '3', type: 'income', description: 'XYZ Mağaza A.Ş. - Nakliye', amount: 32000, date: '2024-01-14', status: 'pending' },
    { id: '4', type: 'expense', description: 'Araç Bakımı - 34 DEF 456', amount: 8500, date: '2024-01-14', status: 'completed' }
  ]

  const overdueInvoices = [
    { id: '1', invoiceNumber: 'FAT-2024-001', customer: 'DEF Lojistik Ltd.', amount: 25000, daysOverdue: 15, status: 'overdue' },
    { id: '2', invoiceNumber: 'FAT-2024-002', customer: 'GHI Üretim A.Ş.', amount: 18000, daysOverdue: 8, status: 'overdue' },
    { id: '3', invoiceNumber: 'FAT-2024-003', customer: 'JKL Ticaret Ltd.', amount: 12000, daysOverdue: 22, status: 'overdue' }
  ]

  const quickActions = [
    { title: 'Fatura Oluştur', description: 'Yeni fatura ve hizmet faturası', icon: Receipt, href: '/finance/invoices', color: 'bg-blue-500', canAccess: canInvoiceManagement },
    { title: 'Ödeme Takibi', description: 'Gelen ve giden ödemeler', icon: CreditCard, href: '/finance/payments', color: 'bg-green-500', canAccess: canPaymentTracking },
    { title: 'Cari Hesap', description: 'Müşteri ve tedarikçi bakiyeleri', icon: Users, href: '/finance/customers', color: 'bg-purple-500', canAccess: canRead },
    { title: 'Sözleşme Yönetimi', description: 'Hizmet sözleşmeleri', icon: CheckCircle, href: '/finance/contracts', color: 'bg-orange-500', canAccess: canWrite }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'expense':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600'
      case 'expense':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!canRead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Finans modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="finance:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Finans & Muhasebe</h1>
                <p className="text-gray-600">Fatura, ödeme, cari hesap ve sözleşme yönetimi</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Fatura, müşteri, tutar ara..."
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
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Toplam Ciro',
                value: `₺${(financeStats.totalRevenue / 1000000).toFixed(1)}M`,
                change: `+${financeStats.revenueGrowth}%`,
                icon: TrendingUp,
                color: 'bg-green-500',
                trend: 'up'
              },
              {
                title: 'Net Kar',
                value: `₺${(financeStats.netProfit / 1000).toFixed(0)}K`,
                change: `+${financeStats.profitGrowth}%`,
                icon: DollarSign,
                color: 'bg-blue-500',
                trend: 'up'
              },
              {
                title: 'Nakit Bakiye',
                value: `₺${(financeStats.cashBalance / 1000).toFixed(0)}K`,
                change: '+5.2%',
                icon: CreditCard,
                color: 'bg-purple-500',
                trend: 'up'
              },
              {
                title: 'Vadesi Geçen',
                value: `${financeStats.overdueInvoices} fatura`,
                change: `₺${(financeStats.overdueAmount / 1000).toFixed(0)}K`,
                icon: AlertTriangle,
                color: 'bg-red-500',
                trend: 'down'
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
                          {stat.change} geçen aya göre
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
                    Sık kullanılan finans işlemleri
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

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Son İşlemler</CardTitle>
                  <CardDescription>
                    Güncel finans hareketleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        {getTransactionIcon(transaction.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-600">
                            {transaction.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'income' ? '+' : '-'}₺{transaction.amount.toLocaleString()}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Overdue Invoices */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Vadesi Geçen Faturalar</CardTitle>
                  <CardDescription>
                    Acil takip gereken faturalar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overdueInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-xs text-gray-600">
                            {invoice.customer}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            {invoice.daysOverdue} gün gecikme
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">
                            ₺{invoice.amount.toLocaleString()}
                          </p>
                          <Button variant="outline" size="sm" className="mt-1">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Alacaklar', value: `₺${(financeStats.accountsReceivable / 1000).toFixed(0)}K`, icon: TrendingUp },
              { title: 'Borçlar', value: `₺${(financeStats.accountsPayable / 1000).toFixed(0)}K`, icon: TrendingDown },
              { title: 'Brüt Kar', value: `₺${(financeStats.grossProfit / 1000).toFixed(0)}K`, icon: BarChart3 },
              { title: 'Operasyon Marjı', value: `${financeStats.operatingMargin}%`, icon: Calendar }
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
