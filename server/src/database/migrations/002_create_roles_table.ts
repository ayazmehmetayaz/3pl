import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.string('description').nullable();
    table.jsonb('permissions').defaultTo('[]');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['name']);
  });

  // Insert default roles
  await knex('roles').insert([
    {
      name: 'admin',
      description: 'Sistem yöneticisi - tüm modüllere erişim',
      permissions: JSON.stringify([
        'users.create', 'users.read', 'users.update', 'users.delete',
        'wms.*', 'tms.*', 'accounting.*', 'marketing.*', 'hr.*',
        'reporting.*', 'technical.*', 'legal.*', 'training.*',
        'media.*', 'admin.*'
      ])
    },
    {
      name: 'warehouse_manager',
      description: 'Depo yöneticisi',
      permissions: JSON.stringify([
        'wms.create', 'wms.read', 'wms.update',
        'inventory.*', 'receiving.*', 'shipping.*'
      ])
    },
    {
      name: 'warehouse_operator',
      description: 'Depo operatörü',
      permissions: JSON.stringify([
        'wms.read', 'wms.update',
        'inventory.read', 'receiving.create', 'shipping.create'
      ])
    },
    {
      name: 'transport_manager',
      description: 'Nakliye yöneticisi',
      permissions: JSON.stringify([
        'tms.create', 'tms.read', 'tms.update', 'tms.delete',
        'vehicle.*', 'route.*', 'delivery.*'
      ])
    },
    {
      name: 'driver',
      description: 'Sürücü',
      permissions: JSON.stringify([
        'tms.read', 'delivery.update',
        'mobile.app'
      ])
    },
    {
      name: 'accounting_manager',
      description: 'Muhasebe müdürü',
      permissions: JSON.stringify([
        'accounting.*', 'invoice.*', 'payment.*',
        'reporting.financial'
      ])
    },
    {
      name: 'accounting_clerk',
      description: 'Muhasebe memuru',
      permissions: JSON.stringify([
        'accounting.read', 'accounting.create',
        'invoice.create', 'invoice.read', 'payment.create'
      ])
    },
    {
      name: 'marketing_manager',
      description: 'Pazarlama müdürü',
      permissions: JSON.stringify([
        'marketing.*', 'customer.*', 'contract.*',
        'reporting.sales'
      ])
    },
    {
      name: 'hr_manager',
      description: 'İnsan kaynakları müdürü',
      permissions: JSON.stringify([
        'hr.*', 'employee.*', 'payroll.*',
        'training.manage'
      ])
    },
    {
      name: 'customer',
      description: 'Müşteri',
      permissions: JSON.stringify([
        'customer.portal', 'order.create', 'order.read',
        'invoice.read', 'shipment.track'
      ])
    }
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('roles');
}
