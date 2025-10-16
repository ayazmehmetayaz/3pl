const express = require('express');
const { accountingController } = require('../controllers/accountingController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Invoice Management
router.get('/invoices', 
  requirePermission('accounting.invoices.read'), 
  accountingController.getInvoices
);

router.post('/invoices', 
  requirePermission('accounting.invoices.create'), 
  accountingController.createInvoice
);

router.get('/invoices/:id', 
  requirePermission('accounting.invoices.read'), 
  accountingController.getInvoiceById
);

router.put('/invoices/:id', 
  requirePermission('accounting.invoices.update'), 
  accountingController.updateInvoice
);

router.post('/invoices/:id/send', 
  requirePermission('accounting.invoices.send'), 
  accountingController.sendInvoice
);

router.post('/invoices/:id/mark-paid', 
  requirePermission('accounting.invoices.mark_paid'), 
  accountingController.markInvoicePaid
);

// Payment Management
router.get('/payments', 
  requirePermission('accounting.payments.read'), 
  accountingController.getPayments
);

router.post('/payments', 
  requirePermission('accounting.payments.create'), 
  accountingController.createPayment
);

router.get('/payments/:id', 
  requirePermission('accounting.payments.read'), 
  accountingController.getPaymentById
);

router.post('/payments/:id/allocate', 
  requirePermission('accounting.payments.allocate'), 
  accountingController.allocatePayment
);

// Chart of Accounts
router.get('/chart-of-accounts', 
  requirePermission('accounting.accounts.read'), 
  accountingController.getChartOfAccounts
);

router.post('/chart-of-accounts', 
  requirePermission('accounting.accounts.create'), 
  accountingController.createAccount
);

router.put('/chart-of-accounts/:id', 
  requirePermission('accounting.accounts.update'), 
  accountingController.updateAccount
);

// Journal Entries
router.get('/journal-entries', 
  requirePermission('accounting.journal.read'), 
  accountingController.getJournalEntries
);

router.post('/journal-entries', 
  requirePermission('accounting.journal.create'), 
  accountingController.createJournalEntry
);

router.post('/journal-entries/:id/post', 
  requirePermission('accounting.journal.post'), 
  accountingController.postJournalEntry
);

// Financial Reports
router.get('/reports/balance-sheet', 
  requirePermission('accounting.reports.read'), 
  accountingController.getBalanceSheet
);

router.get('/reports/income-statement', 
  requirePermission('accounting.reports.read'), 
  accountingController.getIncomeStatement
);

router.get('/reports/cash-flow', 
  requirePermission('accounting.reports.read'), 
  accountingController.getCashFlowStatement
);

router.get('/reports/aged-receivables', 
  requirePermission('accounting.reports.read'), 
  accountingController.getAgedReceivables
);

router.get('/reports/aged-payables', 
  requirePermission('accounting.reports.read'), 
  accountingController.getAgedPayables
);

module.exports = router;
