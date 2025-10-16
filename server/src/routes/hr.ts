import { Router } from 'express';
import { hrController } from '@/controllers/hrController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Employee Management Routes
/**
 * @route GET /api/v1/hr/employees
 * @desc Get all employees
 * @access Private (HR Manager, Admin)
 */
router.get('/employees', authorize(['admin', 'hr_manager']), hrController.getEmployees);

/**
 * @route POST /api/v1/hr/employees
 * @desc Create new employee
 * @access Private (HR Manager, Admin)
 */
router.post('/employees', authorize(['admin', 'hr_manager']), hrController.createEmployee);

/**
 * @route GET /api/v1/hr/employees/:id
 * @desc Get employee by ID
 * @access Private (HR Manager, Admin, Self)
 */
router.get('/employees/:id', authorize(['admin', 'hr_manager'], true), hrController.getEmployeeById);

/**
 * @route PUT /api/v1/hr/employees/:id
 * @desc Update employee
 * @access Private (HR Manager, Admin, Self)
 */
router.put('/employees/:id', authorize(['admin', 'hr_manager'], true), hrController.updateEmployee);

/**
 * @route DELETE /api/v1/hr/employees/:id
 * @desc Delete employee
 * @access Private (HR Manager, Admin)
 */
router.delete('/employees/:id', authorize(['admin', 'hr_manager']), hrController.deleteEmployee);

// Job Applications Routes
/**
 * @route GET /api/v1/hr/applications
 * @desc Get all job applications
 * @access Private (HR Manager, Admin)
 */
router.get('/applications', authorize(['admin', 'hr_manager']), hrController.getApplications);

/**
 * @route POST /api/v1/hr/applications
 * @desc Create job application
 * @access Public
 */
router.post('/applications', hrController.createApplication);

/**
 * @route GET /api/v1/hr/applications/:id
 * @desc Get application by ID
 * @access Private (HR Manager, Admin)
 */
router.get('/applications/:id', authorize(['admin', 'hr_manager']), hrController.getApplicationById);

/**
 * @route PUT /api/v1/hr/applications/:id/status
 * @desc Update application status
 * @access Private (HR Manager, Admin)
 */
router.put('/applications/:id/status', authorize(['admin', 'hr_manager']), hrController.updateApplicationStatus);

// Shift Management Routes
/**
 * @route GET /api/v1/hr/shifts
 * @desc Get shifts
 * @access Private (HR Manager, Admin)
 */
router.get('/shifts', authorize(['admin', 'hr_manager']), hrController.getShifts);

/**
 * @route POST /api/v1/hr/shifts
 * @desc Create shift
 * @access Private (HR Manager, Admin)
 */
router.post('/shifts', authorize(['admin', 'hr_manager']), hrController.createShift);

/**
 * @route GET /api/v1/hr/shifts/requests
 * @desc Get shift requests
 * @access Private (HR Manager, Admin)
 */
router.get('/shifts/requests', authorize(['admin', 'hr_manager']), hrController.getShiftRequests);

/**
 * @route POST /api/v1/hr/shifts/requests
 * @desc Create shift request
 * @access Private (Employee)
 */
router.post('/shifts/requests', authorize(['admin', 'hr_manager'], true), hrController.createShiftRequest);

/**
 * @route PUT /api/v1/hr/shifts/requests/:id/approve
 * @desc Approve shift request
 * @access Private (HR Manager, Admin)
 */
router.put('/shifts/requests/:id/approve', authorize(['admin', 'hr_manager']), hrController.approveShiftRequest);

/**
 * @route PUT /api/v1/hr/shifts/requests/:id/reject
 * @desc Reject shift request
 * @access Private (HR Manager, Admin)
 */
router.put('/shifts/requests/:id/reject', authorize(['admin', 'hr_manager']), hrController.rejectShiftRequest);

// Leave Management Routes
/**
 * @route GET /api/v1/hr/leaves
 * @desc Get leave requests
 * @access Private (HR Manager, Admin)
 */
router.get('/leaves', authorize(['admin', 'hr_manager']), hrController.getLeaveRequests);

/**
 * @route POST /api/v1/hr/leaves
 * @desc Create leave request
 * @access Private (Employee)
 */
router.post('/leaves', authorize(['admin', 'hr_manager'], true), hrController.createLeaveRequest);

/**
 * @route GET /api/v1/hr/leaves/:id
 * @desc Get leave request by ID
 * @access Private (HR Manager, Admin, Self)
 */
router.get('/leaves/:id', authorize(['admin', 'hr_manager'], true), hrController.getLeaveRequestById);

/**
 * @route PUT /api/v1/hr/leaves/:id/approve
 * @desc Approve leave request
 * @access Private (HR Manager, Admin)
 */
router.put('/leaves/:id/approve', authorize(['admin', 'hr_manager']), hrController.approveLeaveRequest);

/**
 * @route PUT /api/v1/hr/leaves/:id/reject
 * @desc Reject leave request
 * @access Private (HR Manager, Admin)
 */
router.put('/leaves/:id/reject', authorize(['admin', 'hr_manager']), hrController.rejectLeaveRequest);

// Payroll Management Routes
/**
 * @route GET /api/v1/hr/payroll
 * @desc Get payroll records
 * @access Private (HR Manager, Admin)
 */
router.get('/payroll', authorize(['admin', 'hr_manager']), hrController.getPayrollRecords);

/**
 * @route POST /api/v1/hr/payroll/generate
 * @desc Generate payroll
 * @access Private (HR Manager, Admin)
 */
router.post('/payroll/generate', authorize(['admin', 'hr_manager']), hrController.generatePayroll);

/**
 * @route GET /api/v1/hr/payroll/:id
 * @desc Get payroll record by ID
 * @access Private (HR Manager, Admin, Self)
 */
router.get('/payroll/:id', authorize(['admin', 'hr_manager'], true), hrController.getPayrollRecordById);

/**
 * @route GET /api/v1/hr/payroll/:id/pdf
 * @desc Get payroll PDF
 * @access Private (HR Manager, Admin, Self)
 */
router.get('/payroll/:id/pdf', authorize(['admin', 'hr_manager'], true), hrController.getPayrollPDF);

// Performance Management Routes
/**
 * @route GET /api/v1/hr/performance-reviews
 * @desc Get performance reviews
 * @access Private (HR Manager, Admin)
 */
router.get('/performance-reviews', authorize(['admin', 'hr_manager']), hrController.getPerformanceReviews);

/**
 * @route POST /api/v1/hr/performance-reviews
 * @desc Create performance review
 * @access Private (HR Manager, Admin)
 */
router.post('/performance-reviews', authorize(['admin', 'hr_manager']), hrController.createPerformanceReview);

/**
 * @route GET /api/v1/hr/performance-reviews/:id
 * @desc Get performance review by ID
 * @access Private (HR Manager, Admin, Self)
 */
router.get('/performance-reviews/:id', authorize(['admin', 'hr_manager'], true), hrController.getPerformanceReviewById);

/**
 * @route PUT /api/v1/hr/performance-reviews/:id
 * @desc Update performance review
 * @access Private (HR Manager, Admin)
 */
router.put('/performance-reviews/:id', authorize(['admin', 'hr_manager']), hrController.updatePerformanceReview);

export default router;
