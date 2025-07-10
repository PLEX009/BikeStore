/**
 * Componente Contacto - Pagina de contacto de la tienda
 * 
 * Este componente renderiza la pagina de contacto con informacion de la tienda,
 * formulario de contacto y enlaces a redes sociales. Incluye integracion con
 * EmailJS para el envio de mensajes y manejo de estados de envio.
 * 
 * @returns {JSX.Element} La pagina de contacto con formulario e informacion
 */
import React, { useState } from 'react';
import styles from '../styles/contacto.module.css';
import { FaPhone, FaWhatsapp, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contacto = () => {
  // Estado para los datos del formulario de contacto
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    asunto: '',
    mensaje: ''
  });
  // Estado para controlar si se esta enviando el mensaje
  const [enviando, setEnviando] = useState(false);
  // Estado para mostrar mensaje de exito cuando se envia correctamente
  const [enviado, setEnviado] = useState(false);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('');

  /**
   * Funcion para manejar cambios en los campos del formulario
   * @param {Event} e - El evento de cambio del input
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Funcion para manejar el envio del formulario de contacto
   * @param {Event} e - El evento de submit del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      // Configuracion de parametros para EmailJS
      const templateParams = {
        to_email: 'wisnermartinez10@gmail.com',
        from_name: formData.nombre,
        from_email: formData.email,
        from_phone: formData.telefono,
        from_address: `${formData.direccion}, ${formData.ciudad}`,
        subject: formData.asunto,
        message: formData.mensaje
      };

      // Enviar email usando EmailJS
      await emailjs.send(
        'YOUR_SERVICE_ID', // Reemplaza con tu Service ID de EmailJS
        'YOUR_TEMPLATE_ID', // Reemplaza con tu Template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Reemplaza con tu Public Key
      );

      // Si el envio es exitoso, muestra mensaje y limpia el formulario
      setEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      // Si hay error, muestra mensaje de error
      setError('Error al enviar el mensaje. Por favor, intentalo de nuevo.');
      console.error('Error:', error);
    } finally {
      // Siempre resetea el estado de envio
      setEnviando(false);
    }
  };

  return (
    // Contenedor principal de la pagina de contacto
    <div className={styles.contacto_container}>
      {/* Seccion del header con titulo y descripcion */}
      <div className={styles.header_section}>
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte. ¡Envíanos un mensaje!</p>
      </div>

      {/* Grid principal con informacion y formulario */}
      <div className={styles.content_grid}>
        {/* Seccion de informacion de contacto */}
        <div className={styles.info_section}>
          <h2>Información de Contacto</h2>
          
          {/* Item de telefono */}
          <div className={styles.contact_item}>
            <FaPhone className={styles.contact_icon} />
            <div>
              <h3>Teléfono</h3>
              <p>+57 300 123 4567</p>
            </div>
          </div>

          {/* Item de WhatsApp con enlace directo */}
          <div className={styles.contact_item}>
            <FaWhatsapp className={styles.contact_icon} />
            <div>
              <h3>WhatsApp</h3>
              <p>+57 300 123 4567</p>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className={styles.whatsapp_link}>
                Enviar mensaje
              </a>
            </div>
          </div>

          {/* Item de email */}
          <div className={styles.contact_item}>
            <FaEnvelope className={styles.contact_icon} />
            <div>
              <h3>Email</h3>
              <p>info@bikestore.com</p>
            </div>
          </div>

          {/* Item de direccion */}
          <div className={styles.contact_item}>
            <FaMapMarkerAlt className={styles.contact_icon} />
            <div>
              <h3>Dirección</h3>
              <p>Calle 123 #45-67<br />Bogotá, Colombia</p>
            </div>
          </div>

          {/* Item de horarios de atencion */}
          <div className={styles.contact_item}>
            <FaClock className={styles.contact_icon} />
            <div>
              <h3>Horarios</h3>
              <p>Lunes - Sábado: 8:00 AM - 7:00 PM<br />Domingo: 9:00 AM - 5:00 PM</p>
            </div>
          </div>

          {/* Seccion de redes sociales */}
          <div className={styles.social_media}>
            <h3>Síguenos</h3>
            <div className={styles.social_links}>
              {/* Enlace a Facebook */}
              <a href="https://facebook.com/bikestore" target="_blank" rel="noopener noreferrer" className={styles.social_link}>
                <FaFacebook />
              </a>
              {/* Enlace a Instagram */}
              <a href="https://instagram.com/bikestore" target="_blank" rel="noopener noreferrer" className={styles.social_link}>
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Seccion del formulario de contacto */}
        <div className={styles.form_section}>
          <h2>Envíanos un mensaje</h2>
          
          {/* Mensaje de exito cuando se envia correctamente */}
          {enviado && (
            <div className={styles.success_message}>
              ¡Mensaje enviado exitosamente! Te responderemos pronto.
            </div>
          )}

          {/* Mensaje de error si falla el envio */}
          {error && (
            <div className={styles.error_message}>
              {error}
            </div>
          )}

          {/* Formulario de contacto */}
          <form onSubmit={handleSubmit} className={styles.contact_form}>
            {/* Primera fila: Nombre y Email */}
            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Segunda fila: Telefono y Ciudad */}
            <div className={styles.form_row}>
              <div className={styles.form_group}>
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.form_group}>
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Campo de direccion */}
            <div className={styles.form_group}>
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Campo de asunto */}
            <div className={styles.form_group}>
              <label htmlFor="asunto">Asunto *</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo de mensaje */}
            <div className={styles.form_group}>
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>

            {/* Boton de envio */}
            <button type="submit" className={styles.submit_btn} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacto; 