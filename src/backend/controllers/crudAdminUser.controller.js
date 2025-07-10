// Importa el modelo UserAdmin para interactuar con la tabla de administradores en la base de datos
import UserAdmin from '../models/userAdmin.js';
// Importa la conexión a la base de datos
import db from '../config/connect.js';

// Objeto que agrupa los métodos CRUD para usuarios administradores
const crudAdminUser = {
  // Método para crear un nuevo usuario administrador
  crear: async (req, res) => {
    try {
      // Muestra en consola los datos recibidos en la petición para crear el usuario
      console.log('Datos recibidos para crear usuario:', req.body);
      // Crea un nuevo usuario administrador usando los datos recibidos en el cuerpo de la petición
      const user = await UserAdmin.create(req.body);
      // Responde con éxito y el ID del usuario creado
      res.status(201).json({ success: true, message: 'Usuario creado correctamente', id_usuario: user.id });
    } catch (err) {
      // Si ocurre un error, lo muestra en consola y responde con error 500
      console.error('Error al crear usuario:', err);
      res.status(500).json({ success: false, message: 'Error al crear usuario', error: err.message });
    }
  },

  // Método para obtener todos los usuarios administradores
  obtenerTodos: async (req, res) => {
    try {
      // Llama al método del modelo para obtener todos los usuarios
      const users = await UserAdmin.obtenerTodos();
      // Responde con la lista de usuarios
      res.json({ success: true, data: users });
    } catch (err) {
      // Si ocurre un error, responde con error 500
      res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: err.message });
    }
  },

  // Método para obtener un usuario administrador por su ID
  obtenerPorId: async (req, res) => {
    try {
      // Busca el usuario por el ID recibido en los parámetros de la ruta
      const user = await UserAdmin.BuscarPorId(req.params.id);
      // Si no se encuentra el usuario, responde con error 404
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Si se encuentra, responde con los datos del usuario
      res.json({ success: true, data: user });
    } catch (err) {
      // Si ocurre un error, responde con error 500
      res.status(500).json({ success: false, message: 'Error al obtener usuario', error: err.message });
    }
  },

  // Método para actualizar un usuario administrador existente
  actualizar: async (req, res) => {
    try {
      // Muestra en consola los datos recibidos y el ID del usuario a actualizar
      console.log('Datos recibidos para actualizar usuario:', req.body);
      console.log('ID del usuario a actualizar:', req.params.id);
      // Llama al método del modelo para actualizar el usuario con el ID y los nuevos datos
      await UserAdmin.update(req.params.id, req.body);
      // Responde con éxito si la actualización fue correcta
      res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } catch (err) {
      // Si ocurre un error, lo muestra en consola y responde con error 500
      console.error('Error al actualizar usuario:', err);
      res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: err.message });
    }
  },

  // Método para eliminar un usuario administrador
  eliminar: async (req, res) => {
    try {
      // Llama al método del modelo para eliminar el usuario por su ID
      await UserAdmin.eliminar(req.params.id);
      // Responde con éxito si la eliminación fue correcta
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (err) {
      // Si ocurre un error, lo muestra en consola
      console.error('Error al eliminar usuario:', err);
      
      // Si el error es porque el usuario tiene compras asociadas, responde con error 400 y un mensaje específico
      if (err.message && err.message.includes('compras asociadas')) {
        return res.status(400).json({ 
          success: false, 
          message: err.message,
          action: 'error'
        });
      }
      // Para otros errores, responde con error 500
      res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: err.message });
    }
  }
};

// Exporta el objeto con los métodos CRUD para ser usado en las rutas
export default crudAdminUser;