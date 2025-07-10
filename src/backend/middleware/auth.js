// -----------------------------------------------------------------------------
// auth.js - Middlewares de autenticación y autorización para rutas protegidas
// -----------------------------------------------------------------------------

// Middleware para verificar si el usuario está autenticado
// Si no hay usuario en la sesión, responde con error 401 (no autorizado)
// Si hay usuario, lo agrega a req.user y permite continuar
export const requireAuth = (req, res, next) => {
  // Aquí puedes implementar la verificación de JWT
  // Por ahora, verificamos si hay un usuario en la sesión
  const user = req.session?.user;
  
  if (!user) {
    return res.status(401).json({
      error: 'Acceso no autorizado. Inicia sesión para continuar.'
    });
  }
  
  req.user = user; // Adjunta el usuario autenticado al request para uso posterior
  next(); // Permite continuar a la siguiente función o ruta
};

// Middleware para verificar si el usuario tiene rol de administrador
// Permite el acceso solo si el usuario tiene rol 1 (admin) o 3 (superusuario)
// Si no cumple, responde con error 403 (prohibido)
export const requireAdmin = (req, res, next) => {
  // Obtiene el usuario de la sesión o del request
  const user = req.session?.user || req.user;
  
  if (!user) {
    return res.status(401).json({
      error: 'Acceso no autorizado. Inicia sesión para continuar.'
    });
  }
  
  // Verifica si el usuario tiene rol de administrador (1) o superusuario (3)
  if (user.rol !== 1 && user.rol !== 3) {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  
  next(); // Permite continuar si el usuario tiene el rol adecuado
};

// Middleware para validar que ciertos campos requeridos estén presentes en el body
// Recibe un array de nombres de campos y verifica que existan en req.body
// Si falta alguno, responde con error 400 y lista los campos faltantes
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    fields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        campos: missingFields
      });
    }
    
    next(); // Permite continuar si no faltan campos
  };
}; 