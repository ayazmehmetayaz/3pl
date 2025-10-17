'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  Bell,
  Search,
  Menu,
  LogOut,
  Key,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Car,
  Wrench,
  Phone,
  Mail,
  Calendar,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AdminPage() {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const adminStats = [
    {
      title: 'Toplam Kullanıcı',
      value: '156',
      change: '+5',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Aktif Oturum',
      value: '23',
      change: '+3',
      icon: Shield,
      color: 'bg-green-500',
    },
    {
      title: 'Sistem Durumu',
      value: '99.9%',
      change: 'Stabil',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      title: 'Veri Yedekleme',
      value: 'Son: 2h',
      change: 'Başarılı',
      icon: Database,
      color: 'bg-orange-500',
    },
  ]

  const systemAlerts = [
    { type: 'Bilgi', message: 'Sistem güncellemesi mevcut', icon: Bell, color: 'text-blue-500' },
    { type: 'Uyarı', message: '3 kullanıcı şifre süresi dolmak üzere', icon: AlertTriangle, color: 'text-yellow-500' },
    { type: 'Başarı', message: 'Veri yedekleme tamamlandı', icon: CheckCircle, color: 'text-green-500' },
  ]

  const recentActivities = [
    { id: '1', user: 'Ahmet Yılmaz', action: 'Yeni kullanıcı oluşturdu', time: '2 saat önce', type: 'user' },
    { id: '2', user: 'Sistem', action: 'Otomatik yedekleme yapıldı', time: '3 saat önce', type: 'system' },
    { id: '3', user: 'Mehmet Özkan', action: 'Rol yetkilerini güncelledi', time: '5 saat önce', type: 'permission' },
    { id: '4', user: 'Sistem', action: 'Güvenlik taraması tamamlandı', time: '1 gün önce', type: 'security' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner 
          variant="gradient" 
          size="large" 
          tip="İdari İşler yükleniyor..." 
        />
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden hover:bg-white/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Settings className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">İdari İşler</h1>
                <p className="text-sm text-gray-500 font-medium">Administrative Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Kullanıcı, sistem ara..."
                className="pl-10 w-64 bg-white/50 border-white/20 focus:border-white/40"
              />
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-white/50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/50">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">İdari İşler</h2>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {[
                { name: 'Genel Bakış', href: '#overview', icon: BarChart3, current: activeTab === 'overview' },
                { name: 'Kullanıcı Yönetimi', href: '#users', icon: Users, current: activeTab === 'users' },
                { name: 'Sistem Ayarları', href: '#settings', icon: Settings, current: activeTab === 'settings' },
                { name: 'Güvenlik', href: '#security', icon: Shield, current: activeTab === 'security' },
                { name: 'Veri Yönetimi', href: '#data', icon: Database, current: activeTab === 'data' },
                { name: 'Loglar', href: '#logs', icon: FileText, current: activeTab === 'logs' },
                { name: 'Yedekleme', href: '#backup', icon: Download, current: activeTab === 'backup' },
                { name: 'Raporlar', href: '#reports', icon: BarChart3, current: activeTab === 'reports' },
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveTab(item.href.replace('#', ''))}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş geldiniz, {user?.name || 'Admin'}
              </h1>
              <p className="text-gray-600">
                Sistem yönetimi, kullanıcı yetkilendirme ve güvenlik ayarları
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="card-hover glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl border-0 relative overflow-hidden">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-800 transition-colors">
                            {stat.title}
                          </p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                            {stat.value}
                          </p>
                          <div className="flex items-center">
                            <span className="text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <motion.div 
                          className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <stat.icon className="h-8 w-8 text-white" />
                          {/* Glow Effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                      </div>
                      
                      {/* Bottom Gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* System Alerts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Sistem Uyarıları</CardTitle>
                    <CardDescription>
                      Sistem durumu ve güvenlik bildirimleri
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAlerts.map((alert, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.color} bg-opacity-20`}>
                            <alert.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{alert.type}</p>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="hover:bg-white/50">
                            <span className="text-xs">İncele</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Son Aktiviteler</CardTitle>
                    <CardDescription>
                      Sistem kullanım geçmişi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div 
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'system' ? 'bg-green-100 text-green-600' :
                            activity.type === 'permission' ? 'bg-purple-100 text-purple-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {activity.type === 'user' ? <Users className="h-5 w-5" /> :
                             activity.type === 'system' ? <Database className="h-5 w-5" /> :
                             activity.type === 'permission' ? <Shield className="h-5 w-5" /> :
                             <AlertTriangle className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.user}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <Card className="glass bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Hızlı İşlemler</CardTitle>
                  <CardDescription>
                    Sık kullanılan yönetim işlemleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Yeni Kullanıcı', icon: Plus, color: 'bg-blue-500' },
                      { name: 'Sistem Yedekleme', icon: Download, color: 'bg-green-500' },
                      { name: 'Güvenlik Taraması', icon: Shield, color: 'bg-purple-500' },
                      { name: 'Log Temizleme', icon: Trash2, color: 'bg-red-500' },
                    ].map((action, index) => (
                      <motion.button
                        key={action.name}
                        className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{action.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
