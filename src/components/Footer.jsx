import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/footer.module.css";
import logo from "../assets/images/Logo-bikeStore.png";

/**
 * @file Footer.jsx
 * @description Componente de pie de pagina para la aplicacion BikeStore.
 * Muestra informacion de la empresa, enlaces de navegacion y datos de contacto.
 */

function Footer() {
  return (
    // Pie de pagina principal
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        {/* Logo de la empresa */}
        <div className={styles.footerLogo}>
          <img src={logo} alt="Logo Bike Store" className={styles.logo} />
        </div>

        {/* Seccion acerca de */}
        <div className={styles.footerSection}>
          <h3>Acerca de</h3>
          <p>
            En EcoBike ofrecemos bicicletas y accesorios de calidad para todo tipo de ciclistas. Promovemos movilidad sostenible con atencion cercana y experta.
          </p>
        </div>

        {/* Seccion de enlaces de navegacion */}
        <div className={styles.footerSection}>
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalogoProductos">Catalogo</Link></li>
            <li><Link to="/quienes-somos">Quienes Somos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Seccion de contacto */}
        <div className={styles.footerSection}>
          <h3>Contacto</h3>
          <ul>
            <li>Email: BikeStore@gmail.com</li>
            <li>Tel: +57 3003456987</li>
          </ul>
        </div>
      </div>

      {/* Pie de pagina inferior */}
      <div className={styles.footerBottom}>
        <p>&copy; Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
