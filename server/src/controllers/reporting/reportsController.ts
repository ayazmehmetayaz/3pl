import { Request, Response, NextFunction } from 'express';
import { db } from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const reportsController = {
  // Generate sales report
  async generateSalesReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;

      if (!startDate || !endDate) {
        throw new CustomError('Start date and end date are required', 400);
      }

      const salesReport = await db('orders')
        .join('customers', 'orders.customer_id', 'customers.id')
        .select(
          'orders.id',
          'orders.order_number',
          'customers.name as customer_name',
          'orders.total_amount',
          'orders.status',
          'orders.created_at',
          'orders.updated_at'
        )
        .whereBetween('orders.created_at', [startDate, endDate])
        .orderBy('orders.created_at', 'desc');

      const summary = await db('orders')
        .select(
          db.raw('COUNT(*) as total_orders'),
          db.raw('SUM(total_amount) as total_revenue'),
          db.raw('AVG(total_amount) as average_order_value'),
          db.raw('COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_orders')
        )
        .whereBetween('created_at', [startDate, endDate])
        .first();

      if (format === 'csv') {
        // Generate CSV format
        const csvData = salesReport.map(order => ({
          'Order ID': order.id,
          'Order Number': order.order_number,
          'Customer': order.customer_name,
          'Amount': order.total_amount,
          'Status': order.status,
          'Created Date': order.created_at
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
        res.send(csvData);
      } else {
        res.json({
          success: true,
          data: {
            summary,
            orders: salesReport
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Generate inventory report
  async generateInventoryReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { warehouseId, lowStockOnly = false, format = 'json' } = req.query;

      let query = db('inventory')
        .join('products', 'inventory.product_id', 'products.id')
        .join('warehouses', 'inventory.warehouse_id', 'warehouses.id')
        .select(
          'products.sku',
          'products.name as product_name',
          'products.category',
          'products.unit_price',
          'inventory.available_quantity',
          'inventory.reserved_quantity',
          'inventory.reorder_level',
          'warehouses.name as warehouse_name',
          'warehouses.location',
          db.raw('(inventory.available_quantity * products.unit_price) as total_value')
        );

      if (warehouseId) {
        query = query.where('inventory.warehouse_id', warehouseId);
      }

      if (lowStockOnly === 'true') {
        query = query.where('inventory.available_quantity', '<', 'inventory.reorder_level');
      }

      const inventoryData = await query.orderBy('products.name');

      const summary = await db('inventory')
        .join('products', 'inventory.product_id', 'products.id')
        .select(
          db.raw('COUNT(DISTINCT inventory.product_id) as total_products'),
          db.raw('SUM(inventory.available_quantity) as total_quantity'),
          db.raw('SUM(inventory.available_quantity * products.unit_price) as total_value'),
          db.raw('COUNT(CASE WHEN inventory.available_quantity < inventory.reorder_level THEN 1 END) as low_stock_items')
        )
        .first();

      if (format === 'csv') {
        const csvData = inventoryData.map(item => ({
          'SKU': item.sku,
          'Product Name': item.product_name,
          'Category': item.category,
          'Warehouse': item.warehouse_name,
          'Location': item.location,
          'Available Qty': item.available_quantity,
          'Reserved Qty': item.reserved_quantity,
          'Reorder Level': item.reorder_level,
          'Unit Price': item.unit_price,
          'Total Value': item.total_value
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.csv');
        res.send(csvData);
      } else {
        res.json({
          success: true,
          data: {
            summary,
            inventory: inventoryData
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Generate financial report
  async generateFinancialReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;

      if (!startDate || !endDate) {
        throw new CustomError('Start date and end date are required', 400);
      }

      const [
        revenueData,
        expenseData,
        profitLoss
      ] = await Promise.all([
        db('invoices')
          .select(
            db.raw('DATE(created_at) as date'),
            db.raw('SUM(total_amount) as daily_revenue'),
            db.raw('COUNT(*) as invoice_count')
          )
          .where('status', 'paid')
          .whereBetween('created_at', [startDate, endDate])
          .groupBy(db.raw('DATE(created_at)'))
          .orderBy('date'),
        db('expenses')
          .select(
            'category',
            db.raw('SUM(amount) as total_amount'),
            db.raw('COUNT(*) as expense_count')
          )
          .whereBetween('created_at', [startDate, endDate])
          .groupBy('category'),
        db('invoices')
          .select(
            db.raw('SUM(CASE WHEN status = "paid" THEN total_amount ELSE 0 END) as total_revenue'),
            db.raw('SUM(CASE WHEN status = "pending" THEN total_amount ELSE 0 END) as pending_revenue')
          )
          .whereBetween('created_at', [startDate, endDate])
          .first()
      ]);

      const totalExpenses = await db('expenses')
        .sum('amount as total')
        .whereBetween('created_at', [startDate, endDate])
        .first();

      const financialSummary = {
        totalRevenue: Number(profitLoss?.total_revenue || 0),
        pendingRevenue: Number(profitLoss?.pending_revenue || 0),
        totalExpenses: Number(totalExpenses?.total || 0),
        netProfit: Number(profitLoss?.total_revenue || 0) - Number(totalExpenses?.total || 0),
        profitMargin: Number(profitLoss?.total_revenue || 0) > 0 
          ? ((Number(profitLoss?.total_revenue || 0) - Number(totalExpenses?.total || 0)) / Number(profitLoss?.total_revenue || 0)) * 100 
          : 0
      };

      if (format === 'csv') {
        const csvData = revenueData.map(item => ({
          'Date': item.date,
          'Revenue': item.daily_revenue,
          'Invoice Count': item.invoice_count
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=financial-report.csv');
        res.send(csvData);
      } else {
        res.json({
          success: true,
          data: {
            summary: financialSummary,
            revenueData,
            expenseData
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Generate operational report
  async generateOperationalReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;

      if (!startDate || !endDate) {
        throw new CustomError('Start date and end date are required', 400);
      }

      const [
        deliveryPerformance,
        vehicleUtilization,
        warehouseEfficiency
      ] = await Promise.all([
        db('shipments')
          .select(
            'status',
            db.raw('COUNT(*) as count'),
            db.raw('AVG(CASE WHEN delivered_at <= estimated_delivery THEN 1 ELSE 0 END) * 100 as on_time_rate'),
            db.raw('AVG(TIMESTAMPDIFF(HOUR, shipped_at, delivered_at)) as avg_delivery_time')
          )
          .whereBetween('created_at', [startDate, endDate])
          .groupBy('status'),
        db('vehicles')
          .select(
            'plate_number',
            'status',
            'utilization_rate',
            db.raw('COUNT(shipments.id) as total_shipments'),
            db.raw('SUM(CASE WHEN shipments.status = "delivered" THEN 1 ELSE 0 END) as completed_shipments')
          )
          .leftJoin('shipments', 'vehicles.id', 'shipments.vehicle_id')
          .whereBetween('shipments.created_at', [startDate, endDate])
          .groupBy('vehicles.id', 'vehicles.plate_number', 'vehicles.status', 'vehicles.utilization_rate'),
        db('warehouses')
          .select(
            'warehouses.name',
            'warehouses.location',
            'warehouses.utilization_rate',
            db.raw('COUNT(inventory.id) as total_products'),
            db.raw('SUM(inventory.available_quantity) as total_quantity')
          )
          .leftJoin('inventory', 'warehouses.id', 'inventory.warehouse_id')
          .groupBy('warehouses.id', 'warehouses.name', 'warehouses.location', 'warehouses.utilization_rate')
      ]);

      if (format === 'csv') {
        const csvData = deliveryPerformance.map(item => ({
          'Status': item.status,
          'Count': item.count,
          'On Time Rate': item.on_time_rate,
          'Avg Delivery Time': item.avg_delivery_time
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=operational-report.csv');
        res.send(csvData);
      } else {
        res.json({
          success: true,
          data: {
            deliveryPerformance,
            vehicleUtilization,
            warehouseEfficiency
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

export default reportsController;
