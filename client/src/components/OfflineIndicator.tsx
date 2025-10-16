'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { useOfflineSync } from '@/lib/offline-sync'

interface OfflineIndicatorProps {
  className?: string
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { syncStatus, forceSync } = useOfflineSync()

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
    }
    
    if (syncStatus.pendingChanges > 0) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    }
    
    if (syncStatus.isOnline) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    
    return <WifiOff className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (syncStatus.syncInProgress) {
      return 'Senkronize ediliyor...'
    }
    
    if (!syncStatus.isOnline) {
      return 'Çevrimdışı modda çalışıyor'
    }
    
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} değişiklik bekliyor`
    }
    
    return 'Tüm veriler senkronize'
  }

  const getStatusColor = () => {
    if (syncStatus.syncInProgress) {
      return 'bg-blue-50 border-blue-200 text-blue-800'
    }
    
    if (!syncStatus.isOnline) {
      return 'bg-red-50 border-red-200 text-red-800'
    }
    
    if (syncStatus.pendingChanges > 0) {
      return 'bg-orange-50 border-orange-200 text-orange-800'
    }
    
    return 'bg-green-50 border-green-200 text-green-800'
  }

  const getLastSyncText = () => {
    if (!syncStatus.lastSync) {
      return 'Henüz senkronize edilmedi'
    }
    
    const now = new Date()
    const diff = now.getTime() - syncStatus.lastSync.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) {
      return 'Az önce senkronize edildi'
    } else if (minutes < 60) {
      return `${minutes} dakika önce senkronize edildi`
    } else {
      const hours = Math.floor(minutes / 60)
      return `${hours} saat önce senkronize edildi`
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 ${className}`}
      >
        <div className={`
          flex items-center space-x-3 px-4 py-2 rounded-lg border shadow-lg backdrop-blur-sm
          ${getStatusColor()}
        `}>
          {getStatusIcon()}
          
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {getStatusText()}
            </span>
            {syncStatus.isOnline && syncStatus.lastSync && (
              <span className="text-xs opacity-75">
                {getLastSyncText()}
              </span>
            )}
          </div>
          
          {syncStatus.isOnline && syncStatus.pendingChanges > 0 && !syncStatus.syncInProgress && (
            <button
              onClick={forceSync}
              className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
              title="Şimdi senkronize et"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OfflineIndicator
