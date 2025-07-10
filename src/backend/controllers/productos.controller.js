import db from '../config/connect.js';

const ProductosController = {
  obtenerProductosConImagen: (req, res) => {
    const query = 'SELECT * FROM productos';

    db.query(query, (err, resultados) => {
      if (err) {
        console.error('❌ Error al obtener productos:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener productos' });
      }
      console.log(resultados[0]);
      const productosConImagen = resultados.map(producto => ({
        id: producto.id_producto,
        nombre: producto.nom_producto,
        precio: producto.precio_uni,
        imagen: producto.imagen ? producto.imagen.replace(/\\/g, '/') : null,
        descripcion: producto.descripcion,
        marcas: producto.marca,
        categoria: producto.categoria, 
        caracteristicas: producto.caracteristicas,
        entradas: producto.entradas,
        estado: producto.estado,
      }));

      res.json(productosConImagen);
    });
  },

  obtenerProductoPorId: (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ?';

    db.query(query, [id], (err, resultados) => {
      if (err) {
        console.error('❌ Error al obtener producto:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener producto' });
      }
      
      if (resultados.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const producto = resultados[0];
      const productoConImagen = {
        id: producto.id_producto,
        nombre: producto.nom_producto,
        precio: producto.precio_uni,
        imagen: producto.imagen ? producto.imagen.replace(/\\/g, '/') : null,
        descripcion: producto.descripcion,
        marcas: producto.marca,
        categoria: producto.categoria, 
        caracteristicas: producto.caracteristicas,
        entradas: producto.entradas,
        estado: producto.estado,
      };

      res.json(productoConImagen);
    });
  },

  procesarCompra: (req, res) => {
    const { productos } = req.body;
    
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos para procesar la compra' });
    }

    // Verificar stock disponible antes de procesar la compra
    const verificarStock = async () => {
      return new Promise((resolve, reject) => {
        const productosSinStock = [];
        let productosVerificados = 0;
        
        productos.forEach(producto => {
          const query = 'SELECT entradas FROM productos WHERE id_producto = ?';
          db.query(query, [producto.id], (err, resultados) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (resultados.length === 0) {
              productosSinStock.push({ id: producto.id, error: 'Producto no encontrado' });
            } else {
              const stockDisponible = resultados[0].entradas;
              if (stockDisponible < producto.cantidad) {
                productosSinStock.push({ 
                  id: producto.id, 
                  stockDisponible, 
                  cantidadSolicitada: producto.cantidad 
                });
              }
            }
            
            productosVerificados++;
            if (productosVerificados === productos.length) {
              resolve(productosSinStock);
            }
          });
        });
      });
    };

    // Procesar la compra - actualizar tanto entradas como salidas
    const procesarCompra = async () => {
      return new Promise((resolve, reject) => {
        let productosProcesados = 0;
        let errores = [];

        productos.forEach(producto => {
          // Actualizar entradas (descontar stock) y salidas (sumar ventas)
          const query = `UPDATE productos 
                        SET entradas = GREATEST(entradas - ?, 0), 
                            salidas = salidas + ? 
                        WHERE id_producto = ?`;
          
          db.query(query, [producto.cantidad, producto.cantidad, producto.id], (err, result) => {
            if (err) {
              errores.push({ id: producto.id, error: err.message });
            }
            
            productosProcesados++;
            
            if (productosProcesados === productos.length) {
              if (errores.length > 0) {
                reject(errores);
              } else {
                resolve();
              }
            }
          });
        });
      });
    };

    // Ejecutar la verificación y compra
    verificarStock()
      .then(productosSinStock => {
        if (productosSinStock.length > 0) {
          return res.status(400).json({ 
            error: 'Algunos productos no tienen stock suficiente', 
            productosSinStock 
          });
        }
        
        return procesarCompra();
      })
      .then(() => {
        res.json({ 
          success: true, 
          message: 'Compra procesada exitosamente',
          totalProductos: productos.length,
          total: productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0)
        });
      })
      .catch(error => {
        console.error('❌ Error al procesar compra:', error);
        // Verificar si ya se envió una respuesta
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al procesar la compra' });
        }
      });
  },

  actualizarStock: (req, res) => {
    const { id, cantidad } = req.body;
    if (!id || !cantidad) {
      return res.status(400).json({ error: 'Faltan datos requeridos (id, cantidad)' });
    }
    // Restar cantidad a entradas y sumar a salidas
    const query = `UPDATE productos SET entradas = GREATEST(entradas - ?, 0), salidas = salidas + ? WHERE id_producto = ?`;
    db.query(query, [cantidad, cantidad, id], (err, result) => {
      if (err) {
        console.error('❌ Error al actualizar stock:', err);
        return res.status(500).json({ error: 'Error al actualizar stock' });
      }
      res.json({ success: true, message: 'Stock actualizado correctamente' });
    });
  },
};

export default ProductosController;
