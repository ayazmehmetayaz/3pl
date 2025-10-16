import { Router } from 'express';
import { accountingController } from '@/controllers/accountingController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Invoice Management Routes
/**
 * @route GET /api/v1/accounting/invoices
 * @desc Get all invoices
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.get('/invoices', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.getInvoices);

/**
 * @route POST /api/v1/accounting/invoices
 * @desc Create new invoice
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.post('/invoices', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.createInvoice);

/**
 * @route GET /api/v1/accounting/invoices/:id
 * @desc Get invoice by ID
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.get('/invoices/:id', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.getInvoiceById);

/**
 * @route PUT /api/v1/accounting/invoices/:id
 * @desc Update invoice
 * @access Private (Accounting Manager, Admin)
 */
router.put('/invoices/:id', authorize(['admin', 'accounting_manager']), accountingController.updateInvoice);

/**
 * @route POST /api/v1/accounting/invoices/:id/send
 * @desc Send invoice to customer
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.post('/invoices/:id/send', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.sendInvoice);

/**
 * @route POST /api/v1/accounting/invoices/:id/mark-paid
 * @desc Mark invoice as paid
 * @access Private (Accounting Manager, Admin)
 */
router.post('/invoices/:id/mark-paid', authorize(['admin', 'accounting_manager']), accountingController.markInvoicePaid);

// Payment Management Routes
/**
 * @route GET /api/v1/accounting/payments
 * @desc Get all payments
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.get('/payments', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.getPayments);

/**
 * @route POST /api/v1/accounting/payments
 * @desc Create new payment
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.post('/payments', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.createPayment);

/**
 * @route GET /api/v1/accounting/payments/:id
 * @desc Get payment by ID
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.get('/payments/:id', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.getPaymentById);

/**
 * @route POST /api/v1/accounting/payments/:id/allocate
 * @desc Allocate payment to invoices
 * @access Private (Accounting Manager, Accounting Clerk, Admin)
 */
router.post('/payments/:id/allocate', authorize(['admin', 'accounting_manager', 'accounting_clerk']), accountingController.allocatePayment);

// Chart of Accounts Routes
/**
 * @route GET /api/v1/accounting/chart-of-accounts
 * @desc Get chart of accounts
 * @access Private (Accounting Manager, Admin)
 */
router.get('/chart-of-accounts', authorize(['admin', 'accounting_manager']), accountingController.getChartOfAccounts);

/**
 * @route POST /api/v1/accounting/chart-of-accounts
 * @desc Create new account
 * @access Private (Accounting Manager, Admin)
 */
router.post('/chart-of-accounts', authorize(['admin', 'accounting_manager']), accountingController.createAccount);

/**
 * @route PUT /api/v1/accounting/chart-of-accounts/:id
 * @desc Update account
 * @access Private (Accounting Manager, Admin)
 */
router.put('/chart-of-accounts/:id', authorize(['admin', 'accounting_manager']), accountingController.updateAccount);

// Journal Entries Routes
/**
 * @route GET /api/v1/accounting/journal-entries
 * @desc Get journal entries
 * @access Private (Accounting Manager, Admin)
 */
router.get('/journal-entries', authorize(['admin', 'accounting_manager']), accountingController.getJournalEntries);

/**
 * @route POST /api/v1/accounting/journal-entries
 * @desc Create journal entry
 * @access Private (Accounting Manager, Admin)
 */
router.post('/journal-entries', authorize(['admin', 'accounting_manager']), accountingController.createJournalEntry);

/**
 * @route POST /api/v1/accounting/journal-entries/:id/post
 * @desc Post journal entry
 * @access Private (Accounting Manager, Admin)
 */
router.post('/journal-entries/:id/post', authorize(['admin', 'accounting_manager']), accountingController.postJournalEntry);

// Financial Reports Routes
/**
 * @route GET /api/v1/accounting/reports/balance-sheet
 * @desc Get balance sheet
 * @access Private (Accounting Manager, Admin)
 */
router.get('/reports/balance-sheet', authorize(['admin', 'accounting_manager']), accountingController.getBalanceSheet);

/**
 * @route GET /api/v1/accounting/reports/income-statement
 * @desc Get income statement
 * @access Private (Accounting Manager, Admin)
 */
router.get('/reports/income-statement', authorize(['admin', 'accounting_manager']), accountingController.getIncomeStatement);

/**
 * @route GET /api/v1/accounting/reports/cash-flow
 * @desc Get cash flow statement
 * @access Private (Accounting Manager, Admin)
 */
router.get('/reports/cash-flow', authorize(['admin', 'accounting_manager']), accountingController.getCashFlowStatement);

/**
 * @route GET /api/v1/accounting/reports/aged-receivables
 * @desc Get aged receivables report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/reports/aged-receivables', authorize(['admin', 'accounting_manager']), accountingController.getAgedReceivables);

/**
 * @route GET /api/v1/accounting/reports/aged-payables
 * @desc Get aged payables report
 * @access Private (Accounting Manager, Admin)
 */
router.get('/reports/aged-payables', authorize(['admin', 'accounting_manager']), accountingController.getAgedPayables);

export default router;
