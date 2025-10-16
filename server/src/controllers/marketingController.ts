import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const marketingController = {
  // Customer Management
  async getCustomers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, status, customerType } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('customers')
        .select(
          'customers.*',
          'users.first_name as sales_rep_first_name',
          'users.last_name as sales_rep_last_name'
        )
        .leftJoin('users', 'customers.assigned_sales_rep', 'users.id');

      if (search) {
        query = query.where(function() {
          this.where('customers.company_name', 'ilike', `%${search}%`)
            .orWhere('customers.customer_code', 'ilike', `%${search}%`)
            .orWhere('customers.contact_person', 'ilike', `%${search}%`)
            .orWhere('customers.email', 'ilike', `%${search}%`);
        });
      }

      if (status) {
        query = query.where('customers.status', status);
      }

      if (customerType) {
        query = query.where('customers.customer_type', customerType);
      }

      const [{ count }] = await query.clone().count('* as count');
      const customers = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('customers.created_at', 'desc');

      res.json({
        success: true,
        data: customers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createCustomer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerCode,
        companyName,
        taxNumber,
        taxOffice,
        contactPerson,
        email,
        phone,
        address,
        city,
        district,
        postalCode,
        country,
        customerType,
        creditLimit,
        paymentTermsDays,
        assignedSalesRep,
        preferences
      } = req.body;

      // Check if customer code already exists
      const existingCustomer = await db('customers').where('customer_code', customerCode).first();
      if (existingCustomer) {
        throw new CustomError('Customer with this code already exists', 400);
      }

      const [customerId] = await db('customers').insert({
        customer_code: customerCode,
        company_name: companyName,
        tax_number: taxNumber,
        tax_office: taxOffice,
        contact_person: contactPerson,
        email,
        phone,
        address,
        city,
        district,
        postal_code: postalCode,
        country: country || 'Turkey',
        customer_type: customerType || 'B2B',
        status: 'active',
        credit_limit: creditLimit || 0,
        current_balance: 0,
        payment_terms_days: paymentTermsDays || 30,
        preferences: JSON.stringify(preferences || {}),
        assigned_sales_rep: assignedSalesRep
      }).returning('id');

      logger.info(`Customer created: ${companyName} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: customerId.id },
        message: 'Customer created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const customer = await db('customers')
        .select(
          'customers.*',
          'users.first_name as sales_rep_first_name',
          'users.last_name as sales_rep_last_name'
        )
        .leftJoin('users', 'customers.assigned_sales_rep', 'users.id')
        .where('customers.id', id)
        .first();

      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }

      // Parse preferences JSON
      if (customer.preferences) {
        customer.preferences = JSON.parse(customer.preferences);
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const customer = await db('customers').where('id', id).first();
      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }

      // Convert preferences to JSON if provided
      if (updateData.preferences) {
        updateData.preferences = JSON.stringify(updateData.preferences);
      }

      await db('customers')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Customer updated: ${customer.company_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCustomer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const customer = await db('customers').where('id', id).first();
      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }

      // Soft delete - deactivate customer
      await db('customers')
        .where('id', id)
        .update({
          status: 'inactive',
          updated_at: new Date()
        });

      logger.info(`Customer deactivated: ${customer.company_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Customer deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Contract Management
  async getContracts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, customerId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('contracts')
        .select(
          'contracts.*',
          'customers.company_name as customer_name',
          'customers.customer_code'
        )
        .join('customers', 'contracts.customer_id', 'customers.id');

      if (status) {
        query = query.where('contracts.status', status);
      }

      if (customerId) {
        query = query.where('contracts.customer_id', customerId);
      }

      const [{ count }] = await query.clone().count('* as count');
      const contracts = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('contracts.created_at', 'desc');

      res.json({
        success: true,
        data: contracts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createContract(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerId,
        contractNumber,
        contractType,
        startDate,
        endDate,
        services,
        pricing,
        terms,
        notes
      } = req.body;

      const [contractId] = await db('contracts').insert({
        customer_id: customerId,
        contract_number: contractNumber,
        contract_type: contractType,
        start_date: startDate,
        end_date: endDate,
        services: JSON.stringify(services),
        pricing: JSON.stringify(pricing),
        terms: JSON.stringify(terms),
        status: 'draft',
        notes,
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Contract created: ${contractNumber} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: contractId.id },
        message: 'Contract created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getContractById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contract = await db('contracts')
        .select(
          'contracts.*',
          'customers.company_name as customer_name',
          'customers.customer_code'
        )
        .join('customers', 'contracts.customer_id', 'customers.id')
        .where('contracts.id', id)
        .first();

      if (!contract) {
        throw new CustomError('Contract not found', 404);
      }

      // Parse JSON fields
      contract.services = JSON.parse(contract.services || '[]');
      contract.pricing = JSON.parse(contract.pricing || '{}');
      contract.terms = JSON.parse(contract.terms || '{}');

      res.json({
        success: true,
        data: contract
      });
    } catch (error) {
      next(error);
    }
  },

  async updateContract(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const contract = await db('contracts').where('id', id).first();
      if (!contract) {
        throw new CustomError('Contract not found', 404);
      }

      // Convert JSON fields
      if (updateData.services) {
        updateData.services = JSON.stringify(updateData.services);
      }
      if (updateData.pricing) {
        updateData.pricing = JSON.stringify(updateData.pricing);
      }
      if (updateData.terms) {
        updateData.terms = JSON.stringify(updateData.terms);
      }

      await db('contracts')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Contract updated: ${contract.contract_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Contract updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async approveContract(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contract = await db('contracts').where('id', id).first();
      if (!contract) {
        throw new CustomError('Contract not found', 404);
      }

      await db('contracts')
        .where('id', id)
        .update({
          status: 'approved',
          approved_by: req.user?.id,
          approved_at: new Date(),
          updated_at: new Date()
        });

      // Send notification
      await MessageQueueService.publishToExchange(
        MessageTypes.NOTIFICATION.exchange,
        MessageTypes.NOTIFICATION.routingKey,
        {
          type: 'contract_approved',
          contractId: id,
          customerId: contract.customer_id
        }
      );

      logger.info(`Contract approved: ${contract.contract_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Contract approved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async signContract(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contract = await db('contracts').where('id', id).first();
      if (!contract) {
        throw new CustomError('Contract not found', 404);
      }

      await db('contracts')
        .where('id', id)
        .update({
          status: 'signed',
          signed_by: req.user?.id,
          signed_at: new Date(),
          updated_at: new Date()
        });

      logger.info(`Contract signed: ${contract.contract_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Contract signed successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Pricing Management
  async getPricingRules(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, customerId, serviceType } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('pricing_rules')
        .select(
          'pricing_rules.*',
          'customers.company_name as customer_name'
        )
        .leftJoin('customers', 'pricing_rules.customer_id', 'customers.id');

      if (customerId) {
        query = query.where('pricing_rules.customer_id', customerId);
      }

      if (serviceType) {
        query = query.where('pricing_rules.service_type', serviceType);
      }

      const [{ count }] = await query.clone().count('* as count');
      const pricingRules = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('pricing_rules.created_at', 'desc');

      res.json({
        success: true,
        data: pricingRules,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createPricingRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerId,
        serviceType,
        serviceName,
        basePrice,
        unit,
        pricingStructure,
        conditions,
        validFrom,
        validTo,
        isActive
      } = req.body;

      const [pricingRuleId] = await db('pricing_rules').insert({
        customer_id: customerId,
        service_type: serviceType,
        service_name: serviceName,
        base_price: basePrice,
        unit,
        pricing_structure: JSON.stringify(pricingStructure),
        conditions: JSON.stringify(conditions),
        valid_from: validFrom,
        valid_to: validTo,
        is_active: isActive !== false,
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Pricing rule created: ${serviceName} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: pricingRuleId.id },
        message: 'Pricing rule created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePricingRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const pricingRule = await db('pricing_rules').where('id', id).first();
      if (!pricingRule) {
        throw new CustomError('Pricing rule not found', 404);
      }

      // Convert JSON fields
      if (updateData.pricingStructure) {
        updateData.pricing_structure = JSON.stringify(updateData.pricingStructure);
      }
      if (updateData.conditions) {
        updateData.conditions = JSON.stringify(updateData.conditions);
      }

      await db('pricing_rules')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Pricing rule updated: ${pricingRule.service_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Pricing rule updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePricingRule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const pricingRule = await db('pricing_rules').where('id', id).first();
      if (!pricingRule) {
        throw new CustomError('Pricing rule not found', 404);
      }

      await db('pricing_rules').where('id', id).del();

      logger.info(`Pricing rule deleted: ${pricingRule.service_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Pricing rule deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Quotation Management
  async getQuotations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, customerId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('quotations')
        .select(
          'quotations.*',
          'customers.company_name as customer_name',
          'customers.customer_code'
        )
        .join('customers', 'quotations.customer_id', 'customers.id');

      if (status) {
        query = query.where('quotations.status', status);
      }

      if (customerId) {
        query = query.where('quotations.customer_id', customerId);
      }

      const [{ count }] = await query.clone().count('* as count');
      const quotations = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('quotations.created_at', 'desc');

      res.json({
        success: true,
        data: quotations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerId,
        quotationNumber,
        validUntil,
        items,
        notes,
        terms
      } = req.body;

      // Calculate totals
      let subtotal = 0;
      let totalTaxAmount = 0;
      let totalDiscountAmount = 0;

      items.forEach((item: any) => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemDiscount = itemTotal * (item.discountRate || 0) / 100;
        const itemTax = (itemTotal - itemDiscount) * (item.taxRate || 0) / 100;
        
        subtotal += itemTotal;
        totalDiscountAmount += itemDiscount;
        totalTaxAmount += itemTax;
      });

      const totalAmount = subtotal - totalDiscountAmount + totalTaxAmount;

      const [quotationId] = await db('quotations').insert({
        customer_id: customerId,
        quotation_number: quotationNumber,
        valid_until: validUntil,
        subtotal,
        tax_amount: totalTaxAmount,
        discount_amount: totalDiscountAmount,
        total_amount: totalAmount,
        currency: 'TRY',
        exchange_rate: 1,
        status: 'draft',
        notes,
        terms: JSON.stringify(terms || {}),
        created_by: req.user?.id
      }).returning('id');

      // Create quotation items
      const quotationItems = items.map((item: any) => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemDiscount = itemTotal * (item.discountRate || 0) / 100;
        const itemTax = (itemTotal - itemDiscount) * (item.taxRate || 0) / 100;
        const totalAmount = itemTotal - itemDiscount + itemTax;

        return {
          quotation_id: quotationId.id,
          service_type: item.serviceType,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unitPrice,
          discount_rate: item.discountRate || 0,
          discount_amount: itemDiscount,
          tax_rate: item.taxRate || 0,
          tax_amount: itemTax,
          total_amount: totalAmount
        };
      });

      await db('quotation_items').insert(quotationItems);

      logger.info(`Quotation created: ${quotationNumber} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: quotationId.id },
        message: 'Quotation created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getQuotationById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const quotation = await db('quotations')
        .select(
          'quotations.*',
          'customers.company_name as customer_name',
          'customers.customer_code'
        )
        .join('customers', 'quotations.customer_id', 'customers.id')
        .where('quotations.id', id)
        .first();

      if (!quotation) {
        throw new CustomError('Quotation not found', 404);
      }

      // Get quotation items
      const items = await db('quotation_items')
        .where('quotation_id', id);

      quotation.items = items;
      quotation.terms = JSON.parse(quotation.terms || '{}');

      res.json({
        success: true,
        data: quotation
      });
    } catch (error) {
      next(error);
    }
  },

  async updateQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const quotation = await db('quotations').where('id', id).first();
      if (!quotation) {
        throw new CustomError('Quotation not found', 404);
      }

      if (updateData.terms) {
        updateData.terms = JSON.stringify(updateData.terms);
      }

      await db('quotations')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Quotation updated: ${quotation.quotation_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Quotation updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async sendQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const quotation = await db('quotations').where('id', id).first();
      if (!quotation) {
        throw new CustomError('Quotation not found', 404);
      }

      // Update quotation status
      await db('quotations')
        .where('id', id)
        .update({
          status: 'sent',
          sent_at: new Date(),
          updated_at: new Date()
        });

      // Send email notification
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: quotation.customer_email,
          template: 'quotation_sent',
          data: {
            quotationNumber: quotation.quotation_number,
            totalAmount: quotation.total_amount,
            validUntil: quotation.valid_until
          }
        }
      );

      logger.info(`Quotation sent: ${quotation.quotation_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Quotation sent successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async acceptQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const quotation = await db('quotations').where('id', id).first();
      if (!quotation) {
        throw new CustomError('Quotation not found', 404);
      }

      await db('quotations')
        .where('id', id)
        .update({
          status: 'accepted',
          accepted_at: new Date(),
          accepted_by: req.user?.id,
          updated_at: new Date()
        });

      logger.info(`Quotation accepted: ${quotation.quotation_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Quotation accepted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const quotation = await db('quotations').where('id', id).first();
      if (!quotation) {
        throw new CustomError('Quotation not found', 404);
      }

      await db('quotations')
        .where('id', id)
        .update({
          status: 'rejected',
          rejected_at: new Date(),
          rejected_by: req.user?.id,
          rejection_reason: reason,
          updated_at: new Date()
        });

      logger.info(`Quotation rejected: ${quotation.quotation_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Quotation rejected successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Campaign Management
  async getCampaigns(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('campaigns');

      if (status) {
        query = query.where('status', status);
      }

      const [{ count }] = await query.clone().count('* as count');
      const campaigns = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('created_at', 'desc');

      res.json({
        success: true,
        data: campaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createCampaign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        campaignName,
        campaignType,
        description,
        targetAudience,
        startDate,
        endDate,
        budget,
        objectives,
        channels,
        isActive
      } = req.body;

      const [campaignId] = await db('campaigns').insert({
        campaign_name: campaignName,
        campaign_type: campaignType,
        description,
        target_audience: JSON.stringify(targetAudience),
        start_date: startDate,
        end_date: endDate,
        budget,
        objectives: JSON.stringify(objectives),
        channels: JSON.stringify(channels),
        status: isActive ? 'active' : 'draft',
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Campaign created: ${campaignName} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: campaignId.id },
        message: 'Campaign created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getCampaignById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const campaign = await db('campaigns').where('id', id).first();

      if (!campaign) {
        throw new CustomError('Campaign not found', 404);
      }

      // Parse JSON fields
      campaign.target_audience = JSON.parse(campaign.target_audience || '[]');
      campaign.objectives = JSON.parse(campaign.objectives || '[]');
      campaign.channels = JSON.parse(campaign.channels || '[]');

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCampaign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const campaign = await db('campaigns').where('id', id).first();
      if (!campaign) {
        throw new CustomError('Campaign not found', 404);
      }

      // Convert JSON fields
      if (updateData.targetAudience) {
        updateData.target_audience = JSON.stringify(updateData.targetAudience);
      }
      if (updateData.objectives) {
        updateData.objectives = JSON.stringify(updateData.objectives);
      }
      if (updateData.channels) {
        updateData.channels = JSON.stringify(updateData.channels);
      }

      await db('campaigns')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Campaign updated: ${campaign.campaign_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Campaign updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async activateCampaign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const campaign = await db('campaigns').where('id', id).first();
      if (!campaign) {
        throw new CustomError('Campaign not found', 404);
      }

      await db('campaigns')
        .where('id', id)
        .update({
          status: 'active',
          activated_at: new Date(),
          updated_at: new Date()
        });

      logger.info(`Campaign activated: ${campaign.campaign_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Campaign activated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deactivateCampaign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const campaign = await db('campaigns').where('id', id).first();
      if (!campaign) {
        throw new CustomError('Campaign not found', 404);
      }

      await db('campaigns')
        .where('id', id)
        .update({
          status: 'inactive',
          deactivated_at: new Date(),
          updated_at: new Date()
        });

      logger.info(`Campaign deactivated: ${campaign.campaign_name} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Campaign deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
