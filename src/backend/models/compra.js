import db from '../config/connect.js';

class Compra {
  // Obtener todas las compras de la base de datos, incluyendo información del usuario asociado a cada compra
  static async getAll() {
    return new Promise((resolve, reject) => {
      // Consulta SQL: selecciona todas las compras y une los datos del usuario correspondiente
      const sql = `
        SELECT c.*, u.nom_com as nombre_usuario, u.email as email_usuario 
        FROM compras c 
        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario 
        ORDER BY c.fecha_compra DESC
      `;
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Obtener una compra específica por su ID, incluyendo información del usuario asociado
  static async getById(id) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: selecciona la compra con el ID dado y une los datos del usuario correspondiente
      const sql = `
        SELECT c.*, u.nom_com as nombre_usuario, u.email as email_usuario 
        FROM compras c 
        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario 
        WHERE c.id_compra = ?
      `;
      console.log('Ejecutando SQL getById:', sql, 'con ID:', id);
      
      db.query(sql, [id], (err, results) => {
        if (err) {
          console.error('Error en getById:', err);
          reject(err);
        } else {
          console.log('Resultados getById:', results);
          // Devuelve el primer resultado o null si no existe
          resolve(results[0] || null);
        }
      });
    });
  }

  // Obtener todas las compras realizadas por un usuario específico
  static async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: selecciona todas las compras de un usuario y une los datos del usuario
      const sql = `
        SELECT c.*, u.nom_com as nombre_usuario, u.email as email_usuario 
        FROM compras c 
        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario 
        WHERE c.id_usuario = ?
        ORDER BY c.fecha_compra DESC
      `;
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Crear una nueva compra en la base de datos
  static async create({ id_usuario, total, estado }) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: inserta una nueva compra con el usuario, total y estado
      const sql = 'INSERT INTO compras (id_usuario, total, estado) VALUES (?, ?, ?)';
      db.query(sql, [id_usuario, total, estado], (err, result) => {
        if (err) reject(err);
        // Devuelve el ID de la compra creada junto con los datos enviados
        else resolve({ id_compra: result.insertId, id_usuario, total, estado });
      });
    });
  }

  // Actualizar los datos de una compra existente
  static async update(id, { id_usuario, total, estado }) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: actualiza los campos de la compra con el ID dado
      const sql = 'UPDATE compras SET id_usuario=?, total=?, estado=? WHERE id_compra=?';
      db.query(sql, [id_usuario, total, estado, id], (err, result) => {
        if (err) reject(err);
        // Devuelve true si se actualizó alguna fila
        else resolve(result.affectedRows > 0);
      });
    });
  }

  // Actualizar solo el estado de una compra específica
  static async updateStatus(id, estado) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: actualiza el estado de la compra con el ID dado
      const sql = 'UPDATE compras SET estado=? WHERE id_compra=?';
      db.query(sql, [estado, id], (err, result) => {
        if (err) reject(err);
        // Devuelve true si se actualizó alguna fila
        else resolve(result.affectedRows > 0);
      });
    });
  }

  // Eliminar una compra de la base de datos por su ID
  static async delete(id) {
    return new Promise((resolve, reject) => {
      // Consulta SQL: elimina la compra con el ID dado
      const sql = 'DELETE FROM compras WHERE id_compra=?';
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        // Devuelve true si se eliminó alguna fila
        else resolve(result.affectedRows > 0);
      });
    });
  }

  // Obtener estadísticas generales de las compras
  static async getStats() {
    return new Promise((resolve, reject) => {
      /*
        Consulta SQL:
        - Cuenta el total de compras
        - Suma el total de ventas
        - Calcula el promedio de compra
        - Cuenta compras completadas, pendientes y canceladas
      */
      const sql = `
        SELECT 
          COUNT(*) as total_compras,
          SUM(total) as total_ventas,
          AVG(total) as promedio_compra,
          COUNT(CASE WHEN estado = 'completada' THEN 1 END) as compras_completadas,
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as compras_pendientes,
          COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as compras_canceladas
        FROM compras
      `;
      db.query(sql, (err, results) => {
        if (err) reject(err);
        // Devuelve el objeto con las estadísticas o null si no hay datos
        else resolve(results[0] || null);
      });
    });
  }
}

export default Compra; 