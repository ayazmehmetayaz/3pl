import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('customer_code').unique().notNullable();
    table.string('company_name').notNullable();
    table.string('tax_number').nullable();
    table.string('tax_office').nullable();
    table.string('contact_person').nullable();
    table.string('email').nullable();
    table.string('phone').nullable();
    table.string('address').nullable();
    table.string('city').nullable();
    table.string('district').nullable();
    table.string('postal_code').nullable();
    table.string('country').defaultTo('Turkey');
    table.enum('customer_type', ['B2B', 'B2C']).defaultTo('B2B');
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.decimal('credit_limit', 15, 2).defaultTo(0);
    table.decimal('current_balance', 15, 2).defaultTo(0);
    table.integer('payment_terms_days').defaultTo(30);
    table.jsonb('preferences').defaultTo('{}');
    table.uuid('assigned_sales_rep').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['customer_code']);
    table.index(['company_name']);
    table.index(['status']);
    table.index(['assigned_sales_rep']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('customers');
}
