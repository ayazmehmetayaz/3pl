exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.enum('role', ['admin', 'operation', 'fulfillment', 'accounting', 'marketing', 'hr', 'technical', 'legal', 'training', 'media', 'purchasing', 'customer']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('last_login').nullable();
    table.string('reset_password_token').nullable();
    table.timestamp('reset_password_expires').nullable();
    table.string('verification_token').nullable();
    table.jsonb('preferences').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index('email');
    table.index('username');
    table.index('role');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
