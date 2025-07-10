/**
 * Formatea un número como moneda colombiana
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} showSymbol - Si mostrar el símbolo de pesos (default: true)
 * @returns {string} Precio formateado en peso colombiano
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '$0' : '0';
  }

  // Convertir a número si es string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Formatear con separadores de miles y sin decimales si es un número entero
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);

  // Si no queremos el símbolo, lo removemos
  if (!showSymbol) {
    return formatted.replace('$', '').trim();
  }

  return formatted;
};

/**
 * Formatea un número como moneda colombiana sin el símbolo de pesos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Precio formateado sin símbolo
 */
export const formatCurrencyNoSymbol = (amount) => {
  return formatCurrency(amount, false);
};

/**
 * Convierte un string de precio formateado de vuelta a número
 * @param {string} formattedPrice - Precio formateado (ej: "$1,500,000")
 * @returns {number} Número sin formateo
 */
export const parseFormattedPrice = (formattedPrice) => {
  if (!formattedPrice) return 0;
  
  // Remover símbolo de pesos y espacios, reemplazar comas
  const cleanPrice = formattedPrice.replace(/[$\s]/g, '').replace(/,/g, '');
  return parseFloat(cleanPrice) || 0;
};
