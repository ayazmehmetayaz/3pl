import { Request, Response, NextFunction } from 'express';
import { db } from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const dashboardController = {
  // Get main dashboard metrics
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Get key metrics
      const [
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalVehicles,
        pendingOrders,
        inTransitShipments,
        lowStockItems,
        overdueInvoices
      ] = await Promise.all([
        db('orders').count('* as count').first(),
        db('invoices').sum('total_amount as total').where('status', 'paid').first(),
        db('customers').count('* as count').where('status', 'active').first(),
        db('vehicles').count('* as count').where('status', 'active').first(),
        db('orders').count('* as count').where('status', 'pending').first(),
        db('shipments').count('* as count').where('status', 'in_transit').first(),
        db('inventory').count('* as count').where('available_quantity', '<', 10).first(),
        db('invoices').count('* as count').where('status', 'overdue').first()
      ]);

      const dashboard = {
        totalOrders: Number(totalOrders?.count || 0),
        totalRevenue: Number(totalRevenue?.total || 0),
        totalCustomers: Number(totalCustomers?.count || 0),
        totalVehicles: Number(totalVehicles?.count || 0),
        pendingOrders: Number(pendingOrders?.count || 0),
        inTransitShipments: Number(inTransitShipments?.count || 0),
        lowStockItems: Number(lowStockItems?.count || 0),
        overdueInvoices: Number(overdueInvoices?.count || 0)
      };

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      next(error);
    }
  },

  // Get WMS dashboard metrics
  async getWMSDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        totalInventory,
        totalWarehouses,
        pendingReceipts,
        pendingShipments,
        lowStockCount,
        warehouseUtilization
      ] = await Promise.all([
        db('inventory').sum('available_quantity as total').first(),
        db('warehouses').count('* as count').where('status', 'active').first(),
        db('receipts').count('* as count').where('status', 'pending').first(),
        db('shipments').count('* as count').where('status', 'pending').first(),
        db('inventory').count('* as count').where('available_quantity', '<', 10).first(),
        db('warehouses').avg('utilization_rate as avg').first()
      ]);

      const wmsDashboard = {
        totalInventory: Number(totalInventory?.total || 0),
        totalWarehouses: Number(totalWarehouses?.count || 0),
        pendingReceipts: Number(pendingReceipts?.count || 0),
        pendingShipments: Number(pendingShipments?.count || 0),
        lowStockCount: Number(lowStockCount?.count || 0),
        warehouseUtilization: Number(warehouseUtilization?.avg || 0)
      };

      res.json({
        success: true,
        data: wmsDashboard
      });
    } catch (error) {
      next(error);
    }
  },

  // Get TMS dashboard metrics
  async getTMSDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        activeVehicles,
        totalShipments,
        pendingDeliveries,
        completedDeliveries,
        onTimeDeliveryRate,
        averageDeliveryTime
      ] = await Promise.all([
        db('vehicles').count('* as count').where('status', 'active').first(),
        db('shipments').count('* as count').first(),
        db('shipments').count('* as count').where('status', 'pending').first(),
        db('shipments').count('* as count').where('status', 'delivered').first(),
        db('shipments').avg('delivery_time as avg').first(),
        db('shipments').avg('actual_delivery_time as avg').first()
      ]);

      const tmsDashboard = {
        activeVehicles: Number(activeVehicles?.count || 0),
        totalShipments: Number(totalShipments?.count || 0),
        pendingDeliveries: Number(pendingDeliveries?.count || 0),
        completedDeliveries: Number(completedDeliveries?.count || 0),
        onTimeDeliveryRate: Number(onTimeDeliveryRate?.avg || 0),
        averageDeliveryTime: Number(averageDeliveryTime?.avg || 0)
      };

      res.json({
        success: true,
        data: tmsDashboard
      });
    } catch (error) {
      next(error);
    }
  },

  // Get Accounting dashboard metrics
  async getAccountingDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [
        totalRevenue,
        totalExpenses,
        pendingInvoices,
        overdueInvoices,
        profitMargin,
        cashFlow
      ] = await Promise.all([
        db('invoices').sum('total_amount as total').where('status', 'paid').first(),
        db('expenses').sum('amount as total').first(),
        db('invoices').count('* as count').where('status', 'pending').first(),
        db('invoices').count('* as count').where('status', 'overdue').first(),
        db('invoices').avg('profit_margin as avg').first(),
        db('transactions').sum('amount as total').where('type', 'income').first()
      ]);

      const accountingDashboard = {
        totalRevenue: Number(totalRevenue?.total || 0),
        totalExpenses: Number(totalExpenses?.total || 0),
        pendingInvoices: Number(pendingInvoices?.count || 0),
        overdueInvoices: Number(overdueInvoices?.count || 0),
        profitMargin: Number(profitMargin?.avg || 0),
        cashFlow: Number(cashFlow?.total || 0)
      };

      res.json({
        success: true,
        data: accountingDashboard
      });
    } catch (error) {
      next(error);
    }
  }
};

export default dashboardController;
