import db from '../config/connect.js';

const DashboardController = {
  // Obtener estadísticas generales del dashboard + datos para gráficas
  obtenerEstadisticas: (req, res) => {
    console.log('📊 Obteniendo estadísticas del dashboard...');
    // Consultas para resumen
    const queries = {
      productos: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos
        FROM productos
      `,
      usuarios: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos
        FROM usuarios
      `,
      proveedores: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos
        FROM proveedores
      `
    };

    // Consulta para ventas por mes (últimos 6 meses)
    const ventasPorMesQuery = `
      SELECT DATE_FORMAT(fecha_compra, '%Y-%m') as mes, SUM(total) as total_ventas
      FROM compras
      WHERE fecha_compra >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes ASC
    `;

    // Consulta para productos por categoría
    const productosPorCategoriaQuery = `
      SELECT categoria, COUNT(*) as total
      FROM productos
      GROUP BY categoria
      ORDER BY total DESC
    `;

    // Consulta para usuarios activos por mes (si existe fecha_registro)
    const usuariosActivosPorMesQuery = `
      SELECT DATE_FORMAT(fecha_registro, '%Y-%m') as mes, COUNT(*) as total
      FROM usuarios
      WHERE estado = 'activo' AND fecha_registro IS NOT NULL
      AND fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes ASC
    `;

    const resultados = {};
    let consultasCompletadas = 0;
    const totalConsultas = Object.keys(queries).length + 3; // resumen + 3 gráficas

    const procesarResultado = (tipo, error, data) => {
      if (error) {
        console.error(`❌ Error al obtener estadísticas de ${tipo}:`, error);
        if (tipo === 'ventasPorMes' || tipo === 'productosPorCategoria' || tipo === 'usuariosActivosPorMes') {
          resultados[tipo] = [];
        } else {
          resultados[tipo] = { total: 0, activos: 0, inactivos: 0 };
        }
      } else {
        if (tipo === 'ventasPorMes' || tipo === 'productosPorCategoria' || tipo === 'usuariosActivosPorMes') {
          resultados[tipo] = data;
        } else {
          const resultado = data[0] || { total: 0, activos: 0, inactivos: 0 };
          resultados[tipo] = resultado;
        }
      }
      consultasCompletadas++;
      if (consultasCompletadas === totalConsultas) {
        // Formatear datos para frontend
        res.json({
          success: true,
          data: {
            productos: resultados.productos,
            usuarios: resultados.usuarios,
            proveedores: resultados.proveedores,
            ventasPorMes: resultados.ventasPorMes.map(row => Number(row.total_ventas)),
            ventasMesLabels: resultados.ventasPorMes.map(row => row.mes),
            productosPorCategoria: resultados.productosPorCategoria.map(row => Number(row.total)),
            productosCategoriaLabels: resultados.productosPorCategoria.map(row => row.categoria),
            usuariosActivosPorMes: resultados.usuariosActivosPorMes.length > 0 ? resultados.usuariosActivosPorMes.map(row => Number(row.total)) : [resultados.usuarios.activos],
            usuariosActivosMesLabels: resultados.usuariosActivosPorMes.length > 0 ? resultados.usuariosActivosPorMes.map(row => row.mes) : ['Activos']
          }
        });
      }
    };

    // Ejecutar todas las consultas resumen
    db.query(queries.productos, (error, data) => procesarResultado('productos', error, data));
    db.query(queries.usuarios, (error, data) => procesarResultado('usuarios', error, data));
    db.query(queries.proveedores, (error, data) => procesarResultado('proveedores', error, data));
    // Consultas para gráficas
    db.query(ventasPorMesQuery, (error, data) => procesarResultado('ventasPorMes', error, data));
    db.query(productosPorCategoriaQuery, (error, data) => procesarResultado('productosPorCategoria', error, data));
    db.query(usuariosActivosPorMesQuery, (error, data) => procesarResultado('usuariosActivosPorMes', error, data));
  },

  // Obtener estadísticas detalladas de productos por categoría
  obtenerEstadisticasProductos: (req, res) => {
    const query = `
      SELECT 
        categoria,
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        AVG(precio_uni) as precio_promedio
      FROM productos 
      GROUP BY categoria
      ORDER BY total DESC
    `;

    db.query(query, (error, resultados) => {
      if (error) {
        console.error('Error al obtener estadísticas de productos:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener estadísticas de productos',
          error: error.message
        });
      }

      res.json({
        success: true,
        data: resultados
      });
    });
  },

  // Obtener estadísticas de stock
  obtenerEstadisticasStock: (req, res) => {
    const query = `
      SELECT 
        COUNT(*) as total_productos,
        SUM(CASE WHEN entradas = 0 OR entradas IS NULL THEN 1 ELSE 0 END) as agotados,
        SUM(CASE WHEN entradas > 0 AND entradas <= limite THEN 1 ELSE 0 END) as bajo_stock,
        SUM(CASE WHEN entradas > limite THEN 1 ELSE 0 END) as stock_ok,
        AVG(entradas) as promedio_stock
      FROM productos 
      WHERE estado = 'activo'
    `;

    db.query(query, (error, resultados) => {
      if (error) {
        console.error('Error al obtener estadísticas de stock:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener estadísticas de stock',
          error: error.message
        });
      }

      res.json({
        success: true,
        data: resultados[0] || {
          total_productos: 0,
          agotados: 0,
          bajo_stock: 0,
          stock_ok: 0,
          promedio_stock: 0
        }
      });
    });
  },

  // Obtener estadísticas de usuarios por rol
  obtenerEstadisticasUsuarios: (req, res) => {
    const query = `
      SELECT 
        r.nombre as rol,
        COUNT(*) as total,
        SUM(CASE WHEN u.estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN u.estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      GROUP BY r.id_rol, r.nombre
      ORDER BY total DESC
    `;

    db.query(query, (error, resultados) => {
      if (error) {
        console.error('Error al obtener estadísticas de usuarios:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener estadísticas de usuarios',
          error: error.message
        });
      }

      res.json({
        success: true,
        data: resultados
      });
    });
  },

  // Obtener estadísticas de ventas (si existe tabla de ventas)
  obtenerEstadisticasVentas: (req, res) => {
    // Por ahora retornamos datos de ejemplo
    // En el futuro se puede conectar con la tabla de ventas
    res.json({
      success: true,
      data: {
        ventas_hoy: 0,
        ventas_semana: 0,
        ventas_mes: 0,
        promedio_venta: 0,
        productos_mas_vendidos: []
      }
    });
  },

  // Ranking de productos más vendidos, usuarios top y proveedores de productos más vendidos
  getRanking: (req, res) => {
    // Top 3 productos más vendidos
    const topProductosQuery = `
      SELECT p.id_producto, p.nom_producto, SUM(dc.cantidad) as total_vendidos, p.marca, p.categoria, p.precio_uni, p.imagen, pr.nombre as proveedor_nombre
      FROM detalle_compra dc
      JOIN productos p ON dc.id_producto = p.id_producto
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      GROUP BY p.id_producto
      ORDER BY total_vendidos DESC
      LIMIT 3
    `;

    // Top usuarios que más han comprado (por total gastado)
    const topUsuariosQuery = `
      SELECT u.id_usuario, u.nom_com, u.num_ident, SUM(c.total) as total_gastado, COUNT(c.id_compra) as compras
      FROM compras c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      GROUP BY u.id_usuario
      ORDER BY total_gastado DESC
      LIMIT 3
    `;

    // Proveedores de los productos más vendidos (de los top 3)
    // Se obtiene en la misma consulta de productos, pero si se quiere un ranking de proveedores:
    const topProveedoresQuery = `
      SELECT pr.id_proveedor, pr.nombre, SUM(dc.cantidad) as total_vendidos
      FROM detalle_compra dc
      JOIN productos p ON dc.id_producto = p.id_producto
      JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      GROUP BY pr.id_proveedor
      ORDER BY total_vendidos DESC
      LIMIT 3
    `;

    const resultados = {};
    let consultasCompletadas = 0;

    const procesarResultado = (tipo, error, data) => {
      if (error) {
        console.error(`Error al obtener ranking de ${tipo}:`, error);
        resultados[tipo] = [];
      } else {
        resultados[tipo] = data;
      }
      consultasCompletadas++;
      if (consultasCompletadas === 3) {
        res.json({
          success: true,
          data: resultados
        });
      }
    };

    db.query(topProductosQuery, (error, data) => procesarResultado('topProductos', error, data));
    db.query(topUsuariosQuery, (error, data) => procesarResultado('topUsuarios', error, data));
    db.query(topProveedoresQuery, (error, data) => procesarResultado('topProveedores', error, data));
  },

  // Obtener todas las estadísticas en una sola llamada
  obtenerTodasEstadisticas: (req, res) => {
    const queries = {
      general: `
        SELECT 
          (SELECT COUNT(*) FROM productos) as total_productos,
          (SELECT COUNT(*) FROM usuarios) as total_usuarios,
          (SELECT COUNT(*) FROM proveedores) as total_proveedores,
          (SELECT COUNT(*) FROM productos WHERE estado = 'activo') as productos_activos,
          (SELECT COUNT(*) FROM usuarios WHERE estado = 'activo') as usuarios_activos,
          (SELECT COUNT(*) FROM proveedores WHERE estado = 'activo') as proveedores_activos
      `,
      stock: `
        SELECT 
          COUNT(*) as total_productos,
          SUM(CASE WHEN entradas = 0 OR entradas IS NULL THEN 1 ELSE 0 END) as agotados,
          SUM(CASE WHEN entradas > 0 AND entradas <= limite THEN 1 ELSE 0 END) as bajo_stock,
          SUM(CASE WHEN entradas > limite THEN 1 ELSE 0 END) as stock_ok
        FROM productos 
        WHERE estado = 'activo'
      `
    };

    const resultados = {};
    let consultasCompletadas = 0;
    const totalConsultas = Object.keys(queries).length;

    const procesarResultado = (tipo, error, data) => {
      if (error) {
        console.error(`Error al obtener estadísticas ${tipo}:`, error);
        resultados[tipo] = {};
      } else {
        resultados[tipo] = data[0] || {};
      }
      
      consultasCompletadas++;
      
      if (consultasCompletadas === totalConsultas) {
        res.json({
          success: true,
          data: resultados
        });
      }
    };

    // Ejecutar consultas
    db.query(queries.general, (error, data) => procesarResultado('general', error, data));
    db.query(queries.stock, (error, data) => procesarResultado('stock', error, data));
  },

  // Producto mas comprado
  productoMasComprado: (req, res) => {
    const query = `
      SELECT p.id_producto, p.nom_producto AS nombre, SUM(dc.cantidad) AS cantidad, p.imagen
      FROM detalle_compra dc
      JOIN productos p ON dc.id_producto = p.id_producto
      GROUP BY p.id_producto
      ORDER BY cantidad DESC
      LIMIT 1
    `;
    db.query(query, (error, data) => {
      if (error) {
        console.error('Error al obtener el producto mas comprado:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el producto mas comprado', error: error.message });
      }
      res.json({ success: true, data: data[0] || null });
    });
  },

  // Usuario con mas compras
  usuarioMasCompras: (req, res) => {
    const query = `
      SELECT u.id_usuario, u.nom_com AS nombre, COUNT(c.id_compra) AS cantidadCompras
      FROM compras c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      GROUP BY u.id_usuario
      ORDER BY cantidadCompras DESC
      LIMIT 1
    `;
    db.query(query, (error, data) => {
      if (error) {
        console.error('Error al obtener el usuario con mas compras:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el usuario con mas compras', error: error.message });
      }
      res.json({ success: true, data: data[0] || null });
    });
  },

  // Proveedor con mas productos
  proveedorMasProductos: (req, res) => {
    const query = `
      SELECT pr.id_proveedor, pr.nombre, COUNT(p.id_producto) AS cantidadProductos, pr.logo
      FROM proveedores pr
      LEFT JOIN productos p ON pr.id_proveedor = p.id_proveedor
      GROUP BY pr.id_proveedor
      ORDER BY cantidadProductos DESC
      LIMIT 1
    `;
    db.query(query, (error, data) => {
      if (error) {
        console.error('Error al obtener el proveedor con mas productos:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el proveedor con mas productos', error: error.message });
      }
      res.json({ success: true, data: data[0] || null });
    });
  }
};

export default DashboardController; 