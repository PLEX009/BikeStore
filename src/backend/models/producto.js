import db from '../config/connect.js';

/**
 * @file producto.js
 * @description Modelo para gestionar los productos de la tienda.
 *
 * ESTRUCTURA DE LA TABLA:
 * - id_producto: ID único del producto
 * - nom_producto: Nombre del producto
 * - descripcion: Descripción del producto
 * - caracteristicas: Características técnicas
 * - precio_uni: Precio unitario
 * - marca: Marca del producto
 * - categoria: Categoría del producto
 * - estado: Estado (disponible, agotado, etc.)
 * - imagen: URL o nombre de la imagen
 * - entradas: Stock ingresado
 * - salidas: Stock vendido
 * - limite: Stock mínimo permitido
 * - id_proveedor: ID del proveedor
 *
 * RELACIONES:
 * - Cada producto puede estar asociado a un proveedor
 */

class Producto {
  /**
   * Obtener todos los productos de la base de datos
   * @function getAll
   * @returns {Promise<Array>} Array de productos con información del proveedor
   * @process Realiza un JOIN entre productos y proveedores para obtener información completa de cada producto.
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.id_producto, p.nom_producto, p.descripcion, p.caracteristicas, p.precio_uni, p.marca, p.categoria, p.estado, p.imagen,
               p.entradas, p.salidas, p.limite, p.id_proveedor, pr.nombre as proveedor_nombre
        FROM productos p
        LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      `;
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  /**
   * Obtener un producto por su ID
   * @function getById
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null si no existe
   * @process Busca un producto específico en la tabla productos usando su ID.
   */
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM productos WHERE id_producto = ?';
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });
  }

  /**
   * Crear un nuevo producto en la base de datos
   * @function create
   * @param {Object} producto - Datos del producto a crear
   * @returns {Promise<Object>} Producto creado con su ID generado
   * @process Inserta un nuevo registro en la tabla productos con los datos proporcionados.
   */
  static async create({ nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite, imagen }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO productos 
        (nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, id_proveedor, imagen, estado, entradas, salidas, limite) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [
        nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, imagen, estado, entradas, salidas, limite
      ], (err, result) => {
        if (err) reject(err);
        else resolve({ id_producto: result.insertId, nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, imagen });
      });
    });
  }

  /**
   * Actualizar los datos de un producto existente
   * @function update
   * @param {number} id - ID del producto a actualizar
   * @param {Object} producto - Nuevos datos del producto
   * @returns {Promise<boolean>} true si se actualizó, false si no se encontró
   * @process Actualiza los campos del producto con el ID dado. Si se proporciona imagen, también la actualiza.
   */
  static async update(id, { nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite, imagen }) {
    return new Promise((resolve, reject) => {
      let sql, params;
      if (imagen) {
        sql = `
          UPDATE productos SET 
          nom_producto=?, descripcion=?, caracteristicas=?, precio_uni=?, marca=?, categoria=?, id_proveedor=?, estado=?, imagen=?, entradas=?, salidas=?, limite=?
          WHERE id_producto=?
        `;
        params = [nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, imagen, entradas, salidas, limite, id];
      } else {
        sql = `
          UPDATE productos SET 
          nom_producto=?, descripcion=?, caracteristicas=?, precio_uni=?, marca=?, categoria=?, id_proveedor=?, estado=?, entradas=?, salidas=?, limite=?
          WHERE id_producto=?
        `;
        params = [nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite, id];
      }
      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Eliminar un producto de la base de datos
   * @function delete
   * @param {number} id - ID del producto a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no se encontró
   * @process Elimina el registro de productos con el ID proporcionado.
   */
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM productos WHERE id_producto = ?';
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }
}

export default Producto; 
