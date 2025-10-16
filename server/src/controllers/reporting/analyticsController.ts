import { Request, Response, NextFunction } from 'express';
import { db } from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const analyticsController = {
  // Get sales analytics
  async getSalesAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period = '30d', startDate, endDate } = req.query;

      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          created_at: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        };
      }

      const salesData = await db('orders')
        .select(
          db.raw('DATE(created_at) as date'),
          db.raw('COUNT(*) as orders_count'),
          db.raw('SUM(total_amount) as total_revenue')
        )
        .where(dateFilter)
        .groupBy(db.raw('DATE(created_at)'))
        .orderBy('date', 'asc');

      const topProducts = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .select(
          'products.name',
          'products.sku',
          db.raw('SUM(order_items.quantity) as total_quantity'),
          db.raw('SUM(order_items.total_amount) as total_revenue')
        )
        .where(dateFilter)
        .groupBy('products.id', 'products.name', 'products.sku')
        .orderBy('total_quantity', 'desc')
        .limit(10);

      res.json({
        success: true,
        data: {
          salesData,
          topProducts
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get inventory analytics
  async getInventoryAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        totalValue,
        lowStockItems,
        fastMovingItems,
        slowMovingItems,
        warehouseDistribution
      ] = await Promise.all([
        db('inventory')
          .join('products', 'inventory.product_id', 'products.id')
          .sum(db.raw('inventory.available_quantity * products.unit_price as total'))
          .first(),
        db('inventory')
          .join('products', 'inventory.product_id', 'products.id')
          .select('products.name', 'products.sku', 'inventory.available_quantity')
          .where('inventory.available_quantity', '<', 10)
          .orderBy('inventory.available_quantity', 'asc'),
        db('inventory_movements')
          .join('products', 'inventory_movements.product_id', 'products.id')
          .select(
            'products.name',
            'products.sku',
            db.raw('SUM(ABS(quantity)) as total_movement')
          )
          .where('inventory_movements.created_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'))
          .groupBy('products.id', 'products.name', 'products.sku')
          .orderBy('total_movement', 'desc')
          .limit(10),
        db('inventory_movements')
          .join('products', 'inventory_movements.product_id', 'products.id')
          .select(
            'products.name',
            'products.sku',
            db.raw('SUM(ABS(quantity)) as total_movement')
          )
          .where('inventory_movements.created_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'))
          .groupBy('products.id', 'products.name', 'products.sku')
          .orderBy('total_movement', 'asc')
          .limit(10),
        db('inventory')
          .join('warehouses', 'inventory.warehouse_id', 'warehouses.id')
          .select(
            'warehouses.name',
            'warehouses.location',
            db.raw('SUM(inventory.available_quantity * products.unit_price) as total_value')
          )
          .join('products', 'inventory.product_id', 'products.id')
          .groupBy('warehouses.id', 'warehouses.name', 'warehouses.location')
      ]);

      res.json({
        success: true,
        data: {
          totalValue: Number(totalValue?.total || 0),
          lowStockItems,
          fastMovingItems,
          slowMovingItems,
          warehouseDistribution
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get customer analytics
  async getCustomerAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        totalCustomers,
        newCustomers,
        topCustomers,
        customerSegments
      ] = await Promise.all([
        db('customers').count('* as count').first(),
        db('customers')
          .count('* as count')
          .where('created_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'))
          .first(),
        db('orders')
          .join('customers', 'orders.customer_id', 'customers.id')
          .select(
            'customers.name',
            'customers.email',
            db.raw('COUNT(orders.id) as orders_count'),
            db.raw('SUM(orders.total_amount) as total_spent')
          )
          .groupBy('customers.id', 'customers.name', 'customers.email')
          .orderBy('total_spent', 'desc')
          .limit(10),
        db('customers')
          .select(
            db.raw('CASE 
              WHEN total_spent >= 10000 THEN "VIP"
              WHEN total_spent >= 5000 THEN "Premium"
              WHEN total_spent >= 1000 THEN "Standard"
              ELSE "Basic"
            END as segment'),
            db.raw('COUNT(*) as count')
          )
          .groupBy('segment')
      ]);

      res.json({
        success: true,
        data: {
          totalCustomers: Number(totalCustomers?.count || 0),
          newCustomers: Number(newCustomers?.count || 0),
          topCustomers,
          customerSegments
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get operational analytics
  async getOperationalAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        deliveryPerformance,
        vehicleUtilization,
        routeEfficiency,
        operationalCosts
      ] = await Promise.all([
        db('shipments')
          .select(
            db.raw('AVG(CASE 
              WHEN delivered_at <= estimated_delivery THEN 1 
              ELSE 0 
            END) * 100 as on_time_rate'),
            db.raw('AVG(TIMESTAMPDIFF(HOUR, shipped_at, delivered_at)) as avg_delivery_time')
          )
          .where('status', 'delivered'),
        db('vehicles')
          .select(
            'status',
            db.raw('COUNT(*) as count'),
            db.raw('AVG(utilization_rate) as avg_utilization')
          )
          .groupBy('status'),
        db('routes')
          .select(
            db.raw('AVG(actual_distance / planned_distance) * 100 as efficiency_rate'),
            db.raw('AVG(actual_time / planned_time) * 100 as time_efficiency')
          ),
        db('expenses')
          .select(
            'category',
            db.raw('SUM(amount) as total_amount')
          )
          .groupBy('category')
      ]);

      res.json({
        success: true,
        data: {
          deliveryPerformance: deliveryPerformance[0] || {},
          vehicleUtilization,
          routeEfficiency: routeEfficiency[0] || {},
          operationalCosts
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

export default analyticsController;
