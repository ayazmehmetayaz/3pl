import SQLite from 'react-native-sqlite-storage';

// SQLite database configuration
SQLite.DEBUG = __DEV__;
SQLite.enablePromise(true);

const DATABASE_NAME = 'AyazERP.db';
const DATABASE_VERSION = 1.0;

class DatabaseService {
  constructor() {
    this.db = null;
  }

  // Initialize database
  async initDatabase() {
    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
        version: DATABASE_VERSION,
        createFromLocation: '~www/ayaz_erp.db',
      });
      
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Create necessary tables for offline storage
  async createTables() {
    const createTablesSQL = [
      // User session table
      `CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        token TEXT,
        last_login DATETIME,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Offline operations queue
      `CREATE TABLE IF NOT EXISTS offline_operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        data TEXT NOT NULL,
        user_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        retry_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Offline warehouse operations
      `CREATE TABLE IF NOT EXISTS offline_warehouse_operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation_type TEXT NOT NULL,
        receipt_data TEXT,
        shipment_data TEXT,
        inventory_data TEXT,
        pick_list_data TEXT,
        user_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        sync_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Offline TMS operations
      `CREATE TABLE IF NOT EXISTS offline_tms_operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation_type TEXT NOT NULL,
        vehicle_data TEXT,
        route_data TEXT,
        shipment_data TEXT,
        delivery_data TEXT,
        user_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        sync_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Offline cache for frequently accessed data
      `CREATE TABLE IF NOT EXISTS offline_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cache_key TEXT UNIQUE NOT NULL,
        cache_data TEXT NOT NULL,
        cache_type TEXT NOT NULL,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Sync status tracking
      `CREATE TABLE IF NOT EXISTS sync_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sync_type TEXT UNIQUE NOT NULL,
        last_sync DATETIME,
        sync_status TEXT DEFAULT 'pending',
        error_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const sql of createTablesSQL) {
      await this.db.executeSql(sql);
    }
  }

  // Save user session
  async saveUserSession(userData) {
    try {
      await this.db.executeSql(
        'INSERT OR REPLACE INTO user_sessions (user_id, email, token, last_login, is_active) VALUES (?, ?, ?, ?, ?)',
        [
          userData.id,
          userData.email,
          userData.token,
          new Date().toISOString(),
          1
        ]
      );
      return true;
    } catch (error) {
      console.error('Error saving user session:', error);
      throw error;
    }
  }

  // Get last user session
  async getLastUserSession() {
    try {
      const [results] = await this.db.executeSql(
        'SELECT * FROM user_sessions WHERE is_active = 1 ORDER BY last_login DESC LIMIT 1'
      );
      
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error getting user session:', error);
      throw error;
    }
  }

  // Clear user session
  async clearUserSession() {
    try {
      await this.db.executeSql('UPDATE user_sessions SET is_active = 0');
      await this.db.executeSql('DELETE FROM offline_operations');
      await this.db.executeSql('DELETE FROM offline_warehouse_operations');
      await this.db.executeSql('DELETE FROM offline_tms_operations');
      await this.db.executeSql('DELETE FROM offline_cache');
      return true;
    } catch (error) {
      console.error('Error clearing user session:', error);
      throw error;
    }
  }

  // Add operation to offline queue
  async addOfflineOperation(operationType, tableName, data, userId) {
    try {
      await this.db.executeSql(
        'INSERT INTO offline_operations (operation_type, table_name, data, user_id) VALUES (?, ?, ?, ?)',
        [operationType, tableName, JSON.stringify(data), userId]
      );
      return true;
    } catch (error) {
      console.error('Error adding offline operation:', error);
      throw error;
    }
  }

  // Get pending offline operations
  async getPendingOperations() {
    try {
      const [results] = await this.db.executeSql(
        'SELECT * FROM offline_operations WHERE status = "pending" ORDER BY timestamp ASC'
      );
      
      const operations = [];
      for (let i = 0; i < results.rows.length; i++) {
        const operation = results.rows.item(i);
        operation.data = JSON.parse(operation.data);
        operations.push(operation);
      }
      
      return operations;
    } catch (error) {
      console.error('Error getting pending operations:', error);
      throw error;
    }
  }

  // Update operation status
  async updateOperationStatus(operationId, status, errorMessage = null) {
    try {
      if (status === 'completed') {
        await this.db.executeSql(
          'DELETE FROM offline_operations WHERE id = ?',
          [operationId]
        );
      } else {
        await this.db.executeSql(
          'UPDATE offline_operations SET status = ?, error_message = ?, retry_count = retry_count + 1 WHERE id = ?',
          [status, errorMessage, operationId]
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating operation status:', error);
      throw error;
    }
  }

  // Cache management
  async setCache(key, data, cacheType, expiresInMinutes = 60) {
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
      
      await this.db.executeSql(
        'INSERT OR REPLACE INTO offline_cache (cache_key, cache_data, cache_type, expires_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [key, JSON.stringify(data), cacheType, expiresAt.toISOString(), new Date().toISOString()]
      );
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      throw error;
    }
  }

  async getCache(key) {
    try {
      const [results] = await this.db.executeSql(
        'SELECT * FROM offline_cache WHERE cache_key = ? AND (expires_at IS NULL OR expires_at > ?)',
        [key, new Date().toISOString()]
      );
      
      if (results.rows.length > 0) {
        const cache = results.rows.item(0);
        return JSON.parse(cache.cache_data);
      }
      return null;
    } catch (error) {
      console.error('Error getting cache:', error);
      throw error;
    }
  }

  async clearExpiredCache() {
    try {
      await this.db.executeSql(
        'DELETE FROM offline_cache WHERE expires_at < ?',
        [new Date().toISOString()]
      );
      return true;
    } catch (error) {
      console.error('Error clearing expired cache:', error);
      throw error;
    }
  }

  // Warehouse specific offline operations
  async saveOfflineReceipt(receiptData, userId) {
    try {
      await this.db.executeSql(
        'INSERT INTO offline_warehouse_operations (operation_type, receipt_data, user_id) VALUES (?, ?, ?)',
        ['receipt', JSON.stringify(receiptData), userId]
      );
      return true;
    } catch (error) {
      console.error('Error saving offline receipt:', error);
      throw error;
    }
  }

  async saveOfflineShipment(shipmentData, userId) {
    try {
      await this.db.executeSql(
        'INSERT INTO offline_warehouse_operations (operation_type, shipment_data, user_id) VALUES (?, ?, ?)',
        ['shipment', JSON.stringify(shipmentData), userId]
      );
      return true;
    } catch (error) {
      console.error('Error saving offline shipment:', error);
      throw error;
    }
  }

  // TMS specific offline operations
  async saveOfflineDelivery(deliveryData, userId) {
    try {
      await this.db.executeSql(
        'INSERT INTO offline_tms_operations (operation_type, delivery_data, user_id) VALUES (?, ?, ?)',
        ['delivery', JSON.stringify(deliveryData), userId]
      );
      return true;
    } catch (error) {
      console.error('Error saving offline delivery:', error);
      throw error;
    }
  }

  // Get offline warehouse operations
  async getOfflineWarehouseOperations(userId) {
    try {
      const [results] = await this.db.executeSql(
        'SELECT * FROM offline_warehouse_operations WHERE user_id = ? AND sync_status = "pending"',
        [userId]
      );
      
      const operations = [];
      for (let i = 0; i < results.rows.length; i++) {
        const operation = results.rows.item(i);
        if (operation.receipt_data) operation.receipt_data = JSON.parse(operation.receipt_data);
        if (operation.shipment_data) operation.shipment_data = JSON.parse(operation.shipment_data);
        if (operation.inventory_data) operation.inventory_data = JSON.parse(operation.inventory_data);
        if (operation.pick_list_data) operation.pick_list_data = JSON.parse(operation.pick_list_data);
        operations.push(operation);
      }
      
      return operations;
    } catch (error) {
      console.error('Error getting offline warehouse operations:', error);
      throw error;
    }
  }

  // Get offline TMS operations
  async getOfflineTMSOperations(userId) {
    try {
      const [results] = await this.db.executeSql(
        'SELECT * FROM offline_tms_operations WHERE user_id = ? AND sync_status = "pending"',
        [userId]
      );
      
      const operations = [];
      for (let i = 0; i < results.rows.length; i++) {
        const operation = results.rows.item(i);
        if (operation.vehicle_data) operation.vehicle_data = JSON.parse(operation.vehicle_data);
        if (operation.route_data) operation.route_data = JSON.parse(operation.route_data);
        if (operation.shipment_data) operation.shipment_data = JSON.parse(operation.shipment_data);
        if (operation.delivery_data) operation.delivery_data = JSON.parse(operation.delivery_data);
        operations.push(operation);
      }
      
      return operations;
    } catch (error) {
      console.error('Error getting offline TMS operations:', error);
      throw error;
    }
  }

  // Update sync status
  async updateSyncStatus(operationId, syncType, status, errorMessage = null) {
    try {
      const tableName = syncType === 'warehouse' ? 'offline_warehouse_operations' : 'offline_tms_operations';
      
      if (status === 'synced') {
        await this.db.executeSql(`DELETE FROM ${tableName} WHERE id = ?`, [operationId]);
      } else {
        await this.db.executeSql(
          `UPDATE ${tableName} SET sync_status = ?, error_message = ? WHERE id = ?`,
          [status, errorMessage, operationId]
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating sync status:', error);
      throw error;
    }
  }

  // Close database
  async closeDatabase() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export default new DatabaseService();
