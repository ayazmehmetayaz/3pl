exports.up = function(knex) {
  return knex.schema.createTable('warehouses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('warehouse_code').unique().notNullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.text('address').notNullable();
    table.string('city').notNullable();
    table.string('district').notNullable();
    table.string('postal_code').nullable();
    table.string('country').defaultTo('Turkey');
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.decimal('total_area', 10, 2).nullable(); // m2
    table.decimal('storage_capacity', 10, 2).nullable(); // palet kapasitesi
    table.boolean('has_temperature_control').defaultTo(false);
    table.decimal('min_temperature', 5, 2).nullable();
    table.decimal('max_temperature', 5, 2).nullable();
    table.boolean('has_security').defaultTo(false);
    table.boolean('has_cctv').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.uuid('manager_id').references('id').inTable('users').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index('warehouse_code');
    table.index('name');
    table.index('is_active');
    table.index('manager_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('warehouses');
};
