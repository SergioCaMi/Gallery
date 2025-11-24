require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/image.model');

async function testMongo() {
  console.log('🔍 TEST DE CONEXIÓN MONGODB');
  console.log('================================');
  console.log('USE_DUMMY_AUTH:', process.env.USE_DUMMY_AUTH);
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'CONFIGURADO' : 'NO CONFIGURADO');
  console.log('');

  try {
    // Conectar
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log('📡 Conectando a:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Conexión exitosa');
    console.log('');

    // Listar bases de datos
    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    console.log('📚 Bases de datos disponibles:');
    databases.forEach(db => console.log(`  - ${db.name}`));
    console.log('');

    // Verificar base de datos actual
    const dbName = mongoose.connection.db.databaseName;
    console.log('🎯 Base de datos actual:', dbName);
    console.log('');

    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Colecciones en la base de datos:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('');

    // Contar documentos
    const count = await Image.countDocuments();
    console.log('📊 Total de imágenes en la colección:', count);
    console.log('');

    // Obtener todas las imágenes
    const images = await Image.find({}).limit(5);
    console.log('🖼️  Primeras imágenes encontradas:');
    if (images.length === 0) {
      console.log('  ❌ NO HAY IMÁGENES EN LA COLECCIÓN');
    } else {
      images.forEach((img, idx) => {
        console.log(`  ${idx + 1}. ${img.title} (${img._id})`);
        console.log(`     URL: ${img.urlImagen}`);
        console.log(`     Usuario: ${img.user?.email || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testMongo();
