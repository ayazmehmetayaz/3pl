// Offline Sync Service for 3PL ERP System
// Handles data synchronization between local storage and server

export interface SyncData {
  id: string
  type: 'wms' | 'tms' | 'finance' | 'hr' | 'customer'
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: number
  synced: boolean
}

export interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  syncInProgress: boolean
}

class OfflineSyncService {
  private static instance: OfflineSyncService
  private syncQueue: SyncData[] = []
  private isOnline: boolean = navigator.onLine
  private syncInProgress: boolean = false
  private lastSync: Date | null = null

  private constructor() {
    this.initializeEventListeners()
    this.loadSyncQueue()
  }

  public static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService()
    }
    return OfflineSyncService.instance
  }

  private initializeEventListeners(): void {
    // Online/Offline status listeners
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingChanges()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Periodic sync check (every 30 seconds when online)
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.syncPendingChanges()
      }
    }, 30000)
  }

  private loadSyncQueue(): void {
    try {
      const stored = localStorage.getItem('syncQueue')
      if (stored) {
        this.syncQueue = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  // Add data to sync queue
  public queueForSync(data: Omit<SyncData, 'id' | 'timestamp' | 'synced'>): void {
    const syncItem: SyncData = {
      id: this.generateId(),
      timestamp: Date.now(),
      synced: false,
      ...data
    }

    this.syncQueue.push(syncItem)
    this.saveSyncQueue()

    // Try immediate sync if online
    if (this.isOnline) {
      this.syncPendingChanges()
    }
  }

  // Sync all pending changes
  public async syncPendingChanges(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return
    }

    this.syncInProgress = true

    try {
      const pendingItems = this.syncQueue.filter(item => !item.synced)
      
      for (const item of pendingItems) {
        await this.syncItem(item)
      }

      this.lastSync = new Date()
      this.saveSyncQueue()
      
      // Clean up synced items older than 24 hours
      this.cleanupOldSyncedItems()
      
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncItem(item: SyncData): Promise<void> {
    try {
      const endpoint = this.getEndpoint(item.type, item.action)
      const response = await fetch(endpoint, {
        method: this.getHttpMethod(item.action),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(item.data)
      })

      if (response.ok) {
        item.synced = true
        console.log(`Synced ${item.type} ${item.action}:`, item.id)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Failed to sync ${item.type} ${item.action}:`, error)
      throw error
    }
  }

  private getEndpoint(type: string, action: string): string {
    // Vercel'de API route'ları kullanma, sadece mock data
    return '/api/mock'
  }

  private getHttpMethod(action: string): string {
    switch (action) {
      case 'create': return 'POST'
      case 'update': return 'PUT'
      case 'delete': return 'DELETE'
      default: return 'POST'
    }
  }

  private getAuthToken(): string {
    // Get JWT token from localStorage or context
    return localStorage.getItem('authToken') || ''
  }

  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private cleanupOldSyncedItems(): void {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    this.syncQueue = this.syncQueue.filter(item => 
      !item.synced || item.timestamp > oneDayAgo
    )
    this.saveSyncQueue()
  }

  // Get sync status
  public getSyncStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSync: this.lastSync,
      pendingChanges: this.syncQueue.filter(item => !item.synced).length,
      syncInProgress: this.syncInProgress
    }
  }

  // Force sync (for manual trigger)
  public async forceSync(): Promise<void> {
    await this.syncPendingChanges()
  }

  // Clear all synced items
  public clearSyncedItems(): void {
    this.syncQueue = this.syncQueue.filter(item => !item.synced)
    this.saveSyncQueue()
  }

  // Get pending changes count by type
  public getPendingCountByType(): Record<string, number> {
    const pending = this.syncQueue.filter(item => !item.synced)
    return pending.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

// Export singleton instance
export const offlineSync = OfflineSyncService.getInstance()

// Hook for React components
export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>(
    offlineSync.getSyncStatus()
  )

  React.useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(offlineSync.getSyncStatus())
    }

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000)

    // Listen for online/offline events
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return {
    syncStatus,
    queueForSync: (data: Omit<SyncData, 'id' | 'timestamp' | 'synced'>) => 
      offlineSync.queueForSync(data),
    forceSync: () => offlineSync.forceSync(),
    clearSyncedItems: () => offlineSync.clearSyncedItems(),
    getPendingCountByType: () => offlineSync.getPendingCountByType()
  }
}

// Import React for the hook
import React from 'react'
