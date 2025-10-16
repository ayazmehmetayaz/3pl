import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import OfflineIndicator from '@/components/OfflineIndicator'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ayaz 3PL - Lojistik Entegre Yönetim Sistemi',
  description: '3PL lojistik firması için entegre ERP + WMS + TMS sistemi. Depo yönetimi, nakliye, finans ve müşteri portalı.',
  keywords: '3PL, lojistik, ERP, WMS, TMS, depo yönetimi, nakliye, fulfillment, warehouse management',
  authors: [{ name: 'Ayaz Lojistik A.Ş.' }],
  creator: 'Ayaz 3PL ERP Team',
  publisher: 'Ayaz Lojistik A.Ş.',
  robots: 'index, follow',
  openGraph: {
    title: 'Ayaz 3PL - Lojistik Entegre Yönetim Sistemi',
    description: '3PL lojistik firması için entegre ERP + WMS + TMS sistemi',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayaz 3PL - Lojistik Entegre Yönetim Sistemi',
    description: '3PL lojistik firması için entegre ERP + WMS + TMS sistemi',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e40af',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <OfflineIndicator />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
