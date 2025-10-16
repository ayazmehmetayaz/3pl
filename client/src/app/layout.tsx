import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ayaz 3PL - Lojistik Entegre Yönetim Sistemi',
  description: '3PL lojistik firması için entegre ERP + WMS + TMS sistemi',
  keywords: '3PL, lojistik, ERP, WMS, TMS, depo yönetimi, nakliye, fulfillment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
