const express = require('express');
const { tmsController } = require('../controllers/tmsController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Vehicle Management
router.get('/vehicles', 
  requirePermission('tms.vehicles.read'), 
  tmsController.getVehicles
);

router.post('/vehicles', 
  requirePermission('tms.vehicles.create'), 
  tmsController.createVehicle
);

router.get('/vehicles/:id', 
  requirePermission('tms.vehicles.read'), 
  tmsController.getVehicleById
);

router.put('/vehicles/:id', 
  requirePermission('tms.vehicles.update'), 
  tmsController.updateVehicle
);

router.get('/vehicles/:id/maintenance', 
  requirePermission('tms.vehicles.read'), 
  tmsController.getVehicleMaintenance
);

router.post('/vehicles/:id/maintenance', 
  requirePermission('tms.vehicles.maintenance'), 
  tmsController.addMaintenanceRecord
);

// Route Planning
router.get('/routes', 
  requirePermission('tms.routes.read'), 
  tmsController.getRoutes
);

router.post('/routes', 
  requirePermission('tms.routes.create'), 
  tmsController.createRoute
);

router.post('/routes/optimize', 
  requirePermission('tms.routes.optimize'), 
  tmsController.optimizeRoute
);

// Shipment Management
router.get('/shipments', 
  requirePermission('tms.shipments.read'), 
  tmsController.getShipments
);

router.post('/shipments', 
  requirePermission('tms.shipments.create'), 
  tmsController.createShipment
);

router.get('/shipments/:id', 
  requirePermission('tms.shipments.read'), 
  tmsController.getShipmentById
);

router.patch('/shipments/:id/status', 
  requirePermission('tms.shipments.update'), 
  tmsController.updateShipmentStatus
);

router.post('/shipments/:id/load', 
  requirePermission('tms.shipments.load'), 
  tmsController.loadShipment
);

router.post('/shipments/:id/unload', 
  requirePermission('tms.shipments.unload'), 
  tmsController.unloadShipment
);

// Delivery Tracking
router.get('/shipments/:id/tracking', 
  requirePermission('tms.shipments.track'), 
  tmsController.getShipmentTracking
);

router.post('/shipments/:id/tracking', 
  requirePermission('tms.shipments.track'), 
  tmsController.updateShipmentTracking
);

router.post('/shipments/:id/deliver', 
  requirePermission('tms.shipments.deliver'), 
  tmsController.deliverShipment
);

// Mobile App Routes for Drivers
router.get('/driver/assignments', 
  requirePermission('tms.driver.assignments'), 
  tmsController.getDriverAssignments
);

router.post('/driver/checkin', 
  requirePermission('tms.driver.checkin'), 
  tmsController.driverCheckIn
);

router.post('/driver/checkout', 
  requirePermission('tms.driver.checkout'), 
  tmsController.driverCheckOut
);

module.exports = router;
