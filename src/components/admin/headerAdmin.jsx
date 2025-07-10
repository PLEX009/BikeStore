import React, { useState, useEffect } from 'react';
import style from '../../styles/admin/headerAdmin.module.css';
import obtenerSaludo from '../../utils/hour';

/**
 * @file headerAdmin.jsx
 * @description Componente de cabecera para el panel de administracion de BikeStore.
 * Muestra un saludo personalizado y el nombre del usuario administrador.
 */

// Funcion utilitaria para capitalizar cada palabra de una cadena
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Componente HeaderAdmin
 * Muestra el saludo, el nombre del usuario y el titulo del panel de administracion.
 * Obtiene el nombre del usuario desde la API usando el numero de identificacion almacenado en localStorage.
 */
function HeaderAdmin() {
  // Obtiene el saludo segun la hora del dia y lo capitaliza
  const saludo = toTitleCase(obtenerSaludo());
  // Estado para el nombre del usuario
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');

  // Efecto para obtener el nombre del usuario al montar el componente
  useEffect(() => {
    const numIdent = localStorage.getItem('num_ident');
    if (numIdent) {
      // Llama a la API para obtener el nombre del usuario por su numero de identificacion
      fetch(`http://localhost:3000/api/crudProduct/usuario-ident/${numIdent}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setNombreUsuario(toTitleCase(data.nombre_usuario));
          } else {
            setNombreUsuario('Usuario');
          }
        })
        .catch(() => {
          setNombreUsuario('Usuario');
        });
    }
  }, []);

  // Renderiza la cabecera del panel de administracion
  return (
    <header className={style.header}>
      <div className={style.saludo_area}>
        <span className={style.saludo}>{saludo},</span>{' '}
        <span className={style.nombre}>{nombreUsuario}</span>{' '}
        <span className={style.panelAdmin}>
          {toTitleCase('- Panel de Administracion BikeStore')}
        </span>
      </div>
    </header>
  );
}

export default HeaderAdmin;
