'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Banknote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFinanceAccess } from '@/components/ProtectedRoute'

interface Payment {
  id: string
  paymentNumber: string
  customerName: string
  invoiceNumber: string
  amount: number
  currency: 'TRY' | 'USD' | 'EUR'
  method: 'cash' | 'transfer' | 'check' | 'credit_card'
  type: 'income' | 'expense'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDate: string
  reference: string
  bankAccount?: string
  notes?: string
}

export default function PaymentsPage() {
  const { canPaymentTracking, canWrite } = useFinanceAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      paymentNumber: 'PAY-2024-001',
      customerName: 'ABC E-ticaret Ltd.',
      invoiceNumber: 'FAT-2024-001',
      amount: 45000,
      currency: 'TRY',
      method: 'transfer',
      type: 'income',
      status: 'completed',
      paymentDate: '2024-01-25',
      reference: 'EFT123456789',
      bankAccount: 'İş Bankası - 1234567890',
      notes: 'Tam ödeme'
    },
    {
      id: '2',
      paymentNumber: 'PAY-2024-002',
      customerName: 'Yakıt Tedarik A.Ş.',
      invoiceNumber: 'FAT-2024-015',
      amount: 8500,
      currency: 'TRY',
      method: 'credit_card',
      type: 'expense',
      status: 'completed',
      paymentDate: '2024-01-24',
      reference: 'CC987654321',
      notes: 'Araç yakıt gideri'
    },
    {
      id: '3',
      paymentNumber: 'PAY-2024-003',
      customerName: 'XYZ Mağaza A.Ş.',
      invoiceNumber: 'FAT-2024-002',
      amount: 32000,
      currency: 'TRY',
      method: 'transfer',
      type: 'income',
      status: 'pending',
      paymentDate: '2024-01-26',
      reference: 'EFT111222333',
      bankAccount: 'Garanti BBVA - 0987654321'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'refunded':
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'transfer':
        return <Banknote className="h-4 w-4 text-blue-500" />
      case 'credit_card':
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case 'cash':
        return <Banknote className="h-4 w-4 text-green-500" />
      case 'check':
        return <CreditCard className="h-4 w-4 text-orange-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600'
      case 'expense':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  if (!canPaymentTracking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Ödeme takibi modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="finance:payment_tracking">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ödeme Takibi</h1>
                <p className="text-gray-600">Gelen ve giden ödemeler, banka işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Ödeme no, müşteri, referans ara..."
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
                  <option value="completed">Tamamlandı</option>
                  <option value="failed">Başarısız</option>
                  <option value="refunded">İade</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Tipler</option>
                  <option value="income">Gelen Ödeme</option>
                  <option value="expense">Giden Ödeme</option>
                </select>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ödeme
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
                title: 'Toplam Ödeme',
                value: payments.length,
                icon: CreditCard,
                color: 'bg-blue-500'
              },
              {
                title: 'Tamamlanan',
                value: payments.filter(p => p.status === 'completed').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'Bekleyen',
                value: payments.filter(p => p.status === 'pending').length,
                icon: Clock,
                color: 'bg-yellow-500'
              },
              {
                title: 'Toplam Tutar',
                value: `₺${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
                icon: Banknote,
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

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Listesi</CardTitle>
              <CardDescription>
                Gelen ve giden ödemeler, banka işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(payment.status)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {payment.paymentNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.type === 'income' ? 'Gelen' : 'Giden'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {payment.customerName}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <CreditCard className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{payment.invoiceNumber}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{payment.paymentDate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getMethodIcon(payment.method)}
                              <span className="text-xs text-gray-600">
                                {payment.method === 'transfer' ? 'Havale' :
                                 payment.method === 'credit_card' ? 'Kredi Kartı' :
                                 payment.method === 'cash' ? 'Nakit' : 'Çek'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Tutar</p>
                          <p className={`text-lg font-bold ${getTypeColor(payment.type)}`}>
                            {payment.type === 'income' ? '+' : '-'}₺{payment.amount.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Referans</p>
                          <p className="text-sm font-medium">{payment.reference}</p>
                        </div>
                        
                        {payment.bankAccount && (
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Banka</p>
                            <p className="text-xs text-gray-600 max-w-32 truncate">{payment.bankAccount}</p>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status === 'completed' ? 'Tamamlandı' :
                             payment.status === 'pending' ? 'Bekleyen' :
                             payment.status === 'failed' ? 'Başarısız' : 'İade'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canWrite && payment.status !== 'completed' && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {payment.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <strong>Not:</strong> {payment.notes}
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
