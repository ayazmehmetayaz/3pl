exports.up = function(knex) {
  return knex.schema.createTable('customers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('customer_code').unique().notNullable();
    table.string('company_name').notNullable();
    table.string('contact_person').nullable();
    table.string('email').nullable();
    table.string('phone').nullable();
    table.text('address').nullable();
    table.string('city').nullable();
    table.string('district').nullable();
    table.string('postal_code').nullable();
    table.string('country').defaultTo('Turkey');
    table.string('tax_number').nullable();
    table.string('tax_office').nullable();
    table.decimal('credit_limit', 15, 2).defaultTo(0);
    table.decimal('current_balance', 15, 2).defaultTo(0);
    table.enum('payment_terms', ['cash', '30_days', '60_days', '90_days']).defaultTo('30_days');
    table.enum('customer_type', ['b2b', 'b2c']).defaultTo('b2b');
    table.boolean('is_active').defaultTo(true);
    table.jsonb('preferences').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index('customer_code');
    table.index('company_name');
    table.index('tax_number');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers');
};
