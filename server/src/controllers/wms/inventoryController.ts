import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const inventoryController = {
  // Get inventory items
  async getInventory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        warehouse_id, 
        category,
        low_stock = false 
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('inventory')
        .select(
          'inventory.*',
          'products.name as product_name',
          'products.sku',
          'products.category',
          'products.unit_price',
          'products.description',
          'warehouses.name as warehouse_name',
          'warehouses.location as warehouse_location'
        )
        .join('products', 'inventory.product_id', 'products.id')
        .join('warehouses', 'inventory.warehouse_id', 'warehouses.id');

      if (search) {
        query = query.where(function() {
          this.where('products.name', 'ilike', `%${search}%`)
            .orWhere('products.sku', 'ilike', `%${search}%`)
            .orWhere('products.description', 'ilike', `%${search}%`);
        });
      }

      if (warehouse_id) {
        query = query.where('inventory.warehouse_id', warehouse_id);
      }

      if (category) {
        query = query.where('products.category', category);
      }

      if (low_stock === 'true') {
        query = query.where('inventory.available_quantity', '<', 'inventory.reorder_level');
      }

      const [{ count }] = await query.clone().count('* as count');
      const inventory = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('products.name', 'asc');

      res.json({
        success: true,
        data: inventory,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get inventory item by ID
  async getInventoryById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const inventory = await db('inventory')
        .select(
          'inventory.*',
          'products.name as product_name',
          'products.sku',
          'products.category',
          'products.unit_price',
          'products.description',
          'warehouses.name as warehouse_name',
          'warehouses.location as warehouse_location'
        )
        .join('products', 'inventory.product_id', 'products.id')
        .join('warehouses', 'inventory.warehouse_id', 'warehouses.id')
        .where('inventory.id', id)
        .first();

      if (!inventory) {
        throw new CustomError('Inventory item not found', 404);
      }

      // Get movement history
      const movements = await db('inventory_movements')
        .where('inventory_id', id)
        .orderBy('created_at', 'desc')
        .limit(20);

      res.json({
        success: true,
        data: {
          ...inventory,
          movements
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update inventory quantity
  async updateInventory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { 
        available_quantity, 
        reserved_quantity, 
        reorder_level,
        location_code 
      } = req.body;

      const updateData = {
        available_quantity,
        reserved_quantity,
        reorder_level,
        location_code,
        updated_by: req.user?.id,
        updated_at: new Date()
      };

      const inventory = await db('inventory')
        .where('id', id)
        .update(updateData)
        .returning('*');

      if (!inventory.length) {
        throw new CustomError('Inventory item not found', 404);
      }

      // Log inventory movement
      await db('inventory_movements').insert({
        id: uuidv4(),
        inventory_id: id,
        movement_type: 'adjustment',
        quantity: available_quantity - inventory[0].available_quantity,
        reference_type: 'manual_adjustment',
        reference_id: req.user?.id,
        notes: 'Manual inventory adjustment',
        created_by: req.user?.id,
        created_at: new Date()
      });

      logger.info(`Inventory updated: ${id} by user: ${req.user?.id}`);

      res.json({
        success: true,
        data: inventory[0],
        message: 'Inventory updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get low stock items
  async getLowStockItems(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { warehouse_id } = req.query;

      let query = db('inventory')
        .select(
          'inventory.*',
          'products.name as product_name',
          'products.sku',
          'products.category',
          'products.unit_price',
          'warehouses.name as warehouse_name'
        )
        .join('products', 'inventory.product_id', 'products.id')
        .join('warehouses', 'inventory.warehouse_id', 'warehouses.id')
        .where('inventory.available_quantity', '<', 'inventory.reorder_level');

      if (warehouse_id) {
        query = query.where('inventory.warehouse_id', warehouse_id);
      }

      const lowStockItems = await query.orderBy('inventory.available_quantity', 'asc');

      res.json({
        success: true,
        data: lowStockItems
      });
    } catch (error) {
      next(error);
    }
  },

  // Get inventory movements
  async getInventoryMovements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        inventory_id,
        movement_type,
        start_date,
        end_date 
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('inventory_movements')
        .select(
          'inventory_movements.*',
          'products.name as product_name',
          'products.sku',
          'warehouses.name as warehouse_name',
          'users.first_name',
          'users.last_name'
        )
        .join('inventory', 'inventory_movements.inventory_id', 'inventory.id')
        .join('products', 'inventory.product_id', 'products.id')
        .join('warehouses', 'inventory.warehouse_id', 'warehouses.id')
        .leftJoin('users', 'inventory_movements.created_by', 'users.id');

      if (inventory_id) {
        query = query.where('inventory_movements.inventory_id', inventory_id);
      }

      if (movement_type) {
        query = query.where('inventory_movements.movement_type', movement_type);
      }

      if (start_date && end_date) {
        query = query.whereBetween('inventory_movements.created_at', [start_date, end_date]);
      }

      const [{ count }] = await query.clone().count('* as count');
      const movements = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('inventory_movements.created_at', 'desc');

      res.json({
        success: true,
        data: movements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

export default inventoryController;
