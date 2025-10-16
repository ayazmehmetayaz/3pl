'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFinanceAccess } from '@/components/ProtectedRoute'

interface Customer {
  id: string
  name: string
  type: '3pl_customer' | 'supplier' | 'vendor'
  status: 'active' | 'suspended' | 'inactive'
  creditLimit: number
  currentBalance: number
  availableCredit: number
  overdueAmount: number
  lastPaymentDate?: string
  paymentTerms: string
  currency: 'TRY' | 'USD' | 'EUR'
  riskLevel: 'low' | 'medium' | 'high'
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  totalInvoices: number
  paidInvoices: number
  overdueInvoices: number
}

export default function CustomersPage() {
  const { canRead, canWrite } = useFinanceAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'ABC E-ticaret Ltd.',
      type: '3pl_customer',
      status: 'active',
      creditLimit: 500000,
      currentBalance: 125000,
      availableCredit: 375000,
      overdueAmount: 0,
      lastPaymentDate: '2024-01-25',
      paymentTerms: '30 gün',
      currency: 'TRY',
      riskLevel: 'low',
      contactInfo: {
        email: 'info@abce-ticaret.com',
        phone: '+90 212 555 0123',
        address: 'İstanbul, Türkiye'
      },
      totalInvoices: 15,
      paidInvoices: 15,
      overdueInvoices: 0
    },
    {
      id: '2',
      name: 'XYZ Mağaza A.Ş.',
      type: '3pl_customer',
      status: 'active',
      creditLimit: 300000,
      currentBalance: 180000,
      availableCredit: 120000,
      overdueAmount: 32000,
      lastPaymentDate: '2024-01-10',
      paymentTerms: '15 gün',
      currency: 'TRY',
      riskLevel: 'medium',
      contactInfo: {
        email: 'muhasebe@xyzmagaza.com',
        phone: '+90 312 555 0456',
        address: 'Ankara, Türkiye'
      },
      totalInvoices: 8,
      paidInvoices: 6,
      overdueInvoices: 2
    },
    {
      id: '3',
      name: 'DEF Yakıt Tedarik A.Ş.',
      type: 'supplier',
      status: 'active',
      creditLimit: 100000,
      currentBalance: -25000,
      availableCredit: 75000,
      overdueAmount: 0,
      lastPaymentDate: '2024-01-24',
      paymentTerms: '7 gün',
      currency: 'TRY',
      riskLevel: 'low',
      contactInfo: {
        email: 'satinalma@defyakıt.com',
        phone: '+90 216 555 0789',
        address: 'İzmir, Türkiye'
      },
      totalInvoices: 12,
      paidInvoices: 12,
      overdueInvoices: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '3pl_customer':
        return 'bg-blue-100 text-blue-800'
      case 'supplier':
        return 'bg-green-100 text-green-800'
      case 'vendor':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-red-600'
    if (balance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || customer.type === typeFilter
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  if (!canRead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Cari hesap modülüne erişim izniniz bulunmuyor.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Cari Hesap Yönetimi</h1>
                <p className="text-gray-600">Müşteri ve tedarikçi bakiyeleri, kredi limitleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Müşteri adı, email ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Tipler</option>
                  <option value="3pl_customer">3PL Müşteri</option>
                  <option value="supplier">Tedarikçi</option>
                  <option value="vendor">Satıcı</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="suspended">Askıda</option>
                  <option value="inactive">Pasif</option>
                </select>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Müşteri
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
                title: 'Toplam Müşteri',
                value: customers.length,
                icon: Users,
                color: 'bg-blue-500'
              },
              {
                title: 'Aktif Müşteri',
                value: customers.filter(c => c.status === 'active').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'Toplam Alacak',
                value: `₺${customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0).toLocaleString()}`,
                icon: TrendingUp,
                color: 'bg-purple-500'
              },
              {
                title: 'Vadesi Geçen',
                value: customers.filter(c => c.overdueAmount > 0).length,
                icon: AlertTriangle,
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

          {/* Customers List */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Listesi</CardTitle>
              <CardDescription>
                Cari hesap bakiyeleri ve kredi limitleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {customer.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(customer.type)}`}>
                              {customer.type === '3pl_customer' ? '3PL Müşteri' :
                               customer.type === 'supplier' ? 'Tedarikçi' : 'Satıcı'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(customer.riskLevel)}`}>
                              {customer.riskLevel === 'low' ? 'Düşük Risk' :
                               customer.riskLevel === 'medium' ? 'Orta Risk' : 'Yüksek Risk'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{customer.contactInfo.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{customer.contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{customer.contactInfo.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Mevcut Bakiye</p>
                          <p className={`text-lg font-bold ${getBalanceColor(customer.currentBalance)}`}>
                            ₺{Math.abs(customer.currentBalance).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.currentBalance > 0 ? 'Alacak' : customer.currentBalance < 0 ? 'Borç' : 'Sıfır'}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Kredi Limiti</p>
                          <p className="text-lg font-bold text-gray-900">₺{customer.creditLimit.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            Kullanılabilir: ₺{customer.availableCredit.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Faturalar</p>
                          <p className="text-sm font-medium text-gray-900">
                            {customer.paidInvoices}/{customer.totalInvoices}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.overdueInvoices > 0 && `${customer.overdueInvoices} vadesi geçen`}
                          </p>
                        </div>
                        
                        {customer.overdueAmount > 0 && (
                          <div className="text-center">
                            <p className="text-sm text-red-600">Vadesi Geçen</p>
                            <p className="text-lg font-bold text-red-600">₺{customer.overdueAmount.toLocaleString()}</p>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status === 'active' ? 'Aktif' :
                             customer.status === 'suspended' ? 'Askıda' : 'Pasif'}
                          </span>
                          {customer.lastPaymentDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Son ödeme: {customer.lastPaymentDate}
                            </p>
                          )}
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
