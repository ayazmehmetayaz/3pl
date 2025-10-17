'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, Permission, ROLE_PERMISSIONS } from '@/types/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: Permission[]
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock kullanıcı verileri - gerçek uygulamada API'den gelecek
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ayaz3pl.com',
    role: 'admin',
    department: 'IT',
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Operasyon Müdürü',
    email: 'ops@ayaz3pl.com',
    role: 'operation_manager',
    department: 'Operasyon',
    permissions: ROLE_PERMISSIONS.operation_manager,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Depo Sorumlusu',
    email: 'warehouse@ayaz3pl.com',
    role: 'warehouse_staff',
    department: 'Depo',
    permissions: ROLE_PERMISSIONS.warehouse_staff,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Nakliye Müdürü',
    email: 'transport@ayaz3pl.com',
    role: 'transport_manager',
    department: 'Nakliye',
    permissions: ROLE_PERMISSIONS.transport_manager,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Muhasebe Uzmanı',
    email: 'finance@ayaz3pl.com',
    role: 'finance_staff',
    department: 'Muhasebe',
    permissions: ROLE_PERMISSIONS.finance_staff,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Müşteri A',
    email: 'customer@abc.com',
    role: 'customer',
    department: 'ABC Şirketi',
    permissions: ROLE_PERMISSIONS.customer,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState<Permission[]>([])

  const isAuthenticated = !!user

  useEffect(() => {
    // Client-side only operations
    if (typeof window !== 'undefined') {
      // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setPermissions(userData.permissions || [])
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          localStorage.removeItem('user')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    
    try {
      // Mock login - gerçek uygulamada API çağrısı yapılacak
      const foundUser = MOCK_USERS.find(u => u.email === email)
      
      if (!foundUser) {
        setIsLoading(false)
        return { success: false, message: 'Kullanıcı bulunamadı' }
      }

      // Mock password kontrolü - gerçek uygulamada hash kontrolü yapılacak
      if (password !== '123456') {
        setIsLoading(false)
        return { success: false, message: 'Şifre hatalı' }
      }

      if (!foundUser.isActive) {
        setIsLoading(false)
        return { success: false, message: 'Hesap aktif değil' }
      }

      // Kullanıcı bilgilerini güncelle
      const userWithLogin = {
        ...foundUser,
        lastLogin: new Date(),
        updatedAt: new Date()
      }

      // LocalStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userWithLogin))
      }
      
      setUser(userWithLogin)
      setPermissions(userWithLogin.permissions)
      
      setIsLoading(false)
      return { success: true }
      
    } catch (error) {
      setIsLoading(false)
      return { success: false, message: 'Giriş sırasında bir hata oluştu' }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setUser(null)
    setPermissions([])
  }

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date() }
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    setUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    permissions,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Permission hook'u
export function usePermission() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: (module: string) => hasPermission(`${module}:read` as Permission),
    canWrite: (module: string) => hasPermission(`${module}:write` as Permission),
    canDelete: (module: string) => hasPermission(`${module}:delete` as Permission),
    hasPermission
  }
}

// Role hook'u
export function useRole() {
  const { hasRole, hasAnyRole, user } = useAuth()
  
  return {
    isAdmin: hasRole('admin'),
    isOperationManager: hasRole('operation_manager'),
    isWarehouseStaff: hasRole('warehouse_staff'),
    isTransportManager: hasRole('transport_manager'),
    isFinanceStaff: hasRole('finance_staff'),
    isCustomer: hasRole('customer'),
    isManagement: hasRole('management'),
    hasAnyRole,
    currentRole: user?.role
  }
}
