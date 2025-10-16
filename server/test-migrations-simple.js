const fs = require('fs');
const path = require('path');

console.log('🚀 Migration dosyaları kontrol ediliyor...\n');

try {
  const migrationDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  console.log(`📁 ${migrationFiles.length} migration dosyası bulundu:\n`);

  let validCount = 0;
  let errorCount = 0;

  for (const file of migrationFiles) {
    try {
      const migrationPath = path.join(migrationDir, file);
      const migration = require(migrationPath);
      
      console.log(`✅ ${file}`);
      
      // Test up function
      if (typeof migration.up === 'function') {
        console.log(`   ✓ up() fonksiyonu mevcut`);
      } else {
        console.log(`   ❌ up() fonksiyonu eksik`);
        errorCount++;
      }

      // Test down function
      if (typeof migration.down === 'function') {
        console.log(`   ✓ down() fonksiyonu mevcut`);
      } else {
        console.log(`   ❌ down() fonksiyonu eksik`);
        errorCount++;
      }

      // Test if it's a valid Knex migration
      if (migration.up && migration.down) {
        console.log(`   ✓ Geçerli Knex migration`);
        validCount++;
      } else {
        console.log(`   ❌ Geçersiz migration formatı`);
        errorCount++;
      }

      console.log('');
    } catch (error) {
      console.log(`❌ ${file} - Hata: ${error.message}\n`);
      errorCount++;
    }
  }

  // Test knexfile configuration
  console.log('🔧 Knexfile konfigürasyonu test ediliyor...\n');
  
  try {
    const knexfile = require('./knexfile');
    const config = knexfile.development;
    console.log(`✓ Host: ${config.connection.host}`);
    console.log(`✓ Port: ${config.connection.port}`);
    console.log(`✓ Database: ${config.connection.database}`);
    console.log(`✓ User: ${config.connection.user}`);
    console.log(`✓ Migrations directory: ${config.migrations.directory}`);
    console.log(`✓ Seeds directory: ${config.seeds.directory}\n`);
  } catch (error) {
    console.log(`❌ Knexfile hatası: ${error.message}\n`);
    errorCount++;
  }

  console.log('🎉 Migration testleri tamamlandı!\n');
  console.log('📋 Özet:');
  console.log(`   • ${migrationFiles.length} migration dosyası kontrol edildi`);
  console.log(`   • ${validCount} geçerli migration`);
  console.log(`   • ${errorCount} hata`);
  console.log('\n💡 Sonraki adımlar:');
  console.log('   1. Docker kurulumu yapın');
  console.log('   2. docker-compose up -d postgres redis');
  console.log('   3. npm run migrate');
  console.log('   4. npm run seed');

} catch (error) {
  console.error('❌ Test hatası:', error.message);
}
