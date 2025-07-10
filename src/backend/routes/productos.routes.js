import  express  from 'express';
import ProductosController from '../controllers/productos.controller.js';

/**
 * @file productos.routes.js
 * @description Rutas para la gestión de productos y operaciones relacionadas.
 *
 * ENDPOINTS:
 * - GET    /completos              → Obtener todos los productos con imagen
 * - GET    /:id                    → Obtener producto por ID
 * - PUT    /actualizar-stock       → Actualizar stock de productos
 * - POST   /procesar-compra        → Procesar una compra de productos
 */

const router = express.Router();

/**
 * Obtener todos los productos con imagen
 * @route GET /completos
 * @returns {Array} Lista de productos con imagen
 */
router.get('/completos', ProductosController.obtenerProductosConImagen);

/**
 * Obtener producto por ID
 * @route GET /:id
 * @param {string} id - ID del producto
 * @returns {Object} Producto encontrado
 */
router.get('/:id', ProductosController.obtenerProductoPorId);

/**
 * Actualizar stock de productos
 * @route PUT /actualizar-stock
 * @body {Array} Productos y cantidades a actualizar
 * @returns {Object} Resultado de la actualización
 */
router.put('/actualizar-stock', ProductosController.actualizarStock);

/**
 * Procesar una compra de productos
 * @route POST /procesar-compra
 * @body {Object} Datos de la compra
 * @returns {Object} Resultado del procesamiento de la compra
 */
router.post('/procesar-compra', ProductosController.procesarCompra);

export default router;