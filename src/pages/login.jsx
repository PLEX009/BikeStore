/**
 * Componente LoginRegister - Pagina de inicio de sesion, registro y recuperacion
 * 
 * Este componente renderiza los formularios de login, registro y recuperacion de contraseña.
 * Incluye validaciones de campos, alternancia de paneles, video de fondo y manejo de errores.
 * 
 * @returns {JSX.Element} Pagina de autenticacion con formularios y overlays
 */
// Importar Librerias Necesarias De React
import React, { useState } from 'react';
import styles from '../styles/login.module.css';
import { Link } from 'react-router-dom';
import { Alert } from '@coreui/coreui';

// Componente Principal LoginRegister
function LoginRegister() {
  // Estados Para Controlar Los Paneles Y Formularios
  const [rightPanel, setRightPanel] = useState(false); // Controla El Panel Derecho (Login/Register)
  const [forgotPassword, setForgotPassword] = useState(false); // Controla Si Se Muestra El Formulario De Recuperacion

  // Estado Para Los Errores De Validacion De Cada Formulario
  const [formErrors, setFormErrors] = useState({
    login: { num_ident: false, contrasena: false },
    register: {
      nom_com: false,
      tipo_ident: false,
      num_ident: false,
      celular: false,
      direccion: false,
      email: false,
      contrasena: false
    },
    recover: {
      num_ident_recuperar: false,
      email_recuperar: false
    }
  });

  // Estado Para Saber Que Campos Han Sido Tocados (Para Mostrar Errores Solo Despues De Interaccion)
  const [touchedFields, setTouchedFields] = useState({
    login: { num_ident: false, contrasena: false },
    register: {
      nom_com: false,
      tipo_ident: false,
      num_ident: false,
      celular: false,
      direccion: false,
      email: false,
      contrasena: false
    },
    recover: {
      num_ident_recuperar: false,
      email_recuperar: false
    }
  });

  /**
   * Funcion Para Alternar Entre Los Formularios De Login Y Registro
   */
  const toggleForms = () => {
    setRightPanel(!rightPanel);
    setForgotPassword(false); // Siempre Que Se Cambie De Formulario, Ocultar El De Recuperacion
  };

  /**
   * Funcion Para Validar Los Campos Del Formulario De Registro
   * @param {string} name - Nombre del campo
   * @param {string} value - Valor del campo
   * @returns {boolean} True si es valido, false si no
   */
  const validateRegisterField = (name, value) => {
    switch (name) {
      case 'nom_com':
        const words = value.trim().split(/\s+/);
        return words.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
      case 'tipo_ident':
        return value !== '';
      case 'num_ident':
        return /^\d{6,12}$/.test(value);
      case 'celular':
        return /^\d{10}$/.test(value);
      case 'direccion':
        return value.trim().length >= 5;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'contrasena':
        return (
          value.length >= 8 &&            // Minimo 8 Caracteres
          /[A-Z]/.test(value) &&           // Al Menos 1 Mayuscula
          /[0-9]/.test(value) &&           // Al Menos 1 Numero
          /[!@#$%^&*(),.?":{}|<>]/.test(value)  // Al Menos 1 Caracter Especial
        );
      default:
        return true;
    }
  };

  /**
   * Funcion Para Validar Los Campos Del Formulario De Login
   */
  const validateLoginField = (name, value) => {
    switch (name) {
      case 'num_ident':
        return /^\d{6,12}$/.test(value);
      case 'contrasena':
        return value.length >= 6;
      default:
        return true;
    }
  };

  /**
   * Funcion Para Validar Los Campos Del Formulario De Recuperacion
   */
  const validateRecoverField = (name, value) => {
    switch (name) {
      case 'num_ident_recuperar':
        return /^\d{6,12}$/.test(value);
      case 'email_recuperar':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default:
        return true;
    }
  };

  /**
   * Manejador De Cambios En Los Campos De Cualquier Formulario
   */
  const handleFieldChange = (formName, e) => {
    const { name, value } = e.target;

    // Marcar El Campo Como Tocado
    setTouchedFields(prev => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [name]: true
      }
    }));

    // Validar El Campo Segun El Formulario
    let isValid;
    if (formName === 'register') {
      isValid = validateRegisterField(name, value);
    } else if (formName === 'login') {
      isValid = validateLoginField(name, value);
    } else if (formName === 'recover') {
      isValid = validateRecoverField(name, value);
    }

    // Actualizar Los Errores
    setFormErrors(prev => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [name]: !isValid
      }
    }));
  };

  /**
   * Funcion Para Obtener Los Atributos De Un Campo (Clases CSS Y Mensaje De Error)
   */
  const getFieldAttributes = (formName, fieldName) => {
    const isTouched = touchedFields[formName][fieldName];
    const hasError = formErrors[formName][fieldName];

    return {
      className: hasError && isTouched ? styles.invalid :
        (!hasError && isTouched) ? styles.valid : '',
      title: hasError && isTouched ? getErrorMessage(formName, fieldName) : ''
    };
  };

  /**
   * Funcion Para Obtener El Mensaje De Error Segun El Campo
   */
  const getErrorMessage = (formName, fieldName) => {
    if (!touchedFields[formName][fieldName] || !formErrors[formName][fieldName]) {
      return '';
    }

    switch (fieldName) {
      case 'nom_com':
        return 'Debe Tener Minimo Tres Palabras';
      case 'tipo_ident':
        return 'Selecciona Un Tipo De Identificacion';
      case 'num_ident':
      case 'num_ident_recuperar':
        return 'Debe Tener Entre 6 Y 12 Digitos';
      case 'celular':
        return 'Debe Tener Exactamente 10 Digitos';
      case 'direccion':
        return 'Minimo 5 Caracteres';
      case 'email':
      case 'email_recuperar':
        return 'Ingresa Un Email Valido';
      case 'contrasena':
        return 'Minimo 8 Caracteres, 1 Mayuscula, 1 Numero Y 1 Caracter Especial';
      default:
        return 'Campo Invalido';
    }
  };

  /**
   * Funcion Para Marcar Todos Los Campos De Un Formulario Como Tocados (Al Enviar)
   */
  const markAllFieldsAsTouched = (formName) => {
    setTouchedFields(prev => {
      const newTouched = { ...prev[formName] };
      Object.keys(newTouched).forEach(key => {
        newTouched[key] = true;
      });
      return {
        ...prev,
        [formName]: newTouched
      };
    });
  };

  /**
   * Manejador Para El Envio Del Formulario De Login
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    markAllFieldsAsTouched('login');

    const hasErrors = Object.values(formErrors.login).some(error => error);
    if (hasErrors) {
      alert('Por Favor Corrige Los Errores En El Formulario');
      return;
    }

    const form = e.target;
    const datos = {
      num_ident: form.num_ident.value,
      contrasena: form.contrasena.value
    };

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.mensaje);
        localStorage.setItem('num_ident', datos.num_ident);
        // Guardar información adicional del usuario
        if (result.usuario) {
          localStorage.setItem('user_name', result.usuario.nombre);
          localStorage.setItem('user_id', result.usuario.id);
          localStorage.setItem('id_usuario', result.usuario.id);
          localStorage.setItem('user_rol', result.usuario.rol);
        }
        
        // Disparar evento personalizado para actualizar otros componentes
        window.dispatchEvent(new CustomEvent('authChange'));
        
        if (result.redireccion) {
          window.location.href = result.redireccion;
        }
      } else if (response.status === 403) {
        alert('⚠️ El usuario está inactivo. Contacte al administrador.');
      } else if (response.status === 401) {
        alert('❗ Credenciales incorrectas');
      } else {
        alert(result.error || '❌ Error al iniciar sesión');
      }

    } catch (err) {
      console.error('Error en el Login', err);
      alert('Error De Red O Del Servidor');
    }
  };

  /**
   * Manejador Para El Envio Del Formulario De Registro
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    markAllFieldsAsTouched('register');

    // Verificar Si Hay Errores
    const hasErrors = Object.values(formErrors.register).some(error => error);
    if (hasErrors) {
      alert('Por Favor Corrige Los Errores En El Formulario');
      return;
    }

    const form = e.target;
    const datos = Object.fromEntries(new FormData(form).entries());

    try {
      // Enviar Datos Al Servidor
      const response = await fetch('http://localhost:3000/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.mensaje);
        toggleForms(); // Cambiar Al Formulario De Login
      } else {
        alert(result.error || 'Error En El Registro');
      }
    } catch (err) {
      alert('Error De Red O Del Servidor');
    }
  };

  /**
   * Manejador Para El Envio Del Formulario De Recuperacion
   */
  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    markAllFieldsAsTouched('recover');

    // Verificar Si Hay Errores
    const hasErrors = Object.values(formErrors.recover).some(error => error);
    if (hasErrors) {
      alert('Por Favor Corrige Los Errores En El Formulario');
      return;
    }

    const form = e.target.closest("form");
    const num_ident_recuperar = form.num_ident_recuperar.value;
    const email_recuperar = form.email_recuperar.value;

    try {
      // Enviar Datos Al Servidor
      const response = await fetch('http://localhost:3000/api/usuarios/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_ident_recuperar, email_recuperar })
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.mensaje);
      } else {
        alert(result.error || '❗ Error Al Recuperar La Contraseña');
      }
    } catch (error) {
      alert('❌ Error De Red O Del Servidor');
    }
  };

  // Renderizado Del Componente
  return (
    <div className={styles.body}>
      {/* Boton Para Volver A La Pagina Principal */}
      <div className={styles.backhome}>
        <Link to="/">
          <button className={styles.button}  type="submit">Pagina Principal</button>
        </Link>
      </div>

      {/* Contenedor Principal Con Los Formularios */}
      <div className={`${styles.container} ${rightPanel ? styles.right_panel_active : ''}`} id="container">
        {/* Formulario De Registro */}
        <div className={styles.form_container + ' ' + styles.sign_up_container}>
          <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
            <h1 className={`${styles.title_form} ${styles.h1}`}>Registrar Usuario</h1>
            <span className={`${styles.email_span} ${styles.span}`}>¿Aún No Tienes Una Cuenta? Solo Necesitas Registrarte Con Tus Datos Basicos Para Crear Tu Perfil Y Empezar A Disfrutar De Todos Los Servicios</span>

            <div className={styles.infield_2}>
              <input type="hidden" name="id_rol" value="1" />
              <input
                type="text"
                name="nom_com"
                placeholder="Nombre Completo"
                onChange={(e) => handleFieldChange('register', e)}
                {...getFieldAttributes('register', 'nom_com')}
              />
            </div>

            <div className={styles.input_group}>
              <div className={styles.infield_2}>
                <select
                  name="tipo_ident"
                  defaultValue=""
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'tipo_ident')}
                >
                  <option value="" disabled>Tipo De Identificacion</option>
                  <option value="CC">Cedula De Ciudadania</option>
                  <option value="CE">Cedula De Extranjeria</option>
                  <option value="TI">Tarjeta De Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>
              <div className={styles.infield_2}>
                <input
                  type="text"
                  name="num_ident"
                  placeholder="Numero Identificacion"
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'num_ident')}
                />
              </div>
            </div>

            <div className={styles.input_group}>
              <div className={styles.infield_2}>
                <input
                  type="tel"
                  name="celular"
                  placeholder="Numero De Celular"
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'celular')}
                />
              </div>
              <div className={styles.infield_2}>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Direccion De Residencia"
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'direccion')}
                />
              </div>
            </div>

            <div className={styles.input_group_2}>
              <div className={styles.infield_2}>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo Electronico"
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'email')}
                />
              </div>
              <div className={styles.infield_2}>
                <input
                  type="password"
                  name="contrasena"
                  placeholder="Crea Tu Contraseña"
                  onChange={(e) => handleFieldChange('register', e)}
                  {...getFieldAttributes('register', 'contrasena')}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button  className={styles.button} type="submit" style={{ width: '13rem' }}>Registrar</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={toggleForms} className={`${styles.button} ${styles.registrar}`}  type="button" formNoValidate>Iniciar Sesion</button>
            </div>
          </form>
        </div>

        {/* Formulario De Login O Recuperacion */}
        <div className={styles.form_container + ' ' + styles.sign_in_container}>
          {!forgotPassword ? (
            // Formulario De Login
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <h1 className={styles.h1}>Iniciar Sesion</h1>
              <span className={styles.span}>¿Ya Tienes Una Cuenta? Solo Necesitas Iniciar Sesion Con Tus Credenciales Para Acceder Rapidamente A Todos Los Servicios Y Beneficios Disponibles.</span>

              <div className={styles.infield_1}>
                <input
                  type="text"
                  name="num_ident"
                  placeholder="Ingrese Su N° De Identificacion"
                  onChange={(e) => handleFieldChange('login', e)}
                  {...getFieldAttributes('login', 'num_ident')}
                />
              </div>
              <div className={styles.infield_1}>
                <input
                  type="password"
                  name="contrasena"
                  placeholder="Ingrese Su Contraseña"
                  onChange={(e) => handleFieldChange('login', e)}
                  {...getFieldAttributes('login', 'contrasena')}
                />
              </div>

              <a href="#" className={styles.forgot} onClick={(e) => {
                e.preventDefault();
                setForgotPassword(true);
              }}>
                ¿Olvidaste Tu Contraseña?
              </a>

              <button className={styles.button} type="submit">Iniciar Sesion</button>
              <button className={`${styles.button} ${styles.registrar}`} onClick={toggleForms}  type="button" formNoValidate>Registrarse</button>
            </form>
          ) : (
            // Formulario De Recuperacion De Contraseña
            <form className={styles.form}>
              <h1 className={styles.h1}>Recuperar Contraseña</h1>
              <span className={styles.span}>¿Olvidaste La Contraseña? Solo Necesitas Ingresar Las Credenciales Solicitadas Y Hacer Clic En "Recuperar".</span>
              <div className={styles.infield_1}>
                <input
                  type="text"
                  name="num_ident_recuperar"
                  placeholder="Ingrese Su N° De Identificacion"
                  onChange={(e) => handleFieldChange('recover', e)}
                  {...getFieldAttributes('recover', 'num_ident_recuperar')}
                />
              </div>
              <div className={styles.infield_1}>
                <input
                  type="email"
                  name="email_recuperar"
                  placeholder="Ingres Su Correo Electronico"
                  onChange={(e) => handleFieldChange('recover', e)}
                  {...getFieldAttributes('recover', 'email_recuperar')}
                />
              </div>
              <a href="#" className={styles.forgot} onClick={(e) => {
                e.preventDefault();
                setForgotPassword(false);
              }}>
                Volver Al Inicio De Sesion
              </a>
              <button className={`${styles.button} ${styles.btn_recuperar}`}
                type="button"
                onClick={handleRecoverSubmit}
              >
                Recuperar
              </button>
            </form>
          )}
        </div>

        {/* Video De Fondo */}
        <video autoPlay muted loop playsInline className={styles.video_fondo}>
          <source src="/videos/videoL.mp4" type="video/mp4" />
        </video>

        {/* Overlay Con Mensajes Y Botones Para Alternar Entre Formularios */}
        <div className={styles.overlay_container}>
          <div className={styles.overlay}>
            <div className={styles.overlay_panel + ' ' + styles.overlay_left}>
              <h1 className={styles.h1}>¡Inicia Sesion!</h1>
              <p>¿Ya Tienes Una Cuenta? Inicia Sesion Con Tu Numero De Identificacion Y Contraseña Para Acceder A Tu Perfil Y Todos Los Servicios Disponibles.</p>
              <button className={styles.button} onClick={toggleForms}>Inicia Sesion</button>
            </div>
            <div className={styles.overlay_panel + ' ' + styles.overlay_right}>
              <h1 className={styles.h1}>¡Registrate Ahora!</h1>
              <p>¿No Tienes Una Cuenta Para Ingresar? ¡Crea Una Ahora! Es Rapido, Facil Y Te Dara Acceso A Todos Los Beneficios.</p>
              <button className={`${styles.button} ${styles.btn_registro_mobile2}`} onClick={toggleForms}>Registrate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;