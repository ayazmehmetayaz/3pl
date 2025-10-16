import { Router } from 'express';
import { tmsController } from '@/controllers/tmsController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Vehicle Management Routes
/**
 * @route GET /api/v1/tms/vehicles
 * @desc Get all vehicles
 * @access Private (Transport Manager, Admin)
 */
router.get('/vehicles', authorize(['admin', 'transport_manager']), tmsController.getVehicles);

/**
 * @route POST /api/v1/tms/vehicles
 * @desc Create new vehicle
 * @access Private (Admin)
 */
router.post('/vehicles', authorize(['admin']), tmsController.createVehicle);

/**
 * @route GET /api/v1/tms/vehicles/:id
 * @desc Get vehicle by ID
 * @access Private (Transport Manager, Admin)
 */
router.get('/vehicles/:id', authorize(['admin', 'transport_manager']), tmsController.getVehicleById);

/**
 * @route PUT /api/v1/tms/vehicles/:id
 * @desc Update vehicle
 * @access Private (Admin)
 */
router.put('/vehicles/:id', authorize(['admin']), tmsController.updateVehicle);

/**
 * @route GET /api/v1/tms/vehicles/:id/maintenance
 * @desc Get vehicle maintenance records
 * @access Private (Transport Manager, Admin)
 */
router.get('/vehicles/:id/maintenance', authorize(['admin', 'transport_manager']), tmsController.getVehicleMaintenance);

/**
 * @route POST /api/v1/tms/vehicles/:id/maintenance
 * @desc Add maintenance record
 * @access Private (Transport Manager, Admin)
 */
router.post('/vehicles/:id/maintenance', authorize(['admin', 'transport_manager']), tmsController.addMaintenanceRecord);

// Route Planning
/**
 * @route GET /api/v1/tms/routes
 * @desc Get all routes
 * @access Private (Transport Manager, Admin)
 */
router.get('/routes', authorize(['admin', 'transport_manager']), tmsController.getRoutes);

/**
 * @route POST /api/v1/tms/routes
 * @desc Create new route
 * @access Private (Transport Manager, Admin)
 */
router.post('/routes', authorize(['admin', 'transport_manager']), tmsController.createRoute);

/**
 * @route POST /api/v1/tms/routes/optimize
 * @desc Optimize route
 * @access Private (Transport Manager, Admin)
 */
router.post('/routes/optimize', authorize(['admin', 'transport_manager']), tmsController.optimizeRoute);

// Shipment Management
/**
 * @route GET /api/v1/tms/shipments
 * @desc Get all shipments
 * @access Private (Transport Manager, Driver, Admin)
 */
router.get('/shipments', authorize(['admin', 'transport_manager', 'driver']), tmsController.getShipments);

/**
 * @route POST /api/v1/tms/shipments
 * @desc Create new shipment
 * @access Private (Transport Manager, Admin)
 */
router.post('/shipments', authorize(['admin', 'transport_manager']), tmsController.createShipment);

/**
 * @route GET /api/v1/tms/shipments/:id
 * @desc Get shipment by ID
 * @access Private (Transport Manager, Driver, Admin)
 */
router.get('/shipments/:id', authorize(['admin', 'transport_manager', 'driver']), tmsController.getShipmentById);

/**
 * @route PUT /api/v1/tms/shipments/:id/status
 * @desc Update shipment status
 * @access Private (Transport Manager, Driver, Admin)
 */
router.put('/shipments/:id/status', authorize(['admin', 'transport_manager', 'driver']), tmsController.updateShipmentStatus);

/**
 * @route POST /api/v1/tms/shipments/:id/load
 * @desc Load shipment onto vehicle
 * @access Private (Transport Manager, Admin)
 */
router.post('/shipments/:id/load', authorize(['admin', 'transport_manager']), tmsController.loadShipment);

/**
 * @route POST /api/v1/tms/shipments/:id/unload
 * @desc Unload shipment from vehicle
 * @access Private (Driver)
 */
router.post('/shipments/:id/unload', authorize(['driver']), tmsController.unloadShipment);

// Delivery Tracking
/**
 * @route GET /api/v1/tms/shipments/:id/tracking
 * @desc Get shipment tracking info
 * @access Private (Transport Manager, Driver, Customer, Admin)
 */
router.get('/shipments/:id/tracking', authorize(['admin', 'transport_manager', 'driver', 'customer']), tmsController.getShipmentTracking);

/**
 * @route POST /api/v1/tms/shipments/:id/tracking
 * @desc Update shipment tracking
 * @access Private (Driver)
 */
router.post('/shipments/:id/tracking', authorize(['driver']), tmsController.updateShipmentTracking);

/**
 * @route POST /api/v1/tms/shipments/:id/deliver
 * @desc Mark shipment as delivered
 * @access Private (Driver)
 */
router.post('/shipments/:id/deliver', authorize(['driver']), tmsController.deliverShipment);

// Mobile App Routes for Drivers
/**
 * @route GET /api/v1/tms/driver/assignments
 * @desc Get driver assignments
 * @access Private (Driver)
 */
router.get('/driver/assignments', authorize(['driver']), tmsController.getDriverAssignments);

/**
 * @route POST /api/v1/tms/driver/check-in
 * @desc Driver check-in
 * @access Private (Driver)
 */
router.post('/driver/check-in', authorize(['driver']), tmsController.driverCheckIn);

/**
 * @route POST /api/v1/tms/driver/check-out
 * @desc Driver check-out
 * @access Private (Driver)
 */
router.post('/driver/check-out', authorize(['driver']), tmsController.driverCheckOut);

export default router;
