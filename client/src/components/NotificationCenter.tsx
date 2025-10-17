'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Truck,
  Package,
  DollarSign,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: 'wms' | 'tms' | 'finance' | 'hr' | 'general'
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Sevkiyat Tamamlandı',
      message: 'ABC Şirketi için 45 paket başarıyla teslim edildi',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'tms'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Stok Uyarısı',
      message: 'Laptop 15" ürünü minimum stok seviyesine ulaştı',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      category: 'wms'
    },
    {
      id: '3',
      type: 'error',
      title: 'Fatura Vadesi Geçti',
      message: 'XYZ Kargo faturası 3 gün gecikmeli',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      category: 'finance'
    },
    {
      id: '4',
      type: 'info',
      title: 'Yeni Müşteri',
      message: 'DEF Lojistik sisteme kayıt oldu',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      category: 'general'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'error': return AlertCircle
      case 'info': return Info
    }
  }

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'wms': return Package
      case 'tms': return Truck
      case 'finance': return DollarSign
      case 'hr': return Users
      case 'general': return Info
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-100'
      case 'warning': return 'text-yellow-500 bg-yellow-100'
      case 'error': return 'text-red-500 bg-red-100'
      case 'info': return 'text-blue-500 bg-blue-100'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Şimdi'
    if (minutes < 60) return `${minutes} dk önce`
    if (hours < 24) return `${hours} saat önce`
    return `${days} gün önce`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-white/50"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs hover:bg-white/50"
                      >
                        Tümünü Okundu İşaretle
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-white/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz bildirim yok</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50">
                    {notifications.map((notification) => {
                      const IconComponent = getIcon(notification.type)
                      const CategoryIcon = getCategoryIcon(notification.category)
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50/30' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <CategoryIcon className="h-3 w-3 text-gray-400" />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteNotification(notification.id)
                                    }}
                                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-sm hover:bg-white/50"
                  >
                    Tüm Bildirimleri Görüntüle
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
