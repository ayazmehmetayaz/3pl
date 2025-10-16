import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const warehouseController = {
  // Get all warehouses
  async getWarehouses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('warehouses')
        .select(
          'warehouses.*',
          'users.first_name as manager_first_name',
          'users.last_name as manager_last_name'
        )
        .leftJoin('users', 'warehouses.manager_id', 'users.id');

      if (search) {
        query = query.where(function() {
          this.where('warehouses.name', 'ilike', `%${search}%`)
            .orWhere('warehouses.warehouse_code', 'ilike', `%${search}%`)
            .orWhere('warehouses.city', 'ilike', `%${search}%`);
        });
      }

      if (status) {
        query = query.where('warehouses.status', status);
      }

      const [{ count }] = await query.clone().count('* as count');
      const warehouses = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('warehouses.created_at', 'desc');

      res.json({
        success: true,
        data: warehouses,
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

  // Get warehouse by ID
  async getWarehouseById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const warehouse = await db('warehouses')
        .select(
          'warehouses.*',
          'users.first_name as manager_first_name',
          'users.last_name as manager_last_name'
        )
        .leftJoin('users', 'warehouses.manager_id', 'users.id')
        .where('warehouses.id', id)
        .first();

      if (!warehouse) {
        throw new CustomError('Warehouse not found', 404);
      }

      // Get warehouse locations
      const locations = await db('warehouse_locations')
        .where('warehouse_id', id)
        .orderBy('zone', 'asc');

      // Get warehouse statistics
      const stats = await db('inventory')
        .where('warehouse_id', id)
        .select(
          db.raw('COUNT(*) as total_products'),
          db.raw('SUM(available_quantity) as total_quantity'),
          db.raw('SUM(available_quantity * products.unit_price) as total_value')
        )
        .join('products', 'inventory.product_id', 'products.id')
        .first();

      res.json({
        success: true,
        data: {
          ...warehouse,
          locations,
          stats
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Create warehouse
  async createWarehouse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        name,
        warehouse_code,
        address,
        city,
        state,
        postal_code,
        country,
        phone,
        email,
        capacity,
        manager_id,
        status = 'active'
      } = req.body;

      const warehouseId = uuidv4();

      const warehouse = await db('warehouses')
        .insert({
          id: warehouseId,
          name,
          warehouse_code,
          address,
          city,
          state,
          postal_code,
          country,
          phone,
          email,
          capacity,
          manager_id,
          status,
          created_by: req.user?.id,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');

      logger.info(`Warehouse created: ${warehouseId} by user: ${req.user?.id}`);

      res.status(201).json({
        success: true,
        data: warehouse[0],
        message: 'Warehouse created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update warehouse
  async updateWarehouse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_by: req.user?.id,
        updated_at: new Date()
      };

      const warehouse = await db('warehouses')
        .where('id', id)
        .update(updateData)
        .returning('*');

      if (!warehouse.length) {
        throw new CustomError('Warehouse not found', 404);
      }

      logger.info(`Warehouse updated: ${id} by user: ${req.user?.id}`);

      res.json({
        success: true,
        data: warehouse[0],
        message: 'Warehouse updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete warehouse
  async deleteWarehouse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if warehouse has inventory
      const inventoryCount = await db('inventory')
        .where('warehouse_id', id)
        .count('* as count')
        .first();

      if (Number(inventoryCount?.count || 0) > 0) {
        throw new CustomError('Cannot delete warehouse with existing inventory', 400);
      }

      const deleted = await db('warehouses')
        .where('id', id)
        .del();

      if (!deleted) {
        throw new CustomError('Warehouse not found', 404);
      }

      logger.info(`Warehouse deleted: ${id} by user: ${req.user?.id}`);

      res.json({
        success: true,
        message: 'Warehouse deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

export default warehouseController;
