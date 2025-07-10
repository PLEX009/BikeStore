import express from 'express';
import crudProveedoresController from '../controllers/crudProveedores.controller.js';
import upload from '../middleware/upload.js';

/**
 * @file crudProveedores.routes.js
 * @description Rutas para la gestión CRUD de proveedores.
 *
 * ENDPOINTS:
 * - GET    /         → Obtener todos los proveedores
 * - GET    /:id      → Obtener proveedor por ID
 * - POST   /create   → Crear proveedor (con logo)
 * - PUT    /:id      → Actualizar proveedor (con logo)
 * - DELETE /:id      → Eliminar proveedor
 */

const router = express.Router();

/**
 * Obtener todos los proveedores
 * @route GET /
 * @returns {Array} Lista de proveedores
 */
router.get('/', crudProveedoresController.obtenerTodos);

/**
 * Obtener proveedor por ID
 * @route GET /:id
 * @param {string} id - ID del proveedor
 * @returns {Object} Proveedor encontrado
 */
router.get('/:id', crudProveedoresController.obtenerPorId);

/**
 * Crear un nuevo proveedor (con logo)
 * @route POST /create
 * @param {FormData} logo - Logo del proveedor (archivo)
 * @body {Object} Datos del proveedor
 * @returns {Object} Proveedor creado
 */
router.post('/create', upload.single('logo'), crudProveedoresController.crear);

/**
 * Actualizar proveedor por ID (con logo)
 * @route PUT /:id
 * @param {string} id - ID del proveedor a actualizar
 * @param {FormData} logo - Logo del proveedor (archivo)
 * @body {Object} Nuevos datos del proveedor
 * @returns {Object} Proveedor actualizado
 */
router.put('/:id', upload.single('logo'), crudProveedoresController.actualizar);

/**
 * Eliminar proveedor por ID
 * @route DELETE /:id
 * @param {string} id - ID del proveedor a eliminar
 * @returns {Object} Resultado de la eliminación
 */
router.delete('/:id', crudProveedoresController.eliminar);

export default router; 