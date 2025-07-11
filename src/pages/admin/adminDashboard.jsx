// Importa React y hooks necesarios para el estado y efectos
import React, { useState, useEffect } from 'react';
// Importa el componente HeaderAdmin para la barra superior del dashboard
import HeaderAdmin from '../../components/admin/headerAdmin';
// Importa el componente PanelAdmin para la barra lateral del dashboard
import PanelAdmin from '../../components/admin/panelAdmin';
// Importa los estilos CSS del modulo para aplicar clases
import style from '../../styles/admin/AdminDashboard.module.css';
// Importa Outlet y useLocation de React Router para navegacion
import { Outlet, useLocation } from 'react-router-dom';
// Importa iconos de React Icons para usar en las cards y botones
import { FaBoxOpen, FaUsers, FaTruck, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// Importa axios para hacer peticiones HTTP al backend
import axios from 'axios';

// Componente de Card de Estadisticas con diseño CRUD
// Muestra estadisticas de productos, usuarios o proveedores con total, activos e inactivos
const StatCard = ({ title, icon, total, activos, inactivos, color, isLoading }) => {
  // Si esta cargando, muestra un skeleton (esqueleto de carga)
  if (isLoading) {
    return (
      <div className={style.statCard}>
        <div className={style.cardHeader}>
          <div className={style.cardIcon} style={{ backgroundColor: color }}>
            {icon}
          </div>
          <div className={style.cardTitle}>{title}</div>
        </div>
        <div className={style.cardContent}>
          <div className={style.loadingSkeleton}>
            <div className={style.skeletonLine}></div>
            <div className={style.skeletonLine}></div>
          </div>
        </div>
      </div>
    );
  }

  // Si no esta cargando, muestra la card con datos reales
  return (
    <div className={style.statCard}>
      <div className={style.cardHeader}>
        <div className={style.cardIcon} style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className={style.cardTitle}>{title}</div>
      </div>
      <div className={style.cardContent}>
        <div className={style.totalNumber}>{total}</div>
        <div className={style.statusBreakdown}>
          <div className={style.statusItem}>
            <FaCheckCircle className={style.statusIcon} />
            <span className={style.statusLabel}>Activos</span>
            <span className={style.statusCount}>{activos}</span>
          </div>
          <div className={style.statusItem}>
            <FaTimesCircle className={style.statusIcon} />
            <span className={style.statusLabel}>Inactivos</span>
            <span className={style.statusCount}>{inactivos}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grafica de barras para una entidad (productos, usuarios, proveedores)
// Crea una grafica de barras simple usando CSS para mostrar total, activos e inactivos
const EntityBarChart = ({ title, data, color }) => {
  // Datos para las barras: total, activos e inactivos con colores especificos
  const chartData = [
    { label: 'Total', value: data.total, barColor: '#F28500' }, // Naranja-amarillo
    { label: 'Activos', value: data.activos, barColor: '#1a6830' }, // Verde
    { label: 'Inactivos', value: data.inactivos, barColor: '#b84220' } // Rojo
  ];
  // Calcula el valor maximo para normalizar las alturas de las barras
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className={style.chartCard}>
      <h3 className={style.chartTitle}>{title}</h3>
      <div className={style.chartContainer}>
        <div className={style.chartBars}>
          {/* Renderiza cada barra del grafico */}
          {chartData.map((item, idx) => (
            <div key={item.label} className={style.chartBar}>
              <div
                className={style.barFill}
                style={{
                  // Calcula la altura de la barra basada en el valor maximo
                  height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '10%',
                  backgroundColor: item.barColor
                }}
              ></div>
              <span className={style.barLabel}>{item.label}<br/>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Card destacada para mostrar un dato especial (producto, usuario, proveedor)
// Muestra informacion destacada como el producto mas comprado, usuario con mas compras, etc.
const HighlightCard = ({ title, icon, main, sub, image, color }) => (
  <div className={style.highlightCard}>
    <div className={style.highlightHeader}>
      {/* Icono con color de fondo personalizable */}
      {icon && (
        <span className={style.highlightIcon} style={{ background: color || '#F28500' }}>
          {icon}
        </span>
      )}
      <span className={style.highlightTitle}>{title}</span>
    </div>
    <div className={style.highlightContent}>
      {/* Imagen del item destacado (producto, usuario, proveedor) */}
      <div className={style.highlightMain}>{main}</div>
      {/* Texto secundario (informacion adicional) */}
      <div className={style.highlightSub}>{sub}</div>
    </div>
  </div>
);

// Componente del Dashboard Principal
// Contiene toda la interfaz del dashboard con estadisticas, graficas y cards destacadas
const DashboardHome = ({ estadisticas, isLoading }) => {
  // Configuracion de las cards de estadisticas principales
  const stats = [
    {
      title: 'Productos',
      icon: <FaBoxOpen size={24} />,
      color: '#F28500', // Naranja
      data: estadisticas.productos || { total: 0, activos: 0, inactivos: 0 }
    },
    {
      title: 'Usuarios',
      icon: <FaUsers size={24} />,
      color: '#1a6830', // Verde
      data: estadisticas.usuarios || { total: 0, activos: 0, inactivos: 0 }
    },
    {
      title: 'Proveedores',
      icon: <FaTruck size={24} />,
      color: '#773b0d', // Cafe
      data: estadisticas.proveedores || { total: 0, activos: 0, inactivos: 0 }
    }
  ];

  return (
    <div className={style.dashboardHome}>
      {/* Header del dashboard con titulo y mensaje de bienvenida */}
      <div className={style.dashboardHeader}>
        <h1 className={style.dashboardTitle}>
          <FaChartLine className={style.titleIcon} />
          Panel de Control
        </h1>
        <p className={style.dashboardSubtitle}>
          <span role="img" aria-label="bicicleta" className={style.welcomeEmoji}>🚴‍♂️</span>
          <span className={style.welcomeStrong}>¡Bienvenido al Panel de Control!</span> <br/>
          Gestiona los <span className={style.welcomeAccent}>productos</span>, <span className={style.welcomeAccent}>usuarios</span> y <span className={style.welcomeAccent}>proveedores</span> de forma eficiente y profesional.<br/>
          <span className={style.welcomeMotivation}>¡Realizado por: Wisner Martinez, Jose Asprilla y Roy Arenas <b>BikeStore</b>!</span>
        </p>
      </div>
      
      {/* Grid de cards destacadas (producto mas comprado, usuario top, proveedor top) */}
      <div className={style.highlightsGrid}>
        {/* Card del producto mas comprado */}
        <HighlightCard
          title="Producto mas comprado"
          icon={<FaBoxOpen size={28} />}
          main={estadisticas.productoMasComprado?.nombre || 'Sin datos'}
          sub={estadisticas.productoMasComprado ? `Cantidad vendida: ${estadisticas.productoMasComprado.cantidad}` : ''}
          image={
            estadisticas.productoMasComprado?.imagen
              ? `/assets/uploads/${estadisticas.productoMasComprado.imagen}`
              : undefined
          }
          color="#773b0d" // Cafe
        />
        {/* Card del usuario con mas compras */}
        <HighlightCard
          title="Usuario con mas compras"
          icon={<FaUsers size={28} />}
          main={estadisticas.usuarioMasComprador?.nombre || 'Sin datos'}
          sub={estadisticas.usuarioMasComprador ? `Compras: ${estadisticas.usuarioMasComprador.cantidadCompras}` : ''}
          image={
            estadisticas.usuarioMasComprador?.avatar
              ? `/assets/uploads/${estadisticas.usuarioMasComprador.avatar}`
              : undefined
          }
          color="#1a6830" // Verde
        />
        {/* Card del proveedor con mas productos */}
        <HighlightCard
          title="Proveedor con mas productos"
          icon={<FaTruck size={28} />}
          main={estadisticas.proveedorConMasProductos?.nombre || 'Sin datos'}
          sub={estadisticas.proveedorConMasProductos ? `Productos: ${estadisticas.proveedorConMasProductos.cantidadProductos}` : ''}
          image={
            estadisticas.proveedorConMasProductos?.logo
              ? `/assets/uploads/${estadisticas.proveedorConMasProductos.logo}`
              : undefined
          }
          color="#F28500" // Naranja
        />
      </div>
      
      {/* Grid de cards de estadisticas principales */}
      <div className={style.statsGrid}>
        {/* Renderiza cada card de estadisticas usando el array stats */}
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            icon={stat.icon}
            total={stat.data.total}
            activos={stat.data.activos}
            inactivos={stat.data.inactivos}
            color={stat.color}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Seccion de graficas (solo se muestra si no esta cargando) */}
      {!isLoading && (
        <div className={style.chartsSection}>
          <div className={style.chartsGrid}>
            {/* Grafica de barras para productos */}
            <EntityBarChart
              title="Productos"
              data={estadisticas.productos || { total: 0, activos: 0, inactivos: 0 }}
              color="#F28500"
            />
            {/* Grafica de barras para usuarios */}
            <EntityBarChart
              title="Usuarios"
              data={estadisticas.usuarios || { total: 0, activos: 0, inactivos: 0 }}
              color="#1a6830"
            />
            {/* Grafica de barras para proveedores */}
            <EntityBarChart
              title="Proveedores"
              data={estadisticas.proveedores || { total: 0, activos: 0, inactivos: 0 }}
              color="#773b0d"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal del Dashboard Administrativo
// Maneja la logica de estado, carga de datos y renderizado condicional
function AdminDashboard() {
  // Hook para obtener la ubicacion actual de la ruta
  const location = useLocation();
  // Estado para almacenar las estadisticas del dashboard
  const [estadisticas, setEstadisticas] = useState({});
  // Estado para controlar si esta cargando datos
  const [isLoading, setIsLoading] = useState(true);
  // Estado para almacenar errores
  const [error, setError] = useState(null);

  // useEffect que se ejecuta cuando cambia la ruta
  // Solo carga estadisticas si estamos en la ruta principal del dashboard
  useEffect(() => {
    if (location.pathname === '/adminDashboard/' || location.pathname === '/adminDashboard') {
      cargarEstadisticas();
    }
  }, [location.pathname]);

  // Funcion para cargar todas las estadisticas del dashboard
  const cargarEstadisticas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Carga estadisticas generales (productos, usuarios, proveedores)
      const response = await axios.get('/api/dashboard/estadisticas');
      let estadisticasData = response.data.data || {};

      // Carga el producto mas comprado
      const prodRes = await axios.get('/api/dashboard/producto-mas-comprado');
      estadisticasData.productoMasComprado = prodRes.data.data;

      // Carga el usuario con mas compras
      const userRes = await axios.get('/api/dashboard/usuario-mas-compras');
      estadisticasData.usuarioMasComprador = userRes.data.data;

      // Carga el proveedor con mas productos
      const provRes = await axios.get('/api/dashboard/proveedor-mas-productos');
      estadisticasData.proveedorConMasProductos = provRes.data.data;

      // Actualiza el estado con todos los datos cargados
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error de conexion al cargar las estadisticas');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado condicional: si estamos en la ruta principal del dashboard
  // muestra las estadisticas y el contenido del dashboard
  if (location.pathname === '/adminDashboard/' || location.pathname === '/adminDashboard') {
    return (
      <div className={style.dashboard_container}>
        {/* Panel lateral izquierdo con navegacion */}
        <PanelAdmin />
        <div className={style.main_content}>
          {/* Header superior del dashboard */}
          <HeaderAdmin />
          <div className={style.content_area}>
            {/* Contenido principal del dashboard con estadisticas */}
            <DashboardHome estadisticas={estadisticas} isLoading={isLoading} />
            {/* Banner de error si hay algun problema */}
            {error && (
              <div className={style.errorMessage}>
                <p>{error}</p>
                <button onClick={cargarEstadisticas} className={style.retryButton}>
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Para otras rutas (CRUD, gestion, etc.), mostrar el contenido normal con Outlet
  // Outlet renderiza los componentes hijos segun la ruta actual
  return (
    <div className={style.dashboard_container}>
      <PanelAdmin />
      <div className={style.main_content}>
        <HeaderAdmin />
        <div className={style.content_area}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la aplicacion
export default AdminDashboard;
  