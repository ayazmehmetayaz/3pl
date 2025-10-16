import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('warehouses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('warehouse_code').unique().notNullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('district').notNullable();
    table.string('postal_code').nullable();
    table.string('country').defaultTo('Turkey');
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.decimal('total_area', 10, 2).nullable();
    table.decimal('storage_capacity', 15, 2).nullable();
    table.boolean('has_temperature_control').defaultTo(false);
    table.boolean('has_hazardous_storage').defaultTo(false);
    table.boolean('is_cross_dock').defaultTo(false);
    table.enum('status', ['active', 'inactive', 'maintenance']).defaultTo('active');
    table.uuid('manager_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['warehouse_code']);
    table.index(['status']);
    table.index(['manager_id']);
  });

  await knex.schema.createTable('warehouse_zones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');
    table.string('zone_code').notNullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.decimal('area', 10, 2).nullable();
    table.integer('capacity').nullable();
    table.boolean('has_temperature_control').defaultTo(false);
    table.boolean('is_hazardous_zone').defaultTo(false);
    table.enum('zone_type', ['storage', 'receiving', 'shipping', 'cross_dock', 'quality_control']).defaultTo('storage');
    table.enum('status', ['active', 'inactive', 'maintenance']).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['warehouse_id', 'zone_code']);
    table.index(['warehouse_id']);
    table.index(['zone_type']);
    table.index(['status']);
  });

  await knex.schema.createTable('warehouse_locations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('zone_id').references('id').inTable('warehouse_zones').onDelete('CASCADE');
    table.string('location_code').notNullable();
    table.string('aisle').nullable();
    table.string('rack').nullable();
    table.string('level').nullable();
    table.string('position').nullable();
    table.decimal('max_weight', 10, 2).nullable();
    table.decimal('max_volume', 10, 3).nullable();
    table.boolean('is_available').defaultTo(true);
    table.enum('location_type', ['pallet', 'shelf', 'floor', 'hanging']).defaultTo('pallet');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['zone_id', 'location_code']);
    table.index(['zone_id']);
    table.index(['is_available']);
    table.index(['location_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('warehouse_locations');
  await knex.schema.dropTable('warehouse_zones');
  await knex.schema.dropTable('warehouses');
}
