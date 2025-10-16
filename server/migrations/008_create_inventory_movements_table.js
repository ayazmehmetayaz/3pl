exports.up = function(knex) {
  return knex.schema.createTable('inventory_movements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.uuid('from_location_id').references('id').inTable('warehouse_locations').nullable();
    table.uuid('to_location_id').references('id').inTable('warehouse_locations').nullable();
    table.enum('movement_type', ['receipt', 'shipment', 'transfer', 'adjustment', 'count', 'damage']).notNullable();
    table.integer('quantity').notNullable();
    table.string('reference_number').nullable(); // irsaliye, sevkiyat, sayım no
    table.string('reference_type').nullable(); // purchase_order, sales_order, transfer_order
    table.uuid('reference_id').nullable(); // ilgili tablo ID'si
    table.string('lot_number').nullable();
    table.date('expiry_date').nullable();
    table.decimal('unit_cost', 15, 2).nullable();
    table.decimal('total_value', 15, 2).nullable();
    table.text('notes').nullable();
    table.uuid('created_by').references('id').inTable('users').notNullable();
    table.timestamp('movement_date').defaultTo(knex.fn.now());
    table.timestamps(true, true);
    
    // Indexes
    table.index('product_id');
    table.index('warehouse_id');
    table.index('from_location_id');
    table.index('to_location_id');
    table.index('movement_type');
    table.index('reference_number');
    table.index('reference_type');
    table.index('reference_id');
    table.index('lot_number');
    table.index('movement_date');
    table.index('created_by');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('inventory_movements');
};
