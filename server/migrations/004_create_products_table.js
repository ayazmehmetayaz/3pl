exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('product_code').unique().notNullable();
    table.string('barcode').nullable();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.string('brand').nullable();
    table.string('unit').defaultTo('adet'); // adet, kg, m, m2, m3, palet
    table.decimal('weight', 10, 3).nullable();
    table.decimal('length', 10, 3).nullable();
    table.decimal('width', 10, 3).nullable();
    table.decimal('height', 10, 3).nullable();
    table.decimal('volume', 10, 3).nullable();
    table.boolean('is_hazardous').defaultTo(false);
    table.boolean('is_fragile').defaultTo(false);
    table.boolean('requires_temperature_control').defaultTo(false);
    table.decimal('min_temperature', 5, 2).nullable();
    table.decimal('max_temperature', 5, 2).nullable();
    table.integer('shelf_life_days').nullable();
    table.string('lot_number').nullable();
    table.date('expiry_date').nullable();
    table.decimal('purchase_price', 15, 2).nullable();
    table.decimal('selling_price', 15, 2).nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('product_code');
    table.index('barcode');
    table.index('name');
    table.index('category');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
