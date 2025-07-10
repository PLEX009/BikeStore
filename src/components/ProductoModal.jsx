import React, {useContext, useState, useEffect} from 'react';
import styles from '../styles/productoModal.module.css';
import { FaShoppingCart, FaTimes, FaStar, FaTruck, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useCarrito } from '../context/CarritoContext';
import axios from 'axios';

// Componente principal ProductoModal
const ProductoModal = ({ producto, onClose, actualizarStockProducto, fetchProductos }) => {
  // Hook del contexto del carrito para agregar productos y mostrar toast
  const { agregarProducto, mostrarToast, carrito } = useCarrito();
  // Estado para mostrar el toast de agregado
  const [agregado, setAgregado] = useState(false);
  // Estado para mostrar loading en el boton
  const [actualizando, setActualizando] = useState(false);
  // Estado para el stock actual del producto
  const [entradas, setEntradas] = useState(producto ? producto.entradas : 0);

  // Efecto para obtener el stock actual al montar o cambiar producto
  useEffect(() => {
    // Funcion para consultar el stock desde la API
    const fetchStock = async () => {
      if (producto && producto.id) {
        try {
          const res = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
          setEntradas(res.data.entradas);
        } catch (error) {
          setEntradas(0);
        }
      }
    };
    fetchStock();
  }, [producto]);

  // Efecto para escuchar eventos de actualizacion del catalogo
  useEffect(() => {
    // Funcion que se ejecuta cuando se dispara el evento personalizado
    const handleActualizarCatalogo = async () => {
      if (producto && producto.id) {
        try {
          const res = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
          setEntradas(res.data.entradas);
        } catch (error) {
          setEntradas(0);
        }
      }
    };
    // Agrega el listener
    window.addEventListener('actualizarCatalogo', handleActualizarCatalogo);
    // Limpia el listener al desmontar
    return () => {
      window.removeEventListener('actualizarCatalogo', handleActualizarCatalogo);
    };
  }, [producto]);

  // Si no hay producto, no renderiza nada
  if (!producto) return null;

  // Determina si el producto esta agotado
  const agotado = entradas === 0 || entradas === null;
  // Determina si quedan pocos productos
  const quedanPocos = entradas > 0 && entradas <= 3;

  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Maneja el click en el boton de agregar al carrito
  const handleAgregar = async () => {
    // Si esta agotado o ya esta actualizando, no hace nada
    if (agotado || actualizando) return;
    setActualizando(true);
    try {
      // Verifica el stock actual antes de agregar
      const response = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
      const stockActual = response.data.entradas;
      
      // Si ya no hay stock, muestra mensaje y no agrega
      if (stockActual <= 0) {
        mostrarToast('Este producto se ha agotado.', 'warning');
        setEntradas(0);
        return;
      }
      
      // Verifica si ya hay suficientes productos en el carrito
      const productoEnCarrito = carrito.find(p => p.id === producto.id);
      const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
      
      if (stockActual <= cantidadEnCarrito) {
        mostrarToast('No hay suficiente stock disponible para agregar más unidades.', 'warning');
        return;
      }
      
      // Agrega el producto al carrito
      await agregarProducto(producto);
      
      // Actualiza el stock local
      setEntradas(stockActual);
      
      // Si se provee fetchProductos, actualiza el catalogo
      if (fetchProductos) {
        setTimeout(() => {
          fetchProductos();
        }, 100);
      }
      
      // Muestra el toast de agregado
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1500);
      
      // Dispara evento para actualizar otros componentes
      window.dispatchEvent(new CustomEvent('actualizarCatalogo'));
      
    } catch (error) {
      console.error('Error al agregar producto:', error);
      mostrarToast('Error al agregar producto al carrito. Intenta de nuevo.', 'error');
    } finally {
      setActualizando(false);
    }
  };

  return (
    // Overlay oscuro que cubre la pantalla
    <div className={styles.modal_overlay} onClick={onClose}>
      {/* Modal principal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>
            <h2>{producto.nombre}</h2>
            <div className={styles.product_rating}>
              <FaStar className={styles.star_icon} />
              <span>4.8</span>
              
            </div>
          </div>
          {/* Boton para cerrar el modal */}
          <button className={styles.close_btn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Contenido principal */}
        <div className={styles.modal_content}>
          {/* Seccion de imagen */}
          <div className={styles.image_section}>
            {producto.imagen ? (
              <div className={styles.image_container}>
                <img
                  src={`http://localhost:3000/${producto.imagen?.replace(/\\/g, '/')}`}
                  alt={producto.nombre}
                  className={styles.product_image}
                />
                {/* Badge de descuento (opcional) */}
                {producto.descuento && (
                  <div className={styles.discount_badge}>
                    -{producto.descuento}%
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.no_image}>
                <div className={styles.no_image_icon}>🛍️</div>
                <p>Imagen no disponible</p>
              </div>
            )}
          </div>

          {/* Seccion de informacion */}
          <div className={styles.info_section}>
            {/* Precio */}
            <div className={styles.price_section}>
              <div className={styles.price_main}>
                <span className={styles.price_label}>Precio:</span>
                <span className={styles.price_value}>{formatearPrecio(producto.precio)}</span>
              </div>
              {producto.precio_anterior && (
                <span className={styles.price_old}>{formatearPrecio(producto.precio_anterior)}</span>
              )}
            </div>

            {/* Stock */}
            <div className={styles.stock_section}>
              {agotado ? (
                <div className={styles.stock_badge_out}>
                  <FaTimes />
                  <span>Agotado</span>
                </div>
              ) : quedanPocos ? (
                <div className={styles.stock_badge_low}>
                  <FaCheckCircle />
                  <span>Solo quedan {entradas} unidades</span>
                </div>
              ) : (
                <div className={styles.stock_badge_available}>
                  <FaCheckCircle />
                  <span>En stock ({entradas} disponibles)</span>
                </div>
              )}
            </div>

            {/* Informacion del producto */}
            <div className={styles.product_details}>
              {producto.marcas && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>Marca:</span>
                  <span className={styles.detail_value}>{producto.marcas}</span>
                </div>
              )}
              
              {producto.descripcion && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>Descripción:</span>
                  <p className={styles.detail_description}>{producto.descripcion}</p>
                </div>
              )}
              
              {producto.caracteristicas && (
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>Características:</span>
                  <p className={styles.detail_description}>{producto.caracteristicas}</p>
                </div>
              )}
            </div>

            {/* Beneficios */}
            <div className={styles.benefits_section}>
              <div className={styles.benefit_item}>
                <FaTruck className={styles.benefit_icon} />
                <span>Envío gratis</span>
              </div>
              <div className={styles.benefit_item}>
                <FaShieldAlt className={styles.benefit_icon} />
                <span>Garantía 1 año</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className={styles.modal_footer}>
          {/* Boton para agregar al carrito */}
          <button 
            className={`${styles.add_to_cart_btn} ${agotado ? styles.disabled : ''}`}
            onClick={handleAgregar}
            disabled={agotado || actualizando}
          >
            <FaShoppingCart className={styles.cart_icon} />
            <span>
              {actualizando ? 'Agregando...' : 
               agotado ? 'Producto agotado' : 
               'Agregar al carrito'}
            </span>
          </button>

          {/* Toast de producto agregado */}
          {agregado && (
            <div className={styles.toast_success}>
              <FaCheckCircle />
              <span>¡Producto agregado al carrito!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
