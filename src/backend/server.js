import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import productosRoutes from './routes/productos.routes.js';
import userRoutes from './routes/userRoutes.js';
import crudProduct from './routes/crud.routes.js';
import crudAdminUser from './routes/crudAdminUser.routes.js';
import crudProveedores from './routes/crudProveedores.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import crudCompras from './routes/crudCompras.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * @file server.js
 * @description Configuración e inicio del servidor Express para la API principal del backend.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Configuración de middlewares globales (CORS, JSON, logging)
 * - Registro de rutas principales de la API
 * - Manejo de archivos estáticos para uploads
 * - Manejo de rutas no encontradas y errores
 * - Inicio del servidor en el puerto configurado
 */

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Middleware de configuración CORS y parseo de JSON/URL-encoded
 */
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware de logging para todas las requests
 */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/**
 * Rutas principales de la API
 * @route /api
 */
app.use('/api', routes);

app.use('/api/usuarios', userRoutes );
app.use('/api/crudAdminUser', crudAdminUser );
// Obtner informacion de productos
app.use('/api/productos', productosRoutes);
app.use('/api/crudProduct', crudProduct);
app.use('/api/crudProveedores', crudProveedores);
app.use('/api/dashboard', dashboardRoutes);

/**
 * Rutas para archivos estáticos (uploads de imágenes)
 * @route /src/assets/uploads
 */
app.use('/src/assets/uploads', express.static('src/assets/uploads'));

/**
 * Middleware para rutas no encontradas
 */


/**
 * Middleware para manejo de errores
 */
app.use(errorHandler);

/**
 * Inicio del servidor
 */
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${config.nodeEnv}`);
  console.log(`🔗 API disponible en http://localhost:${PORT}/api`);
});

export default app; 