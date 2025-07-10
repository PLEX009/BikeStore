import React, { useState, useEffect } from 'react';
import styles from '../../../styles/admin/Crud/CrudProducts.module.css';
import axios from 'axios';

function CrudProveedores() {
  // Estados principales
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    celular: '',
    email: '',
    direccion: '',
    logo: null,
    estado: 'activo'
  });
  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState({ message: '', action: '' });

  // Constantes
  const proveedoresPerPage = 7;

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/crudProveedores/');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProveedores(data);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones de utilidad
  const resetForm = () => {
    setForm({ nombre: '', celular: '', email: '', direccion: '', logo: null, estado: 'activo' });
    setError(null);
  };

  const showSuccess = (message, action) => {
    setModalData({ message, action });
    setShowSuccessModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  // CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'logo' && form[key] instanceof File) {
          formData.append(key, form[key]);
        } else if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });
      if (editingId) {
        await axios.put(`/api/crudProveedores/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess(`Proveedor "${form.nombre}" actualizado correctamente`, 'actualizar');
      } else {
        await axios.post('/api/crudProveedores/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess(`Proveedor "${form.nombre}" creado correctamente`, 'crear');
      }
      await loadData();
      resetForm();
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el proveedor');
    } finally {
      setIsLoading(false);
    }
  };

  // EDITAR: consulta por ID antes de abrir el modal
  const handleEdit = async (proveedor) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/crudProveedores/${proveedor.id_proveedor}`);
      const data = res.data.data;
      setForm({
        nombre: data.nombre || '',
        celular: data.celular || '',
        email: data.email || '',
        direccion: data.direccion || '',
        logo: data.logo || null,
        estado: data.estado || 'activo'
      });
      setEditingId(proveedor.id_proveedor);
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar los datos del proveedor para editar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/crudProveedores/${id}`);
      const proveedorEliminado = proveedores.find(p => p.id_proveedor === id);
      const nombreProveedor = proveedorEliminado?.nombre || 'Proveedor';
      setProveedores(proveedores.filter(p => p.id_proveedor !== id));
      showSuccess(`Proveedor "${nombreProveedor}" eliminado correctamente`, 'eliminar');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el proveedor';
      if (errorMessage.includes('productos asociados')) {
        setModalData({ message: errorMessage, action: 'error' });
        setShowDeleteErrorModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado y paginación
  const filteredProveedores = proveedores.filter(p => {
    if (!p) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (p.nombre || '').toLowerCase().includes(searchTermLower) ||
      (p.email || '').toLowerCase().includes(searchTermLower)
    );
  });

  const indexOfLast = currentPage * proveedoresPerPage;
  const indexOfFirst = Math.max(0, indexOfLast - proveedoresPerPage);
  const currentProveedores = filteredProveedores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredProveedores.length / proveedoresPerPage));

  // Renderizado condicional
  if (isLoading && proveedores.length === 0) {
    return (
      <div className={styles.crudContainer}>
        <div className={styles.crudLoading}>
          <div className={styles.crudSpinner}></div>
          <p>Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  if (error && proveedores.length === 0) {
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

  return (
    <div className={styles.crudContainer}>
      {/* Header */}
        <h2 className={styles.crudTitle}>Gestión de Proveedores</h2>
      <div className={styles.crudSearchContainer}>
        <input
          type="text"
          placeholder="Buscar por Nombre, o Correo..."
          className={`${styles.crudInput} ${styles.crudSearchInput}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          className={styles.crudButton}
          onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}
          disabled={isLoading}
        >
          Nuevo Proveedor
        </button>
      </div>


      {error && (
        <div className={styles.crudErrorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.crudErrorClose}>&times;</button>
        </div>
      )}

      {/* Tabla de proveedores */}
      {currentProveedores.length > 0 ? (
        <>
          <table className={styles.crudTable}>
            <thead>
              <tr>
                <th className={styles.crudTh}>ID</th>
                <th className={styles.crudTh}>Logo</th>
                <th className={styles.crudTh}>Nombre</th>
                <th className={styles.crudTh}>Celular</th>
                <th className={styles.crudTh}>Email</th>
                <th className={styles.crudTh}>Dirección</th>
                <th className={styles.crudTh}>Estado</th>
                <th className={styles.crudTh}>Fecha Registro</th>
                <th className={styles.crudTh}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProveedores.map((p) => (
                <tr key={p.id_proveedor} className={styles.crudTr}>
                  <td className={styles.crudTd}>{p.id_proveedor}</td>
                  <td className={styles.crudTd}>
                    {p.logo ? (
                      <img
                        src={p.logo.startsWith('http') ? p.logo : `/${p.logo}`}
                        alt={p.nombre}
                        className={styles.crudPreviewImage}
                        onError={e => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
                      />
                    ) : (
                      <span>Sin logo</span>
                    )}
                  </td>
                  <td className={styles.crudTd}>{p.nombre}</td>
                  <td className={styles.crudTd}>{p.celular}</td>
                  <td className={styles.crudTd}>{p.email}</td>
                  <td className={styles.crudTd}>{p.direccion}</td>
                  <td className={styles.crudTd}>
                    <span className={`${styles.estadoBadge} ${p.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo}`}>
                      {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.crudTd}>{p.fecha_registro ? new Date(p.fecha_registro).toLocaleString() : ''}</td>
                  <td className={styles.crudTd}>
                    <div className={styles.crudActionCell}>
                      <button
                        type="button"
                        className={`${styles.crudButton} ${styles.crudEditButton} ${styles.iconButton} ${styles.tooltipParent}`}
                        onClick={() => handleEdit(p)}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                        <span className={`${styles.tooltip} ${styles.editTooltip}`}>Editar</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.crudButton} ${styles.crudDeleteButton} ${styles.iconButton} ${styles.tooltipParent}`}
                        onClick={() => handleDelete(p.id_proveedor)}
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

          {/* Paginación */}
          {filteredProveedores.length > proveedoresPerPage && (
            <div className={styles.crudPagination}>
              <button
                className={`${styles.crudButtonPaginacion} ${styles.crudPaginationButton}`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                &laquo;
              </button>

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
        <div className={styles.crudEmptyState}>
          <div className={styles.crudEmptyStateIcon}>📦</div>
          <p>No se encontraron proveedores</p>
          <button
            className={styles.crudButton}
            onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}
            disabled={isLoading}
          >
            Agregar primer proveedor
          </button>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudModalContent}>
            <div className={styles.crudModalHeader}>
              <h2 className={styles.crudModalTitle}>
                {editingId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
              </h2>
              <button
                className={styles.crudCloseModal}
                onClick={() => { setShowModal(false); resetForm(); }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            <div className={styles.crudModalBody}>
              {error && <div className={styles.crudModalError}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Nombre y Celular */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input id="nombre" className={styles.crudModalInput} type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del proveedor" required />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="celular">Celular:</label>
                    <input id="celular" className={styles.crudModalInput} type="text" name="celular" value={form.celular} onChange={handleChange} placeholder="Celular" />
                  </div>
                </div>

                {/* Email y Dirección */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="email">Email:</label>
                    <input id="email" className={styles.crudModalInput} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="direccion">Dirección:</label>
                    <input id="direccion" className={styles.crudModalInput} type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección del proveedor" />
                  </div>
                </div>

                {/* Estado */}
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

                {/* Logo */}
                <div className={styles.crudModalFormGroup}>
                  <label>Logo del proveedor:</label>
                  <div className={styles.crudFileInputContainer}>
                    <label htmlFor="logo" className={styles.crudFileInputLabel}>
                      {form.logo ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    </label>
                    <input id="logo" className={styles.crudFileInput} type="file" name="logo" accept="image/*" onChange={handleChange} />
                    {form.logo && (
                      <div className={styles.crudFileName}>
                        {typeof form.logo === 'string' ? 'Logo actual' : form.logo.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vista previa de imagen */}
                {form.logo && (
                  <div className={styles.crudImagePreviewContainer}>
                    <img
                      src={typeof form.logo === 'string' ? (form.logo.startsWith('http') ? form.logo : `/${form.logo}`) : URL.createObjectURL(form.logo)}
                      alt="Vista previa"
                      className={styles.crudImagePreview}
                      style={{ maxWidth: 120, maxHeight: 120, objectFit: 'contain' }}
                    />
                  </div>
                )}

                <div className={styles.crudModalFooter}>
                  <button type="button" className={`${styles.crudModalButton} ${styles.crudSecondaryButton}`} onClick={() => { setShowModal(false); resetForm(); }} disabled={isLoading}>
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

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudSuccessModal}>
            <div className={styles.crudSuccessHeader}>
              <div className={styles.crudSuccessIcon}>✅</div>
              <h3>¡Operación Exitosa!</h3>
              <button className={styles.crudCloseModal} onClick={() => setShowSuccessModal(false)}>&times;</button>
            </div>
            <div className={styles.crudSuccessBody}>
              <p className={styles.crudSuccessMessage}>{modalData.message}</p>
              <div className={styles.crudSuccessInfo}>
                <p><strong>¿Qué pasó?</strong></p>
                <ul>
                  {modalData.action === 'crear' ? (
                    <>
                      <li>El proveedor se ha agregado exitosamente</li>
                      <li>Ya está disponible en la lista</li>
                    </>
                  ) : modalData.action === 'actualizar' ? (
                    <>
                      <li>Los datos del proveedor se han actualizado correctamente</li>
                      <li>Los cambios ya están aplicados</li>
                    </>
                  ) : (
                    <>
                      <li>El proveedor se ha eliminado permanentemente del sistema</li>
                      <li>Ya no aparecerá en la lista</li>
                      <li>Esta acción no se puede deshacer</li>
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

      {/* Modal de Error de Eliminación */}
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
                <p><strong>¿Por qué no se puede eliminar?</strong></p>
                <ul>
                  <li>Este proveedor tiene productos registrados en el sistema</li>
                  <li>Eliminarlo afectaría la integridad de los datos históricos</li>
                  <li>Se recomienda cambiar el estado a "Inactivo" en su lugar</li>
                </ul>
              </div>
            </div>
            <div className={styles.crudDeleteErrorFooter}>
              <button className={`${styles.crudModalButton} ${styles.crudSecondaryButton}`} onClick={() => setShowDeleteErrorModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrudProveedores;