'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Wrench,
  Fuel,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTMSAccess } from '@/components/ProtectedRoute'

interface Vehicle {
  id: string
  plateNumber: string
  brand: string
  model: string
  year: number
  type: 'truck' | 'van' | 'minibus' | 'trailer'
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  driver?: string
  location?: string
  fuelLevel: number
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
}

export default function VehiclesPage() {
  const { canVehicleManagement, canWrite } = useTMSAccess()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plateNumber: '34 ABC 123',
      brand: 'Mercedes',
      model: 'Actros',
      year: 2022,
      type: 'truck',
      status: 'available',
      driver: 'Ahmet Yılmaz',
      location: 'İstanbul Depo',
      fuelLevel: 85,
      mileage: 125000,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10'
    },
    {
      id: '2',
      plateNumber: '34 DEF 456',
      brand: 'Volvo',
      model: 'FH',
      year: 2021,
      type: 'truck',
      status: 'in_use',
      driver: 'Mehmet Kaya',
      location: 'Ankara Yolu',
      fuelLevel: 45,
      mileage: 98000,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05'
    },
    {
      id: '3',
      plateNumber: '34 GHI 789',
      brand: 'Ford',
      model: 'Transit',
      year: 2023,
      type: 'van',
      status: 'maintenance',
      driver: undefined,
      location: 'Servis',
      fuelLevel: 20,
      mileage: 45000,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-01-20'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in_use':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'retired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'truck':
        return '🚛'
      case 'van':
        return '🚐'
      case 'minibus':
        return '🚌'
      case 'trailer':
        return '🚚'
      default:
        return '🚗'
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.driver && vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canVehicleManagement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Araç yönetimi modülüne erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermission="tms:vehicle_management">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Araç Yönetimi</h1>
                <p className="text-gray-600">Araç ve sürücü atamaları, bakım takibi</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Plaka, marka, sürücü ara..."
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
                  <option value="available">Kullanılabilir</option>
                  <option value="in_use">Kullanımda</option>
                  <option value="maintenance">Bakımda</option>
                  <option value="retired">Emekli</option>
                </select>
                {canWrite && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Araç
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
                title: 'Toplam Araç',
                value: vehicles.length,
                icon: Truck,
                color: 'bg-blue-500'
              },
              {
                title: 'Kullanılabilir',
                value: vehicles.filter(v => v.status === 'available').length,
                icon: CheckCircle,
                color: 'bg-green-500'
              },
              {
                title: 'Kullanımda',
                value: vehicles.filter(v => v.status === 'in_use').length,
                icon: Clock,
                color: 'bg-orange-500'
              },
              {
                title: 'Bakımda',
                value: vehicles.filter(v => v.status === 'maintenance').length,
                icon: Wrench,
                color: 'bg-yellow-500'
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

          {/* Vehicles List */}
          <Card>
            <CardHeader>
              <CardTitle>Araç Listesi</CardTitle>
              <CardDescription>
                Fleet yönetimi ve bakım takibi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {getTypeIcon(vehicle.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {vehicle.plateNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                          </p>
                          {vehicle.driver && (
                            <div className="flex items-center space-x-1 mt-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{vehicle.driver}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Yakıt</p>
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{vehicle.fuelLevel}%</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Kilometre</p>
                          <span className="font-medium">{vehicle.mileage.toLocaleString()}</span>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Konum</p>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">{vehicle.location}</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status === 'available' ? 'Kullanılabilir' :
                             vehicle.status === 'in_use' ? 'Kullanımda' :
                             vehicle.status === 'maintenance' ? 'Bakımda' : 'Emekli'}
                          </span>
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
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Son Bakım: {vehicle.lastMaintenance}
                          </span>
                          <span className="text-gray-600">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Sonraki: {vehicle.nextMaintenance}
                          </span>
                        </div>
                        {vehicle.status === 'maintenance' && (
                          <span className="flex items-center text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Bakım Gerekli
                          </span>
                        )}
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
