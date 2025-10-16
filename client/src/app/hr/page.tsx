'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface Employee {
  id: string
  name: string
  position: string
  department: 'wms' | 'tms' | 'finance' | 'hr' | 'admin' | 'management'
  status: 'active' | 'on_leave' | 'inactive'
  startDate: string
  salary: number
  contact: {
    email: string
    phone: string
    address: string
  }
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  skills: string[]
  performance: number
  attendance: {
    present: number
    absent: number
    late: number
  }
  documents: string[]
}

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity'
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  reason: string
  submittedDate: string
}

export default function HRPage() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('employees')

  // Mock data
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      position: 'Depo Sorumlusu',
      department: 'wms',
      status: 'active',
      startDate: '2023-01-15',
      salary: 45000,
      contact: {
        email: 'ahmet.yilmaz@ayaz3pl.com',
        phone: '+90 532 555 0123',
        address: 'İstanbul, Türkiye'
      },
      emergencyContact: {
        name: 'Fatma Yılmaz',
        phone: '+90 532 555 0124',
        relation: 'Eş'
      },
      skills: ['WMS', 'Forklift', 'İngilizce'],
      performance: 85,
      attendance: { present: 22, absent: 0, late: 2 },
      documents: ['Kimlik', 'Diploma', 'SGK']
    },
    {
      id: '2',
      name: 'Mehmet Özkan',
      position: 'Nakliye Şoförü',
      department: 'tms',
      status: 'active',
      startDate: '2023-03-20',
      salary: 38000,
      contact: {
        email: 'mehmet.ozkan@ayaz3pl.com',
        phone: '+90 532 555 0456',
        address: 'Ankara, Türkiye'
      },
      emergencyContact: {
        name: 'Ayşe Özkan',
        phone: '+90 532 555 0457',
        relation: 'Kardeş'
      },
      skills: ['B Sınıfı Ehliyet', 'GPS', 'Arapça'],
      performance: 78,
      attendance: { present: 20, absent: 1, late: 3 },
      documents: ['Ehliyet', 'Sağlık Raporu', 'Adli Sicil']
    }
  ]

  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Ahmet Yılmaz',
      type: 'annual',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 5,
      status: 'pending',
      reason: 'Aile ziyareti',
      submittedDate: '2024-01-20'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Mehmet Özkan',
      type: 'sick',
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      days: 3,
      status: 'approved',
      reason: 'Grip',
      submittedDate: '2024-01-24'
    }
  ]

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'wms':
        return 'bg-blue-100 text-blue-800'
      case 'tms':
        return 'bg-green-100 text-green-800'
      case 'finance':
        return 'bg-purple-100 text-purple-800'
      case 'hr':
        return 'bg-pink-100 text-pink-800'
      case 'admin':
        return 'bg-gray-100 text-gray-800'
      case 'management':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentName = (dept: string) => {
    switch (dept) {
      case 'wms':
        return 'Depo'
      case 'tms':
        return 'Nakliye'
      case 'finance':
        return 'Muhasebe'
      case 'hr':
        return 'İnsan Kaynakları'
      case 'admin':
        return 'İdari'
      case 'management':
        return 'Yönetim'
      default:
        return dept
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual':
        return 'bg-blue-100 text-blue-800'
      case 'sick':
        return 'bg-red-100 text-red-800'
      case 'personal':
        return 'bg-purple-100 text-purple-800'
      case 'maternity':
        return 'bg-pink-100 text-pink-800'
      case 'paternity':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  if (!hasPermission('hr:read')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">İnsan kaynakları modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="hr:read">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">İnsan Kaynakları</h1>
                <p className="text-gray-600">Çalışan yönetimi, izin takibi, performans değerlendirme</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Çalışan adı, pozisyon ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Departmanlar</option>
                  <option value="wms">Depo</option>
                  <option value="tms">Nakliye</option>
                  <option value="finance">Muhasebe</option>
                  <option value="hr">İnsan Kaynakları</option>
                  <option value="admin">İdari</option>
                  <option value="management">Yönetim</option>
                </select>
                {hasPermission('hr:write') && (
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Yeni Çalışan
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
                title: 'Toplam Çalışan',
                value: employees.length,
                icon: Users,
                color: 'bg-blue-500'
              },
              {
                title: 'Aktif Çalışan',
                value: employees.filter(e => e.status === 'active').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'İzin Bekleyen',
                value: leaveRequests.filter(l => l.status === 'pending').length,
                icon: Clock,
                color: 'bg-yellow-500'
              },
              {
                title: 'Ortalama Performans',
                value: `${Math.round(employees.reduce((sum, e) => sum + e.performance, 0) / employees.length)}%`,
                icon: TrendingUp,
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

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'employees', name: 'Çalışanlar', icon: Users },
                  { id: 'leaves', name: 'İzin Talepleri', icon: Calendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'employees' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Çalışan Listesi</CardTitle>
                  <CardDescription>
                    3PL lojistik ekibi ve bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEmployees.map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {employee.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                                  {getDepartmentName(employee.department)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                  {employee.status === 'active' ? 'Aktif' :
                                   employee.status === 'on_leave' ? 'İzinli' : 'Pasif'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {employee.position}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">{employee.contact.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">{employee.contact.phone}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Başlangıç: {employee.startDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Performans</p>
                              <p className="font-bold text-gray-900">{employee.performance}%</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Devam</p>
                              <p className="font-medium text-green-600">{employee.attendance.present}/22</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Maaş</p>
                              <p className="font-medium text-gray-900">₺{employee.salary.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Beceriler</p>
                              <div className="flex flex-wrap gap-1">
                                {employee.skills.slice(0, 2).map((skill, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {skill}
                                  </span>
                                ))}
                                {employee.skills.length > 2 && (
                                  <span className="text-xs text-gray-500">+{employee.skills.length - 2}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {hasPermission('hr:write') && (
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
            </motion.div>
          )}

          {activeTab === 'leaves' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>İzin Talepleri</CardTitle>
                  <CardDescription>
                    Çalışan izin talepleri ve onay süreçleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaveRequests.map((leave, index) => (
                      <motion.div
                        key={leave.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {leave.employeeName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {leave.reason}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.type)}`}>
                                {leave.type === 'annual' ? 'Yıllık İzin' :
                                 leave.type === 'sick' ? 'Hastalık' :
                                 leave.type === 'personal' ? 'Kişisel' :
                                 leave.type === 'maternity' ? 'Doğum' : 'Babalık'}
                              </span>
                              <span className="text-xs text-gray-600">
                                {leave.days} gün
                              </span>
                              <span className="text-xs text-gray-600">
                                {leave.startDate} - {leave.endDate}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLeaveStatusColor(leave.status)}`}>
                                {leave.status === 'approved' ? 'Onaylandı' :
                                 leave.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Talep: {leave.submittedDate}
                              </p>
                            </div>
                            
                            {hasPermission('hr:write') && leave.status === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
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
