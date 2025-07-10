/**
 * Contexto CarritoContext - Gestiona el estado global del carrito de compras
 * 
 * Este contexto proporciona un estado global para el carrito de compras,
 * incluyendo funciones para agregar, eliminar, modificar productos y procesar compras.
 * Tambien maneja la persistencia en localStorage y la comunicacion con la API.
 * 
 * @module CarritoContext
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crea el contexto del carrito
const CarritoContext = createContext();

/**
 * Hook personalizado para usar el contexto del carrito
 * @returns {object} El contexto del carrito con todas sus funciones y estado
 */
export const useCarrito = () => useContext(CarritoContext);

/**
 * Funcion para verificar si el usuario esta autenticado
 * Verifica la existencia del num_ident en localStorage
 * @returns {boolean} True si el usuario esta autenticado, false en caso contrario
 */
const verificarAutenticacion = () => {
  const numIdent = localStorage.getItem('num_ident');
  return !!numIdent; // Retorna true si existe num_ident, false si no
};

/**
 * Proveedor del contexto del carrito
 * Maneja todo el estado y la logica del carrito de compras
 * 
 * @param {object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {function} props.onStockChange - Callback para cambios de stock (opcional)
 * @returns {JSX.Element} El proveedor del contexto
 */
export const CarritoProvider = ({ children, onStockChange }) => {
  // Estado del carrito (array de productos con cantidad)
  const [carrito, setCarrito] = useState([]);
  // Estado para mostrar u ocultar el drawer del carrito
  const [drawerVisible, setDrawerVisible] = useState(false);

  /**
   * Efecto para cargar el carrito desde localStorage al montar el componente
   * Se ejecuta una sola vez al inicializar
   */
  useEffect(() => {
    // Obtiene el carrito guardado en localStorage o array vacio si no existe
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  /**
   * Efecto para guardar el carrito en localStorage cada vez que cambia
   * Se ejecuta cada vez que el estado del carrito se modifica
   */
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  /**
   * Funcion para cerrar el drawer y disparar evento de actualizacion del catalogo
   * Notifica a otros componentes que el catalogo debe actualizarse
   */
  const cerrarDrawer = () => {
    setDrawerVisible(false);
    window.dispatchEvent(new CustomEvent('actualizarCatalogo'));
  };

  /**
   * Funcion para mostrar un toast (notificacion flotante)
   * @param {string} mensaje - El mensaje a mostrar
   * @param {string} tipo - El tipo de toast (info, success, warning, error)
   */
  const mostrarToast = (mensaje, tipo = 'info') => {
    window.dispatchEvent(new CustomEvent('mostrarToast', {
      detail: { mensaje, tipo }
    }));
  };

  /**
   * Funcion para agregar un producto al carrito
   * Incluye validaciones de stock y manejo de productos existentes
   * @param {object} producto - El producto a agregar al carrito
   */
  const agregarProducto = async (producto) => {
    try {
      // Verifica el stock disponible antes de agregar
      const response = await axios.get(`http://localhost:3000/api/productos/${producto.id}`);
      const stockDisponible = response.data.entradas;
      
      // Verifica si hay suficiente stock considerando lo que ya esta en el carrito
      const productoEnCarrito = carrito.find((p) => p.id === producto.id);
      const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
      
      if (stockDisponible <= cantidadEnCarrito) {
        mostrarToast('No hay suficiente stock disponible para este producto.', 'warning');
        return;
      }
      
      // Si ya existe en el carrito, aumenta la cantidad; si no, lo agrega
      setCarrito(prevCarrito => {
        const existente = prevCarrito.find((p) => p.id === producto.id);
        if (existente) {
          return prevCarrito.map(p =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
          );
        } else {
          return [...prevCarrito, { ...producto, cantidad: 1 }];
        }
      });
      
      // Llama callback si se provee para notificar cambios de stock
      if (onStockChange) onStockChange(producto.id, stockDisponible);
    } catch (error) {
      mostrarToast('Error al agregar producto al carrito.', 'error');
    }
  };

  /**
   * Funcion para eliminar un producto del carrito
   * @param {number} id - El id del producto a eliminar
   */
  const eliminarProducto = async (id) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;
    
    // Filtra el producto del carrito
    setCarrito(carrito.filter(p => p.id !== id));
    // Dispara evento para actualizar el catalogo
    window.dispatchEvent(new CustomEvent('actualizarCatalogo'));
  };

  /**
   * Funcion para aumentar la cantidad de un producto en el carrito
   * Incluye validacion de stock disponible
   * @param {number} id - El id del producto
   */
  const aumentarCantidad = async (id) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;
    
    try {
      // Verifica el stock disponible
      const response = await axios.get(`http://localhost:3000/api/productos/${id}`);
      const stockDisponible = response.data.entradas;
      
      if (stockDisponible > producto.cantidad) {
        // Aumenta la cantidad si hay stock disponible
        setCarrito(prevCarrito => 
          prevCarrito.map(p =>
            p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
          )
        );
        if (onStockChange) onStockChange(id, stockDisponible);
      } else {
        mostrarToast('Has alcanzado el limite maximo de productos disponibles.', 'warning');
      }
    } catch (error) {
      mostrarToast('Error al aumentar la cantidad.', 'error');
    }
  };

  /**
   * Funcion para disminuir la cantidad de un producto en el carrito
   * Si la cantidad llega a 0, elimina el producto
   * @param {number} id - El id del producto
   */
  const disminuirCantidad = async (id) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto || producto.cantidad <= 1) {
      // Si no hay producto o la cantidad es 1, elimina el producto
      await eliminarProducto(id);
      return;
    }
    
    // Disminuye la cantidad
    setCarrito(prevCarrito => 
      prevCarrito.map(p =>
        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
      )
    );
    // Dispara evento para actualizar el catalogo
    window.dispatchEvent(new CustomEvent('actualizarCatalogo'));
  };

  /**
   * Funcion para obtener la cantidad total de productos en el carrito
   * @returns {number} La suma total de todas las cantidades
   */
  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  /**
   * Funcion para vaciar completamente el carrito
   */
  const vaciarCarrito = async () => {
    setCarrito([]);
    // Dispara evento para actualizar el catalogo
    window.dispatchEvent(new CustomEvent('actualizarCatalogo'));
  };

  /**
   * Funcion para procesar la compra
   * Incluye validaciones de carrito vacio y autenticacion
   * @returns {boolean} True si la compra fue exitosa, false en caso contrario
   */
  const procesarCompra = async () => {
    // Si el carrito esta vacio, muestra advertencia
    if (carrito.length === 0) {
      mostrarToast('Debes tener productos en el carrito para realizar una compra.', 'warning');
      return false;
    }
    
    // Verifica si el usuario esta autenticado
    if (!verificarAutenticacion()) {
      mostrarToast('Inicia sesion o registrate para continuar con tu compra.', 'warning');
      return false;
    }
    
    try {
      const userId = localStorage.getItem('id_usuario');
      // Calcula el total de la compra
      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      
      // Prepara los detalles de la compra para la API
      const detalles = carrito.map(item => ({
        id_producto: item.id,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      }));
      
      // Crea la compra en la base de datos
      const response = await axios.post('http://localhost:3000/api/crudCompras/create', {
        id_usuario: userId,
        total: total,
        estado: 'en bodega',
        detalles: detalles
      });
      
      if (response.status === 201) {
        mostrarToast('Compra realizada con exito! Tu pedido esta siendo procesado.', 'success');
        vaciarCarrito();
        return true;
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      mostrarToast('Error al procesar la compra. Por favor, intenta nuevamente.', 'error');
      return false;
    }
  };

  // Provee el contexto a los hijos con todas las funciones y estado
  return (
       <CarritoContext.Provider value={{
      carrito,
      agregarProducto,
      eliminarProducto,
      vaciarCarrito,
      aumentarCantidad,
      disminuirCantidad,
      obtenerCantidadTotal,
      drawerVisible,
      setDrawerVisible,
      cerrarDrawer,
      mostrarToast,
      procesarCompra,
      verificarAutenticacion
    }}>
      {children}
    </CarritoContext.Provider>
  );
};
