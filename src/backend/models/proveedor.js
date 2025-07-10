import db from '../config/connect.js';

/**
 * @file proveedor.js
 * @description Modelo para gestionar los proveedores de la tienda.
 *
 * ESTRUCTURA DE LA TABLA:
 * - id_proveedor: ID único del proveedor
 * - nombre: Nombre del proveedor
 * - celular: Teléfono de contacto
 * - email: Correo electrónico
 * - direccion: Dirección física
 * - logo: URL o nombre del logo
 * - estado: Estado del proveedor (activo, inactivo, etc.)
 *
 * RELACIONES:
 * - Un proveedor puede estar asociado a varios productos
 */

class Proveedor {
  /**
   * Obtener todos los proveedores de la base de datos
   * @function getAll
   * @returns {Promise<Array>} Array de proveedores
   * @process Realiza una consulta para obtener todos los proveedores ordenados por su ID.
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM proveedores ORDER BY id_proveedor ASC';
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  /**
   * Obtener un proveedor por su ID
   * @function getById
   * @param {number} id - ID del proveedor
   * @returns {Promise<Object|null>} Proveedor encontrado o null si no existe
   * @process Busca un proveedor específico en la tabla proveedores usando su ID.
   */
  static async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM proveedores WHERE id_proveedor = ?';
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });
  }

  /**
   * Crear un nuevo proveedor en la base de datos
   * @function create
   * @param {Object} proveedor - Datos del proveedor a crear
   * @returns {Promise<Object>} Proveedor creado con su ID generado
   * @process Inserta un nuevo registro en la tabla proveedores con los datos proporcionados.
   */
  static async create({ nombre, celular, email, direccion, logo, estado }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO proveedores (nombre, celular, email, direccion, logo, estado) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [nombre, celular, email, direccion, logo, estado], (err, result) => {
        if (err) reject(err);
        else resolve({ id_proveedor: result.insertId, nombre, celular, email, direccion, logo, estado });
      });
    });
  }

  /**
   * Actualizar los datos de un proveedor existente
   * @function update
   * @param {number} id - ID del proveedor a actualizar
   * @param {Object} proveedor - Nuevos datos del proveedor
   * @returns {Promise<boolean>} true si se actualizó, false si no se encontró
   * @process Actualiza los campos del proveedor con el ID dado. Si se proporciona logo, también lo actualiza.
   */
  static async update(id, { nombre, celular, email, direccion, logo, estado }) {
    return new Promise((resolve, reject) => {
      let sql, params;
      if (logo) {
        sql = 'UPDATE proveedores SET nombre=?, celular=?, email=?, direccion=?, logo=?, estado=? WHERE id_proveedor=?';
        params = [nombre, celular, email, direccion, logo, estado, id];
      } else {
        sql = 'UPDATE proveedores SET nombre=?, celular=?, email=?, direccion=?, estado=? WHERE id_proveedor=?';
        params = [nombre, celular, email, direccion, estado, id];
      }
      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }

  /**
   * Eliminar un proveedor de la base de datos
   * @function delete
   * @param {number} id - ID del proveedor a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no se encontró
   * @process Elimina el registro de proveedores con el ID proporcionado.
   */
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM proveedores WHERE id_proveedor=?';
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }
}

export default Proveedor; 
