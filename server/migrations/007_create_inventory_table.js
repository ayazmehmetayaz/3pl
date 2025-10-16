exports.up = function(knex) {
  return knex.schema.createTable('inventory', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.uuid('location_id').references('id').inTable('warehouse_locations').nullable();
    table.string('lot_number').nullable();
    table.date('expiry_date').nullable();
    table.integer('quantity').notNullable();
    table.integer('reserved_quantity').defaultTo(0);
    table.integer('available_quantity').notNullable();
    table.decimal('unit_cost', 15, 2).nullable();
    table.decimal('total_value', 15, 2).nullable();
    table.enum('status', ['available', 'reserved', 'damaged', 'quarantine', 'shipped']).defaultTo('available');
    table.date('received_date').nullable();
    table.uuid('received_by').references('id').inTable('users').nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index('product_id');
    table.index('warehouse_id');
    table.index('location_id');
    table.index('lot_number');
    table.index('expiry_date');
    table.index('status');
    table.index('received_date');
    table.index(['product_id', 'warehouse_id', 'lot_number']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('inventory');
};
