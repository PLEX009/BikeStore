import express from 'express';
import CrudProductosController from '../controllers/crudProductos.controller.js';
import multer from 'multer';
import upload from '../middleware/upload.js';

/**
 * @file crud.routes.js
 * @description Rutas para la gestión CRUD de productos y utilidades relacionadas.
 *
 * ENDPOINTS:
 * - GET    /usuario-ident/:num_ident         → Obtener nombre de usuario por número de identificación
 * - POST   /crearProduct                     → Crear un nuevo producto (con imagen)
 * - GET    /proveedores                      → Obtener lista de proveedores
 * - GET    /:id                              → Obtener producto por ID
 * - GET    /                                 → Obtener todos los productos
 * - DELETE /eliminarProduct/:id              → Eliminar un producto por ID
 * - PUT    /actualizarProduct/:id            → Actualizar un producto por ID (con imagen)
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const router = express.Router();

/**
 * Obtener nombre de usuario por número de identificación
 * @route GET /usuario-ident/:num_ident
 * @param {string} num_ident - Número de identificación del usuario
 * @returns {Object} Nombre del usuario
 */
router.get('/usuario-ident/:num_ident', CrudProductosController.obtenerNombreUsuarioPorIdent);

/**
 * Crear un nuevo producto (con imagen)
 * @route POST /crearProduct
 * @param {FormData} imagen - Imagen del producto (archivo)
 * @body {Object} Datos del producto
 * @returns {Object} Producto creado
 */
router.post('/crearProduct', upload.single('imagen'), CrudProductosController.crear);

/**
 * Obtener lista de proveedores
 * @route GET /proveedores
 * @returns {Array} Lista de proveedores
 */
router.get('/proveedores', CrudProductosController.obtenerProveedores);

/**
 * Obtener producto por ID
 * @route GET /:id
 * @param {string} id - ID del producto
 * @returns {Object} Producto encontrado
 */
router.get('/:id', CrudProductosController.obtenerPorId);

/**
 * Obtener todos los productos
 * @route GET /
 * @returns {Array} Lista de productos
 */
router.get('/', CrudProductosController.obtenerTodos);

/**
 * Eliminar un producto por ID
 * @route DELETE /eliminarProduct/:id
 * @param {string} id - ID del producto a eliminar
 * @returns {Object} Resultado de la eliminación
 */
router.delete('/eliminarProduct/:id', CrudProductosController.eliminar);

/**
 * Actualizar un producto por ID (con imagen)
 * @route PUT /actualizarProduct/:id
 * @param {string} id - ID del producto a actualizar
 * @param {FormData} imagen - Imagen del producto (archivo)
 * @body {Object} Nuevos datos del producto
 * @returns {Object} Producto actualizado
 */
router.put('/actualizarProduct/:id', upload.single('imagen'), CrudProductosController.actualizar);

// Nota: La ruta /proveedores está definida dos veces, pero solo se necesita una.

export default router;
