export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  permissions: Permission[]
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 
  | 'admin'           // Sistem Yöneticisi - Tüm modüllere erişim
  | 'operation_manager' // Operasyon Yöneticisi - Depo, nakliye, sipariş akışları
  | 'warehouse_staff'   // Depo Personeli - Mal kabul, adresleme, toplama, sevkiyat
  | 'transport_manager' // Nakliye Sorumlusu - Araç, rota, konteyner, yükleme
  | 'finance_staff'     // Muhasebe ve Finans - Fatura, cari, tahsilat, ödeme
  | 'legal_staff'       // Hukuk Departmanı - Sözleşme, ek protokol, yasal belgeler
  | 'hr_staff'          // İnsan Kaynakları - Puantaj, vardiya, maaş, bordro, izin
  | 'customer'          // 3PL Müşteri - Kendi stoklarını, sevkiyatlarını, faturalarını görür
  | 'sales_staff'       // Satış & Pazarlama - Teklif oluşturur, kampanya planlar
  | 'admin_staff'       // İdari İşler - Personel planlaması, sertifikasyon, araç zimmetleri
  | 'tech_staff'        // Teknik Servis - Donanım bakımı, el terminali yönetimi
  | 'management'        // Yönetim Kurulu - Dashboard Yetkisi, raporlama

export type Permission = 
  // WMS (Depo Yönetimi) İzinleri
  | 'wms:read' | 'wms:write' | 'wms:delete'
  | 'wms:receiving' | 'wms:shipping' | 'wms:inventory'
  | 'wms:location_management' | 'wms:picking' | 'wms:cycle_count'
  
  // TMS (Nakliye Yönetimi) İzinleri  
  | 'tms:read' | 'tms:write' | 'tms:delete'
  | 'tms:route_planning' | 'tms:vehicle_management'
  | 'tms:shipment_tracking' | 'tms:delivery_confirmation'
  
  // Müşteri Portal İzinleri
  | 'customer:read' | 'customer:write'
  | 'customer:order_management' | 'customer:stock_view'
  | 'customer:camera_access' | 'customer:invoice_view'
  
  // Finans İzinleri
  | 'finance:read' | 'finance:write' | 'finance:delete'
  | 'finance:invoice_management' | 'finance:payment_tracking'
  | 'finance:contract_management' | 'finance:reporting'
  
  // İnsan Kaynakları İzinleri
  | 'hr:read' | 'hr:write' | 'hr:delete'
  | 'hr:employee_management' | 'hr:attendance' | 'hr:payroll'
  | 'hr:shift_management' | 'hr:performance_review'
  
  // Hukuk İzinleri
  | 'legal:read' | 'legal:write' | 'legal:delete'
  | 'legal:contract_management' | 'legal:legal_tracking'
  
  // Satış & Pazarlama İzinleri
  | 'sales:read' | 'sales:write' | 'sales:delete'
  | 'sales:quotation_management' | 'sales:customer_management'
  | 'sales:campaign_management'
  
  // İdari İşler İzinleri
  | 'admin:read' | 'admin:write' | 'admin:delete'
  | 'admin:asset_management' | 'admin:maintenance'
  | 'admin:security_management'
  
  // Teknik İşler İzinleri
  | 'tech:read' | 'tech:write' | 'tech:delete'
  | 'tech:system_maintenance' | 'tech:device_management'
  | 'tech:network_management'
  
  // Raporlama İzinleri
  | 'reporting:read' | 'reporting:write'
  | 'reporting:dashboard_access' | 'reporting:custom_reports'
  | 'reporting:export_data'
  
  // Sistem Yönetimi İzinleri
  | 'system:admin' | 'system:user_management' | 'system:role_management'
  | 'system:settings' | 'system:backup' | 'system:logs'

export interface RolePermissions {
  [key: string]: Permission[]
}

// Rol bazlı izin tanımları
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    // Tüm izinler
    'system:admin', 'system:user_management', 'system:role_management',
    'system:settings', 'system:backup', 'system:logs',
    'wms:read', 'wms:write', 'wms:delete',
    'tms:read', 'tms:write', 'tms:delete',
    'finance:read', 'finance:write', 'finance:delete',
    'hr:read', 'hr:write', 'hr:delete',
    'legal:read', 'legal:write', 'legal:delete',
    'sales:read', 'sales:write', 'sales:delete',
    'admin:read', 'admin:write', 'admin:delete',
    'tech:read', 'tech:write', 'tech:delete',
    'reporting:read', 'reporting:write'
  ],
  
  operation_manager: [
    'wms:read', 'wms:write',
    'tms:read', 'tms:write',
    'customer:read',
    'reporting:read', 'reporting:dashboard_access'
  ],
  
  warehouse_staff: [
    'wms:read', 'wms:write',
    'wms:receiving', 'wms:shipping', 'wms:inventory',
    'wms:location_management', 'wms:picking', 'wms:cycle_count'
  ],
  
  transport_manager: [
    'tms:read', 'tms:write',
    'tms:route_planning', 'tms:vehicle_management',
    'tms:shipment_tracking', 'tms:delivery_confirmation',
    'wms:read' // Depo çıkış bilgilerini görebilmek için
  ],
  
  finance_staff: [
    'finance:read', 'finance:write',
    'finance:invoice_management', 'finance:payment_tracking',
    'finance:contract_management', 'finance:reporting',
    'customer:read', 'customer:invoice_view',
    'reporting:read'
  ],
  
  legal_staff: [
    'legal:read', 'legal:write',
    'legal:contract_management', 'legal:legal_tracking',
    'customer:read'
  ],
  
  hr_staff: [
    'hr:read', 'hr:write',
    'hr:employee_management', 'hr:attendance', 'hr:payroll',
    'hr:shift_management', 'hr:performance_review'
  ],
  
  customer: [
    'customer:read',
    'customer:order_management', 'customer:stock_view',
    'customer:camera_access', 'customer:invoice_view'
  ],
  
  sales_staff: [
    'sales:read', 'sales:write',
    'sales:quotation_management', 'sales:customer_management',
    'sales:campaign_management',
    'customer:read'
  ],
  
  admin_staff: [
    'admin:read', 'admin:write',
    'admin:asset_management', 'admin:maintenance',
    'admin:security_management'
  ],
  
  tech_staff: [
    'tech:read', 'tech:write',
    'tech:system_maintenance', 'tech:device_management',
    'tech:network_management'
  ],
  
  management: [
    'reporting:read', 'reporting:dashboard_access',
    'reporting:custom_reports', 'reporting:export_data',
    'finance:read', 'customer:read'
  ]
}

export interface Department {
  id: string
  name: string
  description?: string
  managerId?: string
  isActive: boolean
}

export interface UserSession {
  user: User
  token: string
  expiresAt: Date
  permissions: Permission[]
  lastActivity: Date
}
