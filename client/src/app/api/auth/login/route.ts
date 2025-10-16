import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - demo users
    const demoUsers = [
      {
        email: 'admin@ayaz3pl.com',
        password: '123456',
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@ayaz3pl.com',
          role: 'admin',
          permissions: [
            'dashboard:view', 'wms:view', 'wms:manage_inventory', 'wms:manage_receiving', 'wms:manage_shipping',
            'tms:view', 'tms:manage_vehicles', 'tms:manage_routes', 'tms:manage_shipments',
            'finance:view', 'finance:manage_invoices', 'finance:manage_payments',
            'hr:view', 'hr:manage_employees',
            'customer_portal:view', 'customer_portal:place_order',
            'admin:manage_users', 'admin:manage_roles', 'reports:view_all'
          ]
        }
      },
      {
        email: 'ops@ayaz3pl.com',
        password: '123456',
        user: {
          id: '2',
          name: 'Operasyon Müdürü',
          email: 'ops@ayaz3pl.com',
          role: 'operation',
          permissions: [
            'dashboard:view', 'wms:view', 'wms:manage_receiving', 'wms:manage_shipping',
            'tms:view', 'tms:manage_routes', 'tms:manage_shipments',
            'reports:view_all'
          ]
        }
      },
      {
        email: 'warehouse@ayaz3pl.com',
        password: '123456',
        user: {
          id: '3',
          name: 'Depo Sorumlusu',
          email: 'warehouse@ayaz3pl.com',
          role: 'warehouse',
          permissions: [
            'dashboard:view', 'wms:view', 'wms:manage_inventory', 'wms:manage_receiving', 'wms:manage_shipping'
          ]
        }
      },
      {
        email: 'transport@ayaz3pl.com',
        password: '123456',
        user: {
          id: '4',
          name: 'Nakliye Müdürü',
          email: 'transport@ayaz3pl.com',
          role: 'transport',
          permissions: [
            'dashboard:view', 'tms:view', 'tms:manage_vehicles', 'tms:manage_routes', 'tms:manage_shipments'
          ]
        }
      },
      {
        email: 'finance@ayaz3pl.com',
        password: '123456',
        user: {
          id: '5',
          name: 'Muhasebe Uzmanı',
          email: 'finance@ayaz3pl.com',
          role: 'finance',
          permissions: [
            'dashboard:view', 'finance:view', 'finance:manage_invoices', 'finance:manage_payments', 'reports:view_all'
          ]
        }
      },
      {
        email: 'customer@abc.com',
        password: '123456',
        user: {
          id: '6',
          name: 'ABC Müşterisi',
          email: 'customer@abc.com',
          role: 'customer',
          permissions: [
            'customer_portal:view', 'customer_portal:place_order'
          ]
        }
      }
    ]

    const user = demoUsers.find(u => u.email === email && u.password === password)

    if (user) {
      return NextResponse.json({
        success: true,
        user: user.user,
        token: 'mock-jwt-token'
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Geçersiz e-posta veya şifre.' 
        },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Sunucu hatası',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
