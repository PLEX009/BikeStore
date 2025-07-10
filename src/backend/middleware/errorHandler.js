// -----------------------------------------------------------------------------
// errorHandler.js - Middlewares para manejo centralizado de errores y rutas 404
// -----------------------------------------------------------------------------

// Middleware principal para manejo de errores globales en la aplicación
// Captura errores lanzados en rutas o middlewares y responde con el mensaje adecuado
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err); // Log del error en consola para depuración

  // Manejo de error de validación de datos (por ejemplo, de un ORM como Mongoose)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: err.message
    });
  }

  // Manejo de error por registro duplicado en la base de datos (MySQL, etc.)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'El registro ya existe en la base de datos'
    });
  }

  // Manejo de error de sintaxis en consultas SQL
  if (err.code === 'ER_PARSE_ERROR') {
    return res.status(500).json({
      error: 'Error en la consulta de base de datos'
    });
  }

  // Manejo de cualquier otro error no controlado
  res.status(500).json({
    error: 'Error interno del servidor',
    // En desarrollo muestra el mensaje real, en producción uno genérico
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};

// Middleware para manejar rutas no encontradas (404)
// Si ninguna ruta coincide, responde con error 404 y detalles de la ruta y método
export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.originalUrl,
    metodo: req.method
  });
}; 