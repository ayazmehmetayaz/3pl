// User types are now imported from ./user.ts
export { User, UserRole, Permission } from './user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  lowStockItems: number
  pendingShipments: number
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  price: number
  status: 'active' | 'inactive'
  image?: string
}

export interface Order {
  id: string
  customerName: string
  products: Product[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  orderDate: Date
  deliveryDate?: Date
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  currentStock: number
  status: 'active' | 'maintenance'
}

export interface NavigationItem {
  title: string
  href: string
  icon: string
  badge?: string
  children?: NavigationItem[]
}

export interface ModuleCard {
  title: string
  description: string
  icon: string
  href: string
  color: string
  features: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}