import Compra from '../models/compra.js';
import DetalleCompra from '../models/detalleCompra.js';
import axios from 'axios';
import db from '../config/connect.js';
const crudComprasController = {
  // Obtener todas las compras
  async obtenerTodas(req, res) {
    try {
      console.log('Obteniendo todas las compras...');
      const compras = await Compra.getAll();
      console.log('Compras obtenidas:', compras.length);
      res.json({ data: compras });
    } catch (err) {
      console.error('Error al obtener compras:', err);
      res.status(500).json({ message: 'Error al obtener compras', error: err.message });
    }
  },

  // Obtener compra por ID con detalles
  async obtenerPorId(req, res) {
    try {
      const compraId = req.params.id;
      console.log('Obteniendo compra con ID:', compraId);
      
      if (!compraId || isNaN(compraId)) {
        return res.status(400).json({ message: 'ID de compra inválido' });
      }
      
      const compra = await Compra.getById(compraId);
      console.log('Compra encontrada:', compra);
      
      if (!compra) {
        console.log('Compra no encontrada');
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      
      console.log('Obteniendo detalles para compra ID:', compraId);
      const detalles = await DetalleCompra.getByCompraId(compraId);
      console.log('Detalles encontrados:', detalles);
      
      const responseData = {
        ...compra,
        detalles: detalles || []
      };
      
      console.log('Enviando respuesta:', responseData);
      res.json({ 
        data: responseData
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      res.status(500).json({ 
        message: 'Error al obtener compra', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  },

  // Obtener compras por usuario
  async obtenerPorUsuario(req, res) {
    try {
      const id_usuario = req.params.id_usuario;
      console.log('Obteniendo compras para usuario:', id_usuario);
      const compras = await Compra.getByUserId(id_usuario);
      console.log('Compras encontradas en backend:', compras);
      // Para cada compra, obtener sus detalles
      for (let compra of compras) {
        compra.detalles = await DetalleCompra.getByCompraId(compra.id_compra);
      }

      res.json({ data: compras });
    } catch (err) {
      console.error('Error al obtener compras del usuario:', err);
      res.status(500).json({ message: 'Error al obtener compras del usuario', error: err.message });
    }
  },

  // Crear compra con detalles
  async crear(req, res) {
    try {
      const { id_usuario, total, estado, detalles } = req.body;
      console.log('Creando compra con datos:', { id_usuario, total, estado, detalles });
      
      if (!id_usuario || !total) {
        return res.status(400).json({ message: 'El usuario y el total son obligatorios' });
      }

      // Verificar stock disponible antes de crear la compra
      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const query = 'SELECT entradas FROM productos WHERE id_producto = ?';
          const [producto] = await new Promise((resolve, reject) => {
            db.query(query, [detalle.id_producto], (err, results) => {
              if (err) reject(err);
              else resolve(results);
            });
          });
          
          if (!producto) {
            return res.status(400).json({ 
              message: `Producto con ID ${detalle.id_producto} no encontrado` 
            });
          }
          
          if (producto.entradas < detalle.cantidad) {
            return res.status(400).json({ 
              message: `Stock insuficiente para el producto ID ${detalle.id_producto}. Disponible: ${producto.entradas}, Solicitado: ${detalle.cantidad}` 
            });
          }
        }
      }

      // Crear la compra
      const compra = await Compra.create({ 
        id_usuario, 
        total, 
        estado: estado || 'pendiente' 
      });

     // Crear los detalles y actualizar stock si se proporcionan
      let detallesCreados = [];
      if (detalles && detalles.length > 0) {
        const detallesConCompra = detalles.map(detalle => ({
          ...detalle,
          id_compra: compra.id_compra
        }));
        detallesCreados = await DetalleCompra.createMultiple(detallesConCompra);
          
        // Actualizar stock de cada producto
        for (const detalle of detalles) {
          const updateQuery = `
            UPDATE productos 
            SET entradas = GREATEST(entradas - ?, 0), 
                salidas = salidas + ? 
            WHERE id_producto = ?
          `;
          
          await new Promise((resolve, reject) => {
            db.query(updateQuery, [detalle.cantidad, detalle.cantidad, detalle.id_producto], (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          });
          
          console.log(`Stock actualizado para producto ${detalle.id_producto}: -${detalle.cantidad} entradas, +${detalle.cantidad} salidas`);
        }
      }

      res.status(201).json({ 
        message: 'Compra creada correctamente', 
        data: {
          ...compra,
          detalles: detallesCreados
        }
      });
    } catch (err) {
      console.error('Error al crear compra:', err);
      res.status(500).json({ message: 'Error al crear compra', error: err.message });
    }
  },

  // Actualizar compra
  async actualizar(req, res) {
    try {
      const compraId = req.params.id;
      const { id_usuario, total, estado } = req.body;
      console.log('Actualizando compra:', compraId, { id_usuario, total, estado });
      
      if (!compraId || isNaN(compraId)) {
        return res.status(400).json({ message: 'ID de compra inválido' });
      }
      
      const actualizado = await Compra.update(compraId, { id_usuario, total, estado });
      if (!actualizado) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json({ message: 'Compra actualizada correctamente' });
    } catch (err) {
      console.error('Error al actualizar compra:', err);
      res.status(500).json({ message: 'Error al actualizar compra', error: err.message });
    }
  },

  // Actualizar estado de compra
  async actualizarEstado(req, res) {
    try {
      const compraId = req.params.id;
      const { estado } = req.body;
      console.log('Actualizando estado de compra:', compraId, 'a:', estado);
      
      if (!estado) {
        return res.status(400).json({ message: 'El estado es obligatorio' });
      }
      
      if (!compraId || isNaN(compraId)) {
        return res.status(400).json({ message: 'ID de compra inválido' });
      }
      
      const actualizado = await Compra.updateStatus(compraId, estado);
      if (!actualizado) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json({ message: 'Estado de compra actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar estado de compra:', err);
      res.status(500).json({ message: 'Error al actualizar estado de compra', error: err.message });
    }
  },

  // Eliminar compra
  async eliminar(req, res) {
    try {
      const compraId = req.params.id;
      console.log('Eliminando compra:', compraId);
      
      if (!compraId || isNaN(compraId)) {
        return res.status(400).json({ message: 'ID de compra inválido' });
      }
      
      // Primero eliminar los detalles de la compra
      await DetalleCompra.deleteByCompraId(compraId);
      
      // Luego eliminar la compra
      const eliminado = await Compra.delete(compraId);
      if (!eliminado) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json({ message: 'Compra eliminada correctamente' });
    } catch (err) {
      console.error('Error al eliminar compra:', err);
      res.status(500).json({ message: 'Error al eliminar compra', error: err.message });
    }
  },

  // Obtener estadísticas de compras
  async obtenerEstadisticas(req, res) {
    try {
      console.log('Obteniendo estadísticas de compras...');
      const stats = await Compra.getStats();
      const topProducts = await DetalleCompra.getTopProducts(5);
      res.json({ 
        data: {
          estadisticas: stats,
          productos_mas_vendidos: topProducts
        }
      });
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      res.status(500).json({ message: 'Error al obtener estadísticas', error: err.message });
    }
  },

  // Obtener detalles de una compra
  async obtenerDetalles(req, res) {
    try {
      const compraId = req.params.compraId;
      console.log('Obteniendo detalles de compra:', compraId);
      
      if (!compraId || isNaN(compraId)) {
        return res.status(400).json({ message: 'ID de compra inválido' });
      }
      
      const detalles = await DetalleCompra.getByCompraId(compraId);
      res.json({ data: detalles });
    } catch (err) {
      console.error('Error al obtener detalles de la compra:', err);
      res.status(500).json({ message: 'Error al obtener detalles de la compra', error: err.message });
    }
  },

  // Crear detalle de compra
  async crearDetalle(req, res) {
    try {
      const { id_compra, id_producto, cantidad, subtotal } = req.body;
      console.log('Creando detalle de compra:', { id_compra, id_producto, cantidad, subtotal });
      
      if (!id_compra || !id_producto || !cantidad || !subtotal) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }

      const detalle = await DetalleCompra.create({ 
        id_compra,  
        id_producto, 
        cantidad, 
        subtotal 
      });

      res.status(201).json({ 
        message: 'Detalle de compra creado correctamente', 
        data: detalle 
      });
    } catch (err) {
      console.error('Error al crear detalle de compra:', err);
      res.status(500).json({ message: 'Error al crear detalle de compra', error: err.message });
    }
  },

  // Actualizar detalle de compra
  async actualizarDetalle(req, res) {
    try {
      const detalleId = req.params.detalleId;
      const { id_compra, id_producto, cantidad, subtotal } = req.body;
      console.log('Actualizando detalle de compra:', detalleId, { id_compra, id_producto, cantidad, subtotal });
      
      if (!detalleId || isNaN(detalleId)) {
        return res.status(400).json({ message: 'ID de detalle inválido' });
      }
      
      const actualizado = await DetalleCompra.update(detalleId, { 
        id_compra, 
        id_producto, 
        cantidad, 
        subtotal 
      });
      if (!actualizado) {
        return res.status(404).json({ message: 'Detalle de compra no encontrado' });
      }
      res.json({ message: 'Detalle de compra actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar detalle de compra:', err);
      res.status(500).json({ message: 'Error al actualizar detalle de compra', error: err.message });
    }
  },

  // Eliminar detalle de compra
  async eliminarDetalle(req, res) {
    try {
      const detalleId = req.params.detalleId;
      console.log('Eliminando detalle de compra:', detalleId);
      
      if (!detalleId || isNaN(detalleId)) {
        return res.status(400).json({ message: 'ID de detalle inválido' });
      }
      
      const eliminado = await DetalleCompra.delete(detalleId);
      if (!eliminado) {
        return res.status(404).json({ message: 'Detalle de compra no encontrado' });
      }
      res.json({ message: 'Detalle de compra eliminado correctamente' });
    } catch (err) {
      console.error('Error al eliminar detalle de compra:', err);
      res.status(500).json({ message: 'Error al eliminar detalle de compra', error: err.message });
    }
  },
  // Obtener historial de compras por usuario (con detalles)
  async obtenerHistorialPorUsuario(req, res) {
    try {
      const compras = await Compra.getByUserId(req.params.id_usuario);
      // Para cada compra, obtener sus detalles
      const comprasConDetalles = await Promise.all(
        compras.map(async (compra) => {
          const detalles = await DetalleCompra.getByCompraId(compra.id_compra);
          return { ...compra, detalles: detalles || [] };
        })
      );
      res.json({ data: comprasConDetalles });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener historial de compras del usuario', error: err });
    }
  },

};


export default crudComprasController; 