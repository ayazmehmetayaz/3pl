import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('inventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.uuid('location_id').references('id').inTable('warehouse_locations').onDelete('SET NULL');
    table.string('lot_number').nullable();
    table.string('batch_number').nullable();
    table.date('expiry_date').nullable();
    table.date('manufacturing_date').nullable();
    table.decimal('quantity_on_hand', 15, 3).defaultTo(0);
    table.decimal('reserved_quantity', 15, 3).defaultTo(0);
    table.decimal('available_quantity', 15, 3).defaultTo(0);
    table.decimal('unit_cost', 10, 2).nullable();
    table.decimal('total_value', 15, 2).defaultTo(0);
    table.enum('status', ['available', 'reserved', 'quarantine', 'damaged', 'expired']).defaultTo('available');
    table.timestamp('last_movement_date').nullable();
    table.uuid('last_movement_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['product_id', 'warehouse_id', 'lot_number', 'location_id']);
    table.index(['product_id']);
    table.index(['warehouse_id']);
    table.index(['location_id']);
    table.index(['lot_number']);
    table.index(['status']);
    table.index(['expiry_date']);
  });

  await knex.schema.createTable('inventory_movements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.uuid('location_id').references('id').inTable('warehouse_locations').onDelete('SET NULL');
    table.string('lot_number').nullable();
    table.enum('movement_type', ['in', 'out', 'transfer', 'adjustment', 'cycle_count']).notNullable();
    table.decimal('quantity', 15, 3).notNullable();
    table.decimal('unit_cost', 10, 2).nullable();
    table.decimal('total_cost', 15, 2).nullable();
    table.string('reference_number').nullable();
    table.string('reference_type').nullable(); // order, shipment, adjustment, etc.
    table.uuid('reference_id').nullable(); // UUID of the reference record
    table.text('notes').nullable();
    table.enum('status', ['pending', 'completed', 'cancelled']).defaultTo('completed');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('movement_date').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['product_id']);
    table.index(['warehouse_id']);
    table.index(['movement_type']);
    table.index(['reference_type', 'reference_id']);
    table.index(['movement_date']);
    table.index(['created_by']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('inventory_movements');
  await knex.schema.dropTable('inventory');
}
