const express = require('express');
const { reportingController } = require('../controllers/reportingController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard Routes
router.get('/dashboard', 
  requirePermission('reporting.dashboard.read'), 
  reportingController.getDashboard
);

router.get('/dashboard/warehouse', 
  requirePermission('reporting.dashboard.read'), 
  reportingController.getWarehouseDashboard
);

router.get('/dashboard/transport', 
  requirePermission('reporting.dashboard.read'), 
  reportingController.getTransportDashboard
);

router.get('/dashboard/accounting', 
  requirePermission('reporting.dashboard.read'), 
  reportingController.getAccountingDashboard
);

// Warehouse Reports
router.get('/warehouse/inventory', 
  requirePermission('reporting.warehouse.read'), 
  reportingController.getInventoryReport
);

router.get('/warehouse/inventory-movements', 
  requirePermission('reporting.warehouse.read'), 
  reportingController.getInventoryMovementReport
);

router.get('/warehouse/cycle-count', 
  requirePermission('reporting.warehouse.read'), 
  reportingController.getCycleCountReport
);

router.get('/warehouse/performance', 
  requirePermission('reporting.warehouse.read'), 
  reportingController.getWarehousePerformanceReport
);

// Transport Reports
router.get('/transport/shipments', 
  requirePermission('reporting.transport.read'), 
  reportingController.getShipmentReport
);

router.get('/transport/vehicle-utilization', 
  requirePermission('reporting.transport.read'), 
  reportingController.getVehicleUtilizationReport
);

router.get('/transport/driver-performance', 
  requirePermission('reporting.transport.read'), 
  reportingController.getDriverPerformanceReport
);

router.get('/transport/fuel-consumption', 
  requirePermission('reporting.transport.read'), 
  reportingController.getFuelConsumptionReport
);

router.get('/transport/delivery-performance', 
  requirePermission('reporting.transport.read'), 
  reportingController.getDeliveryPerformanceReport
);

// Financial Reports
router.get('/financial/revenue', 
  requirePermission('reporting.financial.read'), 
  reportingController.getRevenueReport
);

router.get('/financial/cost-analysis', 
  requirePermission('reporting.financial.read'), 
  reportingController.getCostAnalysisReport
);

router.get('/financial/profitability', 
  requirePermission('reporting.financial.read'), 
  reportingController.getProfitabilityReport
);

router.get('/financial/customer-profitability', 
  requirePermission('reporting.financial.read'), 
  reportingController.getCustomerProfitabilityReport
);

// Sales Reports
router.get('/sales/report', 
  requirePermission('reporting.sales.read'), 
  reportingController.getSalesReport
);

router.get('/sales/customer-analysis', 
  requirePermission('reporting.sales.read'), 
  reportingController.getCustomerAnalysisReport
);

router.get('/sales/quotations', 
  requirePermission('reporting.sales.read'), 
  reportingController.getQuotationReport
);

// HR Reports
router.get('/hr/employees', 
  requirePermission('reporting.hr.read'), 
  reportingController.getEmployeeReport
);

router.get('/hr/attendance', 
  requirePermission('reporting.hr.read'), 
  reportingController.getAttendanceReport
);

router.get('/hr/payroll', 
  requirePermission('reporting.hr.read'), 
  reportingController.getPayrollReport
);

router.get('/hr/performance', 
  requirePermission('reporting.hr.read'), 
  reportingController.getPerformanceReport
);

// Custom Reports
router.get('/custom', 
  requirePermission('reporting.custom.read'), 
  reportingController.getCustomReports
);

router.post('/custom', 
  requirePermission('reporting.custom.create'), 
  reportingController.createCustomReport
);

router.get('/custom/:id', 
  requirePermission('reporting.custom.read'), 
  reportingController.getCustomReportById
);

router.put('/custom/:id', 
  requirePermission('reporting.custom.update'), 
  reportingController.updateCustomReport
);

router.delete('/custom/:id', 
  requirePermission('reporting.custom.delete'), 
  reportingController.deleteCustomReport
);

router.post('/custom/:id/execute', 
  requirePermission('reporting.custom.execute'), 
  reportingController.executeCustomReport
);

module.exports = router;