import db from '../config/connect.js';

/**
 * @file detalleCompra.js
 * @description Modelo para gestionar los detalles de cada compra (productos individuales en una compra).
 *
 * ESTRUCTURA DE LA TABLA:
 * - id_deta_com: ID único del detalle
 * - id_compra: ID de la compra a la que pertenece
 * - id_producto: ID del producto comprado
 * - cantidad: Cantidad del producto
 * - subtotal: Precio total (cantidad * precio unitario)
 *
 * RELACIONES:
 * - Pertenece a una Compra (muchos detalles por compra)
 * - Referencia a un Producto (cada detalle es un producto)
 */

class DetalleCompra {
  /**
   * Obtener todos los productos de una compra específica
   * @function getByCompraId
   * @param {number} compraId - ID de la compra
   * @returns {Promise<Array>} Array con los productos y sus detalles
   * @process Realiza un JOIN entre detalle_compra y productos para obtener información completa de cada producto comprado.
   */
  static async getByCompraId(compraId) {
    return new Promise((resolve, reject) => {
      // SQL con JOIN para obtener información completa del producto
      const sql = `
       SELECT dc.*, p.nom_producto as nombre_producto, p.precio_uni as precio_unitario, p.imagen
        FROM detalle_compra dc
        LEFT JOIN productos p ON dc.id_producto = p.id_producto
        WHERE dc.id_compra = ?
        ORDER BY dc.id_deta_com ASC
      `;
      console.log('Ejecutando SQL getByCompraId:', sql, 'con compraId:', compraId);
      
      db.query(sql, [compraId], (err, results) => {
        if (err) {
          console.error('Error en getByCompraId:', err);
          reject(err);
        } else {
          console.log('Resultados getByCompraId:', results);
          resolve(results);
        }
      });
    });
  }

  /**
   * Obtener un detalle específico por su ID único
   * @function getById
   * @param {number} id - ID del detalle de compra
   * @returns {Promise<Object|null>} Detalle con información del producto o null si no existe
   * @process Realiza un JOIN entre detalle_compra y productos para obtener información completa del producto de ese detalle.
   */
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT dc.*, p.nombre as nombre_producto, p.precio as precio_unitario, p.imagen
        FROM detalle_compra dc
        LEFT JOIN productos p ON dc.id_producto = p.id_producto
        WHERE dc.id_deta_com = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });
  }

  /**
   * Crear un nuevo detalle (producto) en una compra
   * @function create
   * @param {Object} detalle - Datos del detalle a crear
   * @param {number} detalle.id_compra - ID de la compra
   * @param {number} detalle.id_producto - ID del producto
   * @param {number} detalle.cantidad - Cantidad del producto
   * @param {number} detalle.subtotal - Subtotal del producto
   * @returns {Promise<Object>} Detalle creado con su ID generado
   * @process Inserta un nuevo registro en la tabla detalle_compra con los datos proporcionados.
   */
  static async create({ id_compra, id_producto, cantidad, subtotal }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO detalle_compra (id_compra,  id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [id_compra,  id_producto, cantidad, subtotal], (err, result) => {
        if (err) reject(err);
        else resolve({ 
          id_deta_com: result.insertId, // ID generado automáticamente
          id_compra, 
   
          id_producto, 
          cantidad, 
          subtotal 
        });
      });
    });
  }

  /**
   * Crear varios detalles de compra en una sola operación
   * @function createMultiple
   * @param {Array<Object>} detalles - Array de detalles a crear
   * @returns {Promise<Array>} Array con los detalles creados y sus IDs
   * @process Usa un INSERT múltiple para optimizar la inserción de varios productos en una compra.
   */
  static async createMultiple(detalles) {
    return new Promise((resolve, reject) => {
      // Si no hay detalles, retornar array vacío
      if (detalles.length === 0) {
        resolve([]);
        return;
      }

      // SQL para insertar múltiples registros de una vez
      const sql = 'INSERT INTO detalle_compra (id_compra, id_producto, cantidad, subtotal) VALUES ?';
      
      // Preparar los valores para el INSERT múltiple
      const values = detalles.map(detalle => [
        detalle.id_compra,
        detalle.id_producto,
        detalle.cantidad,
        detalle.subtotal
      ]);

      db.query(sql, [values], (err, result) => {
        if (err) reject(err);
        else {
          // Crear array con los detalles creados y sus IDs
          const createdDetalles = detalles.map((detalle, index) => ({
            id_deta_com: result.insertId + index, // Los IDs son consecutivos
            ...detalle
          }));
          resolve(createdDetalles);
        }
      });
    });
  }

  /**
   * Modificar un detalle existente de una compra
   * @function update
   * @param {number} id - ID del detalle a modificar
   * @param {Object} detalle - Nuevos datos del detalle
   * @returns {Promise<boolean>} true si se actualizó, false si no se encontró
   * @process Actualiza los campos del detalle de compra con el ID dado.
   */
  static async update(id, { id_compra, id_producto, cantidad, subtotal }) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE detalle_compra SET id_compra=?,, id_producto=?, cantidad=?, subtotal=? WHERE id_deta_com=?';
      db.query(sql, [id_compra, id_seguimiento || null, id_producto, cantidad, subtotal, id], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0); // true si se actualizó al menos una fila
      });
    });
  }

  /**
   * Eliminar un detalle específico de una compra
   * @function delete
   * @param {number} id - ID del detalle a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no se encontró
   * @process Elimina el registro de detalle_compra con el ID proporcionado.
   */
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM detalle_compra WHERE id_deta_com=?';
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Eliminar todos los detalles de una compra específica
   * @function deleteByCompraId
   * @param {number} compraId - ID de la compra
   * @returns {Promise<boolean>} true si se eliminaron detalles, false si no
   * @process Elimina todos los registros de detalle_compra asociados a una compra.
   */
  static async deleteByCompraId(compraId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM detalle_compra WHERE id_compra=?';
      db.query(sql, [compraId], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Obtener los productos más vendidos
   * @function getTopProducts
   * @param {number} [limit=10] - Número máximo de productos a retornar
   * @returns {Promise<Array>} Array con los productos más vendidos y sus estadísticas
   * @process Agrupa los detalles por producto, suma cantidades y subtotales, y ordena por ventas.
   */
  static async getTopProducts(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          p.id_producto,
          p.nombre as nombre_producto,
          p.imagen,
          SUM(dc.cantidad) as total_vendido,
          SUM(dc.subtotal) as total_ingresos
        FROM detalle_compra dc
        LEFT JOIN productos p ON dc.id_producto = p.id_producto
        GROUP BY p.id_producto, p.nombre, p.imagen
        ORDER BY total_vendido DESC
        LIMIT ?
      `;
      db.query(sql, [limit], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

export default DetalleCompra; 
