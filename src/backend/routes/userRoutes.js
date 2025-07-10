import express from 'express';
import UserController from '../controllers/userControllers.js';

/**
 * @file userRoutes.js
 * @description Rutas para la gestión de usuarios: registro, login, recuperación y perfil.
 *
 * ENDPOINTS:
 * - POST   /registrar               → Registrar un nuevo usuario
 * - POST   /login                   → Iniciar sesión de usuario
 * - POST   /recuperar-contrasena    → Recuperar contraseña de usuario
 * - GET    /perfil/:num_ident       → Obtener perfil de usuario por número de identificación
 */

const router = express.Router();

/**
 * Registrar un nuevo usuario
 * @route POST /registrar
 * @body {Object} Datos del usuario
 * @returns {Object} Usuario registrado
 */
router.post('/registrar', UserController.register);

/**
 * Iniciar sesión de usuario
 * @route POST /login
 * @body {Object} Credenciales de usuario
 * @returns {Object} Resultado del login
 */
router.post('/login', UserController.login);

/**
 * Recuperar contraseña de usuario
 * @route POST /recuperar-contrasena
 * @body {Object} Datos para recuperación
 * @returns {Object} Resultado de la recuperación
 */
router.post('/recuperar-contrasena', UserController.recoverPassword);

/**
 * Obtener perfil de usuario por número de identificación
 * @route GET /perfil/:num_ident
 * @param {string|number} num_ident - Número de identificación del usuario
 * @returns {Object} Perfil del usuario
 */
router.get('/perfil/:num_ident', UserController.getProfile);

export default router;