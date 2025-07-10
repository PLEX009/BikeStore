/**
 * Componente Toast - Sistema de notificaciones flotantes
 * 
 * Este componente maneja un sistema de notificaciones toast que se muestran
 * como mensajes flotantes en la pantalla. Los toasts se pueden mostrar
 * desde cualquier parte de la aplicacion mediante eventos personalizados.
 * Incluye auto-remocion y cierre manual.
 * 
 * @returns {JSX.Element} El contenedor de toasts con todos los mensajes activos
 */
import React, { useState, useEffect } from 'react';
import styles from '../styles/toast.module.css';

// Componente Toast para mostrar notificaciones flotantes
const Toast = () => {
  // Estado para la lista de toasts activos (array de objetos con id, mensaje y tipo)
  const [toasts, setToasts] = useState([]);

  /**
   * Efecto para escuchar eventos personalizados y mostrar nuevos toasts
   * Se ejecuta una sola vez al montar el componente
   */
  useEffect(() => {
    // Funcion que maneja el evento personalizado 'mostrarToast'
    const handleMostrarToast = (event) => {
      // Extrae mensaje y tipo del evento personalizado
      const { mensaje, tipo } = event.detail;
      // Genera un id unico para el toast usando timestamp
      const id = Date.now();
      
      // Agrega el nuevo toast al estado usando spread operator
      setToasts(prev => [...prev, { id, mensaje, tipo }]);
      
      // Auto-remueve el toast despues de 3 segundos
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };
    
    // Agrega el listener del evento personalizado al window
    window.addEventListener('mostrarToast', handleMostrarToast);
    
    // Limpia el listener al desmontar el componente para evitar memory leaks
    return () => {
      window.removeEventListener('mostrarToast', handleMostrarToast);
    };
  }, []);

  /**
   * Funcion para remover un toast manualmente
   * @param {number} id - El id del toast a remover
   */
  const removerToast = (id) => {
    // Filtra el toast con el id especificado del estado
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    // Contenedor principal de todos los toasts (posicionado en la pantalla)
    <div className={styles.toastContainer}>
      {/* Mapea todos los toasts activos para renderizarlos */}
      {toasts.map(toast => (
        // Toast individual con clases dinamicas segun el tipo
        <div 
          key={toast.id} 
          className={`${styles.toast} ${styles[toast.tipo]}`}
          onClick={() => removerToast(toast.id)}
        >
          {/* Mensaje principal del toast */}
          <span className={styles.message}>{toast.mensaje}</span>
          
          {/* Boton para cerrar el toast manualmente */}
          <button 
            className={styles.closeBtn} 
            onClick={(e) => {
              e.stopPropagation(); // Evita que se propague el click al toast
              removerToast(toast.id);
            }}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast; 