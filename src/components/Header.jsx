import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Routes, Link, useLocation } from 'react-router-dom';
import Styles from "../styles/header.module.css";
import logo from "../assets/images/Logo-bikeStore.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBicycle, faUsers, faEnvelope, faShoppingCart, faSignInAlt, faBars, faTimes, faUser, faSignOutAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import {useCarrito} from '../context/CarritoContext';
import { FaShoppingCart } from 'react-icons/fa';
import CarritoDrawer from './CarritoDrawer';
import HistorialDrawer from './HistorialDrawer';

/**
 * @file Header.jsx
 * @description Componente de cabecera principal para la aplicacion BikeStore.
 * Incluye logo, menu de navegacion, icono de carrito, usuario y login/logout.
 */

function Header() {
  // Obtiene funciones y estado del contexto del carrito
  const { 
    carrito, 
    eliminarProducto, 
    vaciarCarrito, 
    obtenerCantidadTotal, 
    drawerVisible, 
    setDrawerVisible 
  } = useCarrito();

  // Obtiene la ubicacion actual de la ruta
  const location = useLocation();
  // Estado para abrir/cerrar el menu hamburguesa
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado con la informacion del usuario autenticado
  const [userInfo, setUserInfo] = useState(null);
  // Estado para mostrar el historial de compras
  const [historialVisible, setHistorialVisible] = useState(false);

  // Efecto para verificar si el usuario esta autenticado y obtener su informacion
  useEffect(() => {
    // Funcion para verificar si hay usuario autenticado en localStorage
    const checkUserAuth = () => {
      // Obtiene los datos del usuario desde localStorage
      const numIdent = localStorage.getItem('num_ident');
      const userName = localStorage.getItem('user_name');
      const userId = localStorage.getItem('user_id');
      const id_usuario = localStorage.getItem('id_usuario');
      const userRol = localStorage.getItem('user_rol');

      // Si hay identificacion y nombre, establece el usuario
      if (numIdent && userName) {
        setUserInfo({
          numIdent,
          userName,
          userId,
          id_usuario,
          userRol
        });
      } else {
        // Si no hay datos, limpia el usuario
        setUserInfo(null);
      }
    };

    // Verifica el usuario al montar el componente
    checkUserAuth();

    // Listener para detectar cambios en localStorage (login/logout en otra pestaña)
    const handleStorageChange = (e) => {
      // Si cambia la identificacion o el nombre, vuelve a verificar
      if (e.key === 'num_ident' || e.key === 'user_name') {
        checkUserAuth();
      }
    };

    // Agrega el listener de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Listener para eventos personalizados de autenticacion
    const handleAuthChange = () => {
      checkUserAuth();
    };

    // Agrega el listener de eventos personalizados
    window.addEventListener('authChange', handleAuthChange);

    // Limpia los listeners al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Funcion para saber si una ruta esta activa
  const isActive = (path) => location.pathname === path ? "active" : "";

  // Detectar si el usuario es admin (rol 2 o 3, string o numero)
  const esAdmin = userInfo && (userInfo.userRol == 2 || userInfo.userRol == 3);
  // Log temporal para depuracion
  console.log('userInfo:', userInfo, 'esAdmin:', esAdmin, 'enHome:', location.pathname);
  // Detectar si esta en el dashboard admin
  const enDashboard = location.pathname.startsWith('/adminDashbord');
  // Detectar si esta en el home
  const enHome = location.pathname === '/';

  // Funcion para abrir/cerrar el menu hamburguesa
  const toggleMenu = () => setMenuOpen(!menuOpen);
  // Funcion para cerrar el menu hamburguesa
  const closeMenu = () => setMenuOpen(false);

  // Funcion para cerrar sesion y limpiar datos del usuario
  const handleLogout = () => {
    // Elimina los datos del usuario del localStorage
    localStorage.removeItem('num_ident');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('user_rol');
    // Limpia el estado del usuario
    setUserInfo(null);
    // Dispara un evento personalizado para que otros componentes reaccionen
    window.dispatchEvent(new CustomEvent('authChange'));
    // Redirige al home
    window.location.href = '/';
  };

  return (
    // Cabecera principal
    <header className={Styles.header}>
      <div className={Styles.container}>
        {/* Logo de la empresa */}
        <div className={Styles.logo_container}>
          <img src={logo} alt="Logo Bike Store" className={Styles.logo} />
        </div>

        {/* Boton hamburguesa para menu mobile */}
        <button className={Styles.hamburger} onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Menu de navegacion principal */}
        <nav className={`${Styles.nav} ${menuOpen ? Styles.open : ""}`}>
          <div className={Styles.nav_main} onClick={closeMenu}>
            <Link to="/" >
              <FontAwesomeIcon icon={faHome} /> Inicio
            </Link>
            <Link to="/catalogoProductos">
              <FontAwesomeIcon icon={faBicycle} /> Catalogo
            </Link>
            <Link to="/quienes-somos">
              <FontAwesomeIcon icon={faUsers} /> Quienes Somos
            </Link>
            <Link to="/contacto" >
              <FontAwesomeIcon icon={faEnvelope} /> Contacto
            </Link>
            {/* Boton para ir al dashboard si es admin y NO esta en dashboard */}
            {esAdmin && !enDashboard && (
              <Link to="/adminDashboard" className={Styles.admin_btn}>
                <FontAwesomeIcon icon={faUser} /> Ir al Dashboard
              </Link>
            )}
            {/* Boton para ir al home si es admin y esta en dashboard */}
            {esAdmin && enDashboard && (
              <Link to="/" className={Styles.admin_btn}>
                <FontAwesomeIcon icon={faHome} /> Ir al Home
              </Link>
            )}
          </div>
          {/* Acciones de usuario y carrito */}
          <div className={Styles.nav_right}>
              {/* Icono de carrito con cantidad */}
              <div className={Styles.cart_icon}>
                  <FaShoppingCart onClick={() => setDrawerVisible(true)} />
                  <span>{obtenerCantidadTotal()}</span>
              </div>
              {/* Drawer del carrito */}
              <CarritoDrawer />
              {/* Seccion de usuario: nombre, login/logout */}
              <div className={Styles.user_section}>
                <div className={`${Styles.user_info} ${userInfo ? Styles.authenticated : ''}`}>
                  <FontAwesomeIcon icon={faUser} className={Styles.user_icon} />
                  {userInfo ? (
                    <span className={Styles.user_name}>{userInfo.userName}</span>
                  ) : (
                    <span className={Styles.user_name}>Usuario</span>
                  )}
                </div>
                {userInfo ? (
                   // Botones para usuario autenticado
                  <div className={Styles.user_actions}>
                    {/* Botón para historial de compras */}
                    <button 
                      className={Styles.historial_btn} 
                      onClick={() => setHistorialVisible(true)}
                      
                    >
                      <FontAwesomeIcon icon={faHistory} />
                      <span>Historial</span>
                    </button>
                    {/* Boton para cerrar sesion */}
                    <button className={Styles.logout_btn} onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Cerrar Sesion</span>
                    </button>
                  </div>
                ) : (
                  // Boton para iniciar sesion
                  <Link to="/LoginRegister" className={Styles.login_btn}>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    <span>Iniciar Sesion</span>
                  </Link>
                )}
              </div>
          </div>
        </nav>
      </div>
      {/* Drawer para historial de compras (si esta visible) */}
      {historialVisible && (
        <HistorialDrawer 
          visible={historialVisible} 
          onClose={() => setHistorialVisible(false)} 
        />
      )}
    </header>
  );
}

export default Header;