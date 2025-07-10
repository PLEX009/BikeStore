import User from '../models/user.js';
import db from '../config/connect.js';

const CrudUsuariosController = {
  // Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena } = req.body;

      // Validar datos requeridos
      if (!num_ident || !nom_com || !email || !contrasena) {
        return res.status(400).json({
          error: '❗ Todos los campos son obligatorios'
        });
      }

      // Verificar si el usuario ya existe
      const userExists = await User.ExistNumIdent(num_ident);
      if (userExists) {
        return res.status(400).json({
          error: '❗ El número de identificación ya está registrado'
        });
      }

      // Crear el usuario
      const userData = {
        id_rol: id_rol || 1, // Por defecto rol de cliente
        nom_com,
        tipo_ident,
        num_ident,
        celular,
        direccion,
        email,
        contrasena
      };

      const newUser = await User.create(userData);

      res.status(201).json({
        mensaje: '✅ Usuario registrado con éxito',
        usuario: {
          id: newUser.id,
          num_ident: newUser.num_ident,
          nom_com,
          email
        }
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor al registrar usuario'
      });
    }
  },

  // Iniciar sesión
  login: async (req, res) => {
    try {
      const { num_ident, contrasena } = req.body;

      // Validar datos requeridos
      if (!num_ident || !contrasena) {
        return res.status(400).json({
          error: '❗ Número de identificación y contraseña son requeridos'
        });
      }

      // Verificar credenciales
      const user = await User.VerificarCredenciales(num_ident, contrasena);

      if (!user) {
        return res.status(401).json({
          error: '❗ Credenciales incorrectas'
        });
      }

      if (user.estado && user.estado.toLowerCase() === 'inactivo') {
        return res.status(403).json({
          error: '⚠️ El usuario está inactivo. Contacte al administrador.'
        });
      }

      let redireccion = '/'; // Cliente por defecto

      if (user.id_rol === 2) {
        redireccion = '/adminDashboard';
      } else if (user.id_rol === 3) {
        redireccion = '/adminDashboard';
      }

      res.json({
        mensaje: '✅ Inicio de sesión exitoso',
        redireccion,
        usuario: {
          id: user.id_usuario, // este es el nombre correcto ahora
          nombre: user.nom_com,
          email: user.email,
          rol: user.id_rol
        }
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor al iniciar sesión'
      });
    }
  },

  // Recuperar contraseña
  recoverPassword: async (req, res) => {
    try {
      const { num_ident_recuperar, email_recuperar } = req.body;

      // Validar datos requeridos
      if (!num_ident_recuperar || !email_recuperar) {
        return res.status(400).json({
          error: '❗ Número de identificación y email son requeridos'
        });
      }

      // Buscar contraseña
      const passwordData = await User.RecordarContraseña(num_ident_recuperar, email_recuperar);

      if (!passwordData) {
        return res.status(404).json({
          error: '❗ No se encontró usuario con ese número de identificación y correo'
        });
      }

      res.json({
        mensaje: `🔐 Contraseña recuperada: ${passwordData.contrasena}\n📧 Enviada al correo electrónico`
      });

    } catch (error) {
      console.error('❌ Error en recuperación de contraseña:', error);
      res.status(500).json({
        error: 'Error interno del servidor al recuperar contraseña'
      });
    }
  },

  // Obtener perfil de usuario
  getProfile: async (req, res) => {
    try {
      const { num_ident } = req.params;

      const user = await User.BuscarIdentificacion(num_ident);

      if (!user) {
        return res.status(404).json({
          error: '❗ Usuario no encontrado'
        });
      }

      // No enviar la contraseña en la respuesta
      const { contrasena, ...userProfile } = user;

      res.json(userProfile);

    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);
      res.status(500).json({
        error: 'Error interno del servidor al obtener perfil'
      });
    }
  },

  // Crear nuevo usuario y login
  crear: (req, res) => {
    const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena } = req.body;
    if (!num_ident || !contrasena) {
      return res.status(400).json({ success: false, message: 'Identificación y contraseña requeridas' });
    }
    // Crear usuario
    const queryUsuario = `INSERT INTO usuarios (id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(queryUsuario, [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al crear usuario', error: err.message });
      }
      // Crear login
      const queryLogin = `INSERT INTO user_login (num_ident, contrasena) VALUES (?, ?)`;
      db.query(queryLogin, [num_ident, contrasena], (err2) => {
        if (err2) {
          return res.status(500).json({ success: false, message: 'Usuario creado, pero error en login', error: err2.message });
        }
        res.status(201).json({ success: true, message: 'Usuario y login creados correctamente', id_usuario: result.insertId });
      });
    });
  },

  // Obtener todos los usuarios
  obtenerTodos: (req, res) => {
    const query = `SELECT u.*, r.nombre as nombre_rol FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol`;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: err.message });
      }
      res.json({ success: true, data: results });
    });
  },

  // Obtener usuario por ID
  obtenerPorId: (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al obtener usuario', error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      res.json({ success: true, data: results[0] });
    });
  },

  // Actualizar usuario y login
  actualizar: (req, res) => {
    const { id } = req.params;
    const { id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, contrasena } = req.body;
    const query = `UPDATE usuarios SET id_rol=?, nom_com=?, tipo_ident=?, num_ident=?, celular=?, direccion=?, email=? WHERE id_usuario=?`;
    db.query(query, [id_rol, nom_com, tipo_ident, num_ident, celular, direccion, email, id], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: err.message });
      }
      // Si se envía contraseña, actualizar también el login
      if (contrasena) {
        db.query('UPDATE user_login SET contrasena=? WHERE num_ident=?', [contrasena, num_ident], (err2) => {
          if (err2) {
            return res.status(500).json({ success: false, message: 'Usuario actualizado, pero error en login', error: err2.message });
          }
          res.json({ success: true, message: 'Usuario y login actualizados correctamente' });
        });
      } else {
        res.json({ success: true, message: 'Usuario actualizado correctamente' });
      }
    });
  },

  // Eliminar usuario y login
  eliminar: (req, res) => {
    const { id } = req.params;
    // Obtener num_ident antes de borrar
    db.query('SELECT num_ident FROM usuarios WHERE id_usuario=?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al buscar usuario', error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      const num_ident = results[0].num_ident;
      // Borrar usuario
      db.query('DELETE FROM usuarios WHERE id_usuario=?', [id], (err2) => {
        if (err2) {
          return res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: err2.message });
        }
        // Borrar login
        db.query('DELETE FROM user_login WHERE num_ident=?', [num_ident], (err3) => {
          if (err3) {
            return res.status(500).json({ success: false, message: 'Usuario eliminado, pero error en login', error: err3.message });
          }
          res.json({ success: true, message: 'Usuario y login eliminados correctamente' });
        });
      });
    });
  },

  // Obtener todos los roles
  obtenerRoles: (req, res) => {
    db.query('SELECT * FROM roles', (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al obtener roles', error: err.message });
      }
      res.json({ success: true, data: results });
    });
  }
};

export default CrudUsuariosController;