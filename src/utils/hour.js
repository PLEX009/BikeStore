/**
 * Funcion obtenerSaludo - Devuelve un saludo segun la hora del dia
 * 
 * Esta funcion obtiene la hora local del navegador y retorna un saludo
 * personalizado: "Buenos dias", "Buenas tardes" o "Buenas noches".
 * 
 * @returns {string} El saludo correspondiente a la hora actual
 */
function obtenerSaludo() {
  // Obtener la hora local del navegador
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) {
    return "Buenos dias";
  } else if (hora >= 12 && hora < 18) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
}

export default obtenerSaludo;