import db from '../config/connect.js';

/**
 * @file user.js
 * @description Modelo para gestionar los usuarios del sistema.
 *
 * ESTRUCTURA DE LAS TABLAS:
 * - usuarios: id_usuario, id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado
 * - user_login: num_ident, contrasena
 *
 * RELACIONES:
 * - Un usuario tiene un registro de login asociado por num_ident
 */

class User {
  /**
   * Buscar usuario por número de identificación
   * @function BuscarIdentificacion
   * @param {number} numIdent - Número de identificación
   * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
   * @process Realiza un JOIN entre usuarios y user_login para obtener todos los datos y la contraseña del usuario.
   */
  static async BuscarIdentificacion(numIdent) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.*, ul.contrasena
        FROM usuarios u
        LEFT JOIN user_login ul ON u.num_ident = ul.num_ident
        WHERE u.num_ident = ?
      `;
      
      db.query(sql, [numIdent], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  }

  /**
   * Verificar si existe un número de identificación
   * @function ExistNumIdent
   * @param {number} numIdent - Número de identificación
   * @returns {Promise<boolean>} true si existe, false si no
   * @process Consulta la tabla usuarios para verificar si existe el número de identificación.
   */
  static async ExistNumIdent(numIdent) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT num_ident FROM usuarios WHERE num_ident = ?';
      
      db.query(sql, [numIdent], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  }

  /**
   * Crear un nuevo usuario en la base de datos
   * @function create
   * @param {Object} userData - Datos del usuario a crear
   * @returns {Promise<Object>} Usuario creado con su ID generado y número de identificación
   * @process Inserta el usuario en la tabla usuarios y luego crea el registro de login en user_login.
   */
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email,estado, contrasena } = userData;
      
      // Insertar en tabla usuarios
      const sqlUsuarios = `
        INSERT INTO usuarios (id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?,'activo')
      `;
      
      db.query(sqlUsuarios, [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email,estado], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Insertar en tabla user_login
          const sqlLogin = 'INSERT INTO user_login (num_ident, contrasena) VALUES (?, ?)';
          
          db.query(sqlLogin, [num_ident, contrasena], (err2, result2) => {
            if (err2) {
              reject(err2);
            } else {
              resolve({ id: result.insertId, num_ident });
            }
          });
        }
      });
    });
  }

  /**
   * Verificar credenciales de login
   * @function VerificarCredenciales
   * @param {number} numIdent - Número de identificación
   * @param {string} contrasena - Contraseña a verificar
   * @returns {Promise<Object|null>} Usuario si las credenciales son correctas, null si no
   * @process Busca el usuario y compara la contraseña recibida con la almacenada en user_login.
   */
  static async VerificarCredenciales(numIdent, contrasena) {
    return new Promise((resolve, reject) => {
      const sql = `
       SELECT u.id_usuario, u.nom_com, u.email, u.id_rol,u.estado, ul.contrasena
        FROM usuarios u
        JOIN user_login ul ON u.num_ident = ul.num_ident
        WHERE u.num_ident = ?
      `;

      db.query(sql, [numIdent], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          const user = results[0];
          if (user.contrasena === contrasena) {
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  /**
   * Recuperar contraseña de un usuario
   * @function RecordarContraseña
   * @param {number} numIdent - Número de identificación
   * @param {string} email - Correo electrónico asociado
   * @returns {Promise<Object|null>} Contraseña encontrada o null si no coincide
   * @process Busca la contraseña en user_login asociada al usuario y correo proporcionados.
   */
  static async RecordarContraseña(numIdent, email) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT ul.contrasena
        FROM usuarios u
        JOIN user_login ul ON u.num_ident = ul.num_ident
        WHERE u.num_ident = ? AND u.email = ?
      `;
      
      db.query(sql, [numIdent, email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  }
}

export default User; 
