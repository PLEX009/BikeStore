import db from './config/connect.js';
import Compra from './models/compra.js';
import DetalleCompra from './models/detalleCompra.js';

async function testDatabase() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión básica
    db.query('SELECT 1 as test', (err, results) => {
      if (err) {
        console.error('❌ Error en conexión básica:', err);
        return;
      }
      console.log('✅ Conexión básica exitosa:', results);
    });

    // Probar obtener todas las compras
    console.log('\n🔍 Probando obtener todas las compras...');
    const compras = await Compra.getAll();
    console.log('✅ Compras obtenidas:', compras.length);
    console.log('Primera compra:', compras[0]);

    if (compras.length > 0) {
      const primeraCompra = compras[0];
      console.log('\n🔍 Probando obtener compra por ID:', primeraCompra.id_compra);
      
      const compra = await Compra.getById(primeraCompra.id_compra);
      console.log('✅ Compra por ID:', compra);

      if (compra) {
        console.log('\n🔍 Probando obtener detalles de la compra...');
        const detalles = await DetalleCompra.getByCompraId(primeraCompra.id_compra);
        console.log('✅ Detalles obtenidos:', detalles.length);
        console.log('Detalles:', detalles);
      }
    }

    // Probar estadísticas
    console.log('\n🔍 Probando estadísticas...');
    const stats = await Compra.getStats();
    console.log('✅ Estadísticas:', stats);

  } catch (error) {
    console.error('❌ Error en pruebas:', error);
  } finally {
    db.end();
  }
}

testDatabase(); 