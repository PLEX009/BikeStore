import db from '../config/connect.js';

/**
 * @file userAdmin.js
 * @description Modelo para gestionar los usuarios administradores del sistema.
 *
 * ESTRUCTURA DE LAS TABLAS:
 * - usuarios: id_usuario, id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado
 * - user_login: num_ident, contrasena
 *
 * RELACIONES:
 * - Un usuario tiene un registro de login asociado por num_ident
 */

class UserAdmin {
  /**
   * Buscar usuario admin por ID
   * @function BuscarPorId
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
   * @process Realiza un JOIN entre usuarios y user_login para obtener todos los datos y la contraseña del usuario por su ID.
   */
  static async BuscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.*, ul.contrasena
        FROM usuarios u
        LEFT JOIN user_login ul ON u.num_ident = ul.num_ident
        WHERE u.id_usuario = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] || null);
        }
      });
    });
  }

  /**
   * Buscar usuario admin por número de identificación
   * @function BuscarIdentificacion
   * @param {string|number} numIdent - Número de identificación
   * @returns {Promise<Object|null>} Usuario encontrado o null si no existe
   * @process Realiza un JOIN entre usuarios y user_login para obtener todos los datos y la contraseña del usuario por su número de identificación.
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
   * @param {string|number} numIdent - Número de identificación
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
   * Crear un nuevo usuario admin en la base de datos
   * @function create
   * @param {Object} userData - Datos del usuario a crear
   * @returns {Promise<Object>} Usuario creado con su ID generado y número de identificación
   * @process Verifica si ya existe el usuario, luego inserta en la tabla usuarios y crea el registro de login en user_login.
   */
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena, estado = 'activo' } = userData;
      
      // Primero verificar si ya existe un usuario con ese número de identificación
      const sqlCheck = 'SELECT id_usuario FROM usuarios WHERE num_ident = ?';
      db.query(sqlCheck, [num_ident], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          reject(new Error('Ya existe un usuario con ese número de identificación'));
        } else {
          // Insertar en tabla usuarios (sin contraseña)
          const sqlUsuarios = `
            INSERT INTO usuarios (id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.query(sqlUsuarios, [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado], (err, result) => {
            if (err) {
              reject(err);
            } else {
              // Insertar en tabla user_login (solo contraseña)
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
        }
      });
    });
  }

  /**
   * Actualizar los datos de un usuario admin existente
   * @function update
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Promise<Object>} Resultado de la actualización
   * @process Obtiene el num_ident actual, actualiza la tabla usuarios y, si se proporciona, actualiza la contraseña en user_login.
   */
  static async update(id, userData) {
    return new Promise((resolve, reject) => {
      const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena, estado } = userData;

      // Obtener num_ident actual antes de actualizar
      const getOldIdentSql = 'SELECT num_ident FROM usuarios WHERE id_usuario = ?';
      db.query(getOldIdentSql, [id], (err, resultOld) => {
        if (err) return reject(err);

        const oldNumIdent = resultOld[0]?.num_ident;

        // Actualizar tabla usuarios
        const sqlUsuarios = `UPDATE usuarios SET id_rol=?, nom_com=?, tipo_ident=?, num_ident=?, celular=?, direccion=?, email=?, estado=? WHERE id_usuario=?`;
        db.query(sqlUsuarios, [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, estado, id], (err, result) => {
          if (err) return reject(err);

          // Actualizar contraseña si se proporciona
          if (contrasena && oldNumIdent) {
            const sqlLogin = 'UPDATE user_login SET contrasena=? WHERE num_ident=?';
            db.query(sqlLogin, [contrasena, oldNumIdent], (err2, result2) => {
              if (err2) return reject(err2);
              resolve(result);
            });
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  /**
   * Obtener todos los usuarios admin
   * @function obtenerTodos
   * @returns {Promise<Array>} Array de usuarios administradores
   * @process Realiza un JOIN entre usuarios y user_login para obtener todos los datos y contraseñas, ordenados por ID.
   */
  static async obtenerTodos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.*, ul.contrasena
        FROM usuarios u
        LEFT JOIN user_login ul ON u.num_ident = ul.num_ident
        ORDER BY u.id_usuario ASC
      `;
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Eliminar un usuario admin del sistema
   * @function eliminar
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   * @process Obtiene el num_ident, elimina primero de user_login y luego de usuarios. Si tiene compras asociadas, lanza un error específico.
   */
  static async eliminar(id) {
    return new Promise((resolve, reject) => {
      // Primero obtener el num_ident para eliminar de user_login
      const sqlGetUser = 'SELECT num_ident FROM usuarios WHERE id_usuario=?';
      db.query(sqlGetUser, [id], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error('Usuario no encontrado'));
        } else {
          const num_ident = results[0].num_ident;
          
          // Eliminar de user_login primero
          const sqlDeleteLogin = 'DELETE FROM user_login WHERE num_ident=?';
          db.query(sqlDeleteLogin, [num_ident], (err2, result2) => {
            if (err2) {
              reject(err2);
            } else {
              // Luego eliminar de usuarios
              const sqlDeleteUser = 'DELETE FROM usuarios WHERE id_usuario=?';
              db.query(sqlDeleteUser, [id], (err3, result3) => {
                if (err3) {
                  // Si hay error de clave foránea, significa que tiene compras asociadas
                  if (err3.code === 'ER_ROW_IS_REFERENCED_2') {
                    reject(new Error('No se puede eliminar este usuario porque tiene compras asociadas. Se recomienda cambiar el estado a "Inactivo" en su lugar.'));
                  } else {
                    reject(err3);
                  }
                } else {
                  resolve(result3);
                }
              });
            }
          });
        }
      });
    });
  }
}

export default UserAdmin; 