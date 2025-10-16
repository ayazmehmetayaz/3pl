const express = require('express');
const { hrController } = require('../controllers/hrController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee Management
router.get('/employees', 
  requirePermission('hr.employees.read'), 
  hrController.getEmployees
);

router.post('/employees', 
  requirePermission('hr.employees.create'), 
  hrController.createEmployee
);

router.get('/employees/:id', 
  requirePermission('hr.employees.read'), 
  hrController.getEmployeeById
);

router.put('/employees/:id', 
  requirePermission('hr.employees.update'), 
  hrController.updateEmployee
);

router.delete('/employees/:id', 
  requirePermission('hr.employees.delete'), 
  hrController.deleteEmployee
);

// Job Applications
router.get('/applications', 
  requirePermission('hr.applications.read'), 
  hrController.getApplications
);

router.post('/applications', 
  hrController.createApplication
);

router.get('/applications/:id', 
  requirePermission('hr.applications.read'), 
  hrController.getApplicationById
);

router.patch('/applications/:id/status', 
  requirePermission('hr.applications.update'), 
  hrController.updateApplicationStatus
);

// Shift Management
router.get('/shifts', 
  requirePermission('hr.shifts.read'), 
  hrController.getShifts
);

router.post('/shifts', 
  requirePermission('hr.shifts.create'), 
  hrController.createShift
);

router.get('/shift-requests', 
  requirePermission('hr.shifts.read'), 
  hrController.getShiftRequests
);

router.post('/shift-requests', 
  requirePermission('hr.shifts.request'), 
  hrController.createShiftRequest
);

router.post('/shift-requests/:id/approve', 
  requirePermission('hr.shifts.approve'), 
  hrController.approveShiftRequest
);

router.post('/shift-requests/:id/reject', 
  requirePermission('hr.shifts.reject'), 
  hrController.rejectShiftRequest
);

// Leave Management
router.get('/leaves', 
  requirePermission('hr.leaves.read'), 
  hrController.getLeaveRequests
);

router.post('/leaves', 
  requirePermission('hr.leaves.request'), 
  hrController.createLeaveRequest
);

router.get('/leaves/:id', 
  requirePermission('hr.leaves.read'), 
  hrController.getLeaveRequestById
);

router.post('/leaves/:id/approve', 
  requirePermission('hr.leaves.approve'), 
  hrController.approveLeaveRequest
);

router.post('/leaves/:id/reject', 
  requirePermission('hr.leaves.reject'), 
  hrController.rejectLeaveRequest
);

// Payroll Management
router.get('/payroll', 
  requirePermission('hr.payroll.read'), 
  hrController.getPayrollRecords
);

router.post('/payroll/generate', 
  requirePermission('hr.payroll.generate'), 
  hrController.generatePayroll
);

router.get('/payroll/:id', 
  requirePermission('hr.payroll.read'), 
  hrController.getPayrollRecordById
);

router.get('/payroll/:id/pdf', 
  requirePermission('hr.payroll.read'), 
  hrController.getPayrollPDF
);

// Performance Management
router.get('/performance-reviews', 
  requirePermission('hr.performance.read'), 
  hrController.getPerformanceReviews
);

router.post('/performance-reviews', 
  requirePermission('hr.performance.create'), 
  hrController.createPerformanceReview
);

router.get('/performance-reviews/:id', 
  requirePermission('hr.performance.read'), 
  hrController.getPerformanceReviewById
);

router.put('/performance-reviews/:id', 
  requirePermission('hr.performance.update'), 
  hrController.updatePerformanceReview
);

module.exports = router;
