import { Request, Response } from 'express';
import warehouseController from './warehouseController';
import inventoryController from './inventoryController';

// Re-export all controllers for easy importing
export { warehouseController, inventoryController };

// Main WMS controller that combines all functionality
export const wmsController = {
  // Warehouse management
  ...warehouseController,

  // Inventory management
  ...inventoryController
};

export default wmsController;
