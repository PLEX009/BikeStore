/**
 * @file api.js
 * @description Funciones para interactuar con la API del backend desde el frontend.
 */

const API_URL = 'http://localhost:3000/api';

export const obtenerProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return await res.json();
};
