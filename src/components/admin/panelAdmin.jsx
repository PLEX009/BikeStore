import { FaBoxOpen, FaUsers, FaUserCircle, FaBars, FaSearch, FaChartBar, FaTable, FaRegSmile, FaUserAlt, FaExclamationTriangle, FaBook, FaSignOutAlt, FaShoppingCart, FaHome, FaPager, FaBaby, FaPage4, FaPagelines, FaChrome } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/admin/panelAdmin.module.css";
import { useState, useEffect } from "react";
import avatar from "../../assets/images/chatBot.jpg";
import { useAuth } from "../../hooks/useAuth";

/**
 * @file panelAdmin.jsx
 * @description Componente de barra lateral (sidebar) para el panel de administracion de BikeStore.
 * Muestra el menu de navegacion, el nombre del usuario y el avatar, y permite cerrar sesion.
 * El menu se adapta dinamicamente segun el rol del usuario (superusuario o no).
 *
 * FUNCIONALIDADES PRINCIPALES:
 * - Mostrar avatar y nombre del usuario autenticado
 * - Renderizar menu de navegacion con iconos
 * - Mostrar opcion de CRUD de usuarios solo para superusuarios (rol 3)
 * - Permitir cierre de sesion con confirmacion
 */

// Definicion base de los items del menu de navegacion
const navItems = [
  { to: "/adminDashboard/", icon: <FaHome size={24}  />, label: "Inicio" },
  { to: "/adminDashboard/crudProducts", icon: <FaBoxOpen size={24} />, label: "Productos" },
  // El CRUD de usuarios se agregara condicionalmente mas abajo
  { to: "/adminDashboard/crudProveedores", icon: <FaChartBar size={24} />, label: "Proveedores" },
  { to: "/adminDashboard/crudCompras", icon: <FaShoppingCart size={24} />, label: "Compras" }
];

/**
 * Componente PanelAdmin
 * Renderiza la barra lateral de administracion con navegacion dinamica y control de sesion.
 *
 * - Obtiene el nombre del usuario autenticado desde la API usando el numero de identificacion almacenado en localStorage.
 * - Determina si el usuario es superusuario (rol 3) para mostrar el menu de usuarios.
 * - Permite cerrar sesion con confirmacion.
 *
 * @returns {JSX.Element} Sidebar de administracion
 */
export default function PanelAdmin() {
  // Hook para obtener la ruta actual y resaltar el menu activo
  const location = useLocation();
  // Estado para el nombre del usuario mostrado en el sidebar
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  // Hook de autenticacion para obtener info del usuario y funcion de logout
  const { logout, userInfo } = useAuth();

  // Efecto para obtener el nombre del usuario al montar el componente
  useEffect(() => {
    const numIdent = localStorage.getItem('num_ident');
    if (numIdent) {
      // Llama a la API para obtener el nombre del usuario por su numero de identificacion
      fetch(`http://localhost:3000/api/crudProduct/usuario-ident/${numIdent}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setNombreUsuario(data.nombre_usuario);
          } else {
            setNombreUsuario('Usuario');
          }
        })
        .catch(() => setNombreUsuario('Usuario'));
    }
  }, []);

  /**
   * Maneja el cierre de sesion del usuario, mostrando una confirmacion antes de cerrar.
   */
 const handleLogout = () => {
  if (window.confirm('¿Estas seguro de que quieres cerrar sesion?')) {
    logout(); // llama la funcion de useAuth y cierra la sesion
    navigate('/LoginRegister'); // Redirige a la ruta correcta
  }
};

  // Determina si el usuario autenticado es superusuario (rol 3)
  const isSuperUser = userInfo && userInfo.userRol === 3;

  return (
    <aside className={styles.panel_admin + ' ' + styles.open}>
      <div className={styles.sidebar_content}>
        {/* Seccion de usuario: avatar y nombre */}
        <div className={styles.user_section}>
          <img src={avatar} alt="Avatar usuario" className={styles.avatar} />
          <div className={styles.user_name}>{nombreUsuario}</div>
        </div>
        {/* Lista de navegacion dinamica */}
        <ul className={styles.nav_list} >
          {/* Renderizar los items del menu, insertando el CRUD de usuarios solo si es superusuario */}
          {navItems.map((item, idx) => {
            // Insertar el CRUD de usuarios despues de Productos solo si es superusuario
            if (item.to === "/adminDashboard/crudProducts" && isSuperUser) {
              return [
                // Opcion de Productos
                <li key={item.to}><Link to={item.to} className={location.pathname === item.to ? styles.active : ""}>{item.icon}<span className={styles.label}>{item.label}</span>{item.badge && <span className={styles.badge}>{item.badge}</span>}</Link></li>,
                // Opcion de Usuarios (solo para superusuario)
                <li key="crudUser"><Link to="/adminDashboard/crudUser" className={location.pathname === "/adminDashboard/crudUser" ? styles.active : ""}><FaUsers size={24} /><span className={styles.label}>Usuarios</span></Link></li>
              ];
            }
            // Si no es el CRUD de productos, renderizar normalmente
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={location.pathname === item.to ? styles.active : ""}
                >
                  {item.icon}
                  <span className={styles.label}>{item.label}</span>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </Link>
              </li>
            );
          })}
          {/* Boton de cierre de sesion */}
          <li>
            <Link to="/" className={styles.home_button}>
              <FaChrome size={24} />
              <span className={styles.label}>Visitar Pagina</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className={styles.logout_button}
            >
              <FaSignOutAlt size={24} />
              <span className={styles.label}>Cerrar Sesion</span>
            </button>
          </li>
          {/* Boton para ir al Home */}
        </ul>
      </div>
    </aside>
  );
}
