import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export const accountingController = {
  // Invoice Management
  async getInvoices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, invoiceType, customerId, dateFrom, dateTo } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('invoices')
        .select(
          'invoices.*',
          'customers.company_name as customer_name',
          'customers.tax_number as customer_tax_number'
        )
        .leftJoin('customers', 'invoices.customer_id', 'customers.id');

      if (status) {
        query = query.where('invoices.status', status);
      }

      if (invoiceType) {
        query = query.where('invoices.invoice_type', invoiceType);
      }

      if (customerId) {
        query = query.where('invoices.customer_id', customerId);
      }

      if (dateFrom) {
        query = query.where('invoices.invoice_date', '>=', dateFrom);
      }

      if (dateTo) {
        query = query.where('invoices.invoice_date', '<=', dateTo);
      }

      const [{ count }] = await query.clone().count('* as count');
      const invoices = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('invoices.created_at', 'desc');

      res.json({
        success: true,
        data: invoices,
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

  async createInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        customerId,
        invoiceType,
        invoiceDate,
        dueDate,
        items,
        notes,
        referenceNumber
      } = req.body;

      const trx = await db.transaction();

      try {
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

        // Generate invoice number
        const invoiceNumber = `INV${Date.now()}`;

        // Create invoice
        const [invoiceId] = await trx('invoices').insert({
          invoice_number: invoiceNumber,
          invoice_type: invoiceType,
          customer_id: customerId,
          invoice_date: invoiceDate,
          due_date: dueDate,
          subtotal,
          tax_amount: totalTaxAmount,
          discount_amount: totalDiscountAmount,
          total_amount: totalAmount,
          balance_amount: totalAmount,
          currency: 'TRY',
          exchange_rate: 1,
          status: 'draft',
          payment_status: 'unpaid',
          reference_number: referenceNumber,
          notes,
          created_by: req.user?.id
        }).returning('id');

        // Create invoice items
        const invoiceItems = items.map((item: any) => {
          const itemTotal = item.quantity * item.unitPrice;
          const itemDiscount = itemTotal * (item.discountRate || 0) / 100;
          const itemTax = (itemTotal - itemDiscount) * (item.taxRate || 0) / 100;
          const totalAmount = itemTotal - itemDiscount + itemTax;

          return {
            invoice_id: invoiceId.id,
            product_id: item.productId,
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

        await trx('invoice_items').insert(invoiceItems);

        await trx.commit();

        logger.info(`Invoice created: ${invoiceNumber} by ${req.user?.email}`);

        res.status(201).json({
          success: true,
          data: { id: invoiceId.id, invoiceNumber },
          message: 'Invoice created successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  async getInvoiceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const invoice = await db('invoices')
        .select(
          'invoices.*',
          'customers.company_name as customer_name',
          'customers.tax_number as customer_tax_number',
          'customers.address as customer_address',
          'customers.city as customer_city',
          'customers.district as customer_district',
          'customers.postal_code as customer_postal_code'
        )
        .leftJoin('customers', 'invoices.customer_id', 'customers.id')
        .where('invoices.id', id)
        .first();

      if (!invoice) {
        throw new CustomError('Invoice not found', 404);
      }

      // Get invoice items
      const items = await db('invoice_items')
        .select(
          'invoice_items.*',
          'products.product_code',
          'products.name as product_name'
        )
        .leftJoin('products', 'invoice_items.product_id', 'products.id')
        .where('invoice_items.invoice_id', id);

      invoice.items = items;

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  },

  async updateInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const invoice = await db('invoices').where('id', id).first();
      if (!invoice) {
        throw new CustomError('Invoice not found', 404);
      }

      // Only allow updates if invoice is in draft status
      if (invoice.status !== 'draft') {
        throw new CustomError('Cannot update non-draft invoice', 400);
      }

      await db('invoices')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Invoice updated: ${invoice.invoice_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Invoice updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async sendInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const invoice = await db('invoices').where('id', id).first();
      if (!invoice) {
        throw new CustomError('Invoice not found', 404);
      }

      // Update invoice status
      await db('invoices')
        .where('id', id)
        .update({
          status: 'sent',
          updated_at: new Date()
        });

      // Send email notification
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: invoice.customer_email,
          template: 'invoice_sent',
          data: {
            invoiceNumber: invoice.invoice_number,
            totalAmount: invoice.total_amount,
            dueDate: invoice.due_date
          }
        }
      );

      logger.info(`Invoice sent: ${invoice.invoice_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Invoice sent successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async markInvoicePaid(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { paymentMethod, paymentDate } = req.body;

      const invoice = await db('invoices').where('id', id).first();
      if (!invoice) {
        throw new CustomError('Invoice not found', 404);
      }

      const trx = await db.transaction();

      try {
        // Update invoice
        await trx('invoices')
          .where('id', id)
          .update({
            status: 'paid',
            payment_status: 'paid',
            paid_amount: invoice.total_amount,
            balance_amount: 0,
            payment_date: paymentDate || new Date(),
            payment_method: paymentMethod,
            updated_at: new Date()
          });

        // Create payment record
        const [paymentId] = await trx('payments').insert({
          payment_number: `PAY${Date.now()}`,
          payment_type: 'receipt',
          customer_id: invoice.customer_id,
          payment_date: paymentDate || new Date(),
          amount: invoice.total_amount,
          currency: invoice.currency,
          exchange_rate: invoice.exchange_rate,
          payment_method: paymentMethod,
          reference_number: invoice.invoice_number,
          notes: `Payment for invoice ${invoice.invoice_number}`,
          status: 'completed',
          created_by: req.user?.id
        }).returning('id');

        // Create payment allocation
        await trx('payment_allocations').insert({
          payment_id: paymentId.id,
          invoice_id: id,
          allocated_amount: invoice.total_amount
        });

        await trx.commit();

        logger.info(`Invoice marked as paid: ${invoice.invoice_number} by ${req.user?.email}`);

        res.json({
          success: true,
          message: 'Invoice marked as paid successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  // Payment Management
  async getPayments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, paymentType, customerId, dateFrom, dateTo } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('payments')
        .select(
          'payments.*',
          'customers.company_name as customer_name'
        )
        .leftJoin('customers', 'payments.customer_id', 'customers.id');

      if (paymentType) {
        query = query.where('payments.payment_type', paymentType);
      }

      if (customerId) {
        query = query.where('payments.customer_id', customerId);
      }

      if (dateFrom) {
        query = query.where('payments.payment_date', '>=', dateFrom);
      }

      if (dateTo) {
        query = query.where('payments.payment_date', '<=', dateTo);
      }

      const [{ count }] = await query.clone().count('* as count');
      const payments = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('payments.created_at', 'desc');

      res.json({
        success: true,
        data: payments,
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

  async createPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        paymentType,
        customerId,
        paymentDate,
        amount,
        currency,
        exchangeRate,
        paymentMethod,
        bankAccount,
        referenceNumber,
        notes
      } = req.body;

      const [paymentId] = await db('payments').insert({
        payment_number: `PAY${Date.now()}`,
        payment_type: paymentType,
        customer_id: customerId,
        payment_date: paymentDate,
        amount,
        currency: currency || 'TRY',
        exchange_rate: exchangeRate || 1,
        payment_method: paymentMethod,
        bank_account: bankAccount,
        reference_number: referenceNumber,
        notes,
        status: 'completed',
        created_by: req.user?.id
      }).returning('id');

      logger.info(`Payment created: ${paymentId.id} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: paymentId.id },
        message: 'Payment created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getPaymentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const payment = await db('payments')
        .select(
          'payments.*',
          'customers.company_name as customer_name'
        )
        .leftJoin('customers', 'payments.customer_id', 'customers.id')
        .where('payments.id', id)
        .first();

      if (!payment) {
        throw new CustomError('Payment not found', 404);
      }

      // Get payment allocations
      const allocations = await db('payment_allocations')
        .select(
          'payment_allocations.*',
          'invoices.invoice_number'
        )
        .join('invoices', 'payment_allocations.invoice_id', 'invoices.id')
        .where('payment_allocations.payment_id', id);

      payment.allocations = allocations;

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  async allocatePayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { allocations } = req.body;

      const payment = await db('payments').where('id', id).first();
      if (!payment) {
        throw new CustomError('Payment not found', 404);
      }

      const trx = await db.transaction();

      try {
        // Clear existing allocations
        await trx('payment_allocations').where('payment_id', id).del();

        let totalAllocated = 0;

        // Create new allocations
        for (const allocation of allocations) {
          await trx('payment_allocations').insert({
            payment_id: id,
            invoice_id: allocation.invoiceId,
            allocated_amount: allocation.amount
          });

          totalAllocated += allocation.amount;

          // Update invoice paid amount
          await trx('invoices')
            .where('id', allocation.invoiceId)
            .increment('paid_amount', allocation.amount)
            .decrement('balance_amount', allocation.amount);

          // Update invoice status if fully paid
          const invoice = await trx('invoices').where('id', allocation.invoiceId).first();
          if (invoice.balance_amount <= 0) {
            await trx('invoices')
              .where('id', allocation.invoiceId)
              .update({
                status: 'paid',
                payment_status: 'paid',
                payment_date: payment.payment_date
              });
          }
        }

        await trx.commit();

        logger.info(`Payment allocated: ${id} by ${req.user?.email}`);

        res.json({
          success: true,
          message: 'Payment allocated successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  // Chart of Accounts
  async getChartOfAccounts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const accounts = await db('chart_of_accounts')
        .where('is_active', true)
        .orderBy('account_code');

      // Build hierarchical structure
      const accountMap = new Map();
      const rootAccounts: any[] = [];

      accounts.forEach(account => {
        accountMap.set(account.account_code, { ...account, children: [] });
      });

      accounts.forEach(account => {
        if (account.parent_account_code) {
          const parent = accountMap.get(account.parent_account_code);
          if (parent) {
            parent.children.push(accountMap.get(account.account_code));
          }
        } else {
          rootAccounts.push(accountMap.get(account.account_code));
        }
      });

      res.json({
        success: true,
        data: rootAccounts
      });
    } catch (error) {
      next(error);
    }
  },

  async createAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        accountCode,
        accountName,
        accountType,
        parentAccountCode,
        description
      } = req.body;

      // Check if account code already exists
      const existingAccount = await db('chart_of_accounts')
        .where('account_code', accountCode)
        .first();

      if (existingAccount) {
        throw new CustomError('Account code already exists', 400);
      }

      const [accountId] = await db('chart_of_accounts').insert({
        account_code: accountCode,
        account_name: accountName,
        account_type: accountType,
        parent_account_code: parentAccountCode,
        description,
        is_active: true,
        is_leaf: true
      }).returning('id');

      // Update parent account if exists
      if (parentAccountCode) {
        await db('chart_of_accounts')
          .where('account_code', parentAccountCode)
          .update({ is_leaf: false });
      }

      logger.info(`Account created: ${accountCode} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        data: { id: accountId.id },
        message: 'Account created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const account = await db('chart_of_accounts').where('id', id).first();
      if (!account) {
        throw new CustomError('Account not found', 404);
      }

      await db('chart_of_accounts')
        .where('id', id)
        .update({
          ...updateData,
          updated_at: new Date()
        });

      logger.info(`Account updated: ${account.account_code} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Account updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Journal Entries
  async getJournalEntries(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status, dateFrom, dateTo } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('journal_entries')
        .select('journal_entries.*');

      if (status) {
        query = query.where('journal_entries.status', status);
      }

      if (dateFrom) {
        query = query.where('journal_entries.entry_date', '>=', dateFrom);
      }

      if (dateTo) {
        query = query.where('journal_entries.entry_date', '<=', dateTo);
      }

      const [{ count }] = await query.clone().count('* as count');
      const entries = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('journal_entries.created_at', 'desc');

      res.json({
        success: true,
        data: entries,
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

  async createJournalEntry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        entryDate,
        description,
        referenceType,
        referenceId,
        lines
      } = req.body;

      // Validate journal entry (debits = credits)
      const totalDebits = lines.reduce((sum: number, line: any) => sum + (line.debitAmount || 0), 0);
      const totalCredits = lines.reduce((sum: number, line: any) => sum + (line.creditAmount || 0), 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        throw new CustomError('Total debits must equal total credits', 400);
      }

      const trx = await db.transaction();

      try {
        // Generate entry number
        const entryNumber = `JE${Date.now()}`;

        // Create journal entry
        const [entryId] = await trx('journal_entries').insert({
          entry_number: entryNumber,
          entry_date: entryDate,
          reference_type: referenceType,
          reference_id: referenceId,
          description,
          status: 'draft',
          created_by: req.user?.id
        }).returning('id');

        // Create journal entry lines
        const entryLines = lines.map((line: any) => ({
          entry_id: entryId.id,
          account_id: line.accountId,
          description: line.description,
          debit_amount: line.debitAmount || 0,
          credit_amount: line.creditAmount || 0,
          currency: line.currency || 'TRY',
          exchange_rate: line.exchangeRate || 1
        }));

        await trx('journal_entry_lines').insert(entryLines);

        await trx.commit();

        logger.info(`Journal entry created: ${entryNumber} by ${req.user?.email}`);

        res.status(201).json({
          success: true,
          data: { id: entryId.id, entryNumber },
          message: 'Journal entry created successfully'
        });
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  async postJournalEntry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const entry = await db('journal_entries').where('id', id).first();
      if (!entry) {
        throw new CustomError('Journal entry not found', 404);
      }

      if (entry.status !== 'draft') {
        throw new CustomError('Only draft entries can be posted', 400);
      }

      await db('journal_entries')
        .where('id', id)
        .update({
          status: 'posted',
          approved_by: req.user?.id,
          approved_at: new Date()
        });

      logger.info(`Journal entry posted: ${entry.entry_number} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Journal entry posted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Financial Reports
  async getBalanceSheet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      const reportDate = date || new Date().toISOString().split('T')[0];

      // Get account balances
      const balances = await db.raw(`
        SELECT 
          coa.account_code,
          coa.account_name,
          coa.account_type,
          COALESCE(SUM(
            CASE 
              WHEN jel.debit_amount > 0 THEN jel.debit_amount
              WHEN jel.credit_amount > 0 THEN -jel.credit_amount
              ELSE 0
            END
          ), 0) as balance
        FROM chart_of_accounts coa
        LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
        LEFT JOIN journal_entries je ON jel.entry_id = je.id
        WHERE coa.is_active = true
        AND (je.status = 'posted' OR je.status IS NULL)
        AND (je.entry_date <= ? OR je.entry_date IS NULL)
        GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type
        ORDER BY coa.account_code
      `, [reportDate]);

      // Group by account type
      const report = {
        assets: balances.rows.filter((row: any) => row.account_type === 'asset'),
        liabilities: balances.rows.filter((row: any) => row.account_type === 'liability'),
        equity: balances.rows.filter((row: any) => row.account_type === 'equity'),
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0
      };

      report.totalAssets = report.assets.reduce((sum: number, item: any) => sum + Number(item.balance), 0);
      report.totalLiabilities = report.liabilities.reduce((sum: number, item: any) => sum + Number(item.balance), 0);
      report.totalEquity = report.equity.reduce((sum: number, item: any) => sum + Number(item.balance), 0);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  },

  async getIncomeStatement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        throw new CustomError('Start date and end date are required', 400);
      }

      // Get revenue and expense balances
      const balances = await db.raw(`
        SELECT 
          coa.account_code,
          coa.account_name,
          coa.account_type,
          COALESCE(SUM(
            CASE 
              WHEN jel.debit_amount > 0 THEN jel.debit_amount
              WHEN jel.credit_amount > 0 THEN -jel.credit_amount
              ELSE 0
            END
          ), 0) as balance
        FROM chart_of_accounts coa
        LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
        LEFT JOIN journal_entries je ON jel.entry_id = je.id
        WHERE coa.is_active = true
        AND (je.status = 'posted' OR je.status IS NULL)
        AND (je.entry_date >= ? AND je.entry_date <= ?)
        AND coa.account_type IN ('revenue', 'expense')
        GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type
        ORDER BY coa.account_type, coa.account_code
      `, [startDate, endDate]);

      const report = {
        revenue: balances.rows.filter((row: any) => row.account_type === 'revenue'),
        expenses: balances.rows.filter((row: any) => row.account_type === 'expense'),
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0
      };

      report.totalRevenue = report.revenue.reduce((sum: number, item: any) => sum + Number(item.balance), 0);
      report.totalExpenses = report.expenses.reduce((sum: number, item: any) => sum + Number(item.balance), 0);
      report.netIncome = report.totalRevenue - report.totalExpenses;

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  },

  async getCashFlowStatement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        throw new CustomError('Start date and end date are required', 400);
      }

      // This is a simplified cash flow statement
      // In a real implementation, you would need more complex logic
      const cashFlow = {
        operatingActivities: {
          netIncome: 0,
          adjustments: [],
          netOperatingCashFlow: 0
        },
        investingActivities: {
          items: [],
          netInvestingCashFlow: 0
        },
        financingActivities: {
          items: [],
          netFinancingCashFlow: 0
        },
        netCashChange: 0
      };

      res.json({
        success: true,
        data: cashFlow
      });
    } catch (error) {
      next(error);
    }
  },

  async getAgedReceivables(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agedReceivables = await db.raw(`
        SELECT 
          c.id,
          c.company_name,
          c.customer_code,
          i.invoice_number,
          i.invoice_date,
          i.due_date,
          i.total_amount,
          i.paid_amount,
          i.balance_amount,
          CASE 
            WHEN i.due_date >= CURRENT_DATE THEN 'Current'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '30 days' THEN '1-30 Days'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '60 days' THEN '31-60 Days'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '90 days' THEN '61-90 Days'
            ELSE 'Over 90 Days'
          END as aging_bucket
        FROM customers c
        JOIN invoices i ON c.id = i.customer_id
        WHERE i.status IN ('sent', 'overdue')
        AND i.balance_amount > 0
        ORDER BY c.company_name, i.due_date
      `);

      res.json({
        success: true,
        data: agedReceivables.rows
      });
    } catch (error) {
      next(error);
    }
  },

  async getAgedPayables(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const agedPayables = await db.raw(`
        SELECT 
          s.id,
          s.company_name,
          s.supplier_code,
          i.invoice_number,
          i.invoice_date,
          i.due_date,
          i.total_amount,
          i.paid_amount,
          i.balance_amount,
          CASE 
            WHEN i.due_date >= CURRENT_DATE THEN 'Current'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '30 days' THEN '1-30 Days'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '60 days' THEN '31-60 Days'
            WHEN i.due_date >= CURRENT_DATE - INTERVAL '90 days' THEN '61-90 Days'
            ELSE 'Over 90 Days'
          END as aging_bucket
        FROM suppliers s
        JOIN invoices i ON s.id = i.supplier_id
        WHERE i.invoice_type = 'purchase'
        AND i.status IN ('sent', 'overdue')
        AND i.balance_amount > 0
        ORDER BY s.company_name, i.due_date
      `);

      res.json({
        success: true,
        data: agedPayables.rows
      });
    } catch (error) {
      next(error);
    }
  }
};
