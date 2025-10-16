exports.up = function(knex) {
  return knex.schema.createTable('warehouse_locations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.string('location_code').notNullable(); // A-01-01-01 (Zone-Row-Rack-Level)
    table.string('zone').notNullable(); // A, B, C, D
    table.integer('row_number').notNullable();
    table.integer('rack_number').notNullable();
    table.integer('level_number').notNullable();
    table.enum('location_type', ['storage', 'cross_dock', 'quarantine', 'loading', 'unloading']).defaultTo('storage');
    table.decimal('max_weight', 10, 2).nullable();
    table.decimal('max_volume', 10, 2).nullable();
    table.boolean('is_hazardous_allowed').defaultTo(false);
    table.boolean('is_temperature_controlled').defaultTo(false);
    table.boolean('is_occupied').defaultTo(false);
    table.uuid('current_product_id').references('id').inTable('products').nullable();
    table.integer('current_quantity').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('warehouse_id');
    table.index('location_code');
    table.index(['warehouse_id', 'zone', 'row_number', 'rack_number', 'level_number']);
    table.index('location_type');
    table.index('is_occupied');
    table.index('current_product_id');
    table.unique(['warehouse_id', 'location_code']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('warehouse_locations');
};
