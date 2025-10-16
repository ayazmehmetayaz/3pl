import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chart_of_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('account_code').unique().notNullable();
    table.string('account_name').notNullable();
    table.string('account_type').notNullable(); // asset, liability, equity, revenue, expense
    table.string('parent_account_code').nullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_leaf').defaultTo(true);
    table.text('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['account_code']);
    table.index(['account_type']);
    table.index(['parent_account_code']);
  });

  await knex.schema.createTable('invoices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('invoice_number').unique().notNullable();
    table.string('invoice_series').nullable();
    table.enum('invoice_type', ['sales', 'purchase', 'service', 'credit_note', 'debit_note']).notNullable();
    table.uuid('customer_id').references('id').inTable('customers').onDelete('SET NULL');
    table.uuid('supplier_id').nullable(); // For purchase invoices
    table.date('invoice_date').notNullable();
    table.date('due_date').nullable();
    table.date('payment_date').nullable();
    table.decimal('subtotal', 15, 2).notNullable();
    table.decimal('tax_amount', 15, 2).defaultTo(0);
    table.decimal('discount_amount', 15, 2).defaultTo(0);
    table.decimal('total_amount', 15, 2).notNullable();
    table.decimal('paid_amount', 15, 2).defaultTo(0);
    table.decimal('balance_amount', 15, 2).defaultTo(0);
    table.string('currency').defaultTo('TRY');
    table.decimal('exchange_rate', 10, 4).defaultTo(1);
    table.enum('status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']).defaultTo('draft');
    table.enum('payment_status', ['unpaid', 'partial', 'paid']).defaultTo('unpaid');
    table.string('payment_method').nullable();
    table.string('reference_number').nullable();
    table.text('notes').nullable();
    table.string('pdf_path').nullable();
    table.string('e_invoice_uuid').nullable();
    table.string('e_invoice_status').nullable();
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['invoice_number']);
    table.index(['invoice_date']);
    table.index(['customer_id']);
    table.index(['status']);
    table.index(['due_date']);
  });

  await knex.schema.createTable('invoice_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('invoice_id').references('id').inTable('invoices').onDelete('CASCADE');
    table.uuid('product_id').references('id').inTable('products').onDelete('SET NULL');
    table.string('description').notNullable();
    table.decimal('quantity', 15, 3).notNullable();
    table.string('unit').notNullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.decimal('discount_rate', 5, 2).defaultTo(0);
    table.decimal('discount_amount', 10, 2).defaultTo(0);
    table.decimal('tax_rate', 5, 2).defaultTo(0);
    table.decimal('tax_amount', 10, 2).defaultTo(0);
    table.decimal('total_amount', 15, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['invoice_id']);
    table.index(['product_id']);
  });

  await knex.schema.createTable('journal_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('entry_number').unique().notNullable();
    table.date('entry_date').notNullable();
    table.string('reference_type').nullable();
    table.uuid('reference_id').nullable();
    table.text('description').nullable();
    table.enum('status', ['draft', 'posted', 'cancelled']).defaultTo('draft');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('approved_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('approved_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['entry_number']);
    table.index(['entry_date']);
    table.index(['reference_type', 'reference_id']);
    table.index(['status']);
  });

  await knex.schema.createTable('journal_entry_lines', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('entry_id').references('id').inTable('journal_entries').onDelete('CASCADE');
    table.uuid('account_id').references('id').inTable('chart_of_accounts').onDelete('CASCADE');
    table.text('description').nullable();
    table.decimal('debit_amount', 15, 2).defaultTo(0);
    table.decimal('credit_amount', 15, 2).defaultTo(0);
    table.string('currency').defaultTo('TRY');
    table.decimal('exchange_rate', 10, 4).defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['entry_id']);
    table.index(['account_id']);
  });

  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('payment_number').unique().notNullable();
    table.enum('payment_type', ['receipt', 'payment']).notNullable();
    table.uuid('customer_id').references('id').inTable('customers').onDelete('SET NULL');
    table.uuid('supplier_id').nullable();
    table.date('payment_date').notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('currency').defaultTo('TRY');
    table.decimal('exchange_rate', 10, 4).defaultTo(1);
    table.string('payment_method').notNullable(); // cash, bank_transfer, check, credit_card
    table.string('bank_account').nullable();
    table.string('reference_number').nullable();
    table.text('notes').nullable();
    table.enum('status', ['pending', 'completed', 'cancelled']).defaultTo('completed');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['payment_number']);
    table.index(['payment_date']);
    table.index(['customer_id']);
    table.index(['payment_type']);
  });

  await knex.schema.createTable('payment_allocations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('payment_id').references('id').inTable('payments').onDelete('CASCADE');
    table.uuid('invoice_id').references('id').inTable('invoices').onDelete('CASCADE');
    table.decimal('allocated_amount', 15, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['payment_id']);
    table.index(['invoice_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('payment_allocations');
  await knex.schema.dropTable('payments');
  await knex.schema.dropTable('journal_entry_lines');
  await knex.schema.dropTable('journal_entries');
  await knex.schema.dropTable('invoice_items');
  await knex.schema.dropTable('invoices');
  await knex.schema.dropTable('chart_of_accounts');
}
