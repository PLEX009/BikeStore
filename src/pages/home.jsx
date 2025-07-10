/**
 * Componente Home - Pagina principal de la tienda
 * 
 * Este componente renderiza la pagina de inicio con carousel de imagenes,
 * seccion hero, categorias populares y productos destacados. Incluye
 * integracion con el carrito y modal de detalles de productos.
 * 
 * @returns {JSX.Element} La pagina principal con todas las secciones
 */
import React, { useEffect, useState } from 'react';
import { CCarousel, CCarouselItem, CImage } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from '../styles/home.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductoCard from '../components/ProductoCard';
import ProductoModal from '../components/ProductoModal';
import { useCarrito } from '../context/CarritoContext';
 

function Home() {
  // Estado para almacenar todos los productos de la API
  const [productos, setProductos] = useState([]);
  // Estado para el producto seleccionado en el modal
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ranking, setRanking] = useState({ topProductos: [], topUsuarios: [], topProveedores: [] });
  const [loadingRanking, setLoadingRanking] = useState(true);

  /**
   * Funcion para obtener productos desde la API
   * Realiza una peticion GET para obtener todos los productos
   */
  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/productos/completos');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  

  /**
   * Efecto para cargar productos al montar y escuchar eventos de actualizacion
   * Se ejecuta una sola vez al inicializar el componente
   */
  useEffect(() => {
    fetchProductos();
    
    // Escuchar el evento para recargar productos cuando el carrito cambia
    const handleActualizarCatalogo = () => {
      fetchProductos();
    };
    window.addEventListener('actualizarCatalogo', handleActualizarCatalogo);
    // Limpiar el event listener al desmontar para evitar memory leaks
    return () => {
      window.removeEventListener('actualizarCatalogo', handleActualizarCatalogo);
    };
  }, []);

  // Hook del contexto del carrito para agregar productos
  const { agregarProducto } = useCarrito();

  /**
   * Funcion para abrir el modal de detalles del producto
   * @param {object} producto - El producto seleccionado
   */
  const handleVerDetalles = (producto) => {
    // Buscar el producto actualizado en el array global
    const actualizado = productos.find(p => p.id === producto.id);
    setProductoSeleccionado(actualizado || producto);
  };

  /**
   * Funcion para cerrar el modal de detalles
   */
  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
  };

  // Filtrar productos por estado 'activo' para mostrar solo los activos en el home
  const productosActivos = productos.filter(p => p.estado === 'activo');

  /**
   * Funcion para actualizar el stock de un producto en el array global
   * @param {number} id - El id del producto a actualizar
   * @param {number} nuevasEntradas - El nuevo stock disponible
   */

  /* Toma el id del producto que quieres actualizar y el nuevo valor de entradas.

        Usa setProductos() para actualizar el estado.

        Dentro del map(), recorre todos los productos:

        Si encuentra el producto con el id indicado, crea una nueva copia del objeto ({ ...p }) pero con entradas actualizado.

        Si no, lo deja igual. */
  const actualizarStockProducto = (id, nuevasEntradas) => {
    setProductos(prev => prev.map(p =>
      p.id === id ? { ...p, entradas: nuevasEntradas } : p
    ));
  };

  return (
    // Contenedor principal de la pagina de inicio
    <div className={styles.home_page}>
      {/* Seccion del carousel con imagenes promocionales */}
      <div className={styles.carousel_container}>
        <CCarousel controls indicators transition="crossfade" interval={2000}>
          {/* Primera imagen del carousel */}
          <CCarouselItem>
            <CImage className="d-block w-100" src="/images/biciCaro1.jpg" alt="Slide 1" />
          </CCarouselItem>
          {/* Segunda imagen del carousel */}
          <CCarouselItem>
            <CImage className="d-block w-100" src="/images/biciCaro2.jpg" alt="Slide 2" />
          </CCarouselItem>
          {/* Tercera imagen del carousel */}
          <CCarouselItem>
            <CImage className="d-block w-100" src="/images/biciCaro3.jpg" alt="Slide 3" />
          </CCarouselItem>
        </CCarousel>
      </div>

      {/* Seccion hero con informacion principal de la tienda */}
      <aside className={styles.hero_section}>
        <div className={styles.main_text_content}>
          <h2>Bike Store</h2>
          <span>Descubre tu próxima Aventura</span>
          <p>
            Las mejores bicicletas para cada tipo de ciclista. <br />
            Encuentra la bicicleta perfecta para ti y disfruta de las mejores aventuras.
          </p>
          {/* Imagen de presentacion */}
          <img src="/images/bici3.png" alt="bicicleta de presentación" />
        </div>
      </aside>

   
      {/* Seccion de categorias populares */}
      <section className={styles.categories}>
        <h2>Categorías Populares</h2>
        <div className={styles.category_grid}>
          {/* Categoria Montaña */}
          <div className={styles.category_card}>
            <img src="/images/bici7.png" alt="Montaña" />
            <h3>Montaña</h3>
          </div>
          {/* Categoria Ruta */}
          <div className={styles.category_card}>
            <img src="/images/bici14.png" alt="Ruta" />
            <h3>Ruta</h3>
          </div>
          {/* Categoria Eléctrica */}
          <div className={styles.category_card}>
            <img src="/images/bici8.png" alt="Eléctrica" />
            <h3>Eléctrica</h3>
          </div>
          {/* Categoria Cross */}
          <div className={styles.category_card}>
            <img src="/images/bici12.png" alt="Cross" />
            <h3>Cross</h3>
          </div>
          {/* Categoria Urbana */}
          <div className={styles.category_card}>
            <img src="/images/bici11.png" alt="Urbana" />
            <h3>Urbana</h3>
          </div>
        </div>
      </section>

      {/* Seccion de productos destacados */}
      <section className={styles.featured_products}>
        <h2>Bicicletas Destacadas</h2>
        <div className={styles.product_grid}>
          {/* Renderiza los primeros 5 productos activos */}
          {productosActivos.slice(0, 5).map((prod) => (
            <ProductoCard
              key={prod.id}
              producto={prod}
              onVerDetalles={handleVerDetalles}
              actualizarStockProducto={actualizarStockProducto}
              fetchProductos={fetchProductos}
            />
          ))}
        </div>

        {/* Modal de detalles del producto */}
        <ProductoModal 
          producto={productoSeleccionado}  
          onClose={handleCerrarModal} 
          actualizarStockProducto={actualizarStockProducto} 
          fetchProductos={fetchProductos}
        />
      </section>

      {/* Boton para ver mas productos que lleva al catalogo */}
      <div className={styles.verMasContainer}>
        <Link to="/catalogoProductos" className={styles.verMasBtn}>Ver más productos</Link>
      </div>
    </div>
  );
}

export default Home;
