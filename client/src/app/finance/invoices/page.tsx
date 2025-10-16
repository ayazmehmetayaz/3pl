'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Receipt, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFinanceAccess } from '@/components/ProtectedRoute'

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerType: '3pl_customer' | 'supplier' | 'vendor'
  type: 'service' | 'product' | 'transport' | 'storage'
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate: string
  paidDate?: string
  total: number
  paidAmount: number
  remainingAmount: number
  currency: 'TRY' | 'USD' | 'EUR'
  daysOverdue?: number
}

export default function InvoicesPage() {
  const { canInvoiceManagement, canWrite } = useFinanceAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'FAT-2024-001',
      customerName: 'ABC E-ticaret Ltd.',
      customerType: '3pl_customer',
      type: 'service',
      status: 'paid',
      issueDate: '2024-01-01',
      dueDate: '2024-01-31',
      paidDate: '2024-01-25',
      total: 45000,
      paidAmount: 45000,
      remainingAmount: 0,
      currency: 'TRY'
    },
    {
      id: '2',
      invoiceNumber: 'FAT-2024-002',
      customerName: 'XYZ Mağaza A.Ş.',
      customerType: '3pl_customer',
      type: 'transport',
      status: 'overdue',
      issueDate: '2024-01-05',
      dueDate: '2024-01-20',
      total: 32000,
      paidAmount: 0,
      remainingAmount: 32000,
      currency: 'TRY',
      daysOverdue: 15
    },
    {
      id: '3',
      invoiceNumber: 'FAT-2024-003',
      customerName: 'DEF Lojistik Ltd.',
      customerType: '3pl_customer',
      type: 'storage',
      status: 'sent',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      total: 28000,
      paidAmount: 0,
      remainingAmount: 28000,
      currency: 'TRY'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Receipt className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800'
      case 'transport':
        return 'bg-green-100 text-green-800'
      case 'storage':
        return 'bg-purple-100 text-purple-800'
      case 'product':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canInvoiceManagement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Fatura yönetimi modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="finance:invoice_management">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fatura Yönetimi</h1>
                <p className="text-gray-600">3PL hizmet faturaları ve ödeme takibi</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Fatura no, müşteri ara..."
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
                  <option value="draft">Taslak</option>
                  <option value="sent">Gönderildi</option>
                  <option value="paid">Ödendi</option>
                  <option value="overdue">Vadesi Geçti</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Fatura
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
                title: 'Toplam Fatura',
                value: invoices.length,
                icon: Receipt,
                color: 'bg-blue-500'
              },
              {
                title: 'Ödenen',
                value: invoices.filter(i => i.status === 'paid').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'Bekleyen',
                value: invoices.filter(i => i.status === 'sent').length,
                icon: Clock,
                color: 'bg-yellow-500'
              },
              {
                title: 'Vadesi Geçen',
                value: invoices.filter(i => i.status === 'overdue').length,
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

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Fatura Listesi</CardTitle>
              <CardDescription>
                3PL hizmet faturaları ve ödeme durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(invoice.status)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                              {invoice.type === 'service' ? 'Hizmet' :
                               invoice.type === 'transport' ? 'Nakliye' :
                               invoice.type === 'storage' ? 'Depo' : 'Ürün'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {invoice.customerName}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Düzenleme: {invoice.issueDate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Vade: {invoice.dueDate}</span>
                            </div>
                            {invoice.paidDate && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-green-600">Ödeme: {invoice.paidDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Toplam</p>
                          <p className="font-bold text-gray-900">₺{invoice.total.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Ödenen</p>
                          <p className="font-medium text-green-600">₺{invoice.paidAmount.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Kalan</p>
                          <p className="font-medium text-red-600">₺{invoice.remainingAmount.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status === 'paid' ? 'Ödendi' :
                             invoice.status === 'sent' ? 'Gönderildi' :
                             invoice.status === 'overdue' ? 'Vadesi Geçti' :
                             invoice.status === 'draft' ? 'Taslak' : 'İptal'}
                          </span>
                          {invoice.daysOverdue && (
                            <p className="text-xs text-red-600 mt-1">
                              {invoice.daysOverdue} gün gecikme
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {canWrite && invoice.status !== 'paid' && (
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
