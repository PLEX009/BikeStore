import React, { useState, useEffect } from 'react';
import styles from '../styles/CarritoDrawer.module.css';
import { useCarrito } from '../context/CarritoContext';
import axios from 'axios';
import { formatCurrency } from '../utils/FormatColombia';

/**
 * @file CarritoDrawer.jsx
 * @description Componente para mostrar el carrito de compras como un drawer lateral.
 * Permite ver, modificar y procesar los productos en el carrito, asi como gestionar la autenticacion del usuario.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Mostrar productos agregados al carrito con su cantidad y stock disponible
 * - Permitir aumentar, disminuir o eliminar productos del carrito
 * - Procesar la compra y vaciar el carrito
 * - Verificar autenticacion antes de comprar
 * - Redirigir al login si el usuario no esta autenticado
 */

/**
 * Componente CarritoDrawer
 * @param {Object} props
 * @param {boolean} props.visible - Indica si el drawer esta visible
 * @param {Function} props.onClose - Funcion para cerrar el drawer
 * @returns {JSX.Element|null} Drawer del carrito o null si no esta visible
 */
const CarritoDrawer = ({ visible, onClose }) => {
  // Contexto del carrito con funciones y estado global
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    cerrarDrawer,
    procesarCompra,
    verificarAutenticacion
  } = useCarrito();

  // Estado para el stock disponible de cada producto
  const [stockDisponible, setStockDisponible] = useState({});
  // Estado para mostrar loading al procesar la compra
  const [procesandoCompra, setProcesandoCompra] = useState(false);

  /**
   * Obtiene el stock disponible de un producto desde la API
   * @param {string|number} id - ID del producto
   * @returns {Promise<number>} Stock disponible
   */
  const obtenerStockDisponible = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/productos/${id}`);
      return response.data.entradas;
    } catch (error) {
      console.error('Error al obtener stock:', error);
      return 0;
    }
  };

  // Cargar stock disponible para todos los productos en el carrito cuando cambia el carrito
  useEffect(() => {
    const cargarStock = async () => {
      const stockData = {};
      for (const producto of carrito) {
        stockData[producto.id] = await obtenerStockDisponible(producto.id);
      }
      setStockDisponible(stockData);
    };

    if (carrito.length > 0) {
      cargarStock();
    }
  }, [carrito]);

  // Calcular el total del carrito
  const total = carrito.reduce((acc, prod) => acc + parseFloat(prod.precio) * prod.cantidad, 0);

  /**
   * Procesa la compra de los productos en el carrito
   * - Verifica autenticacion
   * - Llama a la funcion global de procesarCompra
   * - Cierra el drawer si la compra es exitosa
   */
  const handleComprar = async () => {
    if (carrito.length === 0) {
      return; // El toast ya se muestra en procesarCompra
    }

    // Verificar autenticacion antes de procesar la compra
    if (!verificarAutenticacion()) {
      return; // El toast ya se muestra en procesarCompra
    }

    setProcesandoCompra(true);
    try {
      const compraExitosa = await procesarCompra();
      if (compraExitosa) {
        cerrarDrawer();
      }
    } catch (error) {
      console.error('Error en la compra:', error);
    } finally {
      setProcesandoCompra(false);
    }
  };

  /**
   * Disminuye la cantidad de un producto en el carrito
   * @param {string|number} id - ID del producto
   */
  const handleDisminuir = async (id) => {
    await disminuirCantidad(id);
  };

  /**
   * Elimina un producto del carrito
   * @param {string|number} id - ID del producto
   */
  const handleEliminar = async (id) => {
    await eliminarProducto(id);
  };

  /**
   * Cierra el drawer del carrito
   */
  const handleCerrar = () => {
    cerrarDrawer();
    if (onClose) onClose();
  };

  /**
   * Redirige al login y cierra el drawer
   */
  const handleIrAlLogin = () => {
    cerrarDrawer();
    window.location.href = '/loginRegister';
  };

  // Debug: mostrar el contenido del carrito en consola
  console.log('Carrito en Drawer:', carrito);

  // Si el drawer no esta visible, no renderizar nada
  if (!visible) return null;

  return (
    // Overlay oscuro que cubre la pantalla y cierra el drawer al hacer click fuera
    <div className={styles.overlay} onClick={handleCerrar}>
      {/* Drawer lateral que contiene el carrito. El stopPropagation evita que se cierre al hacer click dentro */}
      <div
        className={`${styles.drawer} ${styles.open}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del drawer con titulo y boton de cerrar */}
        <div className={styles.header}>
          <h2>Carrito</h2>
          <button className={styles.closeBtn} onClick={handleCerrar}>✖</button>
        </div>

        {/* Contenido principal: lista de productos o mensaje de vacio */}
        <div className={styles.content}>
          {carrito.length === 0 ? (
            // Si el carrito esta vacio, mostrar mensaje
            <p>Tu carrito esta vacio.</p>
          ) : (
            // Si hay productos, renderizar cada producto
            carrito.map((prod) => {
              const stockActual = stockDisponible[prod.id] || 0;
              return (
                // Producto individual en el carrito
                <div key={prod.id} className={styles.producto}>
                  {/* Informacion e imagen del producto */}
                  <div style={{ display: 'flex', gap: '10px' }} className={styles.producto_info}>
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '4px' }}
                    />
                    <div className={styles.info}>
                      <strong>{prod.nombre}</strong>
                      <p>{formatCurrency(prod.precio)}</p>
                      {/* Contador de cantidad con botones para aumentar/disminuir */}
                      <div className={styles.contador}>
                        <button onClick={() => handleDisminuir(prod.id)}>-</button>
                        <span>{prod.cantidad}</span>
                        <button onClick={() => aumentarCantidad(prod.id)} disabled={stockActual === 0}>+</button>
                      </div>
                    </div>
                  </div>
                  {/* Boton para eliminar el producto del carrito */}
                  <button className={styles.boton_eliminar} onClick={() => handleEliminar(prod.id)}>🗑️</button>
                </div>
              );
            })
          )}
        </div>

        {/* Pie del drawer: total y acciones de compra o login */}
        {carrito.length > 0 && (
          <div className={styles.footer}>
            {/* Total de la compra */}
            <p className={styles.precio_total}><strong>Total:</strong> {formatCurrency(total.toFixed(2))}</p>
            {/* Si el usuario esta autenticado, mostrar boton de comprar */}
            {verificarAutenticacion() ? (
              <button 
                className={styles.buyBtn} 
                onClick={handleComprar}
                disabled={procesandoCompra}
              >
                {procesandoCompra ? 'Procesando...' : 'Comprar'}
              </button>
            ) : (
              // Si no esta autenticado, mostrar mensaje y boton para ir al login
              <div className={styles.authRequired}>
                <p className={styles.authMessage}>Inicia sesion o registrate para continuar con tu compra</p>
                <button 
                  className={styles.loginBtn} 
                  onClick={handleIrAlLogin}
                >
                  Iniciar Sesion / Registrarse
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoDrawer;
