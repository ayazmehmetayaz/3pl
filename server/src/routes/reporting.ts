import { Router } from 'express';
import { reportingController } from '@/controllers/reportingController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Dashboard Routes
/**
 * @route GET /api/v1/reporting/dashboard
 * @desc Get dashboard data
 * @access Private (Admin)
 */
router.get('/dashboard', authorize(['admin']), reportingController.getDashboard);

/**
 * @route GET /api/v1/reporting/dashboard/warehouse
 * @desc Get warehouse dashboard
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/dashboard/warehouse', authorize(['admin', 'warehouse_manager']), reportingController.getWarehouseDashboard);

/**
 * @route GET /api/v1/reporting/dashboard/transport
 * @desc Get transport dashboard
 * @access Private (Transport Manager, Admin)
 */
router.get('/dashboard/transport', authorize(['admin', 'transport_manager']), reportingController.getTransportDashboard);

/**
 * @route GET /api/v1/reporting/dashboard/accounting
 * @desc Get accounting dashboard
 * @access Private (Accounting Manager, Admin)
 */
router.get('/dashboard/accounting', authorize(['admin', 'accounting_manager']), reportingController.getAccountingDashboard);

// Warehouse Reports
/**
 * @route GET /api/v1/reporting/warehouse/inventory-report
 * @desc Get inventory report
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouse/inventory-report', authorize(['admin', 'warehouse_manager']), reportingController.getInventoryReport);

/**
 * @route GET /api/v1/reporting/warehouse/movement-report
 * @desc Get inventory movement report
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouse/movement-report', authorize(['admin', 'warehouse_manager']), reportingController.getInventoryMovementReport);

/**
 * @route GET /api/v1/reporting/warehouse/cycle-count-report
 * @desc Get cycle count report
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouse/cycle-count-report', authorize(['admin', 'warehouse_manager']), reportingController.getCycleCountReport);

/**
 * @route GET /api/v1/reporting/warehouse/performance-report
 * @desc Get warehouse performance report
 * @access Private (Warehouse Manager, Admin)
 */
router.get('/warehouse/performance-report', authorize(['admin', 'warehouse_manager']), reportingController.getWarehousePerformanceReport);

// Transport Reports
/**
 * @route GET /api/v1/reporting/transport/shipment-report
 * @desc Get shipment report
 * @access Private (Transport Manager, Admin)
 */
router.get('/transport/shipment-report', authorize(['admin', 'transport_manager']), reportingController.getShipmentReport);

/**
 * @route GET /api/v1/reporting/transport/vehicle-utilization-report
 * @desc Get vehicle utilization report
 * @access Private (Transport Manager, Admin)
 */
router.get('/transport/vehicle-utilization-report', authorize(['admin', 'transport_manager']), reportingController.getVehicleUtilizationReport);

/**
 * @route GET /api/v1/reporting/transport/driver-performance-report
 * @desc Get driver performance report
 * @access Private (Transport Manager, Admin)
 */
router.get('/transport/driver-performance-report', authorize(['admin', 'transport_manager']), reportingController.getDriverPerformanceReport);

/**
 * @route GET /api/v1/reporting/transport/fuel-consumption-report
 * @desc Get fuel consumption report
 * @access Private (Transport Manager, Admin)
 */
router.get('/transport/fuel-consumption-report', authorize(['admin', 'transport_manager']), reportingController.getFuelConsumptionReport);

/**
 * @route GET /api/v1/reporting/transport/delivery-performance-report
 * @desc Get delivery performance report
 * @access Private (Transport Manager, Admin)
 */
router.get('/transport/delivery-performance-report', authorize(['admin', 'transport_manager']), reportingController.getDeliveryPerformanceReport);

// Financial Reports
/**
 * @route GET /api/v1/reporting/financial/revenue-report
 * @desc Get revenue report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/financial/revenue-report', authorize(['admin', 'accounting_manager']), reportingController.getRevenueReport);

/**
 * @route GET /api/v1/reporting/financial/cost-analysis-report
 * @desc Get cost analysis report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/financial/cost-analysis-report', authorize(['admin', 'accounting_manager']), reportingController.getCostAnalysisReport);

/**
 * @route GET /api/v1/reporting/financial/profitability-report
 * @desc Get profitability report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/financial/profitability-report', authorize(['admin', 'accounting_manager']), reportingController.getProfitabilityReport);

/**
 * @route GET /api/v1/reporting/financial/customer-profitability-report
 * @desc Get customer profitability report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/financial/customer-profitability-report', authorize(['admin', 'accounting_manager']), reportingController.getCustomerProfitabilityReport);

// Sales Reports
/**
 * @route GET /api/v1/reporting/sales/sales-report
 * @desc Get sales report
 * @access Private (Marketing Manager, Admin)
 */
router.get('/sales/sales-report', authorize(['admin', 'marketing_manager']), reportingController.getSalesReport);

/**
 * @route GET /api/v1/reporting/sales/customer-analysis-report
 * @desc Get customer analysis report
 * @access Private (Marketing Manager, Admin)
 */
router.get('/sales/customer-analysis-report', authorize(['admin', 'marketing_manager']), reportingController.getCustomerAnalysisReport);

/**
 * @route GET /api/v1/reporting/sales/quotation-report
 * @desc Get quotation report
 * @access Private (Marketing Manager, Admin)
 */
router.get('/sales/quotation-report', authorize(['admin', 'marketing_manager']), reportingController.getQuotationReport);

// HR Reports
/**
 * @route GET /api/v1/reporting/hr/employee-report
 * @desc Get employee report
 * @access Private (HR Manager, Admin)
 */
router.get('/hr/employee-report', authorize(['admin', 'hr_manager']), reportingController.getEmployeeReport);

/**
 * @route GET /api/v1/reporting/hr/attendance-report
 * @desc Get attendance report
 * @access Private (HR Manager, Admin)
 */
router.get('/hr/attendance-report', authorize(['admin', 'hr_manager']), reportingController.getAttendanceReport);

/**
 * @route GET /api/v1/reporting/hr/payroll-report
 * @desc Get payroll report
 * @access Private (HR Manager, Admin)
 */
router.get('/hr/payroll-report', authorize(['admin', 'hr_manager']), reportingController.getPayrollReport);

/**
 * @route GET /api/v1/reporting/hr/performance-report
 * @desc Get performance report
 * @access Private (HR Manager, Admin)
 */
router.get('/hr/performance-report', authorize(['admin', 'hr_manager']), reportingController.getPerformanceReport);

// Custom Reports
/**
 * @route GET /api/v1/reporting/custom-reports
 * @desc Get custom reports
 * @access Private (Admin)
 */
router.get('/custom-reports', authorize(['admin']), reportingController.getCustomReports);

/**
 * @route POST /api/v1/reporting/custom-reports
 * @desc Create custom report
 * @access Private (Admin)
 */
router.post('/custom-reports', authorize(['admin']), reportingController.createCustomReport);

/**
 * @route GET /api/v1/reporting/custom-reports/:id
 * @desc Get custom report by ID
 * @access Private (Admin)
 */
router.get('/custom-reports/:id', authorize(['admin']), reportingController.getCustomReportById);

/**
 * @route PUT /api/v1/reporting/custom-reports/:id
 * @desc Update custom report
 * @access Private (Admin)
 */
router.put('/custom-reports/:id', authorize(['admin']), reportingController.updateCustomReport);

/**
 * @route DELETE /api/v1/reporting/custom-reports/:id
 * @desc Delete custom report
 * @access Private (Admin)
 */
router.delete('/custom-reports/:id', authorize(['admin']), reportingController.deleteCustomReport);

/**
 * @route POST /api/v1/reporting/custom-reports/:id/execute
 * @desc Execute custom report
 * @access Private (Admin)
 */
router.post('/custom-reports/:id/execute', authorize(['admin']), reportingController.executeCustomReport);

export default router;
