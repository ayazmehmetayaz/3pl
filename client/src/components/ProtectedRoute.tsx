'use client'

import { useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Permission, UserRole } from '@/types/user'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: Permission
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  fallback?: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, hasRole, hasAnyRole } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo
    }
  }, [isAuthenticated, isLoading, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim için giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    )
  }

  // İzin kontrolü
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim izniniz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  // Rol kontrolü
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim için gerekli rolünüz bulunmuyor.</p>
        </div>
      </div>
    )
  }

  // Çoklu rol kontrolü
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim için gerekli rollerden birine sahip olmanız gerekiyor.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Özel hook'lar
export function useWMSAccess() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: hasPermission('wms:read'),
    canWrite: hasPermission('wms:write'),
    canDelete: hasPermission('wms:delete'),
    canReceiving: hasPermission('wms:receiving'),
    canShipping: hasPermission('wms:shipping'),
    canInventory: hasPermission('wms:inventory'),
    canLocationManagement: hasPermission('wms:location_management'),
    canPicking: hasPermission('wms:picking'),
    canCycleCount: hasPermission('wms:cycle_count')
  }
}

export function useTMSAccess() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: hasPermission('tms:read'),
    canWrite: hasPermission('tms:write'),
    canDelete: hasPermission('tms:delete'),
    canRoutePlanning: hasPermission('tms:route_planning'),
    canVehicleManagement: hasPermission('tms:vehicle_management'),
    canShipmentTracking: hasPermission('tms:shipment_tracking'),
    canDeliveryConfirmation: hasPermission('tms:delivery_confirmation')
  }
}

export function useCustomerAccess() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: hasPermission('customer:read'),
    canWrite: hasPermission('customer:write'),
    canOrderManagement: hasPermission('customer:order_management'),
    canStockView: hasPermission('customer:stock_view'),
    canCameraAccess: hasPermission('customer:camera_access'),
    canInvoiceView: hasPermission('customer:invoice_view')
  }
}

export function useFinanceAccess() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: hasPermission('finance:read'),
    canWrite: hasPermission('finance:write'),
    canDelete: hasPermission('finance:delete'),
    canInvoiceManagement: hasPermission('finance:invoice_management'),
    canPaymentTracking: hasPermission('finance:payment_tracking'),
    canContractManagement: hasPermission('finance:contract_management'),
    canReporting: hasPermission('finance:reporting')
  }
}

export function useHRAccess() {
  const { hasPermission } = useAuth()
  
  return {
    canRead: hasPermission('hr:read'),
    canWrite: hasPermission('hr:write'),
    canDelete: hasPermission('hr:delete'),
    canEmployeeManagement: hasPermission('hr:employee_management'),
    canAttendance: hasPermission('hr:attendance'),
    canPayroll: hasPermission('hr:payroll'),
    canShiftManagement: hasPermission('hr:shift_management'),
    canPerformanceReview: hasPermission('hr:performance_review')
  }
}
