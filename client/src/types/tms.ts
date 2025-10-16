export interface Vehicle {
  id: string
  plateNumber: string
  brand: string
  model: string
  year: number
  type: 'truck' | 'van' | 'minibus' | 'trailer' | 'container'
  capacity: {
    weight: number // kg
    volume: number // m³
    pallets: number
  }
  dimensions: {
    length: number // cm
    width: number // cm
    height: number // cm
  }
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid'
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  location?: {
    latitude: number
    longitude: number
    address: string
    lastUpdated: Date
  }
  driver?: {
    id: string
    name: string
    phone: string
    licenseNumber: string
    licenseExpiry: Date
  }
  insurance: {
    company: string
    policyNumber: string
    expiryDate: Date
  }
  registration: {
    number: string
    expiryDate: Date
  }
  lastMaintenance: Date
  nextMaintenance: Date
  mileage: number
  createdAt: Date
  updatedAt: Date
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseType: 'B' | 'C' | 'CE' | 'D'
  licenseExpiry: Date
  status: 'available' | 'on_duty' | 'off_duty' | 'suspended'
  currentVehicle?: string
  location?: {
    latitude: number
    longitude: number
    lastUpdated: Date
  }
  workingHours: {
    start: string // HH:mm
    end: string // HH:mm
    days: number[] // [1,2,3,4,5] for weekdays
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Route {
  id: string
  name: string
  description?: string
  type: 'delivery' | 'pickup' | 'both' | 'milkrun'
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  stops: RouteStop[]
  totalDistance: number // km
  estimatedDuration: number // minutes
  actualDuration?: number // minutes
  startTime?: Date
  endTime?: Date
  vehicleId?: string
  driverId?: string
  createdAt: Date
  updatedAt: Date
}

export interface RouteStop {
  id: string
  sequence: number
  type: 'pickup' | 'delivery' | 'fuel' | 'rest'
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  contactPerson?: {
    name: string
    phone: string
    email?: string
  }
  timeWindow: {
    earliest: Date
    latest: Date
  }
  estimatedDuration: number // minutes
  actualArrival?: Date
  actualDeparture?: Date
  status: 'pending' | 'arrived' | 'completed' | 'skipped'
  notes?: string
  items?: ShipmentItem[]
}

export interface Shipment {
  id: string
  shipmentNumber: string
  type: 'domestic' | 'international' | 'express' | 'bulk'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
  origin: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
    contactPerson?: {
      name: string
      phone: string
      email?: string
    }
  }
  destination: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
    contactPerson?: {
      name: string
      phone: string
      email?: string
    }
  }
  items: ShipmentItem[]
  vehicleId?: string
  driverId?: string
  routeId?: string
  customerId: string
  customerName: string
  requestedPickupDate: Date
  requestedDeliveryDate: Date
  actualPickupDate?: Date
  actualDeliveryDate?: Date
  trackingNumber?: string
  documents: string[]
  notes?: string
  specialInstructions?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ShipmentItem {
  id: string
  shipmentId: string
  productId: string
  productName: string
  quantity: number
  weight: number // kg
  volume: number // m³
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  isFragile: boolean
  isHazardous: boolean
  temperature?: 'ambient' | 'cold' | 'frozen'
  lotNumbers?: string[]
  serialNumbers?: string[]
}

export interface Container {
  id: string
  containerNumber: string
  type: '20ft' | '40ft' | '45ft' | 'reefer' | 'tank'
  status: 'available' | 'loaded' | 'in_transit' | 'delivered' | 'maintenance'
  location: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
    type: 'port' | 'depot' | 'customer' | 'transit'
  }
  capacity: {
    weight: number // kg
    volume: number // m³
  }
  contents?: ShipmentItem[]
  sealNumber?: string
  temperature?: {
    min: number
    max: number
    current?: number
  }
  lastInspection?: Date
  nextInspection?: Date
  createdAt: Date
  updatedAt: Date
}

export interface MilkrunRoute {
  id: string
  name: string
  description?: string
  type: 'supplier_pickup' | 'customer_delivery' | 'mixed'
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 1-7
    dayOfMonth?: number // 1-31
    time: string // HH:mm
  }
  stops: MilkrunStop[]
  vehicleId?: string
  driverId?: string
  totalDistance: number
  estimatedDuration: number
  actualDuration?: number
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface MilkrunStop {
  id: string
  sequence: number
  type: 'pickup' | 'delivery'
  customerId: string
  customerName: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  timeWindow: {
    start: Date
    end: Date
  }
  estimatedDuration: number
  actualArrival?: Date
  actualDeparture?: Date
  status: 'pending' | 'arrived' | 'completed' | 'skipped'
  items?: ShipmentItem[]
  notes?: string
}

export interface LoadingPlan {
  id: string
  vehicleId: string
  shipmentId: string
  status: 'planned' | 'loading' | 'loaded' | 'completed'
  items: LoadingItem[]
  loadingSequence: number[]
  totalWeight: number
  totalVolume: number
  utilizationRate: number
  loadingInstructions?: string
  specialRequirements?: string[]
  plannedLoadingTime: Date
  actualLoadingStart?: Date
  actualLoadingEnd?: Date
  loadedBy?: string
  verifiedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface LoadingItem {
  id: string
  productId: string
  productName: string
  quantity: number
  weight: number
  volume: number
  position: {
    zone: string // 'front', 'middle', 'rear'
    level: number // 1, 2, 3
    side: 'left' | 'right' | 'center'
  }
  isFragile: boolean
  isHazardous: boolean
  requiresTemperature: boolean
  loadingSequence: number
  loadedAt?: Date
  loadedBy?: string
}

export interface DeliveryTracking {
  id: string
  shipmentId: string
  driverId: string
  vehicleId: string
  status: 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  location: {
    latitude: number
    longitude: number
    address: string
    timestamp: Date
  }
  events: TrackingEvent[]
  estimatedDelivery?: Date
  actualDelivery?: Date
  deliveryProof?: {
    signature?: string
    photo?: string
    notes?: string
    deliveredBy?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface TrackingEvent {
  id: string
  type: 'pickup' | 'departure' | 'transit' | 'arrival' | 'delivery' | 'exception'
  description: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  timestamp: Date
  notes?: string
  photos?: string[]
}

export interface TMSStats {
  totalVehicles: number
  activeVehicles: number
  totalDrivers: number
  onDutyDrivers: number
  pendingShipments: number
  inTransitShipments: number
  deliveredShipments: number
  averageDeliveryTime: number
  fuelConsumption: number
  maintenanceAlerts: number
  routeOptimizationSavings: number
}

export interface RouteOptimization {
  id: string
  requestId: string
  shipments: string[]
  optimizedRoute: RouteStop[]
  savings: {
    distance: number // km
    time: number // minutes
    fuel: number // liters
    cost: number // currency
  }
  algorithm: 'genetic' | 'simulated_annealing' | 'nearest_neighbor' | 'manual'
  status: 'processing' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: 'preventive' | 'corrective' | 'inspection'
  description: string
  parts: MaintenancePart[]
  labor: {
    hours: number
    cost: number
    technician: string
  }
  totalCost: number
  mileage: number
  date: Date
  nextMaintenance?: Date
  status: 'scheduled' | 'in_progress' | 'completed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MaintenancePart {
  id: string
  name: string
  partNumber: string
  quantity: number
  unitCost: number
  totalCost: number
  supplier?: string
  warranty?: {
    months: number
    expires: Date
  }
}

export interface FuelRecord {
  id: string
  vehicleId: string
  driverId: string
  date: Date
  fuelType: 'diesel' | 'gasoline'
  quantity: number // liters
  cost: number
  location: string
  odometer: number
  receipt?: string
  notes?: string
  createdAt: Date
}

export interface ComplianceDocument {
  id: string
  vehicleId?: string
  driverId?: string
  type: 'insurance' | 'registration' | 'license' | 'inspection' | 'permit'
  documentNumber: string
  issuer: string
  issueDate: Date
  expiryDate: Date
  status: 'valid' | 'expiring' | 'expired'
  document?: string // file path or URL
  notes?: string
  createdAt: Date
  updatedAt: Date
}
