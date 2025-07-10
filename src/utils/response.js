// Utilidades para respuestas estandarizadas

/**
 * Respuesta exitosa
 * Devuelve una respuesta JSON con exito true, mensaje, datos y timestamp
 * @param {object} res - Objeto de respuesta de Express
 * @param {any} data - Datos a retornar
 * @param {string} message - Mensaje opcional (por defecto 'Operacion exitosa')
 * @param {number} statusCode - Codigo de estado HTTP (por defecto 200)
 */
export const successResponse = (res, data, message = 'Operacion exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de error
 * Devuelve una respuesta JSON con exito false, mensaje, error y timestamp
 * @param {object} res - Objeto de respuesta de Express
 * @param {any} error - Error a retornar
 * @param {string} message - Mensaje opcional (por defecto 'Error en la operacion')
 * @param {number} statusCode - Codigo de estado HTTP (por defecto 500)
 */
export const errorResponse = (res, error, message = 'Error en la operacion', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de validacion
 * Devuelve una respuesta JSON con exito false, mensaje, errores y timestamp
 * @param {object} res - Objeto de respuesta de Express
 * @param {any} errors - Errores de validacion
 * @param {string} message - Mensaje opcional (por defecto 'Error de validacion')
 */
export const validationResponse = (res, errors, message = 'Error de validacion') => {
  return res.status(400).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de recurso no encontrado
 * Devuelve una respuesta JSON con exito false y mensaje de recurso no encontrado
 * @param {object} res - Objeto de respuesta de Express
 * @param {string} resource - Nombre del recurso (por defecto 'Recurso')
 */
export const notFoundResponse = (res, resource = 'Recurso') => {
  return res.status(404).json({
    success: false,
    message: `${resource} no encontrado`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de acceso denegado
 * Devuelve una respuesta JSON con exito false y mensaje de acceso denegado
 * @param {object} res - Objeto de respuesta de Express
 * @param {string} message - Mensaje opcional (por defecto 'Acceso denegado')
 */
export const forbiddenResponse = (res, message = 'Acceso denegado') => {
  return res.status(403).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de no autorizado
 * Devuelve una respuesta JSON con exito false y mensaje de no autorizado
 * @param {object} res - Objeto de respuesta de Express
 * @param {string} message - Mensaje opcional (por defecto 'No autorizado')
 */
export const unauthorizedResponse = (res, message = 'No autorizado') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}; 