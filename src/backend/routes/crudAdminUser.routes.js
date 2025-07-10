import express from 'express';
import crudAdminUser from '../controllers/crudAdminUser.controller.js';

/**
 * @file crudAdminUser.routes.js
 * @description Rutas para la gestión CRUD de usuarios administradores.
 *
 * ENDPOINTS:
 * - GET    /         → Obtener todos los usuarios
 * - GET    /:id      → Obtener usuario por ID
 * - POST   /create   → Crear usuario
 * - PUT    /:id      → Actualizar usuario
 * - DELETE /:id      → Eliminar usuario
 */

const router = express.Router();

/**
 * Obtener todos los usuarios administradores
 * @route GET /
 * @returns {Array} Lista de usuarios administradores
 */
router.get('/', crudAdminUser.obtenerTodos);

/**
 * Obtener usuario administrador por ID
 * @route GET /:id
 * @param {string} id - ID del usuario
 * @returns {Object} Usuario encontrado
 */
router.get('/:id', crudAdminUser.obtenerPorId);

/**
 * Crear un nuevo usuario administrador
 * @route POST /create
 * @body {Object} Datos del usuario
 * @returns {Object} Usuario creado
 */
router.post('/create', crudAdminUser.crear);

/**
 * Actualizar usuario administrador por ID
 * @route PUT /:id
 * @param {string} id - ID del usuario a actualizar
 * @body {Object} Nuevos datos del usuario
 * @returns {Object} Usuario actualizado
 */
router.put('/:id', crudAdminUser.actualizar);

/**
 * Eliminar usuario administrador por ID
 * @route DELETE /:id
 * @param {string} id - ID del usuario a eliminar
 * @returns {Object} Resultado de la eliminación
 */
router.delete('/:id', crudAdminUser.eliminar);

export default router;