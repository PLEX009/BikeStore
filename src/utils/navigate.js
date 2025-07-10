/**
 * Utilidad de navegacion global para React Router
 * 
 * Permite guardar una referencia global al objeto de navegacion (nav)
 * y realizar navegaciones programaticas desde cualquier parte de la app.
 * 
 * @module navigate
 */
let nav

/**
 * Guarda la referencia global al objeto de navegacion
 * @param {object} n - El objeto de navegacion (por ejemplo, el history o navigate de React Router)
 */
export const setNav = (n) => (nav = n)

/**
 * Navega a la ruta especificada usando el objeto de navegacion global
 * @param {string} path - La ruta a la que se desea navegar
 */
export const go = (path) => nav?.path