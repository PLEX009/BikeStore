/**
 * Componente QuienesSomos - Pagina de presentacion de la tienda
 * 
 * Este componente muestra la historia, mision, vision, valores y equipo de la tienda.
 * Incluye imagenes, secciones informativas y estructura visual amigable.
 * 
 * @returns {JSX.Element} Pagina de quienes somos con informacion institucional
 */
import React from 'react';
import styles from '../styles/quienesSomos.module.css';
import logo from '../assets/images/Logo-bikeStore.png';

const QuienesSomos = () => {
  return (
    // Contenedor principal de la pagina quienes somos
    <section className={styles.quienes_container}>
      {/* Seccion de encabezado con logo y slogan */}
      <div className={styles.header_section}>
        <img src={logo} alt="Logo Bike Store" className={styles.logo} />
        <h1>¿Quiénes Somos?</h1>
        <p className={styles.slogan}>Tu aventura sobre ruedas comienza aqui</p>
      </div>
      {/* Grid de informacion principal */}
      <div className={styles.info_grid}>
        {/* Bloque de historia */}
        <div className={styles.info_block}>
          <h2>Nuestra Historia</h2>
          <p>
            Bike Store nacio en <i>2025 </i> a tres dias de entregar el proyecto con la pasion de acercar el mundo del ciclismo a todos. Desde nuestros inicios, nos hemos dedicado a ofrecer bicicletas y accesorios de la mejor calidad, brindando asesoria personalizada y un servicio excepcional a cada cliente.
          </p>
        </div>
        {/* Bloque de mision */}
        <div className={styles.info_block}>
          <h2>Mision</h2>
          <p>
            Inspirar y acompanar a las personas en su camino hacia una vida mas activa, saludable y sostenible, ofreciendo productos y experiencias unicas en el mundo del ciclismo.
          </p>
        </div>
        {/* Bloque de vision */}
        <div className={styles.info_block}>
          <h2>Vision</h2>
          <p>
            Ser la tienda de bicicletas lider en la region, reconocida por la innovacion, la calidad y la pasion por el ciclismo.
          </p>
        </div>
        {/* Bloque de valores */}
        <div className={styles.info_block}>
          <h2>Valores</h2>
          <ul>
            <li>Pasion por el ciclismo</li>
            <li>Atencion personalizada</li>
            <li>Calidad y confianza</li>
            <li>Compromiso con el medio ambiente</li>
            <li>Innovacion constante</li>
          </ul>
        </div>
      </div>
      {/* Seccion del equipo */}
      <div className={styles.equipo_section}>
        <h2>Nuestro Equipo</h2>
        <p>
          Somos un grupo de ciclistas, mecanicos y asesores apasionados, listos para ayudarte a encontrar la bicicleta perfecta y acompanarte en cada aventura.
        </p>
        <img src="/images/biciCaro1.jpg" alt="Equipo Bike Store" className={styles.equipo_img} />
      </div>
    </section>
  );
};

export default QuienesSomos;