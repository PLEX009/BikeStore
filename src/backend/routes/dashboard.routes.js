import express from 'express';
import DashboardController from '../controllers/dashboard.controller.js';

/**
 * @file dashboard.routes.js
 * @description Rutas para la obtención de estadísticas y reportes del dashboard administrativo.
 *
 * ENDPOINTS:
 * - GET /estadisticas                → Obtener estadísticas básicas
 * - GET /todas-estadisticas          → Obtener todas las estadísticas en una sola llamada
 * - GET /estadisticas-productos      → Obtener estadísticas de productos
 * - GET /estadisticas-stock          → Obtener estadísticas de stock
 * - GET /estadisticas-usuarios       → Obtener estadísticas de usuarios
 * - GET /estadisticas-ventas         → Obtener estadísticas de ventas
 */

const router = express.Router();

/**
 * Obtener todas las estadísticas básicas
 * @route GET /estadisticas
 * @returns {Object} Estadísticas básicas
 */
router.get('/estadisticas', DashboardController.obtenerEstadisticas);

/**
 * Obtener todas las estadísticas en una sola llamada
 * @route GET /todas-estadisticas
 * @returns {Object} Todas las estadísticas
 */
router.get('/todas-estadisticas', DashboardController.obtenerTodasEstadisticas);

/** 
 * Obtener estadísticas de productos
 * @route GET /estadisticas-productos
 * @returns {Object} Estadísticas de productos
 */
router.get('/estadisticas-productos', DashboardController.obtenerEstadisticasProductos);

/**
 * Obtener estadísticas de stock
 * @route GET /estadisticas-stock
 * @returns {Object} Estadísticas de stock
 */
router.get('/estadisticas-stock', DashboardController.obtenerEstadisticasStock);

/**
 * Obtener estadísticas de usuarios
 * @route GET /estadisticas-usuarios
 * @returns {Object} Estadísticas de usuarios
 */
router.get('/estadisticas-usuarios', DashboardController.obtenerEstadisticasUsuarios);

/**
 * Obtener estadísticas de ventas
 * @route GET /estadisticas-ventas
 * @returns {Object} Estadísticas de ventas
 */
router.get('/estadisticas-ventas', DashboardController.obtenerEstadisticasVentas);

/**
 * Obtener el producto mas comprado
 * @route GET /producto-mas-comprado
 * @returns {Object} Producto mas comprado
 */
router.get('/producto-mas-comprado', DashboardController.productoMasComprado);

/**
 * Obtener el usuario con mas compras
 * @route GET /usuario-mas-compras
 * @returns {Object} Usuario con mas compras
 */
router.get('/usuario-mas-compras', DashboardController.usuarioMasCompras);

/**
 * Obtener el proveedor con mas productos
 * @route GET /proveedor-mas-productos
 * @returns {Object} Proveedor con mas productos
 */
router.get('/proveedor-mas-productos', DashboardController.proveedorMasProductos);

/**
 * Obtener ranking de productos, usuarios y proveedores top
 * @route GET /ranking
 * @returns {Object} Ranking de productos, usuarios y proveedores
 */
router.get('/ranking', DashboardController.getRanking);

export default router; 