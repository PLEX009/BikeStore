import express from 'express';
import crudComprasController from '../controllers/crudCompras.controller.js';

/**
 * @file crudCompras.routes.js
 * @description Rutas para la gestión CRUD de compras y sus detalles.
 *
 * ENDPOINTS PRINCIPALES:
 * - POST   /                      → Crear compra
 * - GET    /                      → Obtener todas las compras
 * - GET    /stats                 → Obtener estadísticas de compras
 * - GET    /usuario/:userId       → Obtener compras por usuario
 * - GET    /:compraId/detalles    → Obtener detalles de una compra
 * - POST   /detalles/create       → Crear detalle de compra
 * - PUT    /detalles/:detalleId   → Actualizar detalle de compra
 * - DELETE /detalles/:detalleId   → Eliminar detalle de compra
 * - GET    /:id                   → Obtener compra por ID
 * - PUT    /:id                   → Actualizar compra
 * - PATCH  /:id/estado            → Actualizar estado de compra
 * - DELETE /:id                   → Eliminar compra
 * - GET    /usuario/:id_usuario   → Obtener historial de compras por usuario (con detalles)
 */

const router = express.Router();

/**
 * Middleware de logging para todas las rutas
 */
router.use((req, res, next) => {
  console.log(`[CRUD Compras] ${req.method} ${req.path} - Params:`, req.params, 'Body:', req.body);
  next();
});

/**
 * Crear una nueva compra
 * @route POST /
 * @body {Object} Datos de la compra
 * @returns {Object} Compra creada
 */
router.post('/', crudComprasController.crear);

/**
 * Crear una nueva compra (alias)
 * @route POST /create
 * @body {Object} Datos de la compra
 * @returns {Object} Compra creada
 */
router.post('/create', crudComprasController.crear);

/**
 * Obtener todas las compras
 * @route GET /
 * @returns {Array} Lista de compras
 */
router.get('/', crudComprasController.obtenerTodas);

/**
 * Obtener estadísticas de compras
 * @route GET /stats
 * @returns {Object} Estadísticas de compras
 */
router.get('/stats', crudComprasController.obtenerEstadisticas);

/**
 * Obtener compras por usuario
 * @route GET /usuario/:id_usuario
 * @param {string} id_usuario - ID del usuario
 * @returns {Array} Compras del usuario con detalles
 */
router.get('/usuario/:id_usuario', crudComprasController.obtenerPorUsuario);

/**
 * Obtener detalles de una compra
 * @route GET /:compraId/detalles
 * @param {string} compraId - ID de la compra
 * @returns {Array} Detalles de la compra
 */
router.get('/:compraId/detalles', crudComprasController.obtenerDetalles);

/**
 * Crear detalle de compra
 * @route POST /detalles/create
 * @body {Object} Datos del detalle
 * @returns {Object} Detalle creado
 */
router.post('/detalles/create', crudComprasController.crearDetalle);

/**
 * Actualizar detalle de compra
 * @route PUT /detalles/:detalleId
 * @param {string} detalleId - ID del detalle a actualizar
 * @body {Object} Nuevos datos del detalle
 * @returns {Object} Detalle actualizado
 */
router.put('/detalles/:detalleId', crudComprasController.actualizarDetalle);

/**
 * Eliminar detalle de compra
 * @route DELETE /detalles/:detalleId
 * @param {string} detalleId - ID del detalle a eliminar
 * @returns {Object} Resultado de la eliminación
 */
router.delete('/detalles/:detalleId', crudComprasController.eliminarDetalle);

/**
 * Obtener compra por ID
 * @route GET /:id
 * @param {string} id - ID de la compra
 * @returns {Object} Compra encontrada
 */
router.get('/:id', crudComprasController.obtenerPorId);

/**
 * Actualizar compra por ID
 * @route PUT /:id
 * @param {string} id - ID de la compra a actualizar
 * @body {Object} Nuevos datos de la compra
 * @returns {Object} Compra actualizada
 */
router.put('/:id', crudComprasController.actualizar);

/**
 * Actualizar estado de compra
 * @route PATCH /:id/estado
 * @param {string} id - ID de la compra
 * @body {Object} Nuevo estado
 * @returns {Object} Compra con estado actualizado
 */
router.patch('/:id/estado', crudComprasController.actualizarEstado);

/**
 * Eliminar compra por ID
 * @route DELETE /:id
 * @param {string} id - ID de la compra a eliminar
 * @returns {Object} Resultado de la eliminación
 */
router.delete('/:id', crudComprasController.eliminar);



export default router; 