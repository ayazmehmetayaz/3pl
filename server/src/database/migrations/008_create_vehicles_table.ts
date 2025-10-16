import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vehicles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('vehicle_plate').unique().notNullable();
    table.string('vehicle_type').notNullable(); // truck, van, container, etc.
    table.string('brand').nullable();
    table.string('model').nullable();
    table.integer('model_year').nullable();
    table.string('color').nullable();
    table.string('vin_number').nullable();
    table.string('engine_number').nullable();
    table.decimal('capacity_weight', 10, 2).nullable(); // kg
    table.decimal('capacity_volume', 10, 3).nullable(); // m3
    table.integer('max_pallets').nullable();
    table.boolean('has_temperature_control').defaultTo(false);
    table.boolean('has_gps_tracking').defaultTo(true);
    table.string('fuel_type').defaultTo('diesel');
    table.decimal('fuel_capacity', 8, 2).nullable(); // liters
    table.decimal('average_consumption', 5, 2).nullable(); // L/100km
    table.string('insurance_number').nullable();
    table.date('insurance_expiry').nullable();
    table.date('registration_expiry').nullable();
    table.date('inspection_expiry').nullable();
    table.enum('status', ['active', 'inactive', 'maintenance', 'retired']).defaultTo('active');
    table.uuid('current_driver_id').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('assigned_warehouse_id').references('id').inTable('warehouses').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['vehicle_plate']);
    table.index(['vehicle_type']);
    table.index(['status']);
    table.index(['current_driver_id']);
    table.index(['assigned_warehouse_id']);
  });

  await knex.schema.createTable('vehicle_maintenance', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
    table.date('maintenance_date').notNullable();
    table.string('maintenance_type').notNullable(); // routine, repair, inspection
    table.text('description').nullable();
    table.decimal('cost', 10, 2).nullable();
    table.integer('odometer_reading').nullable();
    table.string('service_provider').nullable();
    table.text('notes').nullable();
    table.enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled']).defaultTo('scheduled');
    table.date('next_maintenance_due').nullable();
    table.uuid('performed_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['vehicle_id']);
    table.index(['maintenance_date']);
    table.index(['maintenance_type']);
    table.index(['status']);
  });

  await knex.schema.createTable('vehicle_fuel_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
    table.date('fuel_date').notNullable();
    table.decimal('fuel_amount', 8, 2).notNullable(); // liters
    table.decimal('fuel_cost', 10, 2).nullable();
    table.string('fuel_station').nullable();
    table.string('fuel_card_number').nullable();
    table.integer('odometer_reading').nullable();
    table.text('notes').nullable();
    table.uuid('recorded_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['vehicle_id']);
    table.index(['fuel_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vehicle_fuel_records');
  await knex.schema.dropTable('vehicle_maintenance');
  await knex.schema.dropTable('vehicles');
}
