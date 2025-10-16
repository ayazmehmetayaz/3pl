export interface Warehouse {
  id: string
  name: string
  code: string
  location: string
  capacity: number
  currentStock: number
  status: 'active' | 'maintenance' | 'inactive'
  type: 'ambient' | 'cold' | 'frozen' | 'hazardous'
  temperature?: {
    min: number
    max: number
    current?: number
  }
  humidity?: {
    min: number
    max: number
    current?: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  warehouseId: string
  code: string // A-01-01-01 (Blok-Raf-Seviye-Pozisyon)
  type: 'floor' | 'rack' | 'shelf' | 'bin'
  capacity: {
    weight: number // kg
    volume: number // m³
    pallets: number
  }
  dimensions: {
    width: number
    height: number
    depth: number
  }
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  currentStock: number
  lastUpdated: Date
}

export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  category: string
  type: 'single' | 'pallet' | 'bulk'
  dimensions: {
    width: number
    height: number
    depth: number
    weight: number
  }
  storage: {
    temperature?: 'ambient' | 'cold' | 'frozen'
    humidity?: number
    hazardous?: boolean
    fragile?: boolean
  }
  fifo: boolean
  fefo: boolean
  minStock: number
  maxStock: number
  currentStock: number
  reservedStock: number
  availableStock: number
  status: 'active' | 'inactive' | 'discontinued'
  createdAt: Date
  updatedAt: Date
}

export interface Lot {
  id: string
  productId: string
  lotNumber: string
  batchNumber?: string
  serialNumbers?: string[]
  quantity: number
  expiryDate?: Date
  productionDate?: Date
  supplierId?: string
  supplierName?: string
  qualityStatus: 'approved' | 'pending' | 'rejected' | 'quarantine'
  locationId?: string
  status: 'available' | 'allocated' | 'shipped' | 'expired'
  createdAt: Date
  updatedAt: Date
}

export interface ReceivingOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  warehouseId: string
  expectedDate: Date
  actualDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  items: ReceivingItem[]
  documents: string[]
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ReceivingItem {
  id: string
  receivingOrderId: string
  productId: string
  expectedQuantity: number
  receivedQuantity: number
  damagedQuantity: number
  status: 'pending' | 'partial' | 'complete' | 'damaged'
  lotNumber?: string
  expiryDate?: Date
  qualityCheck: 'pending' | 'passed' | 'failed'
  location?: string
}

export interface ShippingOrder {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  warehouseId: string
  type: 'customer' | 'transfer' | 'return'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'picking' | 'picked' | 'packed' | 'shipped' | 'delivered'
  items: ShippingItem[]
  documents: string[]
  notes?: string
  requestedDate: Date
  shippedDate?: Date
  deliveredDate?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ShippingItem {
  id: string
  shippingOrderId: string
  productId: string
  requestedQuantity: number
  pickedQuantity: number
  packedQuantity: number
  status: 'pending' | 'picking' | 'picked' | 'packed'
  lotNumbers: string[]
  locations: string[]
}

export interface PickingTask {
  id: string
  shippingOrderId: string
  pickerId?: string
  pickerName?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  items: PickingItem[]
  startTime?: Date
  endTime?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PickingItem {
  id: string
  pickingTaskId: string
  productId: string
  quantity: number
  location: string
  lotNumber?: string
  status: 'pending' | 'picked' | 'short' | 'damaged'
  pickedQuantity: number
  notes?: string
}

export interface CycleCount {
  id: string
  warehouseId: string
  name: string
  type: 'full' | 'partial' | 'abc' | 'location'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate: Date
  startDate?: Date
  endDate?: Date
  items: CycleCountItem[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CycleCountItem {
  id: string
  cycleCountId: string
  productId: string
  location: string
  expectedQuantity: number
  countedQuantity: number
  variance: number
  status: 'pending' | 'counted' | 'approved' | 'rejected'
  countedBy?: string
  countedAt?: Date
  notes?: string
}

export interface Transfer {
  id: string
  transferNumber: string
  fromWarehouseId: string
  fromLocationId: string
  toWarehouseId: string
  toLocationId: string
  type: 'warehouse_transfer' | 'location_transfer' | 'crossdock'
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled'
  items: TransferItem[]
  requestedDate: Date
  completedDate?: Date
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TransferItem {
  id: string
  transferId: string
  productId: string
  quantity: number
  lotNumbers: string[]
  status: 'pending' | 'transferred'
}

export interface FulfillmentOrder {
  id: string
  customerId: string
  customerName: string
  orderNumber: string
  marketplace?: string // 'trendyol', 'hepsiburada', 'amazon', etc.
  type: 'fulfillment' | 'crossdock'
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: FulfillmentItem[]
  packaging: {
    type: 'single' | 'multi'
    materials: string[]
  }
  shipping: {
    carrier: string
    service: string
    trackingNumber?: string
  }
  requestedDate: Date
  shippedDate?: Date
  deliveredDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FulfillmentItem {
  id: string
  fulfillmentOrderId: string
  productId: string
  quantity: number
  lotNumbers: string[]
  status: 'pending' | 'picked' | 'packed' | 'shipped'
}

export interface InventoryAlert {
  id: string
  type: 'low_stock' | 'overstock' | 'expiry' | 'quality' | 'location_full'
  severity: 'info' | 'warning' | 'critical'
  warehouseId: string
  productId?: string
  locationId?: string
  message: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  createdAt: Date
}

export interface WMSStats {
  totalProducts: number
  totalLocations: number
  occupiedLocations: number
  utilizationRate: number
  pendingReceipts: number
  pendingShipments: number
  activePickingTasks: number
  cycleCountVariance: number
  fulfillmentOrders: number
  crossdockOrders: number
}

export interface WarehouseZone {
  id: string
  warehouseId: string
  name: string
  code: string
  type: 'receiving' | 'storage' | 'picking' | 'shipping' | 'crossdock'
  temperature?: 'ambient' | 'cold' | 'frozen'
  capacity: number
  currentStock: number
  status: 'active' | 'inactive' | 'maintenance'
}

export interface PutawayRule {
  id: string
  warehouseId: string
  productId?: string
  categoryId?: string
  zoneId?: string
  locationType?: 'floor' | 'rack' | 'shelf'
  priority: number
  conditions: {
    maxWeight?: number
    maxVolume?: number
    temperature?: string
    hazardous?: boolean
  }
  isActive: boolean
}

export interface PickingRule {
  id: string
  warehouseId: string
  type: 'fifo' | 'fefo' | 'location' | 'manual'
  priority: number
  conditions: {
    productId?: string
    categoryId?: string
    zoneId?: string
  }
  isActive: boolean
}
