const express = require('express');
const { marketingController } = require('../controllers/marketingController');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Customer Management
router.get('/customers', 
  requirePermission('marketing.customers.read'), 
  marketingController.getCustomers
);

router.post('/customers', 
  requirePermission('marketing.customers.create'), 
  marketingController.createCustomer
);

router.get('/customers/:id', 
  requirePermission('marketing.customers.read'), 
  marketingController.getCustomerById
);

router.put('/customers/:id', 
  requirePermission('marketing.customers.update'), 
  marketingController.updateCustomer
);

router.delete('/customers/:id', 
  requirePermission('marketing.customers.delete'), 
  marketingController.deleteCustomer
);

// Contract Management
router.get('/contracts', 
  requirePermission('marketing.contracts.read'), 
  marketingController.getContracts
);

router.post('/contracts', 
  requirePermission('marketing.contracts.create'), 
  marketingController.createContract
);

router.get('/contracts/:id', 
  requirePermission('marketing.contracts.read'), 
  marketingController.getContractById
);

router.put('/contracts/:id', 
  requirePermission('marketing.contracts.update'), 
  marketingController.updateContract
);

router.post('/contracts/:id/approve', 
  requirePermission('marketing.contracts.approve'), 
  marketingController.approveContract
);

router.post('/contracts/:id/sign', 
  requirePermission('marketing.contracts.sign'), 
  marketingController.signContract
);

// Pricing Management
router.get('/pricing-rules', 
  requirePermission('marketing.pricing.read'), 
  marketingController.getPricingRules
);

router.post('/pricing-rules', 
  requirePermission('marketing.pricing.create'), 
  marketingController.createPricingRule
);

router.put('/pricing-rules/:id', 
  requirePermission('marketing.pricing.update'), 
  marketingController.updatePricingRule
);

router.delete('/pricing-rules/:id', 
  requirePermission('marketing.pricing.delete'), 
  marketingController.deletePricingRule
);

// Quotation Management
router.get('/quotations', 
  requirePermission('marketing.quotations.read'), 
  marketingController.getQuotations
);

router.post('/quotations', 
  requirePermission('marketing.quotations.create'), 
  marketingController.createQuotation
);

router.get('/quotations/:id', 
  requirePermission('marketing.quotations.read'), 
  marketingController.getQuotationById
);

router.put('/quotations/:id', 
  requirePermission('marketing.quotations.update'), 
  marketingController.updateQuotation
);

router.post('/quotations/:id/send', 
  requirePermission('marketing.quotations.send'), 
  marketingController.sendQuotation
);

router.post('/quotations/:id/accept', 
  requirePermission('marketing.quotations.accept'), 
  marketingController.acceptQuotation
);

router.post('/quotations/:id/reject', 
  requirePermission('marketing.quotations.reject'), 
  marketingController.rejectQuotation
);

// Campaign Management
router.get('/campaigns', 
  requirePermission('marketing.campaigns.read'), 
  marketingController.getCampaigns
);

router.post('/campaigns', 
  requirePermission('marketing.campaigns.create'), 
  marketingController.createCampaign
);

router.get('/campaigns/:id', 
  requirePermission('marketing.campaigns.read'), 
  marketingController.getCampaignById
);

router.put('/campaigns/:id', 
  requirePermission('marketing.campaigns.update'), 
  marketingController.updateCampaign
);

router.post('/campaigns/:id/activate', 
  requirePermission('marketing.campaigns.activate'), 
  marketingController.activateCampaign
);

router.post('/campaigns/:id/deactivate', 
  requirePermission('marketing.campaigns.deactivate'), 
  marketingController.deactivateCampaign
);

module.exports = router;
