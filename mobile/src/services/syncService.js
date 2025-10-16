import NetInfo from '@react-native-async-storage/async-storage';
import databaseService from './database';
import apiService from './apiService';

class SyncService {
  constructor() {
    this.isOnline = false;
    this.syncInProgress = false;
    this.syncInterval = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Initialize sync service
  async initialize() {
    try {
      // Check initial network status
      const netInfo = await NetInfo.fetch();
      this.isOnline = netInfo.isConnected;
      
      // Listen for network changes
      NetInfo.addEventListener(state => {
        this.handleNetworkChange(state.isConnected);
      });

      // Start periodic sync
      this.startPeriodicSync();
      
      console.log('Sync service initialized');
    } catch (error) {
      console.error('Error initializing sync service:', error);
    }
  }

  // Handle network state changes
  handleNetworkChange(isConnected) {
    const wasOffline = !this.isOnline;
    this.isOnline = isConnected;
    
    console.log(`Network status changed: ${isConnected ? 'Online' : 'Offline'}`);
    
    if (wasOffline && isConnected) {
      // Came back online, trigger immediate sync
      this.triggerSync();
    }
  }

  // Start periodic sync (every 5 minutes when online)
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.triggerSync();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Trigger sync process
  async triggerSync() {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    console.log('Starting sync process...');

    try {
      // Get user session
      const userSession = await databaseService.getLastUserSession();
      if (!userSession) {
        console.log('No user session found, skipping sync');
        return;
      }

      // Sync different types of data
      await this.syncPendingOperations();
      await this.syncWarehouseOperations(userSession.user_id);
      await this.syncTMSOperations(userSession.user_id);
      await this.syncCacheData();
      
      // Clear expired cache
      await databaseService.clearExpiredCache();
      
      this.retryCount = 0;
      console.log('Sync completed successfully');
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.handleSyncError(error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync pending operations
  async syncPendingOperations() {
    try {
      const operations = await databaseService.getPendingOperations();
      
      for (const operation of operations) {
        try {
          const result = await this.syncOperation(operation);
          if (result.success) {
            await databaseService.updateOperationStatus(operation.id, 'completed');
          } else {
            await databaseService.updateOperationStatus(
              operation.id, 
              'failed', 
              result.error
            );
          }
        } catch (error) {
          await databaseService.updateOperationStatus(
            operation.id, 
            'failed', 
            error.message
          );
        }
      }
    } catch (error) {
      console.error('Error syncing pending operations:', error);
    }
  }

  // Sync individual operation
  async syncOperation(operation) {
    try {
      const { operation_type, table_name, data } = operation;
      
      let result;
      switch (operation_type) {
        case 'create':
          result = await apiService.post(`/api/${table_name}`, data);
          break;
        case 'update':
          result = await apiService.put(`/api/${table_name}/${data.id}`, data);
          break;
        case 'delete':
          result = await apiService.delete(`/api/${table_name}/${data.id}`);
          break;
        default:
          throw new Error(`Unknown operation type: ${operation_type}`);
      }
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sync warehouse operations
  async syncWarehouseOperations(userId) {
    try {
      const operations = await databaseService.getOfflineWarehouseOperations(userId);
      
      for (const operation of operations) {
        try {
          let result;
          
          switch (operation.operation_type) {
            case 'receipt':
              result = await apiService.post('/api/wms/receipts', operation.receipt_data);
              break;
            case 'shipment':
              result = await apiService.post('/api/wms/shipments', operation.shipment_data);
              break;
            case 'inventory':
              result = await apiService.post('/api/wms/inventory', operation.inventory_data);
              break;
            case 'pick_list':
              result = await apiService.post('/api/wms/pick-lists', operation.pick_list_data);
              break;
            default:
              console.warn(`Unknown warehouse operation type: ${operation.operation_type}`);
              continue;
          }
          
          if (result) {
            await databaseService.updateSyncStatus(operation.id, 'warehouse', 'synced');
          }
          
        } catch (error) {
          await databaseService.updateSyncStatus(
            operation.id, 
            'warehouse', 
            'failed', 
            error.message
          );
        }
      }
    } catch (error) {
      console.error('Error syncing warehouse operations:', error);
    }
  }

  // Sync TMS operations
  async syncTMSOperations(userId) {
    try {
      const operations = await databaseService.getOfflineTMSOperations(userId);
      
      for (const operation of operations) {
        try {
          let result;
          
          switch (operation.operation_type) {
            case 'delivery':
              result = await apiService.post('/api/tms/deliveries', operation.delivery_data);
              break;
            case 'route':
              result = await apiService.post('/api/tms/routes', operation.route_data);
              break;
            case 'vehicle':
              result = await apiService.post('/api/tms/vehicles', operation.vehicle_data);
              break;
            case 'shipment':
              result = await apiService.post('/api/tms/shipments', operation.shipment_data);
              break;
            default:
              console.warn(`Unknown TMS operation type: ${operation.operation_type}`);
              continue;
          }
          
          if (result) {
            await databaseService.updateSyncStatus(operation.id, 'tms', 'synced');
          }
          
        } catch (error) {
          await databaseService.updateSyncStatus(
            operation.id, 
            'tms', 
            'failed', 
            error.message
          );
        }
      }
    } catch (error) {
      console.error('Error syncing TMS operations:', error);
    }
  }

  // Sync cache data
  async syncCacheData() {
    try {
      // Sync frequently accessed data when online
      const cacheKeys = [
        'warehouses',
        'products',
        'customers',
        'vehicles',
        'routes'
      ];
      
      for (const key of cacheKeys) {
        try {
          const data = await apiService.get(`/api/cache/${key}`);
          if (data) {
            await databaseService.setCache(key, data, 'master_data', 120); // 2 hours
          }
        } catch (error) {
          console.warn(`Failed to sync cache for ${key}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error syncing cache data:', error);
    }
  }

  // Handle sync errors
  handleSyncError(error) {
    this.retryCount++;
    
    if (this.retryCount < this.maxRetries) {
      // Retry after exponential backoff
      const retryDelay = Math.pow(2, this.retryCount) * 1000; // 2s, 4s, 8s
      
      setTimeout(() => {
        if (this.isOnline) {
          this.triggerSync();
        }
      }, retryDelay);
      
      console.log(`Sync failed, retrying in ${retryDelay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
    } else {
      console.error('Max retry attempts reached, sync failed permanently');
      this.retryCount = 0;
    }
  }

  // Manual sync trigger
  async manualSync() {
    if (this.isOnline) {
      await this.triggerSync();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }

  // Get sync status
  async getSyncStatus() {
    try {
      const pendingOperations = await databaseService.getPendingOperations();
      const userSession = await databaseService.getLastUserSession();
      
      return {
        isOnline: this.isOnline,
        syncInProgress: this.syncInProgress,
        pendingOperations: pendingOperations.length,
        hasUserSession: !!userSession,
        lastSync: userSession?.last_login
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        isOnline: this.isOnline,
        syncInProgress: this.syncInProgress,
        pendingOperations: 0,
        hasUserSession: false,
        lastSync: null
      };
    }
  }

  // Force sync specific data type
  async forceSyncData(dataType, userId) {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    switch (dataType) {
      case 'warehouse':
        await this.syncWarehouseOperations(userId);
        break;
      case 'tms':
        await this.syncTMSOperations(userId);
        break;
      case 'operations':
        await this.syncPendingOperations();
        break;
      case 'cache':
        await this.syncCacheData();
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  // Clear all offline data (logout)
  async clearAllOfflineData() {
    try {
      await databaseService.clearUserSession();
      console.log('All offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync();
  }
}

export default new SyncService();
