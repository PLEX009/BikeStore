import Producto from '../models/producto.js';
import db from '../config/connect.js';
import path from 'path';

const CrudProductosController = {
  // Crear nuevo producto
  crear: async (req, res) => {
    try {
      let { nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite } = req.body;
      estado = (estado || 'activo').toLowerCase();
      entradas = entradas !== undefined && entradas !== '' ? Number(entradas) : null;
      salidas = salidas !== undefined && salidas !== '' ? Number(salidas) : null;
      limite = limite !== undefined && limite !== '' ? Number(limite) : null;
      const imagen = req.file ? `src/assets/uploads/${req.file.filename}` : null;
      const producto = await Producto.create({ nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite, imagen });
      res.status(201).json({
        success: true,
        data: {
          ...producto,
          imagen: imagen ? `${req.protocol}://${req.get('host')}/${imagen}` : null
        }
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ success: false, message: 'Error al crear el producto', error: error.message });
    }
  },

  // Obtener todos los productos
  obtenerTodos: async (req, res) => {
    try {
      const productos = await Producto.getAll();
      res.json({
        success: true,
        data: productos.map(p => ({
          id_producto: p.id_producto,
          nom_producto: p.nom_producto,
          descripcion: p.descripcion,
          caracteristicas: p.caracteristicas,
          precio_uni: p.precio_uni,
          marca: p.marca,
          categoria: p.categoria,
          estado: p.estado,
          imagen: p.imagen ? `${req.protocol}://${req.get('host')}/${p.imagen.replace('uploads/', 'uploads/')}` : null,
          entradas: p.entradas !== null ? Number(p.entradas) : null,
          salidas: p.salidas !== null ? Number(p.salidas) : null,
          limite: p.limite !== null ? Number(p.limite) : null,
          id_proveedor: p.id_proveedor,
          proveedor: p.proveedor_nombre || null
        }))
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener productos', error: error.message });
    }
  },

  // Obtener producto por ID
  obtenerPorId: async (req, res) => {
    try {
      const producto = await Producto.getById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      res.json({
        success: true,
        data: {
          ...producto,
          imagen: producto.imagen ? `${req.protocol}://${req.get('host')}/${producto.imagen}` : null
        }
      });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ success: false, message: 'Error al obtener el producto', error: error.message });
    }
  },

  // Actualizar producto
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      let { nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite } = req.body;
      estado = (estado || 'activo').toLowerCase();
      entradas = entradas !== undefined && entradas !== '' ? Number(entradas) : null;
      salidas = salidas !== undefined && salidas !== '' ? Number(salidas) : null;
      limite = limite !== undefined && limite !== '' ? Number(limite) : null;
      const imagen = req.file ? `src/assets/uploads/${req.file.filename}` : undefined;
      const actualizado = await Producto.update(id, { nom_producto, descripcion, caracteristicas, precio_uni, marca, categoria, proveedor, estado, entradas, salidas, limite, imagen });
      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      let imagenUrl = null;
      if (req.file) {
        imagenUrl = `${req.protocol}://${req.get('host')}/src/assets/uploads/${req.file.filename}`;
      } else {
        // Si no hay nueva imagen, busca la imagen actual en la base de datos
        const producto = await Producto.getById(id);
        imagenUrl = producto && producto.imagen ? `${req.protocol}://${req.get('host')}/${producto.imagen}` : null;
      }
      res.json({
        success: true,
        data: {
          id_producto: Number(id),
          nom_producto,
          descripcion,
          caracteristicas,
          precio_uni,
          marca,
          categoria,
          estado,
          imagen: imagenUrl
        }
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar el producto', error: error.message });
    }
  },

  // Eliminar producto
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Producto.delete(id);
      if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ success: false, message: 'No se puede eliminar este producto porque tiene compras asociadas.' });
      }
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el producto', error: error.message });
    }
  },

  // Obtener todos los proveedores
  obtenerProveedores: (req, res) => {
    console.log('Entrando a obtenerProveedores');
    const query = "SELECT id_proveedor, nombre FROM proveedores WHERE estado = 'activo' ORDER BY nombre";
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error al obtener proveedores:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener proveedores', error: error.message });
      }
      console.log('Proveedores encontrados:', results);
      res.json({ success: true, data: results });
    });
  },

  // Obtener todas las categorías
  obtenerCategorias: (req, res) => {
    db.query('SELECT id_categoria, nombre FROM categorias', (error, results) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener categorías', error: error.message });
      }
      res.json({ success: true, data: results });
    });
  },

  obtenerNombreUsuarioPorIdent: (req, res) => {
    const { num_ident } = req.params;
    const query = `SELECT nom_com FROM usuarios WHERE num_ident = ?`;
    db.query(query, [num_ident], (error, resultados) => {
      if (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al consultar el nombre del usuario',
          error: error.message
        });
      }
      if (resultados.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      res.json({
        success: true,
        nombre_usuario: resultados[0].nom_com
      });
    });
  },
};

export default CrudProductosController;
