/**
 * Componente HistorialDrawer - Muestra el historial de compras del usuario
 * 
 * Este componente renderiza un drawer lateral que muestra todas las compras
 * realizadas por el usuario autenticado. Incluye detalles de cada compra,
 * estado de entrega, productos comprados y precios.
 * 
 * @param {boolean} visible - Controla si el drawer esta visible o no
 * @param {function} onClose - Funcion que se ejecuta al cerrar el drawer
 * @returns {JSX.Element|null} El componente del historial o null si no esta visible
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import styles from '../styles/historialDrawer.module.css';
import { formatCurrency } from '../utils/FormatColombia';

const HistorialDrawer = ({ visible, onClose }) => {
  // Estado para almacenar la lista de compras del usuario
  const [compras, setCompras] = useState([]);
  // Estado para controlar el estado de carga
  const [loading, setLoading] = useState(false);
  // Estado para manejar errores en la carga de datos
  const [error, setError] = useState(null);
  // Hook personalizado para obtener informacion del usuario autenticado
  const { userInfo } = useAuth();

  // Efecto que se ejecuta cuando el drawer se hace visible y hay un usuario autenticado
  useEffect(() => {
    if (visible && userInfo?.id_usuario) {
      cargarCompras();
    }
  }, [visible, userInfo]);

  /**
   * Funcion para cargar las compras del usuario desde el servidor
   * Realiza una peticion GET al endpoint de compras por usuario
   */
  const cargarCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando compras para usuario:', userInfo.id_usuario);
      // Realiza la peticion al servidor para obtener las compras del usuario
      const response = await axios.get(`http://localhost:3000/api/crudCompras/usuario/${userInfo.id_usuario}`);
      console.log('Respuesta del servidor:', response.data);
      
      // Verifica si la respuesta contiene datos validos
      if (response.data && response.data.data) {
        setCompras(response.data.data);
      } else {
        setCompras([]);
      }
    } catch (error) {
      console.error('Error al cargar compras:', error);
      setError('Error al cargar el historial de compras. Por favor, intenta de nuevo.');
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Funcion para obtener el color correspondiente al estado de la compra
   * @param {string} estado - El estado de la compra (en bodega, en transito, etc.)
   * @returns {string} El color en formato hexadecimal
   */
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en bodega':
      case 'pendiente':
        return '#ff9800'; // Color naranja para pendientes
      case 'en transito':
      case 'en tránsito':
        return '#2196f3'; // Color azul para en transito
      case 'entregado':
      case 'completada':
        return '#4caf50'; // Color verde para entregadas
      case 'cancelada':
        return '#f44336'; // Color rojo para canceladas
      default:
        return '#666'; // Color gris por defecto
    }
  };

  /**
   * Funcion para obtener el icono correspondiente al estado de la compra
   * @param {string} estado - El estado de la compra
   * @returns {string} El emoji correspondiente al estado
   */
  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'en bodega':
      case 'pendiente':
        return '📦'; // Icono de caja para pendientes
      case 'en transito':
      case 'en tránsito':
        return '🚚'; // Icono de camion para en transito
      case 'entregado':
      case 'completada':
        return '✅'; // Icono de check para entregadas
      case 'cancelada':
        return '❌'; // Icono de X para canceladas
      default:
        return '❔'; // Icono de interrogacion por defecto
    }
  };

  /**
   * Funcion para formatear fechas en formato legible
   * @param {string} fecha - La fecha a formatear
   * @returns {string} La fecha formateada en español
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha invalida';
    }
  };

  /**
   * Funcion para formatear precios en formato de moneda colombiana
   * @param {number} precio - El precio a formatear
   * @returns {string} El precio formateado en pesos colombianos
   */
  const formatearPrecio = (precio) => {
    if (!precio || isNaN(precio)) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(precio);
  };

  /**
   * Funcion para obtener la imagen del producto desde diferentes campos posibles
   * @param {object} detalle - El detalle del producto
   * @returns {string} La URL de la imagen del producto
   */
  const obtenerImagenProducto = (detalle) => {
    // Intenta obtener la imagen del producto desde diferentes campos
    return detalle.imagen || 
           detalle.imagen_producto || 
           detalle.url_imagen || 
           '/src/assets/images/bici1.png'; // Usamos una imagen que existe en el proyecto
  };

  /**
   * Funcion para obtener el nombre del producto desde diferentes campos posibles
   * @param {object} detalle - El detalle del producto
   * @returns {string} El nombre del producto
   */
  const obtenerNombreProducto = (detalle) => {
    return detalle.nombre_producto || 
           detalle.nom_producto || 
           `Producto #${detalle.id_producto}`;
  };

  // Si el drawer no esta visible, no renderiza nada
  if (!visible) return null;

  return (
    // Overlay que cubre toda la pantalla y permite cerrar el drawer al hacer click
    <div className={styles.historial_overlay} onClick={onClose}>
      {/* Contenedor principal del drawer */}
      <div className={styles.historial_drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header del drawer con titulo y boton de cerrar */}
        <div className={styles.historial_header}>
          <h2>🧾 Mi Historial de Compras</h2>
          <button className={styles.close_btn} onClick={onClose}>×</button>
        </div>

        {/* Contenido principal del drawer */}
        <div className={styles.historial_content}>
          {/* Estado de carga - muestra un spinner mientras carga los datos */}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando tu historial de compras...</p>
            </div>
          ) : error ? (
            // Estado de error - muestra el mensaje de error y boton para reintentar
            <div className={styles.error_state}>
              <p>⚠️ {error}</p>
              <button 
                className={styles.retry_btn} 
                onClick={cargarCompras}
              >
                Intentar de nuevo
              </button>
            </div>
          ) : compras.length === 0 ? (
            // Estado vacio - cuando no hay compras registradas
            <div className={styles.empty_state}>
              <div className={styles.empty_icon}>🛒</div>
              <h3>No tienes compras registradas</h3>
              <p>Cuando realices tu primera compra, aparecera aqui tu historial completo.</p>
            </div>
          ) : (
            // Lista de compras - renderiza todas las compras del usuario
            <div className={styles.compras_list}>
              {compras.map((compra) => (
                // Contenedor individual para cada compra
                <div key={compra.id_compra} className={styles.compra_item}>
                  {/* Header de la compra con informacion basica */}
                  <div className={styles.compra_header}>
                    <div className={styles.compra_info}>
                      <h3>Compra #{compra.id_compra}</h3>
                      <p className={styles.fecha}>{formatearFecha(compra.fecha_compra)}</p>
                    </div>
                    {/* Badge que muestra el estado de la compra con color e icono */}
                    <div 
                      className={styles.estado_badge}
                      style={{ backgroundColor: getEstadoColor(compra.estado) }}
                    >
                      <span style={{marginRight: '0.5em'}}>{getEstadoIcon(compra.estado)}</span>
                      {compra.estado || 'Pendiente'}
                    </div>
                  </div>
                  
                  {/* Detalles de la compra */}
                  <div className={styles.compra_details}>
                    {/* Total de la compra */}
                    <p className={styles.total}><b>Total:</b> {formatCurrency(compra.total)}</p>
                    
                    {/* Lista de productos comprados */}
                    {compra.detalles && compra.detalles.length > 0 ? (
                      <div className={styles.productos_list}>
                        <h4>Productos comprados:</h4>
                        {/* Grid de productos */}
                        <div className={styles.productos_grid}>
                          {compra.detalles.map((detalle, index) => (
                            // Contenedor individual para cada producto
                            <div key={`${compra.id_compra}-${index}`} className={styles.producto_item}>
                              {/* Contenedor de la imagen del producto */}
                              <div className={styles.producto_img_container}>
                                <img 
                                  src={obtenerImagenProducto(detalle)} 
                                  alt={obtenerNombreProducto(detalle)} 
                                  className={styles.producto_img}
                                  // Manejo de error en la carga de imagen
                                  onError={(e) => {
                                    e.target.src = '/src/assets/images/bici1.png';
                                  }}
                                />
                              </div>
                              {/* Informacion del producto */}
                              <div className={styles.producto_info}>
                                <span className={styles.producto_nombre}>
                                  {obtenerNombreProducto(detalle)}
                                </span>
                                <span className={styles.producto_cantidad}>
                                  Cantidad: {detalle.cantidad || 1}
                                </span>
                                <span className={styles.producto_precio}>Subtotal: {formatCurrency(detalle.subtotal)}</span>
                                {/* Precio unitario si esta disponible */}
                                {detalle.precio_unitario && (
                                  <span className={styles.producto_precio_unitario}>
                                    Precio unitario: {formatCurrency(detalle.precio_unitario)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Mensaje cuando no hay detalles disponibles
                      <div className={styles.no_detalles}>
                        <p>No hay detalles disponibles para esta compra.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialDrawer; 