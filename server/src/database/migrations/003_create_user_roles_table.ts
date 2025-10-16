import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.uuid('assigned_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
    table.boolean('is_active').defaultTo(true);
    
    table.unique(['user_id', 'role_id']);
    table.index(['user_id']);
    table.index(['role_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_roles');
}
