import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-async-storage/async-storage';
import databaseService from '../services/database';
import syncService from '../services/syncService';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [offlineData, setOfflineData] = useState({
    receipts: [],
    shipments: [],
    deliveries: [],
    inventory: []
  });

  useEffect(() => {
    initializeOfflineService();
    return () => {
      syncService.destroy();
    };
  }, []);

  const initializeOfflineService = async () => {
    try {
      // Initialize database
      await databaseService.initDatabase();
      
      // Initialize sync service
      await syncService.initialize();
      
      // Check initial network status
      const netInfo = await NetInfo.fetch();
      setIsOnline(netInfo.isConnected);
      
      // Listen for network changes
      NetInfo.addEventListener(handleNetworkChange);
      
      // Load offline data
      await loadOfflineData();
      
      console.log('Offline service initialized');
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
    }
  };

  const handleNetworkChange = (state) => {
    const wasOffline = !isOnline;
    const nowOnline = state.isConnected;
    
    setIsOnline(nowOnline);
    
    if (wasOffline && nowOnline) {
      // Came back online, trigger sync
      handleSync();
    }
  };

  const loadOfflineData = async () => {
    try {
      const userSession = await databaseService.getLastUserSession();
      if (!userSession) return;

      const [warehouseOps, tmsOps, operations] = await Promise.all([
        databaseService.getOfflineWarehouseOperations(userSession.user_id),
        databaseService.getOfflineTMSOperations(userSession.user_id),
        databaseService.getPendingOperations()
      ]);

      setOfflineData({
        receipts: warehouseOps.filter(op => op.operation_type === 'receipt'),
        shipments: warehouseOps.filter(op => op.operation_type === 'shipment'),
        deliveries: tmsOps.filter(op => op.operation_type === 'delivery'),
        inventory: warehouseOps.filter(op => op.operation_type === 'inventory')
      });

      setPendingOperations(operations.length);
      setLastSync(userSession.last_login);
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline || syncInProgress) return;

    setSyncInProgress(true);
    try {
      await syncService.triggerSync();
      await loadOfflineData(); // Refresh offline data after sync
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const saveOfflineOperation = async (operationType, data, userId) => {
    try {
      await databaseService.addOfflineOperation(
        'create',
        operationType,
        data,
        userId
      );
      
      // Reload offline data to update UI
      await loadOfflineData();
      
      return true;
    } catch (error) {
      console.error('Error saving offline operation:', error);
      throw error;
    }
  };

  const saveOfflineReceipt = async (receiptData, userId) => {
    try {
      await databaseService.saveOfflineReceipt(receiptData, userId);
      await loadOfflineData();
      return true;
    } catch (error) {
      console.error('Error saving offline receipt:', error);
      throw error;
    }
  };

  const saveOfflineShipment = async (shipmentData, userId) => {
    try {
      await databaseService.saveOfflineShipment(shipmentData, userId);
      await loadOfflineData();
      return true;
    } catch (error) {
      console.error('Error saving offline shipment:', error);
      throw error;
    }
  };

  const saveOfflineDelivery = async (deliveryData, userId) => {
    try {
      await databaseService.saveOfflineDelivery(deliveryData, userId);
      await loadOfflineData();
      return true;
    } catch (error) {
      console.error('Error saving offline delivery:', error);
      throw error;
    }
  };

  const getOfflineData = async (dataType) => {
    try {
      const userSession = await databaseService.getLastUserSession();
      if (!userSession) return [];

      switch (dataType) {
        case 'receipts':
          const warehouseOps = await databaseService.getOfflineWarehouseOperations(userSession.user_id);
          return warehouseOps.filter(op => op.operation_type === 'receipt');
        case 'shipments':
          const warehouseOps2 = await databaseService.getOfflineWarehouseOperations(userSession.user_id);
          return warehouseOps2.filter(op => op.operation_type === 'shipment');
        case 'deliveries':
          const tmsOps = await databaseService.getOfflineTMSOperations(userSession.user_id);
          return tmsOps.filter(op => op.operation_type === 'delivery');
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting offline data:', error);
      return [];
    }
  };

  const clearOfflineData = async () => {
    try {
      await databaseService.clearUserSession();
      setOfflineData({
        receipts: [],
        shipments: [],
        deliveries: [],
        inventory: []
      });
      setPendingOperations(0);
      setLastSync(null);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  };

  const getSyncStatus = async () => {
    try {
      return await syncService.getSyncStatus();
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        isOnline,
        syncInProgress,
        pendingOperations,
        hasUserSession: false,
        lastSync
      };
    }
  };

  const forceSync = async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    setSyncInProgress(true);
    try {
      await syncService.manualSync();
      await loadOfflineData();
    } finally {
      setSyncInProgress(false);
    }
  };

  const value = {
    // State
    isOnline,
    syncInProgress,
    pendingOperations,
    lastSync,
    offlineData,
    
    // Actions
    handleSync,
    saveOfflineOperation,
    saveOfflineReceipt,
    saveOfflineShipment,
    saveOfflineDelivery,
    getOfflineData,
    clearOfflineData,
    getSyncStatus,
    forceSync,
    loadOfflineData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export default OfflineContext;
