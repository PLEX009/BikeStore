// Importa React y hooks necesarios
import React, { useState, useEffect } from 'react';
// Importa los estilos CSS del modulo
import styles from '../../../styles/admin/Crud/CrudProducts.module.css';
// Importa axios para peticiones HTTP
import axios from 'axios';
import { formatCurrency } from '../../../utils/FormatColombia';

/**
 * Componente para la gestion de compras en el panel de administrador.
 * Permite ver, buscar, paginar, cambiar estado y ver detalles de compras.
 * @returns {JSX.Element} Interfaz de gestion de compras
 */
function CrudCompras() {
  // Estado que almacena la lista de compras
  const [compras, setCompras] = useState([]);
  // Estado para el formulario de edicion (no se usa para crear)
  const [form, setForm] = useState({
    id_usuario: '',
    total: '',
    estado: 'pendiente'
  });
  // Estado para los detalles de la compra seleccionada
  const [detalles, setDetalles] = useState([]);
  // Estado para la lista de productos disponibles
  const [productos, setProductos] = useState([]);
  // Estado para la lista de usuarios disponibles
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados de UI para busqueda, paginacion, modales y mensajes
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState({ message: '', action: '' });
  const [selectedCompra, setSelectedCompra] = useState(null);

  // Constante para la cantidad de compras por pagina
  const comprasPerPage = 10;

  // Opciones de estado para el select de estado de compra
  const estadoOptions = [
    { value: 'en bodega', label: 'En Bodega' },
    { value: 'en transito', label: 'En Transito' },
    { value: 'entregado', label: 'Entregado' }
  ];

  // useEffect para cargar datos iniciales al montar el componente
  useEffect(() => {
    loadData(); // Carga compras
    loadProductos(); // Carga productos
    loadUsuarios(); // Carga usuarios
  }, []);

  /**
   * Carga la lista de compras desde el backend
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/crudCompras/');
      // Verifica que la respuesta sea un array
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setCompras(data);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga la lista de productos desde el backend
   */
  const loadProductos = async () => {
    try {
      const res = await axios.get('/api/crudProduct/');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  /**
   * Carga la lista de usuarios desde el backend
   */
  const loadUsuarios = async () => {
    try {
      const res = await axios.get('/api/usuarios/');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  /**
   * Reinicia el formulario y los detalles
   */
  const resetForm = () => {
    setForm({ id_usuario: '', total: '', estado: 'pendiente' });
    setDetalles([]);
    setError(null);
  };

  /**
   * Muestra un modal de exito con mensaje y tipo de accion
   * @param {string} message Mensaje a mostrar
   * @param {string} action Tipo de accion (actualizar/eliminar)
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
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Formatea un numero como moneda COP
   * @param {number} amount Monto a formatear
   * @returns {string} Monto formateado
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  /**
   * Formatea una fecha a formato legible
   * @param {string} dateString Fecha en string
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Capitaliza la primera letra de cada palabra de un string
   * @param {string} str Texto a capitalizar
   * @returns {string} Texto capitalizado
   */
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  /**
   * Devuelve la clase CSS segun el estado de la compra
   * @param {string} estado Estado de la compra
   * @returns {string} Clase CSS
   */
  const getEstadoClass = (estado) => {
    // Normaliza espacios y minusculas
    const normalized = (estado || '').toLowerCase().replace(/\s+/g, ' ').trim();
    switch (normalized) {
      case 'en transito':
      case 'en transito':
      case 'en bodega':
        return `${styles.estadoBadge} ${styles.estadoAmarillo}`;
      case 'entregado': 
        return `${styles.estadoBadge} ${styles.estadoActivo}`;
      default:
        return `${styles.estadoBadge} ${styles.estadoInactivo}`;
    }
  };

  /**
   * Maneja el submit del formulario de edicion de compra
   * @param {object} e Evento submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const compraData = {
        ...form,
        detalles: detalles
      };
      // Actualiza la compra por ID
      await axios.put(`/api/crudCompras/${editingId}`, compraData);
      showSuccess(`Compra #${editingId} actualizada correctamente`, 'actualizar');
      await loadData();
      resetForm();
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la compra');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la edicion de una compra (carga datos por ID y abre modal)
   * @param {object} compra Objeto compra a editar
   */
  const handleEdit = async (compra) => {
    setIsLoading(true);
    setError(null);
    try {
      // Consulta la compra por ID
      const res = await axios.get(`/api/crudCompras/${compra.id_compra}`);
      if (!res.data.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      const data = res.data.data;
      setForm({
        id_usuario: data.id_usuario || '',
        total: data.total || '',
        estado: data.estado || 'pendiente'
      });
      setDetalles(data.detalles || []);
      setEditingId(compra.id_compra);
      setShowModal(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los datos de la compra para editar';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Muestra los detalles de una compra en un modal tipo factura
   * @param {object} compra Objeto compra a mostrar
   */
  const handleViewDetails = async (compra) => {
    setIsLoading(true);
    setError(null);
    try {
      // Consulta la compra por ID
      const res = await axios.get(`/api/crudCompras/${compra.id_compra}`);
      if (!res.data.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      setSelectedCompra(res.data.data);
      setShowDetailsModal(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los detalles de la compra';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza el estado de una compra
   * @param {number} id ID de la compra
   * @param {string} newStatus Nuevo estado
   */
  const handleUpdateStatus = async (id, newStatus) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/crudCompras/${id}/estado`, { estado: newStatus });
      setCompras(compras.map(c => 
        c.id_compra === id ? { ...c, estado: newStatus } : c
      ));
      showSuccess(`Estado de compra #${id} actualizado a ${newStatus}`, 'actualizar');
    } catch (err) {
      setError('Error al actualizar el estado de la compra');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado de compras segun el termino de busqueda
  const filteredCompras = compras.filter(c => {
    if (!c) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      c.id_compra.toString().includes(searchTermLower) ||
      (c.nombre_usuario || '').toLowerCase().includes(searchTermLower) ||
      (c.email_usuario || '').toLowerCase().includes(searchTermLower) ||
      (c.estado || '').toLowerCase().includes(searchTermLower)
    );
  });

  // Logica de paginacion
  const indexOfLast = currentPage * comprasPerPage;
  const indexOfFirst = Math.max(0, indexOfLast - comprasPerPage);
  const currentCompras = filteredCompras.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredCompras.length / comprasPerPage));

  // Renderizado condicional: muestra spinner si esta cargando y no hay compras
  if (isLoading && compras.length === 0) {
    return (
      <div className={styles.crudContainer}>
        <div className={styles.crudLoading}>
          <div className={styles.crudSpinner}></div>
          <p>Cargando compras...</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional: muestra error si no hay compras
  if (error && compras.length === 0) {
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
      <h2 className={styles.crudTitle}>Gestion de Compras</h2>
      
      {/* Barra de busqueda */}
      <div className={styles.crudSearchContainer}>
        <input
          type="text"
          placeholder="Buscar compras..."
          className={`${styles.crudInput} ${styles.crudSearchInput}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Banner de error si hay error */}
      {error && (
        <div className={styles.crudErrorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.crudErrorClose}>&times;</button>
        </div>
      )}

      {/* Tabla de compras */}
      {currentCompras.length > 0 ? (
        <>
          <table className={styles.crudTable}>
            <thead>
              <tr>
                <th className={styles.crudTh}>ID</th>
                <th className={styles.crudTh}>Usuario</th>
                <th className={styles.crudTh}>Email</th>
                <th className={styles.crudTh}>Fecha</th>
                <th className={styles.crudTh}>Total</th>
                <th className={styles.crudTh}>Estado</th>
                <th className={styles.crudTh}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza cada compra en una fila */}
              {currentCompras.map((compra) => (
                <tr key={compra.id_compra} className={styles.crudTr}>
                  <td className={styles.crudTd}>{compra.id_compra}</td>
                  <td className={styles.crudTd}>
                    <div>
                      <div>{compra.nombre_usuario || 'N/A'}</div>
                    </div>
                  </td>
                  <td className={styles.crudTd}>{(compra.email_usuario)}</td>
                  <td className={styles.crudTd}>{formatDate(compra.fecha_compra)}</td>
                  <td className={styles.crudTd}>{formatCurrency(compra.total)}</td>
                  <td className={styles.crudTd}>
                    {/* Select para cambiar el estado de la compra */}
                    <select
                      className={
                        `${styles.estadoSelect} ` +
                        (compra.estado.toLowerCase() === 'entregado'
                          ? styles.estadoVerde
                          : (compra.estado.toLowerCase() === 'en transito' || compra.estado.toLowerCase() === 'en transito' || compra.estado.toLowerCase() === 'en bodega')
                            ? styles.estadoAmarillo
                            : styles.estadoInactivo)
                      }
                      value={compra.estado}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        if (newStatus === compra.estado) return;
                        const confirm = window.confirm(
                          `Seguro que deseas cambiar el estado de la compra #${compra.id_compra} a "${estadoOptions.find(opt => opt.value === newStatus)?.label}"?`
                        );
                        if (!confirm) return;
                        await handleUpdateStatus(compra.id_compra, newStatus);
                      }}
                      disabled={isLoading}
                    >
                      {estadoOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.crudTd}>
                    <div className={styles.crudActionCell}>
                      {/* Boton para ver detalles de la compra */}
                      <button
                        type="button"
                        className={`${styles.crudButton} ${styles.crudEditButton} ${styles.iconButton} ${styles.tooltipParent}`}
                        onClick={() => handleViewDetails(compra)}
                        disabled={isLoading}
                      >
                        {/* Icono de ojo */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        <span className={`${styles.tooltip} ${styles.editTooltip}`}>Ver detalles</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginacion de la tabla */}
          {filteredCompras.length > comprasPerPage && (
            <div className={styles.crudPagination}>
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
        // Estado vacio si no hay compras
        <div className={styles.crudEmptyState}>
          <div className={styles.crudEmptyStateIcon}>🛒</div>
          <p>No se encontraron compras</p>
        </div>
      )}

      {/* Modal de detalles tipo factura */}
      {showDetailsModal && selectedCompra && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.invoiceModal}>
            {/* Header de la factura */}
            <div className={styles.invoiceHeader}>
              <h1 className={styles.invoiceTitle}>Factura de Compra</h1>
              <p className={styles.invoiceSubtitle}>BikeStore - Tu tienda de confianza</p>
            </div>

            {/* Cuerpo de la factura */}
            <div className={styles.invoiceBody}>
              {/* Informacion del cliente y compra */}
              <div className={styles.invoiceInfoGrid}>
                <div className={styles.invoiceInfoSection}>
                  <h3>Informacion del Cliente</h3>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>Nombre:</span>
                    <span className={styles.invoiceInfoValue}>{selectedCompra.nombre_usuario || 'N/A'}</span>
                  </div>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>Email:</span>
                    <span className={styles.invoiceInfoValue}>{selectedCompra.email_usuario || 'N/A'}</span>
                  </div>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>ID Usuario:</span>
                    <span className={styles.invoiceInfoValue}>#{selectedCompra.id_usuario}</span>
                  </div>
                </div>

                <div className={styles.invoiceInfoSection}>
                  <h3>Detalles de la Compra</h3>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>Fecha:</span>
                    <span className={styles.invoiceInfoValue}>{formatDate(selectedCompra.fecha_compra)}</span>
                  </div>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>Estado:</span>
                    <span className={`${styles.invoiceStatus} ${styles[selectedCompra.estado]}`}>
                      {selectedCompra.estado === 'entregado' && 'Entregado'}
                      {selectedCompra.estado === 'en transito' && 'En Transito'}
                      {selectedCompra.estado === 'en bodega' && 'En Bodega'}
                    </span>
                  </div>
                  <div className={styles.invoiceInfoItem}>
                    <span className={styles.invoiceInfoLabel}>Total:</span>
                    <span className={styles.invoiceInfoValue}>{formatCurrency(selectedCompra.total)}</span>
                  </div>
                </div>
              </div>

              {/* Tabla de productos comprados */}
              {selectedCompra.detalles && selectedCompra.detalles.length > 0 && (
                <div className={styles.invoiceProducts}>
                  <div className={styles.invoiceProductsHeader}>
                    <h2 className={styles.invoiceProductsTitle}>Productos Comprados</h2>
                  </div>
                  
                  <table className={styles.invoiceTable}>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th style={{textAlign: 'center'}}>Cantidad</th>
                        <th style={{textAlign: 'right'}}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Renderiza cada producto comprado */}
                      {selectedCompra.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td className={styles.productName}>
                            {detalle.nombre_producto || 'Producto no disponible'}
                          </td>
                          <td className={styles.productQuantity}>
                            {detalle.cantidad}
                          </td>
                          <td className={styles.productSubtotal}>
                            {formatCurrency(detalle.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Total de la factura */}
                  <div className={styles.invoiceTotal}>
                    <span className={styles.invoiceTotalLabel}>Total de la Compra</span>
                    <span className={styles.invoiceTotalAmount}>{formatCurrency(selectedCompra.total)}</span>
                  </div>
                </div>
              )}

              {/* Mensaje si no hay productos en la compra */}
              {(!selectedCompra.detalles || selectedCompra.detalles.length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#718096',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{fontSize: '3rem', marginBottom: '16px'}}>📦</div>
                  <p style={{margin: 0, fontSize: '1rem'}}>No hay productos registrados en esta compra</p>
                </div>
              )}
            </div>

            {/* Footer de la factura */}
            <div className={styles.invoiceFooter}>
              <div className={styles.invoiceDate}>
                Generado el {new Date().toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className={styles.invoiceActions}>
                {/* Boton para cerrar el modal de detalles */}
                <button 
                  className={`${styles.invoiceButton} ${styles.invoiceButton.secondary}`}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exito para mostrar mensajes de operacion exitosa */}
      {showSuccessModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudSuccessModal}>
            <div className={styles.crudSuccessHeader}>
              <div className={styles.crudSuccessIcon}>✅</div>
              <h3>Operacion Exitosa!</h3>
              <button className={styles.crudCloseModal} onClick={() => setShowSuccessModal(false)}>&times;</button>
            </div>
            <div className={styles.crudSuccessBody}>
              <p className={styles.crudSuccessMessage}>{modalData.message}</p>
              <div className={styles.crudSuccessInfo}>
                <p><strong>Que paso?</strong></p>
                <ul>
                  {modalData.action === 'actualizar' ? (
                    <>
                      <li>Los datos de la compra se han actualizado correctamente</li>
                      <li>Los cambios ya estan aplicados</li>
                      <li>La compra mantiene su historial completo</li>
                    </>
                  ) : (
                    <>
                      <li>La compra se ha eliminado permanentemente del sistema</li>
                      <li>Ya no aparecera en la lista de compras</li>
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
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la app
export default CrudCompras; 