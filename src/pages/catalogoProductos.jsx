/**
 * Componente CatalogoProductos - Pagina principal del catalogo de productos
 * 
 * Este componente renderiza el catalogo completo de productos con filtros por categoria,
 * busqueda por nombre y visualizacion de productos activos. Incluye un sidebar con
 * filtros y una seccion principal con grid de productos.
 * 
 * @param {array} productos - Array de todos los productos (activos e inactivos)
 * @param {function} setProductos - Funcion para actualizar el estado de productos
 * @param {function} actualizarStockProducto - Funcion para actualizar stock local
 * @param {function} fetchProductos - Funcion para recargar productos desde API
 * @returns {JSX.Element} El catalogo completo con filtros y productos
 */
import React, { useEffect, useState } from 'react';
import styles from '../styles/catalogoProductos.module.css';
import ProductoCard from '../components/ProductoCard';
import ProductoModal from '../components/ProductoModal';
import { FaBicycle, FaSearch, FaFilter } from 'react-icons/fa';
import CarritoDrawer from '../components/CarritoDrawer';

function CatalogoProductos({ productos, setProductos, actualizarStockProducto, fetchProductos }) {
  // Estado para el termino de busqueda
  const [busqueda, setBusqueda] = useState('');
  // Estado para la categoria seleccionada en el filtro
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  // Estado para el producto seleccionado en el modal
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  /**
   * Efecto para cargar productos desde la API al montar el componente
   * Se ejecuta cuando cambia setProductos
   */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Realiza peticion GET para obtener todos los productos
        const res = await fetch('http://localhost:3000/api/productos/completos');
        const data = await res.json();
        setProductos(data);
        console.log("Productos recibidos:", data);
      } catch (error) {
        console.error('Error al cargar productos', error);
      }
    };
    fetchProductos();
  }, [setProductos]);

  /**
   * Efecto para loggear cambios en productos (solo para debugging)
   */
  useEffect(() => {
    console.log("Productos actualizados:", productos);
  }, [productos]);

  // Configuracion de colores y nombres para cada categoria
  const categoriasConfig = {
    'Montana': { color: '#DAF7A6', bgColor: '#E8F5E8', nombre: 'Montaña' },
    'Carretera': { color: '#d4e6f1', bgColor: '#E3F2FD', nombre: 'Ruta / Carretera' },
    'Urbana': { color: '#e8daef', bgColor: '#F3E5F5', nombre: 'Urbana' },
    'BMX': { color: '#fadbd8', bgColor: '#FFEBEE', nombre: 'BMX' },
    'Electrica': { color: '#fdebd0', bgColor: '#FFF3E0', nombre: 'Eléctrica' },
    'Gravel': { color: '#A8F0DF', bgColor: '#EFEBE9', nombre: 'Gravel' },
    'Plegable': { color: '#eafaf1', bgColor: '#E8F5E8', nombre: 'Plegable' },
    'Infantil': { color: '#fcf3cf', bgColor: '#fef9e7', nombre: 'Infantil' },
    'Accesorios': { color: '#d5d8dc', bgColor: '#ECEFF1', nombre: 'Accesorios' }
  };

  // Filtrar productos por estado 'activo' para mostrar solo productos disponibles
  const productosActivos = productos.filter(p => p.estado === 'activo');
  // Obtener categorias unicas solo de productos activos
  const categoriasUnicas = [...new Set(productosActivos.map(p => p.categoria).filter(Boolean))];
  // Filtrar productos activos por busqueda y categoria seleccionada
  const productosFiltrados = productosActivos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoriaSeleccionada === '' || p.categoria === categoriaSeleccionada)
  );

  /**
   * Funcion para manejar el click en una categoria del filtro
   * @param {string} categoria - La categoria seleccionada
   */
  const handleCategoriaClick = (categoria) => {
    // Si se hace click en la categoria ya seleccionada, la deselecciona
    setCategoriaSeleccionada(categoriaSeleccionada === categoria ? '' : categoria);
  };

  /**
   * Funcion para abrir el modal de detalles del producto
   * @param {object} producto - El producto seleccionado
   */
  const handleVerDetalles = (producto) => {
    // Busca el producto actualizado en el estado local
    const actualizado = productos.find(p => p.id === producto.id);
    setProductoSeleccionado(actualizado || producto);
  };

  /**
   * Funcion para cerrar el modal de detalles
   */
  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
  };

  return (
    // Contenedor principal del catalogo
    <div className={styles.catalogo_container}>
      {/* Sidebar con filtros por categoria */}
      <aside className={styles.filtro}>
        <div className={styles.filtro_header}>
          <FaFilter className={styles.filtro_icon} />
          <h3>Filtrar por categoría</h3>
        </div>
        
        {/* Grid de categorias para filtrado */}
        <div className={styles.categorias_grid}>
          {/* Boton "Todas" para mostrar todos los productos activos */}
          <div 
            className={`${styles.categoria_card} ${categoriaSeleccionada === '' ? styles.active : ''}`}
            onClick={() => handleCategoriaClick('')}
          >
            <FaBicycle className={styles.categoria_icon} style={{ color: '#007bff' }} />
            <span>Todas</span>
            {/* Contador corregido: muestra solo productos activos */}
            <span className={styles.producto_count}>{productosActivos.length}</span>
          </div>
          
          {/* Renderiza cada categoria unica con su configuracion */}
          {categoriasUnicas.map(cat => {
            const config = categoriasConfig[cat] || { color: '#666', bgColor: '#f5f5f5', nombre: cat };
            // Contador corregido: cuenta solo productos activos en esta categoria
            const productosEnCategoria = productosActivos.filter(p => p.categoria === cat).length;
            
            return (
              <div 
                key={cat} 
                className={`${styles.categoria_card} ${categoriaSeleccionada === cat ? styles.active : ''}`}
                onClick={() => handleCategoriaClick(cat)}
                style={{
                  '--categoria-color': config.color,
                  '--categoria-bg': config.bgColor
                }}
              >
                <FaBicycle className={styles.categoria_icon} style={{ color: config.color }} />
                <span>{config.nombre}</span>
                <span className={styles.producto_count}>{productosEnCategoria}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Seccion principal con productos */}
      <main className={styles.productos}>
        {/* Barra de busqueda y filtros activos */}
        <div className={styles.buscador}>
          <div className={styles.search_container}>
            <FaSearch className={styles.search_icon} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          {/* Muestra el filtro activo si hay una categoria seleccionada */}
          {categoriaSeleccionada && (
            <div className={styles.filtro_activo}>
              <span>Filtrado por: {categoriasConfig[categoriaSeleccionada]?.nombre || categoriaSeleccionada}</span>
              <button onClick={() => setCategoriaSeleccionada('')}>Limpiar</button>
            </div>
          )}
        </div>

        {/* Grid de productos filtrados */}
        <div className={styles.grid}>
          {productosFiltrados.length > 0 ? (
            // Renderiza cada producto usando ProductoCard
            productosFiltrados.map(prod => (
              <ProductoCard 
                key={prod.id} 
                producto={prod} 
                onVerDetalles={handleVerDetalles} 
                actualizarStockProducto={actualizarStockProducto} 
                fetchProductos={fetchProductos} 
              />
            ))
          ) : (
            // Mensaje cuando no hay productos que coincidan con la busqueda
            <div className={styles.no_productos}>
              <FaSearch className={styles.no_productos_icon} />
              <p>No hay productos que coincidan con tu búsqueda.</p>
              <button onClick={() => {setBusqueda(''); setCategoriaSeleccionada('');}}>
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
        
        {/* Modal de detalles del producto */}
        <ProductoModal 
          producto={productoSeleccionado} 
          onClose={handleCerrarModal} 
          actualizarStockProducto={actualizarStockProducto} 
          fetchProductos={fetchProductos} 
        />
      </main>
      
      {/* Drawer del carrito de compras */}
      <CarritoDrawer />
    </div>
  );
}

/**
 * Componente wrapper que maneja el estado global de productos
 * Proporciona el estado y funciones necesarias al componente CatalogoProductos
 * 
 * @returns {JSX.Element} El componente CatalogoProductos con props necesarias
 */
export default function CatalogoProductosWrapper() {
  // Estado para almacenar todos los productos (activos e inactivos)
  const [productos, setProductos] = useState([]);

  /**
   * Funcion para cargar productos desde la API
   */
  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/productos/completos');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos', error);
    }
  };

  /**
   * Efecto para cargar productos al montar y escuchar eventos de actualizacion
   */
  useEffect(() => {
    fetchProductos();
    
    // Escuchar el evento para recargar el catalogo al cerrar el carrito
    const handleActualizarCatalogo = () => {
      fetchProductos();
    };
    
    window.addEventListener('actualizarCatalogo', handleActualizarCatalogo);
    
    // Limpiar el event listener al desmontar para evitar memory leaks
    return () => {
      window.removeEventListener('actualizarCatalogo', handleActualizarCatalogo);
    };
  }, []);

  /**
   * Funcion para actualizar el stock de un producto en el estado local
   * @param {number} id - El id del producto a actualizar
   * @param {number} nuevasEntradas - El nuevo stock disponible
   */
  const actualizarStockProducto = (id, nuevasEntradas) => {
    setProductos(prev => prev.map(p =>
      p.id === id ? { ...p, entradas: nuevasEntradas } : p
    ));
  };

  return (
    <CatalogoProductos
      productos={productos}
      setProductos={setProductos}
      actualizarStockProducto={actualizarStockProducto}
      fetchProductos={fetchProductos}
    />
  );
}



