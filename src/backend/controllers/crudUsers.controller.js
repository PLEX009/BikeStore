const db = require('../config/connect');

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  db.query(`SELECT u.*, r.nombre as nombre_rol FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol`, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios', error: err });
    res.json({ data: results });
  });
};

// Obtener roles
exports.getRoles = (req, res) => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener roles', error: err });
    res.json({ data: results });
  });
};

// Obtener usuario por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuario', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ data: results[0] });
  });
};

// Crear usuario y login
exports.createUser = (req, res) => {
  const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena } = req.body;
  if (!num_ident || !contrasena) return res.status(400).json({ message: 'Identificación y contraseña requeridas' });
  // Primero crear el usuario
  db.query('INSERT INTO usuarios (id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al crear usuario', error: err });
      // Luego crear el login
      db.query('INSERT INTO user_login (num_ident, contrasena) VALUES (?, ?)',
        [num_ident, contrasena],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Usuario creado, pero error en login', error: err2 });
          res.json({ message: 'Usuario y login creados correctamente' });
        }
      );
    }
  );
};

// Actualizar usuario y login
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena } = req.body;
  db.query('UPDATE usuarios SET id_rol=?, nom_com=?, tipo_ident=?, num_ident=?, celular=?, direccion=?, email=? WHERE id_usuario=?',
    [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar usuario', error: err });
      // Si se envía contraseña, actualizar también el login
      if (contrasena) {
        db.query('UPDATE user_login SET contrasena=? WHERE num_ident=?',
          [contrasena, num_ident],
          (err2) => {
            if (err2) return res.status(500).json({ message: 'Usuario actualizado, pero error en login', error: err2 });
            res.json({ message: 'Usuario y login actualizados correctamente' });
          }
        );
      } else {
        res.json({ message: 'Usuario actualizado correctamente' });
      }
    }
  );
};

// Eliminar usuario y login
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  // Obtener num_ident antes de borrar
  db.query('SELECT num_ident FROM usuarios WHERE id_usuario=?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar usuario', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    const num_ident = results[0].num_ident;
    // Borrar usuario
    db.query('DELETE FROM usuarios WHERE id_usuario=?', [id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error al eliminar usuario', error: err2 });
      // Borrar login
      db.query('DELETE FROM user_login WHERE num_ident=?', [num_ident], (err3) => {
        if (err3) return res.status(500).json({ message: 'Usuario eliminado, pero error en login', error: err3 });
        res.json({ message: 'Usuario y login eliminados correctamente' });
      });
    });
  });
};
