import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('product_code').unique().notNullable();
    table.string('barcode').nullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.string('brand').nullable();
    table.string('unit_of_measure').defaultTo('adet');
    table.decimal('weight', 10, 3).nullable();
    table.decimal('length', 10, 2).nullable();
    table.decimal('width', 10, 2).nullable();
    table.decimal('height', 10, 2).nullable();
    table.decimal('volume', 10, 3).nullable();
    table.boolean('is_hazardous').defaultTo(false);
    table.boolean('requires_temperature_control').defaultTo(false);
    table.integer('min_temperature').nullable();
    table.integer('max_temperature').nullable();
    table.integer('shelf_life_days').nullable();
    table.decimal('cost_price', 10, 2).nullable();
    table.decimal('selling_price', 10, 2).nullable();
    table.enum('status', ['active', 'inactive', 'discontinued']).defaultTo('active');
    table.string('image_url').nullable();
    table.jsonb('attributes').defaultTo('{}');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['product_code']);
    table.index(['barcode']);
    table.index(['name']);
    table.index(['category']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
