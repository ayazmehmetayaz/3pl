exports.up = function(knex) {
  return knex.schema.createTable('user_modules', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('module_name').notNullable();
    table.boolean('can_read').defaultTo(false);
    table.boolean('can_write').defaultTo(false);
    table.boolean('can_delete').defaultTo(false);
    table.boolean('can_approve').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes
    table.index('user_id');
    table.index('module_name');
    table.unique(['user_id', 'module_name']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_modules');
};
