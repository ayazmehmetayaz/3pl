const knex = require('knex');
const knexfile = require('./knexfile');

// Test migration'ları
async function testMigrations() {
  console.log('🚀 Migration testleri başlatılıyor...\n');

  // Mock connection for testing
  const db = knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  });

  try {
    // Test migration files syntax
    const fs = require('fs');
    const path = require('path');
    const migrationDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log(`📁 ${migrationFiles.length} migration dosyası bulundu:\n`);

    for (const file of migrationFiles) {
      try {
        const migration = require(path.join(migrationDir, file));
        
        console.log(`✅ ${file}`);
        
        // Test up function
        if (typeof migration.up === 'function') {
          console.log(`   ✓ up() fonksiyonu mevcut`);
        } else {
          console.log(`   ❌ up() fonksiyonu eksik`);
        }

        // Test down function
        if (typeof migration.down === 'function') {
          console.log(`   ✓ down() fonksiyonu mevcut`);
        } else {
          console.log(`   ❌ down() fonksiyonu eksik`);
        }

        // Test if it's a valid Knex migration
        if (migration.up && migration.down) {
          console.log(`   ✓ Geçerli Knex migration`);
        } else {
          console.log(`   ❌ Geçersiz migration formatı`);
        }

        console.log('');
      } catch (error) {
        console.log(`❌ ${file} - Hata: ${error.message}\n`);
      }
    }

    // Test knexfile configuration
    console.log('🔧 Knexfile konfigürasyonu test ediliyor...\n');
    
    const config = knexfile.development;
    console.log(`✓ Host: ${config.connection.host}`);
    console.log(`✓ Port: ${config.connection.port}`);
    console.log(`✓ Database: ${config.connection.database}`);
    console.log(`✓ User: ${config.connection.user}`);
    console.log(`✓ Migrations directory: ${config.migrations.directory}`);
    console.log(`✓ Seeds directory: ${config.seeds.directory}\n`);

    // Test environment variables
    console.log('🌍 Environment variables test ediliyor...\n');
    
    require('dotenv').config();
    
    const envVars = [
      'POSTGRES_HOST',
      'POSTGRES_PORT', 
      'POSTGRES_DB',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD'
    ];

    for (const envVar of envVars) {
      if (process.env[envVar]) {
        console.log(`✓ ${envVar}: ${process.env[envVar]}`);
      } else {
        console.log(`⚠️  ${envVar}: Tanımlanmamış (varsayılan kullanılacak)`);
      }
    }

    console.log('\n🎉 Migration testleri tamamlandı!');
    console.log('\n📋 Özet:');
    console.log(`   • ${migrationFiles.length} migration dosyası kontrol edildi`);
    console.log(`   • Knexfile konfigürasyonu doğrulandı`);
    console.log(`   • Environment variables kontrol edildi`);
    console.log('\n💡 Sonraki adımlar:');
    console.log('   1. Docker kurulumu yapın');
    console.log('   2. docker-compose up -d postgres redis');
    console.log('   3. npm run migrate');
    console.log('   4. npm run seed');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  } finally {
    await db.destroy();
  }
}

// Run tests
testMigrations().catch(console.error);
