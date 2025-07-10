/**
 * Componente ProductoCard - Tarjeta de producto para mostrar en catalogo y home
 * 
 * Este componente renderiza una tarjeta individual de producto que permite
 * ver detalles del producto y agregarlo al carrito. Incluye manejo de stock,
 * estados de carga y validaciones de disponibilidad.
 * 
 * @param {object} producto - Objeto con la informacion del producto
 * @param {function} onVerDetalles - Funcion para abrir modal de detalles
 * @param {function} actualizarStockProducto - Funcion para actualizar stock (opcional)
 * @param {function} fetchProductos - Funcion para recargar productos (opcional)
 * @returns {JSX.Element} La tarjeta del producto
 */
// Card de producto para mostrar en el catalogo y home, permite ver detalles y agregar al carrito
import React, { useState, useEffect } from 'react';
import styles from '../styles/productoCard.module.css';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '../context/CarritoContext';
import axios from 'axios';
import { formatCurrency } from '../utils/FormatColombia';

// Componente principal ProductoCard
const ProductoCard = ({ producto, onVerDetalles, actualizarStockProducto, fetchProductos }) => {
  // Hook del contexto del carrito para agregar productos y mostrar toast
  const { agregarProducto, mostrarToast } = useCarrito();
  // Estado para mostrar el toast de agregado exitosamente
  const [agregado, setAgregado] = useState(false);
  // Estado para mostrar loading en el boton durante la actualizacion
  const [actualizando, setActualizando] = useState(false);
  // Estado para el stock actual del producto (se inicializa con el stock del producto)
  const [stockActual, setStockActual] = useState(producto.entradas);

  // Determina si el producto esta agotado (stock 0 o null)
  const agotado = stockActual === 0 || stockActual === null;

  

  /**
   * Funcion para actualizar el stock del producto desde la API
   * Realiza una peticion GET para obtener el stock actualizado
   */
  const actualizarStock = async () => {
    try {
      // Consulta el stock actual del producto desde el servidor
      const response = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
      // Actualiza el estado con el stock real del servidor
      setStockActual(response.data.entradas);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  // Efecto para escuchar eventos de actualizacion del catalogo
  useEffect(() => {
    // Funcion que se ejecuta cuando se dispara el evento personalizado
    const handleActualizarCatalogo = () => {
      actualizarStock();
    };
    // Agrega el listener para el evento personalizado
    window.addEventListener('actualizarCatalogo', handleActualizarCatalogo);
    // Limpia el listener al desmontar el componente para evitar memory leaks
    return () => {
      window.removeEventListener('actualizarCatalogo', handleActualizarCatalogo);
    };
  }, [producto.id]);

  /**
   * Funcion para manejar el click en el boton de agregar al carrito
   * Incluye validaciones de stock y manejo de errores
   */
  const handleAgregar = async () => {
    // Si esta agotado o ya esta actualizando, no hace nada
    if (agotado || actualizando) return;
    
    setActualizando(true);
    try {
      // Verifica el stock actual antes de agregar para evitar conflictos
      const response = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
      const stockDisponible = response.data.entradas;
      
      // Si ya no hay stock, muestra mensaje y no agrega
      if (stockDisponible <= 0) {
        setStockActual(0);
        mostrarToast('Este producto se ha agotado.', 'warning');
        return;
      }
      
      // Agrega el producto al carrito usando el contexto
      await agregarProducto(producto);
      
      // Si se provee fetchProductos, actualiza el catalogo completo
      if (fetchProductos) await fetchProductos();
      
      // Actualiza el stock actual en el estado local
      setStockActual(stockDisponible);
      
      // Muestra el toast de agregado exitosamente por 1 segundo
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1000);
    } catch (error) {
      // Manejo de errores - muestra mensaje al usuario
      mostrarToast('Error al agregar producto al carrito. Intenta de nuevo.', 'error');
    } finally {
      // Siempre resetea el estado de actualizacion
      setActualizando(false);
    }
  };

  return (
    // Card principal del producto con clase condicional si esta agotado
    <div className={`${styles.card} ${agotado ? styles.cardAgotado : ''}`}>
      {/* Seccion de imagen del producto */}
      {producto.imagen ? (
        // Muestra la imagen del producto, ajustando la ruta para el servidor
        <img
          src={`http://localhost:3000/${producto.imagen.replace(/\\/g, '/')}`}
          alt={producto.nombre}
        />
      ) : (
        // Mensaje cuando no hay imagen disponible
        <div className={styles.no_image}>Sin imagen</div>
      )}
      
      {/* Informacion del producto */}
      <h3>{producto.nombre}</h3>
      <p>{formatCurrency(producto.precio)}</p>
      
      {/* Seccion de botones de accion */}
      <div className={styles.actions}>
        {/* Boton para ver detalles del producto */}
        <button onClick={() => onVerDetalles({ ...producto })}>Ver detalles</button>
        
        {/* Boton para agregar al carrito o mensaje de agotado */}
        {agotado ? (
          // Boton deshabilitado cuando el producto esta agotado
          <button disabled className={styles.agotadoBtn}>Agotado</button>
        ) : (
          // Icono de carrito clickeable para agregar al carrito
          <FaShoppingCart 
            className={styles.cart_icon} 
            onClick={handleAgregar} 
            disabled={actualizando} 
          />
        )}
      </div>
      
      {/* Overlay que cubre el producto cuando esta agotado */}
      {agotado && (
        <div className={styles.overlayAgotado} style={{ pointerEvents: 'none' }}>
          <span>Producto Agotado!</span>
        </div>
      )}
      
      {/* Toast de confirmacion cuando se agrega al carrito */}
      {agregado && (
        <div className={styles.toast}>
          <span>🛒 Producto agregado al carrito</span>
        </div>
      )}
    </div>
  );
};

export default ProductoCard;
  