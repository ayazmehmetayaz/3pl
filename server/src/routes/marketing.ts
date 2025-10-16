import { Router } from 'express';
import { marketingController } from '@/controllers/marketingController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Customer Management Routes
/**
 * @route GET /api/v1/marketing/customers
 * @desc Get all customers
 * @access Private (Marketing Manager, Admin)
 */
router.get('/customers', authorize(['admin', 'marketing_manager']), marketingController.getCustomers);

/**
 * @route POST /api/v1/marketing/customers
 * @desc Create new customer
 * @access Private (Marketing Manager, Admin)
 */
router.post('/customers', authorize(['admin', 'marketing_manager']), marketingController.createCustomer);

/**
 * @route GET /api/v1/marketing/customers/:id
 * @desc Get customer by ID
 * @access Private (Marketing Manager, Admin)
 */
router.get('/customers/:id', authorize(['admin', 'marketing_manager']), marketingController.getCustomerById);

/**
 * @route PUT /api/v1/marketing/customers/:id
 * @desc Update customer
 * @access Private (Marketing Manager, Admin)
 */
router.put('/customers/:id', authorize(['admin', 'marketing_manager']), marketingController.updateCustomer);

/**
 * @route DELETE /api/v1/marketing/customers/:id
 * @desc Delete customer
 * @access Private (Admin)
 */
router.delete('/customers/:id', authorize(['admin']), marketingController.deleteCustomer);

// Contract Management Routes
/**
 * @route GET /api/v1/marketing/contracts
 * @desc Get all contracts
 * @access Private (Marketing Manager, Admin)
 */
router.get('/contracts', authorize(['admin', 'marketing_manager']), marketingController.getContracts);

/**
 * @route POST /api/v1/marketing/contracts
 * @desc Create new contract
 * @access Private (Marketing Manager, Admin)
 */
router.post('/contracts', authorize(['admin', 'marketing_manager']), marketingController.createContract);

/**
 * @route GET /api/v1/marketing/contracts/:id
 * @desc Get contract by ID
 * @access Private (Marketing Manager, Admin)
 */
router.get('/contracts/:id', authorize(['admin', 'marketing_manager']), marketingController.getContractById);

/**
 * @route PUT /api/v1/marketing/contracts/:id
 * @desc Update contract
 * @access Private (Marketing Manager, Admin)
 */
router.put('/contracts/:id', authorize(['admin', 'marketing_manager']), marketingController.updateContract);

/**
 * @route POST /api/v1/marketing/contracts/:id/approve
 * @desc Approve contract
 * @access Private (Admin)
 */
router.post('/contracts/:id/approve', authorize(['admin']), marketingController.approveContract);

/**
 * @route POST /api/v1/marketing/contracts/:id/sign
 * @desc Sign contract
 * @access Private (Marketing Manager, Admin)
 */
router.post('/contracts/:id/sign', authorize(['admin', 'marketing_manager']), marketingController.signContract);

// Pricing Management Routes
/**
 * @route GET /api/v1/marketing/pricing
 * @desc Get pricing rules
 * @access Private (Marketing Manager, Admin)
 */
router.get('/pricing', authorize(['admin', 'marketing_manager']), marketingController.getPricingRules);

/**
 * @route POST /api/v1/marketing/pricing
 * @desc Create pricing rule
 * @access Private (Marketing Manager, Admin)
 */
router.post('/pricing', authorize(['admin', 'marketing_manager']), marketingController.createPricingRule);

/**
 * @route PUT /api/v1/marketing/pricing/:id
 * @desc Update pricing rule
 * @access Private (Marketing Manager, Admin)
 */
router.put('/pricing/:id', authorize(['admin', 'marketing_manager']), marketingController.updatePricingRule);

/**
 * @route DELETE /api/v1/marketing/pricing/:id
 * @desc Delete pricing rule
 * @access Private (Admin)
 */
router.delete('/pricing/:id', authorize(['admin']), marketingController.deletePricingRule);

// Quotation Management Routes
/**
 * @route GET /api/v1/marketing/quotations
 * @desc Get all quotations
 * @access Private (Marketing Manager, Admin)
 */
router.get('/quotations', authorize(['admin', 'marketing_manager']), marketingController.getQuotations);

/**
 * @route POST /api/v1/marketing/quotations
 * @desc Create new quotation
 * @access Private (Marketing Manager, Admin)
 */
router.post('/quotations', authorize(['admin', 'marketing_manager']), marketingController.createQuotation);

/**
 * @route GET /api/v1/marketing/quotations/:id
 * @desc Get quotation by ID
 * @access Private (Marketing Manager, Admin)
 */
router.get('/quotations/:id', authorize(['admin', 'marketing_manager']), marketingController.getQuotationById);

/**
 * @route PUT /api/v1/marketing/quotations/:id
 * @desc Update quotation
 * @access Private (Marketing Manager, Admin)
 */
router.put('/quotations/:id', authorize(['admin', 'marketing_manager']), marketingController.updateQuotation);

/**
 * @route POST /api/v1/marketing/quotations/:id/send
 * @desc Send quotation to customer
 * @access Private (Marketing Manager, Admin)
 */
router.post('/quotations/:id/send', authorize(['admin', 'marketing_manager']), marketingController.sendQuotation);

/**
 * @route POST /api/v1/marketing/quotations/:id/accept
 * @desc Accept quotation
 * @access Private (Customer, Marketing Manager, Admin)
 */
router.post('/quotations/:id/accept', authorize(['customer', 'admin', 'marketing_manager']), marketingController.acceptQuotation);

/**
 * @route POST /api/v1/marketing/quotations/:id/reject
 * @desc Reject quotation
 * @access Private (Customer, Marketing Manager, Admin)
 */
router.post('/quotations/:id/reject', authorize(['customer', 'admin', 'marketing_manager']), marketingController.rejectQuotation);

// Campaign Management Routes
/**
 * @route GET /api/v1/marketing/campaigns
 * @desc Get all campaigns
 * @access Private (Marketing Manager, Admin)
 */
router.get('/campaigns', authorize(['admin', 'marketing_manager']), marketingController.getCampaigns);

/**
 * @route POST /api/v1/marketing/campaigns
 * @desc Create new campaign
 * @access Private (Marketing Manager, Admin)
 */
router.post('/campaigns', authorize(['admin', 'marketing_manager']), marketingController.createCampaign);

/**
 * @route GET /api/v1/marketing/campaigns/:id
 * @desc Get campaign by ID
 * @access Private (Marketing Manager, Admin)
 */
router.get('/campaigns/:id', authorize(['admin', 'marketing_manager']), marketingController.getCampaignById);

/**
 * @route PUT /api/v1/marketing/campaigns/:id
 * @desc Update campaign
 * @access Private (Marketing Manager, Admin)
 */
router.put('/campaigns/:id', authorize(['admin', 'marketing_manager']), marketingController.updateCampaign);

/**
 * @route POST /api/v1/marketing/campaigns/:id/activate
 * @desc Activate campaign
 * @access Private (Marketing Manager, Admin)
 */
router.post('/campaigns/:id/activate', authorize(['admin', 'marketing_manager']), marketingController.activateCampaign);

/**
 * @route POST /api/v1/marketing/campaigns/:id/deactivate
 * @desc Deactivate campaign
 * @access Private (Marketing Manager, Admin)
 */
router.post('/campaigns/:id/deactivate', authorize(['admin', 'marketing_manager']), marketingController.deactivateCampaign);

export default router;
