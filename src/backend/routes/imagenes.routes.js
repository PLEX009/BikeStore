import express from 'express';
const router = express.Router();
import imagenesController from '../controllers/imagenes.controller.js';

/**
 * @file imagenes.routes.js
 * @description Rutas para la gestión de imágenes en base64 asociadas a diferentes tablas.
 *
 * ENDPOINTS:
 * - PUT    /subir/:tabla/:campoId/:id      → Actualizar una imagen (base64)
 * - GET    /obtener/:tabla/:campoId/:id    → Obtener una imagen (base64)
 * - GET    /eliminar/:tabla/:campoId/:id   → Eliminar una imagen (pone el campo a NULL)
 * - POST   /insertar/:tabla/:campoId/:id   → Insertar una imagen (base64)
 */

/**
 * Actualizar una imagen (recibe la imagen en base64)
 * @route PUT /subir/:tabla/:campoId/:id
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo identificador
 * @param {string} id - Valor del identificador
 * @body {string} imagen - Imagen en base64
 * @returns {Object} Resultado de la actualización
 */
router.put('/subir/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;
    const imagenBase64 = req.body.imagen;

    if (!imagenBase64) {
        return res.status(400).json({ error: 'Se requiere la imagen base64' });
    }

    try {
        const resultado = await imagenesController.procesarImagen(tabla, campoId, id, imagenBase64);
        res.json(resultado);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

/**
 * Obtener una imagen (devuelve la imagen en base64)
 * @route GET /obtener/:tabla/:campoId/:id
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo identificador
 * @param {string} id - Valor del identificador
 * @returns {Object} Imagen en base64
 */
router.get('/obtener/:tabla/:campoId/:id', async (req, res) => {
    const {tabla, campoId, id } = req.params;

    try {
        const imagen = await imagenesController.procesarImagen(tabla , campoId, id);
        res.json(imagen);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
});

/**
 * Eliminar una imagen (pone el campo imagen a NULL)
 * @route GET /eliminar/:tabla/:campoId/:id
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo identificador
 * @param {string} id - Valor del identificador
 * @returns {Object} Resultado de la eliminación
 */
router.get('/eliminar/:tabla/:campoId/:id', async (req, res) => {
    const {tabla, campoId, id } = req.params;

    try {
        const resultado = await imagenesController.eliminarImagen(tabla , campoId, id);
        res.json(resultado);
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
});

/**
 * Insertar una imagen (recibe la imagen en base64)
 * @route POST /insertar/:tabla/:campoId/:id
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo identificador
 * @param {string} id - Valor del identificador
 * @body {string} imagen - Imagen en base64
 * @returns {Object} Resultado de la inserción
 */
router.post('/insertar/:tabla/:campoId/:id', async (req, res) => {
    const { tabla, campoId, id } = req.params;
    const imagenBase64 = req.body.imagen;

    if (!imagenBase64) {
        return res.status(400).json({ error: 'Se requiere la imagen base64' });
    }

    try {
        const resultado = await imagenesController.insertarImagen(tabla, campoId, id, imagenBase64);
        res.json(resultado);
    } catch (error) {
        console.error('Error al insertar la imagen:', error);
        res.status(500).json({ error: 'Error al insertar la imagen' });
    }
});

export default router;