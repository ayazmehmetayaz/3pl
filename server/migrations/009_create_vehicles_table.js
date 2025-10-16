exports.up = function(knex) {
  return knex.schema.createTable('vehicles', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('license_plate').unique().notNullable();
    table.string('vehicle_type').notNullable(); // kamyon, tır, van, konteyner
    table.string('brand').nullable();
    table.string('model').nullable();
    table.integer('model_year').nullable();
    table.string('color').nullable();
    table.decimal('max_weight', 10, 2).nullable(); // kg
    table.decimal('max_volume', 10, 2).nullable(); // m3
    table.integer('max_pallets').nullable();
    table.decimal('length', 8, 2).nullable(); // metre
    table.decimal('width', 8, 2).nullable();
    table.decimal('height', 8, 2).nullable();
    table.string('fuel_type').nullable(); // dizel, benzin, elektrik
    table.decimal('fuel_capacity', 8, 2).nullable(); // litre
    table.string('insurance_number').nullable();
    table.date('insurance_expiry').nullable();
    table.string('registration_number').nullable();
    table.date('registration_expiry').nullable();
    table.date('inspection_date').nullable();
    table.date('next_inspection_date').nullable();
    table.enum('status', ['active', 'maintenance', 'inactive', 'damaged']).defaultTo('active');
    table.uuid('current_driver_id').references('id').inTable('users').nullable();
    table.uuid('assigned_warehouse_id').references('id').inTable('warehouses').nullable();
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.timestamp('last_location_update').nullable();
    table.boolean('has_gps').defaultTo(false);
    table.boolean('has_temperature_control').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('license_plate');
    table.index('vehicle_type');
    table.index('status');
    table.index('current_driver_id');
    table.index('assigned_warehouse_id');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vehicles');
};
