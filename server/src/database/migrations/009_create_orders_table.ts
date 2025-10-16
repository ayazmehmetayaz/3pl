import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('order_number').unique().notNullable();
    table.uuid('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.date('order_date').defaultTo(knex.fn.now());
    table.date('requested_delivery_date').nullable();
    table.date('promised_delivery_date').nullable();
    table.date('actual_delivery_date').nullable();
    table.enum('order_type', ['standard', 'express', 'same_day', 'scheduled']).defaultTo('standard');
    table.enum('status', ['draft', 'confirmed', 'in_progress', 'picked', 'shipped', 'delivered', 'cancelled']).defaultTo('draft');
    table.enum('priority', ['low', 'normal', 'high', 'urgent']).defaultTo('normal');
    table.decimal('total_amount', 15, 2).defaultTo(0);
    table.decimal('total_weight', 10, 3).defaultTo(0);
    table.decimal('total_volume', 10, 3).defaultTo(0);
    table.string('shipping_address').notNullable();
    table.string('shipping_city').notNullable();
    table.string('shipping_district').notNullable();
    table.string('shipping_postal_code').nullable();
    table.string('shipping_contact_person').nullable();
    table.string('shipping_phone').nullable();
    table.text('notes').nullable();
    table.text('internal_notes').nullable();
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('assigned_warehouse_id').references('id').inTable('warehouses').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['order_number']);
    table.index(['customer_id']);
    table.index(['order_date']);
    table.index(['status']);
    table.index(['assigned_warehouse_id']);
  });

  await knex.schema.createTable('order_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.decimal('quantity_ordered', 15, 3).notNullable();
    table.decimal('quantity_picked', 15, 3).defaultTo(0);
    table.decimal('quantity_shipped', 15, 3).defaultTo(0);
    table.decimal('unit_price', 10, 2).nullable();
    table.decimal('total_price', 15, 2).nullable();
    table.string('lot_number').nullable();
    table.date('expiry_date').nullable();
    table.text('notes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['order_id']);
    table.index(['product_id']);
  });

  await knex.schema.createTable('shipments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('shipment_number').unique().notNullable();
    table.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.uuid('vehicle_id').references('id').inTable('vehicles').onDelete('SET NULL');
    table.uuid('driver_id').references('id').inTable('users').onDelete('SET NULL');
    table.date('shipment_date').nullable();
    table.time('departure_time').nullable();
    table.time('arrival_time').nullable();
    table.decimal('distance_km', 8, 2).nullable();
    table.decimal('fuel_cost', 10, 2).nullable();
    table.decimal('total_weight', 10, 3).defaultTo(0);
    table.decimal('total_volume', 10, 3).defaultTo(0);
    table.enum('status', ['planned', 'loading', 'in_transit', 'delivered', 'cancelled']).defaultTo('planned');
    table.text('delivery_notes').nullable();
    table.string('delivery_signature').nullable();
    table.string('delivery_photo').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['shipment_number']);
    table.index(['order_id']);
    table.index(['vehicle_id']);
    table.index(['driver_id']);
    table.index(['status']);
    table.index(['shipment_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('shipments');
  await knex.schema.dropTable('order_items');
  await knex.schema.dropTable('orders');
}
