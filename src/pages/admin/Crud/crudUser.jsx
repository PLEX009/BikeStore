// Importa React y hooks necesarios para el estado y efectos
import React, { useState, useEffect } from 'react';
// Importa los estilos CSS del modulo para aplicar clases
import styles from '../../../styles/admin/Crud/CrudProducts.module.css';
// Importa axios para hacer peticiones HTTP al backend
import axios from 'axios';

/**
 * Componente para la gestion de usuarios en el panel de administrador.
 * Permite crear, leer, actualizar y eliminar usuarios del sistema.
 * Incluye validaciones, manejo de contraseñas y estados de usuario.
 * @returns {JSX.Element} Interfaz de gestion de usuarios
 */
function CrudUsers() {
  // Estados principales para manejar los datos de usuarios
  const [users, setUsers] = useState([]);
  // Estado del formulario para crear/editar usuarios
  const [form, setForm] = useState({
    id_rol: '', nom_com: '', tipo_ident: '', num_ident: '',
    celular: '', direccion: '', estado: 'activo', email: '', contrasena: ''
  });
  
  // Estados de UI para controlar la interfaz de usuario
  const [searchTerm, setSearchTerm] = useState(''); // Termino de busqueda
  const [currentPage, setCurrentPage] = useState(1); // Pagina actual
  const [editingId, setEditingId] = useState(null); // ID del usuario siendo editado
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña en formulario
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Contraseñas visibles en tabla
  const [error, setError] = useState(null); // Mensajes de error
  const [showModal, setShowModal] = useState(false); // Modal de formulario
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false); // Modal de error al eliminar
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal de exito
  const [modalData, setModalData] = useState({ message: '', action: '' }); // Datos del modal

  // Constantes de configuracion
  const usersPerPage = 10; // Usuarios por pagina
  // Opciones de tipos de identificacion disponibles
  const tiposIdent = [
    { value: 'CC', label: 'Cedula de Ciudadania' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cedula de Extranjeria' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PAS', label: 'Pasaporte' }
  ];

  // Opciones de roles disponibles en el sistema
  const roles = [
    { value: '1', label: 'Cliente' },
    { value: '2', label: 'Administrador' },
    { value: '3', label: 'SuperUsuario' },
  ];

  /**
   * Obtiene el nombre del rol basado en el ID numerico
   * @param {number} id_rol ID del rol
   * @returns {string} Nombre del rol
   */
  const getRolLabel = (id_rol) => {
    const rol = roles.find(r => r.value === String(id_rol));
    return rol ? rol.label : id_rol;
  };

  // useEffect para cargar datos iniciales al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carga la lista de usuarios desde el backend
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const usersRes = await axios.get('/api/crudAdminUser/');
      // Verifica que la respuesta sea un array
      const usersData = Array.isArray(usersRes.data.data) ? usersRes.data.data : [];
      setUsers(usersData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones de utilidad para manejar el estado de la UI
  /**
   * Reinicia el formulario a sus valores iniciales
   */
  const resetForm = () => {
    setForm({
      id_rol: '', nom_com: '', tipo_ident: '', num_ident: '',
      celular: '', direccion: '', estado: 'activo', email: '', contrasena: ''
    });
    setError(null);
  };

  /**
   * Muestra un modal de exito con mensaje y tipo de accion
   * @param {string} message Mensaje a mostrar
   * @param {string} action Tipo de accion (crear/actualizar/eliminar)
   */
  const showSuccess = (message, action) => {
    setModalData({ message, action });
    setShowSuccessModal(true);
  };

  /**
   * Maneja el cambio de los inputs del formulario
   * @param {object} e Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
  /**
   * Maneja el submit del formulario para crear o actualizar usuarios
   * @param {object} e Evento submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir envios duplicados mientras se procesa
    if (isLoading) {
      console.log('Formulario ya se esta enviando, ignorando envio duplicado');
      return;
    }

    // Validar campos requeridos antes de enviar
    if (!form.id_rol || !form.nom_com || !form.tipo_ident || !form.num_ident || !form.email) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar contraseña solo al crear un nuevo usuario
    if (!editingId && !form.contrasena) {
      setError('La contraseña es requerida al crear un usuario');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Enviando formulario:', form);

      // Si hay editingId, actualiza el usuario existente
      if (editingId) {
        await axios.put(`/api/crudAdminUser/${editingId}`, form);
        showSuccess(`Usuario "${form.nom_com}" actualizado correctamente`, 'actualizar');
      } else {
        // Si no hay editingId, crea un nuevo usuario
        await axios.post('/api/crudAdminUser/create', form);
        showSuccess(`Usuario "${form.nom_com}" creado correctamente`, 'crear');
      }

      // Recarga los datos y limpia el formulario
      await loadData();
      resetForm();
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error('Error al guardar el usuario:', err);
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la edicion de un usuario (carga datos por ID y abre modal)
   * @param {object} user Objeto usuario a editar
   */
  const handleEdit = async (user) => {
    setIsLoading(true);
    setError(null);
    try {
      // Consulta el usuario por ID para obtener datos completos
      const res = await axios.get(`/api/crudAdminUser/${user.id_usuario}`);
      const userData = res.data.data;
      // Llena el formulario con los datos del usuario
      setForm({
        id_rol: userData.id_rol || '',
        nom_com: userData.nom_com || '',
        tipo_ident: userData.tipo_ident || '',
        num_ident: userData.num_ident || '',
        celular: userData.celular || '',
        direccion: userData.direccion || '',
        estado: userData.estado || 'activo',
        email: userData.email || '',
        contrasena: userData.contrasena || ''
      });
      setEditingId(user.id_usuario);
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar los datos del usuario para editar');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Alterna la visibilidad de la contraseña en la tabla
   * @param {number} userId ID del usuario
   */
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  /**
   * Maneja la eliminacion de un usuario
   * @param {number} id ID del usuario a eliminar
   */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estas seguro de que deseas eliminar este usuario?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/crudAdminUser/${id}`);
      // Obtiene el nombre del usuario eliminado para el mensaje
      const usuarioEliminado = users.find(user => user.id_usuario === id);
      const nombreUsuario = usuarioEliminado?.nom_com || 'Usuario';
      // Actualiza la lista local removiendo el usuario eliminado
      setUsers(users.filter(user => user.id_usuario !== id));
      showSuccess(`Usuario "${nombreUsuario}" eliminado correctamente`, 'eliminar');
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
      // Si el error es por compras asociadas, muestra modal especial
      if (errorMessage.includes('compras asociadas')) {
        setModalData({ message: errorMessage, action: 'error' });
        setShowDeleteErrorModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado y paginacion
  // Filtra usuarios segun el termino de busqueda
  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.nom_com || '').toLowerCase().includes(searchTermLower) ||
      (user.email || '').toLowerCase().includes(searchTermLower) ||
      (user.num_ident || '').toLowerCase().includes(searchTermLower) ||
      (user.celular || '').toLowerCase().includes(searchTermLower)
    );
  });

  // Logica de paginacion
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = Math.max(0, indexOfLastUser - usersPerPage);
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));

  // Renderizado condicional: muestra spinner si esta cargando y no hay usuarios
  if (isLoading && users.length === 0) {
    return (
      <div className={styles.crudContainer}>
        <div className={styles.crudLoading}>
          <div className={styles.crudSpinner}></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional: muestra error si no hay usuarios
  if (error && users.length === 0) {
    return (
      <div className={styles.crudContainer}>
        <div className={styles.crudError}>
          <p>Error: {error}</p>
          <button className={styles.crudButton} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Render principal del componente
  return (
    <div className={styles.crudContainer}>
      {/* Titulo principal */}
      <h2 className={styles.crudTitle}>Gestion de Usuarios</h2>
      
      {/* Header con busqueda y boton de nuevo usuario */}
      <div className={styles.crudSearchContainer}>
        {/* Input de busqueda */}
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className={`${styles.crudInput} ${styles.crudSearchInput}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetea a la primera pagina al buscar
          }}
        />
        {/* Boton para crear nuevo usuario */}
        <button
          className={styles.crudButton}
          onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}
          disabled={isLoading}
        >
          Nuevo Usuario
        </button>
      </div>

      {/* Banner de error si hay error */}
      {error && (
        <div className={styles.crudErrorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.crudErrorClose}>&times;</button>
        </div>
      )}

      {/* Tabla de usuarios */}
      {currentUsers.length > 0 ? (
        <>
          <table className={styles.crudTable}>
            <thead>
              <tr>
                <th className={styles.crudTh}>ID</th>
                <th className={styles.crudTh}>Nombre</th>
                <th className={styles.crudTh}>Rol</th>
                <th className={styles.crudTh}>Tipo Ident.</th>
                <th className={styles.crudTh}># Identificacion</th>
                <th className={styles.crudTh}>Celular</th>
                <th className={styles.crudTh}>Estado</th>
                <th className={styles.crudTh}>Email</th>
                <th className={styles.crudTh}>Contraseña</th>
                <th className={styles.crudTh}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza cada usuario en una fila */}
              {currentUsers.map((user) => (
                <tr key={user.id_usuario} className={styles.crudTr}>
                  <td className={styles.crudTd}>{user.id_usuario}</td>
                  <td className={styles.crudTd}>{user.nom_com}</td>
                  <td className={styles.crudTd}>{getRolLabel(user.id_rol)}</td>
                  <td className={styles.crudTd}>{user.tipo_ident}</td>
                  <td className={styles.crudTd}>{user.num_ident}</td>
                  <td className={styles.crudTd}>{user.celular}</td>
                  <td className={styles.crudTd}>
                    {/* Badge de estado con color segun estado */}
                    <span className={`${styles.estadoBadge} ${user.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo}`}>
                      {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.crudTd}>{user.email}</td>
                  <td className={styles.crudTd}>
                    {/* Celda de contraseña con toggle de visibilidad */}
                    <div className={styles.passwordCell}>
                      <span>
                        {visiblePasswords[user.id_usuario] ? user.contrasena : '••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(user.id_usuario)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {visiblePasswords[user.id_usuario] ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </td>
                  <td className={styles.crudTd}>
                    <div className={styles.crudActionCell}>
                      {/* Boton de editar */}
                      <button
                        type="button"
                        className={`${styles.crudButton} ${styles.crudEditButton} ${styles.iconButton} ${styles.tooltipParent}`}
                        onClick={() => handleEdit(user)}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                        <span className={`${styles.tooltip} ${styles.editTooltip}`}>Editar</span>
                      </button>
                      {/* Boton de eliminar */}
                      <button
                        type="button"
                        className={`${styles.crudButton} ${styles.crudDeleteButton} ${styles.iconButton} ${styles.tooltipParent}`}
                        onClick={() => handleDelete(user.id_usuario)}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                        <span className={`${styles.tooltip} ${styles.deleteTooltip}`}>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginacion de la tabla */}
          {filteredUsers.length > usersPerPage && (
            <div className={styles.crudPagination}>
              {/* Boton anterior */}
              <button
                className={`${styles.crudButtonPaginacion} ${styles.crudPaginationButton}`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                &laquo;
              </button>

              {/* Botones numericos de pagina */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.crudButtonPaginacion} ${styles.crudPaginationButton} ${currentPage === i + 1 ? styles.crudActivePage : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={isLoading}
                >
                  {i + 1}
                </button>
              ))}

              {/* Boton siguiente */}
              <button
                className={`${styles.crudButtonPaginacion} ${styles.crudPaginationButton}`}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || isLoading}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      ) : (
        // Estado vacio si no hay usuarios
        <div className={styles.crudEmptyState}>
          <div className={styles.crudEmptyStateIcon}>👤</div>
          <p>No se encontraron usuarios</p>
          <button
            className={styles.crudButton}
            onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}
            disabled={isLoading}
          >
            Agregar primer usuario
          </button>
        </div>
      )}

      {/* Modal de formulario para crear/editar usuarios */}
      {showModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudModalContent}>
            <div className={styles.crudModalHeader}>
              <h2 className={styles.crudModalTitle}>
                {editingId ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h2>
              <button
                className={styles.crudCloseModal}
                onClick={() => { setShowModal(false); resetForm(); setEditingId(null); }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            <div className={styles.crudModalBody}>
              {/* Mensaje de error en el modal */}
              {error && <div className={styles.crudModalError}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Primera fila: Rol y Nombre */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="id_rol">Rol</label>
                    <select id="id_rol" name="id_rol" className={styles.crudModalInput} value={form.id_rol} onChange={handleChange} required>
                      <option value="">Seleccione rol</option>
                      {roles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="nom_com">Nombre Completo:</label>
                    <input id="nom_com" className={styles.crudModalInput} type="text" name="nom_com" value={form.nom_com} onChange={handleChange} placeholder="Ej: Juan Perez" required />
                  </div>
                </div>

                {/* Segunda fila: Tipo y Numero de Identificacion */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="tipo_ident">Tipo de Identificacion</label>
                    <select id="tipo_ident" name="tipo_ident" className={styles.crudModalInput} value={form.tipo_ident} onChange={handleChange} required>
                      <option value="">Seleccione tipo</option>
                      {tiposIdent.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="num_ident">Numero de Identificacion:</label>
                    <input id="num_ident" className={`${styles.crudModalInput} ${editingId ? styles.readOnlyInput : ''}`} type="number" name="num_ident" value={form.num_ident} onChange={handleChange} placeholder="Ej: 123456789" readOnly={!!editingId}/>
                  </div>
                </div>

                {/* Tercera fila: Celular y Direccion */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="celular">Celular:</label>
                    <input id="celular" className={styles.crudModalInput} type="number" name="celular" value={form.celular} onChange={handleChange} placeholder="Ej: 3001234567" />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="direccion">Direccion:</label>
                    <input id="direccion" className={styles.crudModalInput} type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej: Calle 123 #45-67" />
                  </div>
                </div>

                {/* Estado (solo visible al editar) */}
                {editingId ? (
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" className={styles.crudModalInput} value={form.estado} onChange={handleChange}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                ) : (
                  <input type="hidden" name="estado" value="activo" />
                )}

                {/* Cuarta fila: Email y Contraseña */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="email">Emsail:</label>
                    <input id="email" className={styles.crudModalInput} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Ej: correo@ejemplo.com" required />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="contrasena">Contraseña:</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        id="contrasena"
                        className={styles.crudModalInput}
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        value={form.contrasena}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required={!editingId} // Solo requerida al crear
                      />
                      {/* Boton para mostrar/ocultar contraseña */}
                      <button
                        type="button"
                        className={styles.togglePasswordButton}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Mostrar/Ocultar contraseña"
                      >
                        {showPassword ? (
                          // Icono de ojo abierto
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          // Icono de ojo cerrado
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.42 21.42 0 0 1 5.07-6.13M1 1l22 22" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Botones del formulario */}
                <div className={styles.crudModalFooter}>
                  <button type="button" className={`${styles.crudModalButton} ${styles.crudSecondaryButton}`} onClick={() => { setShowModal(false); resetForm(); setEditingId(null); }} disabled={isLoading}>
                    Cancelar
                  </button>
                  <button type="submit" className={`${styles.crudModalButton} ${styles.crudPrimaryButton}`} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className={styles.crudSpinner}></span>
                        Procesando...
                      </>
                    ) : editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exito para mostrar mensajes de operacion exitosa */}
      {showSuccessModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudSuccessModal}>
            <div className={styles.crudSuccessHeader}>
              <div className={styles.crudSuccessIcon}>✅</div>
              <h3>¡Operacion Exitosa!</h3>
              <button className={styles.crudCloseModal} onClick={() => setShowSuccessModal(false)}>&times;</button>
            </div>
            <div className={styles.crudSuccessBody}>
              <p className={styles.crudSuccessMessage}>{modalData.message}</p>
              <div className={styles.crudSuccessInfo}>
                <p><strong>¿Que paso?</strong></p>
                <ul>
                  {modalData.action === 'crear' ? (
                    <>
                      <li>El usuario se ha agregado exitosamente al sistema</li>
                      <li>Ya puede iniciar sesion</li>
                      <li>Puedes verlo en la lista de usuarios</li>
                    </>
                  ) : modalData.action === 'actualizar' ? (
                    <>
                      <li>Los datos del usuario se han actualizado correctamente</li>
                      <li>Los cambios ya estan aplicados</li>
                    </>
                  ) : (
                    <>
                      <li>El usuario se ha eliminado permanentemente del sistema</li>
                      <li>Ya no aparecera en la lista</li>
                      <li>Esta accion no se puede deshacer</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className={styles.crudSuccessFooter}>
              <button className={`${styles.crudModalButton} ${styles.crudPrimaryButton}`} onClick={() => setShowSuccessModal(false)}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error de Eliminacion para usuarios con compras asociadas */}
      {showDeleteErrorModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudDeleteErrorModal}>
            <div className={styles.crudDeleteErrorHeader}>
              <div className={styles.crudDeleteErrorIcon}>⚠️</div>
              <h3>No se puede eliminar</h3>
              <button className={styles.crudCloseModal} onClick={() => setShowDeleteErrorModal(false)}>&times;</button>
            </div>
            <div className={styles.crudDeleteErrorBody}>
              <p className={styles.crudDeleteErrorMessage}>{modalData.message}</p>
              <div className={styles.crudDeleteErrorInfo}>
                <p><strong>¿Por que no se puede eliminar?</strong></p>
                <ul>
                  <li>Este usuario tiene compras registradas en el sistema</li>
                  <li>Eliminarlo afectaria la integridad de los datos historicos</li>
                  <li>Se recomienda cambiar el estado a "Inactivo" en su lugar</li>
                </ul>
              </div>
            </div>
            <div className={styles.crudDeleteErrorFooter}>
              <button className={`${styles.crudModalButton} ${styles.crudPrimaryButton}`} onClick={() => setShowDeleteErrorModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la aplicacion
export default CrudUsers;