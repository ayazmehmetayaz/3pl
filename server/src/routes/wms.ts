import { Router } from 'express';
import { wmsController } from '@/controllers/wmsController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Warehouse Management Routes
/**
 * @route GET /api/v1/wms/warehouses
 * @desc Get all warehouses
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouses', authorize(['admin', 'warehouse_manager']), wmsController.getWarehouses);

/**
 * @route POST /api/v1/wms/warehouses
 * @desc Create new warehouse
 * @access Private (Admin)
 */
router.post('/warehouses', authorize(['admin']), wmsController.createWarehouse);

/**
 * @route GET /api/v1/wms/warehouses/:id
 * @desc Get warehouse by ID
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouses/:id', authorize(['admin', 'warehouse_manager']), wmsController.getWarehouseById);

/**
 * @route PUT /api/v1/wms/warehouses/:id
 * @desc Update warehouse
 * @access Private (Admin)
 */
router.put('/warehouses/:id', authorize(['admin']), wmsController.updateWarehouse);

// Inventory Management Routes
/**
 * @route GET /api/v1/wms/inventory
 * @desc Get inventory items
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.get('/inventory', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.getInventory);

/**
 * @route GET /api/v1/wms/inventory/:id
 * @desc Get inventory item by ID
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.get('/inventory/:id', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.getInventoryById);

/**
 * @route POST /api/v1/wms/inventory/receive
 * @desc Receive goods into warehouse
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.post('/inventory/receive', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.receiveGoods);

/**
 * @route POST /api/v1/wms/inventory/ship
 * @desc Ship goods from warehouse
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.post('/inventory/ship', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.shipGoods);

/**
 * @route POST /api/v1/wms/inventory/transfer
 * @desc Transfer goods between locations
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.post('/inventory/transfer', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.transferGoods);

/**
 * @route POST /api/v1/wms/inventory/adjust
 * @desc Adjust inventory quantities
 * @access Private (Warehouse Manager)
 */
router.post('/inventory/adjust', authorize(['admin', 'warehouse_manager']), wmsController.adjustInventory);

// Pick Lists and Orders
/**
 * @route GET /api/v1/wms/pick-lists
 * @desc Get pick lists
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.get('/pick-lists', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.getPickLists);

/**
 * @route POST /api/v1/wms/pick-lists
 * @desc Create pick list
 * @access Private (Warehouse Manager)
 */
router.post('/pick-lists', authorize(['admin', 'warehouse_manager']), wmsController.createPickList);

/**
 * @route PUT /api/v1/wms/pick-lists/:id/complete
 * @desc Complete pick list
 * @access Private (Warehouse Operator)
 */
router.put('/pick-lists/:id/complete', authorize(['admin', 'warehouse_operator']), wmsController.completePickList);

// Cycle Counting
/**
 * @route GET /api/v1/wms/cycle-counts
 * @desc Get cycle counts
 * @access Private (Warehouse Manager)
 */
router.get('/cycle-counts', authorize(['admin', 'warehouse_manager']), wmsController.getCycleCounts);

/**
 * @route POST /api/v1/wms/cycle-counts
 * @desc Create cycle count
 * @access Private (Warehouse Manager)
 */
router.post('/cycle-counts', authorize(['admin', 'warehouse_manager']), wmsController.createCycleCount);

/**
 * @route PUT /api/v1/wms/cycle-counts/:id/complete
 * @desc Complete cycle count
 * @access Private (Warehouse Manager, Warehouse Operator)
 */
router.put('/cycle-counts/:id/complete', authorize(['admin', 'warehouse_manager', 'warehouse_operator']), wmsController.completeCycleCount);

export default router;
