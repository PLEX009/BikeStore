import express from 'express';
import userRoutes from './userRoutes.js';
// import productosRoutes from '.productos.routes.js';

import productImagenRoutes from './productos.routes.js';
import crudProduct from './crud.routes.js';
import crudAdminUser from './crudAdminUser.routes.js';
import crudProveedores from './crudProveedores.routes.js';
import crudCompras from './crudCompras.routes.js';
import dashboardRoutes from './dashboard.routes.js';
const router = express.Router();

/**
 * @file index.js (routes)
 * @description Archivo principal de rutas. Agrupa y expone todos los endpoints de la API.
 *
 * RUTAS PRINCIPALES:
 * - /usuarios         → Rutas de usuarios
 * - /productos        → Rutas de productos (con imágenes)
 * - /crudAdminUser    → Rutas CRUD de usuarios administradores
 * - /crudProduct      → Rutas CRUD de productos
 * - /crudProveedores  → Rutas CRUD de proveedores
 * - /crudCompras      → Rutas CRUD de compras
 * - /health           → Ruta de prueba para verificar el estado de la API
 */

/**
 * Rutas de usuarios
 * @route /usuarios
 */
router.use('/usuarios', userRoutes);

/**
 * Rutas de productos (con imágenes)
 * @route /productos
 */
router.use('/productos', productImagenRoutes);

/**
 * Rutas CRUD de usuarios administradores
 * @route /crudAdminUser
 */
router.use('/crudAdminUser', crudAdminUser);

/**
 * Rutas CRUD de productos
 * @route /crudProduct
 */
router.use('/crudProduct', crudProduct);

/**
 * Rutas CRUD de proveedores
 * @route /crudProveedores
 */
router.use('/crudProveedores', crudProveedores);

/**
 * Rutas CRUD de compras
 * @route /crudCompras
 */
router.use('/crudCompras', crudCompras);
router.use('/dashboard', dashboardRoutes);

/**
 * Ruta de prueba para verificar el estado de la API
 * @route GET /health
 * @returns {Object} Mensaje de estado y timestamp
 */
router.get('/health', (req, res) => {
  res.json({ 
    mensaje: '✅ API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router; 