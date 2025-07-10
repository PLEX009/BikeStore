import Proveedor from '../models/proveedor.js';
import path from 'path';

const crudProveedoresController = {
  // Obtener todos los proveedores
  async obtenerTodos(req, res) {
    try {
      const proveedores = await Proveedor.getAll();
      res.json({ data: proveedores });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener proveedores', error: err });
    }
  },

  // Obtener proveedor por ID
  async obtenerPorId(req, res) {
    try {
      const proveedor = await Proveedor.getById(req.params.id);
      if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ data: proveedor });
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener proveedor', error: err });
    }
  },

  // Crear proveedor
  async crear(req, res) {
    try {
      const { nombre, celular, email, direccion, estado } = req.body;
      if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
      let logo = null;
      if (req.file) {
        logo = `src/assets/uploads/${req.file.filename}`;
      }
      const proveedor = await Proveedor.create({ nombre, celular, email, direccion, logo, estado: estado || 'activo' });
      res.status(201).json({ message: 'Proveedor creado correctamente', data: proveedor });
    } catch (err) {
      res.status(500).json({ message: 'Error al crear proveedor', error: err });
    }
  },

  // Actualizar proveedor
  async actualizar(req, res) {
    try {
      const { nombre, celular, email, direccion, estado } = req.body;
      let logo = null;
      if (req.file) {
        logo = `src/assets/uploads/${req.file.filename}`;
      }
      const actualizado = await Proveedor.update(req.params.id, { nombre, celular, email, direccion, logo, estado });
      if (!actualizado) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ message: 'Proveedor actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar proveedor', error: err });
    }
  },

  // Eliminar proveedor
  async eliminar(req, res) {
    try {
      const eliminado = await Proveedor.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (err) {
      // Error de clave foránea
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ message: 'No se puede eliminar este proveedor porque tiene productos asociados.' });
      }
      res.status(500).json({ message: 'Error al eliminar proveedor', error: err });
    }
  }
};

export default crudProveedoresController; 