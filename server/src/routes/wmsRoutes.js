const express = require('express');
const { wmsController } = require('../controllers/wmsController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Warehouse Management
router.get('/warehouses', 
  requirePermission('wms.warehouses.read'), 
  wmsController.getWarehouses
);

router.post('/warehouses', 
  requirePermission('wms.warehouses.create'), 
  wmsController.createWarehouse
);

router.get('/warehouses/:id', 
  requirePermission('wms.warehouses.read'), 
  wmsController.getWarehouseById
);

router.put('/warehouses/:id', 
  requirePermission('wms.warehouses.update'), 
  wmsController.updateWarehouse
);

// Inventory Management
router.get('/inventory', 
  requirePermission('wms.inventory.read'), 
  wmsController.getInventory
);

router.get('/inventory/:id', 
  requirePermission('wms.inventory.read'), 
  wmsController.getInventoryById
);

router.post('/inventory/receive', 
  requirePermission('wms.inventory.receive'), 
  wmsController.receiveGoods
);

router.post('/inventory/ship', 
  requirePermission('wms.inventory.ship'), 
  wmsController.shipGoods
);

router.post('/inventory/transfer', 
  requirePermission('wms.inventory.transfer'), 
  wmsController.transferGoods
);

router.post('/inventory/adjust', 
  requirePermission('wms.inventory.adjust'), 
  wmsController.adjustInventory
);

// Pick Lists
router.get('/pick-lists', 
  requirePermission('wms.pick_lists.read'), 
  wmsController.getPickLists
);

router.post('/pick-lists', 
  requirePermission('wms.pick_lists.create'), 
  wmsController.createPickList
);

router.post('/pick-lists/:id/complete', 
  requirePermission('wms.pick_lists.complete'), 
  wmsController.completePickList
);

// Cycle Count
router.get('/cycle-counts', 
  requirePermission('wms.cycle_counts.read'), 
  wmsController.getCycleCounts
);

router.post('/cycle-counts', 
  requirePermission('wms.cycle_counts.create'), 
  wmsController.createCycleCount
);

router.post('/cycle-counts/:id/complete', 
  requirePermission('wms.cycle_counts.complete'), 
  wmsController.completeCycleCount
);

module.exports = router;
