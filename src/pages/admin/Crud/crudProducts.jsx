import React, { useState, useEffect } from 'react';
import styles from '../../../styles/admin/Crud/CrudProducts.module.css';
import axios from 'axios';
import { formatCurrency } from '../../../utils/FormatColombia';

function CrudProducts() {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    proveedor: '', nom_producto: '', descripcion: '', caracteristicas: '',
    precio_uni: '', marca: '', categoria: '', imagen: null,
    entradas: '', salidas: '', limite: '', estado: 'activo'
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
  const productsPerPage = 7;
  const categorias = [
    { id_categoria: 'Montana', nombre: 'Montaña' },
    { id_categoria: 'Carretera', nombre: 'Ruta / Carretera' },
    { id_categoria: 'Urbana', nombre: 'Urbana' },
    { id_categoria: 'BMX', nombre: 'BMX' },
    { id_categoria: 'Electrica', nombre: 'Eléctrica' },
    { id_categoria: 'Gravel', nombre: 'Gravel' },
    { id_categoria: 'Plegable', nombre: 'Plegable' },
    { id_categoria: 'Infantil', nombre: 'Infantil' },
    { id_categoria: 'Accesorios', nombre: 'Accesorios' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, proveedoresRes] = await Promise.all([
        axios.get('/api/crudProduct/'),
        axios.get('/api/crudProduct/proveedores')
      ]);
      
      const productsData = Array.isArray(productsRes.data.data) ? productsRes.data.data :
                          Array.isArray(productsRes.data) ? productsRes.data : [];
      setProducts(productsData);
      setProveedores(proveedoresRes.data.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones de utilidad
  const resetForm = () => {
    setForm({
      proveedor: '', nom_producto: '', descripcion: '', caracteristicas: '',
      precio_uni: '', marca: '', categoria: '', imagen: null,
      entradas: '', salidas: '', limite: '', estado: 'activo'
    });
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

  // Funciones de stock
  const getStockInfo = (product) => {
    const { entradas, salidas, limite } = product;
    if (typeof entradas !== 'number' || typeof limite !== 'number') {
      return { text: 'Sin datos', class: '', tooltip: 'No hay datos suficientes' };
    }
    
    const stockData = {
      'Agotado': { class: styles.agotadoBadge, tooltip: 'Este producto no tiene unidades disponibles' },
      'Abastecer': { class: styles.abastecerBadge, tooltip: '¡Atención! El stock está bajo' },
      'Disponible': { class: styles.disponibleBadge, tooltip: '¡Todo bien! Hay suficiente stock' }
    };
    
    let status = 'Sin datos';
    if (entradas === 0) status = 'Agotado';
    else if (entradas > 0 && entradas <= limite) status = 'Abastecer';
    else if (entradas > limite) status = 'Disponible';
    
    return {
      text: status,
      class: stockData[status]?.class || '',
      tooltip: stockData[status]?.tooltip || 'No hay datos suficientes',
      entradas, salidas, limite
    };
  };

  // Funciones de CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'imagen' && form[key] instanceof File) {
          formData.append(key, form[key]);
        } else if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      const url = editingId 
        ? `/api/crudProduct/actualizarProduct/${editingId}`
        : '/api/crudProduct/crearProduct';
      
      const method = editingId ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const action = editingId ? 'actualizar' : 'crear';
      showSuccess(`Producto "${form.nom_producto}" ${action === 'actualizar' ? 'actualizado' : 'creado'} correctamente`, action);
      
      await loadData();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      setError(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (product) => {
    try {
      const response = await axios.get(`/api/crudProduct/${product.id_producto}`);
      const productoCompleto = response.data.data;
      
      // Obtener el proveedor actual del producto aunque esté inactivo
      let proveedorActual = null;
      if (productoCompleto.id_proveedor) {
        try {
          const proveedorResponse = await axios.get(`/api/crudProveedores/${productoCompleto.id_proveedor}`);
          proveedorActual = proveedorResponse.data.data;
        } catch (err) {
          console.log('No se pudo obtener el proveedor actual:', err);
        }
      }
      
      setEditingId(productoCompleto.id_producto);
      setForm({
        proveedor: productoCompleto.id_proveedor || '',
        nom_producto: productoCompleto.nom_producto,
        descripcion: productoCompleto.descripcion || '',
        caracteristicas: productoCompleto.caracteristicas || '',
        precio_uni: productoCompleto.precio_uni,
        marca: productoCompleto.marca || '',
        categoria: productoCompleto.categoria || '',
        imagen: productoCompleto.imagen || null,
        entradas: productoCompleto.entradas ?? '',
        salidas: productoCompleto.salidas ?? '',
        limite: productoCompleto.limite ?? '',
        estado: (productoCompleto.estado || 'activo').toLowerCase(),
      });
      
      // Recargar la lista de proveedores activos y agregar el proveedor actual si es necesario
      try {
        const proveedoresRes = await axios.get('/api/crudProduct/proveedores');
        let proveedoresActivos = proveedoresRes.data.data || [];
        
        // Si hay un proveedor actual y no está en la lista de proveedores activos, agregarlo
        if (proveedorActual && !proveedoresActivos.find(p => p.id_proveedor === proveedorActual.id_proveedor)) {
          proveedoresActivos = [...proveedoresActivos, proveedorActual];
        }
        
        setProveedores(proveedoresActivos);
      } catch (err) {
        console.log('Error al recargar proveedores:', err);
      }
      
      setShowModal(true);
    } catch (err) {
      console.error('Error al obtener datos del producto:', err);
      setError('Error al cargar los datos del producto para editar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      await axios.delete(`/api/crudProduct/eliminarProduct/${id}`);
      const productoEliminado = products.find(product => product.id_producto === id);
      const nombreProducto = productoEliminado?.nom_producto || 'Producto';
      
      setProducts(products.filter(product => product.id_producto !== id));
      showSuccess(`Producto "${nombreProducto}" eliminado correctamente`, 'eliminar');
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el producto';
      
      if (errorMessage.includes('compras asociadas')) {
        setModalData({ message: errorMessage, action: 'error' });
        setShowDeleteErrorModal(true);
      } else {
        setError(errorMessage);
      }
    }
  };

  // Filtrado y paginación
  const filteredProducts = products.filter(product => {
  if (!product) return false;

  const searchTermLower = searchTerm.toLowerCase();
  const stockStatus = getStockInfo(product).text.toLowerCase();

  return (
    (product.nom_producto || '').toLowerCase().includes(searchTermLower) ||
    (product.proveedor || '').toLowerCase().includes(searchTermLower) ||
    (product.categoria || '').toLowerCase().includes(searchTermLower) ||
    (product.marca || '').toLowerCase().includes(searchTermLower) ||
    stockStatus.includes(searchTermLower)
  );
});


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = Math.max(0, indexOfLastProduct - productsPerPage);
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  // Renderizado condicional
  if (isLoading && products.length === 0) {
    return (
      <div className={styles.crudContainer}>
        <div className={styles.crudLoading}>
          <div className={styles.crudSpinner}></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
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
      
            <h2 className={styles.crudTitle}>Gestión de Productos</h2>
      {/* Header */}
      <div className={styles.crudSearchContainer}>
        <input
          type="text"
          placeholder="Buscar productos..."
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
          Nuevo Producto
        </button>
      </div>

      {error && (
        <div className={styles.crudErrorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.crudErrorClose}>&times;</button>
        </div>
      )}

      {/* Tabla de productos */}
      {currentProducts.length > 0 ? (
        <>
          <table className={styles.crudTable}>
            <thead>
              <tr>
                <th className={styles.crudTh}>ID</th>
                <th className={styles.crudTh}>Nombre</th>
                <th className={styles.crudTh}>Proveedor</th>
                <th className={styles.crudTh}>Precio</th>
                <th className={styles.crudTh}>Marca</th>
                <th className={styles.crudTh}>Categoría</th>
                <th className={styles.crudTh}>Imagen</th>
                <th className={styles.crudTh}>Estado</th>
                <th className={styles.crudTh}>Stock</th>
                <th className={styles.crudTh}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => {
                const stockInfo = getStockInfo(product);
                
                return (
                  <tr key={product.id_producto} className={styles.crudTr}>
                    <td className={styles.crudTd}>{product.id_producto}</td>
                    <td className={styles.crudTd}>{product.nom_producto}</td>
                    <td className={styles.crudTd}>{product.proveedor}</td>
                    <td className={styles.crudTd}>{formatCurrency(product.precio_uni || 0)}</td>
                    <td className={styles.crudTd}>{product.marca || 'N/A'}</td>
                    <td className={styles.crudTd}>{product.categoria || 'N/A'}</td>
                    <td className={styles.crudTd}>
                      {product.imagen ? (
                        <img
                          src={product.imagen}
                          alt={product.nom_producto}
                          className={styles.crudPreviewImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <span>Sin imagen</span>
                      )}
                    </td>
                    <td className={styles.crudTd}>
                      <span className={`${styles.estadoBadge} ${product.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo}`}>
                        {product.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className={styles.crudTd}>
                      <span className={`${stockInfo.class} ${styles.badgeTooltipParent}`}>
                        {stockInfo.text}
                        <span className={styles.badgeTooltip}>
                          <p><b>Estado: {stockInfo.text}</b></p>
                          <p>{stockInfo.tooltip}</p>
                          <p>Disponibles: {stockInfo.entradas}</p>
                          <p>Vendidas: {stockInfo.salidas}</p>
                          <p>Umbral: {stockInfo.limite}</p>
                        </span>
                      </span>
                    </td>
                    <td className={styles.crudTd}>
                      <div className={styles.crudActionCell}>
                        <button
                          type="button"
                          className={`${styles.crudButton} ${styles.crudEditButton} ${styles.iconButton} ${styles.tooltipParent}`}
                          onClick={() => handleEdit(product)}
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                          <span className={`${styles.tooltip} ${styles.editTooltip}`}>Editar</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.crudButton} ${styles.crudDeleteButton} ${styles.iconButton} ${styles.tooltipParent}`}
                          onClick={() => handleDelete(product.id_producto)}
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                          <span className={`${styles.tooltip} ${styles.deleteTooltip}`}>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          {filteredProducts.length > productsPerPage && (
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
          <p>No se encontraron productos</p>
          <button 
            className={styles.crudButton} 
            onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }} 
            disabled={isLoading}
          >
            Agregar primer producto
          </button>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <div className={styles.crudModalOverlay}>
          <div className={styles.crudModalContent}>
            <div className={styles.crudModalHeader}>
              <h2 className={styles.crudModalTitle}>
                {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
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
                {/* Proveedor y Nombre */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="proveedor">Nombre Proveedor</label>
                    <select id="proveedor" name="proveedor" className={styles.crudModalInput} value={form.proveedor} onChange={handleChange} required>
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map(p => (
                        <option key={p.id_proveedor} value={p.id_proveedor}>
                          {p.nombre} {p.estado === 'inactivo' ? '(Inactivo)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="nom_producto">Nombre Producto:</label>
                    <input id="nom_producto" className={styles.crudModalInput} type="text" name="nom_producto" value={form.nom_producto} onChange={handleChange} placeholder="Ej: Bicicleta de Montañismo" required />
                  </div>
                </div>

                {/* Descripción */}
                <div className={styles.crudModalFormGroup}>
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea id="descripcion" className={`${styles.crudModalInput} ${styles.crudModalTextarea}`} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Describe las características del producto" />
                </div>

                {/* Característica, Precio y Marca */}
                <div className={styles.crudModalFormRow3}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="caracteristicas">Característica:</label>
                    <input id="caracteristicas" className={styles.crudModalInput} type="text" name="caracteristicas" value={form.caracteristicas} onChange={handleChange} placeholder="Ej: Carbono, 18 Velocidades" />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="precio_uni">Precio:</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>$</span>
                      <input id="precio_uni" className={styles.crudModalInput} type="number" name="precio_uni" value={form.precio_uni} onChange={handleChange} style={{ paddingLeft: '30px' }} placeholder="0.00" min="0" step="0.01" required />
                    </div>
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="marca">Marca:</label>
                    <input id="marca" className={styles.crudModalInput} type="text" name="marca" value={form.marca} onChange={handleChange} placeholder="Ej:  RoadMax" />
                  </div>
                </div>

                {/* Categoría, Entradas y Salidas */}
                <div className={styles.crudModalFormRow3}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="categoria">Categoría:</label>
                    <select id="categoria" name="categoria" className={styles.crudModalInput} value={form.categoria} onChange={handleChange} required>
                      <option value="">Seleccione una categoría</option>
                      {categorias.map(c => (
                        <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="entradas">Disponibles:</label>
                    <input id="entradas" className={styles.crudModalInput} type="number" name="entradas" value={form.entradas} onChange={handleChange} placeholder="Cantidad de entradas" min="0" required />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="salidas">Vendidas:</label>
                    <input id="salidas" className={styles.crudModalInput} type="number" name="salidas" value={form.salidas} onChange={handleChange} placeholder="Cantidad de salidas" min="0" required />
                  </div>
                </div>

                {/* Límite e Imagen */}
                <div className={styles.crudModalFormRow2}>
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="limite">Umbral:</label>
                    <input id="limite" className={styles.crudModalInput} type="number" name="limite" value={form.limite} onChange={handleChange} placeholder="Cantidad límite para stock bajo" min="0" required />
                  </div>
                  <div className={styles.crudModalFormGroup}>
                    <label>Imagen del producto:</label>
                    <div className={styles.crudFileInputContainer}>
                      <label htmlFor="imagen" className={styles.crudFileInputLabel}>
                        {form.imagen ? 'Cambiar archivo' : 'Seleccionar archivo'}
                      </label>
                      <input id="imagen" className={styles.crudFileInput} type="file" name="imagen" accept="image/*" onChange={handleChange} required={!editingId} />
                      {form.imagen && (
                        <div className={styles.crudFileName}>
                          {typeof form.imagen === 'string' ? 'Imagen actual' : form.imagen.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vista previa de imagen */}
                {form.imagen && (
                  <div className={styles.crudImagePreviewContainer}>
                    <img
                      src={typeof form.imagen === 'string' ? form.imagen : URL.createObjectURL(form.imagen)}
                      alt="Vista previa"
                      className={styles.crudImagePreview}
                    />
                  </div>
                )}

                {/* Estado (solo en edición) */}
                {editingId && (
                  <div className={styles.crudModalFormGroup}>
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" className={styles.crudModalInput} value={form.estado} onChange={handleChange}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
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
                  <li>Este producto tiene compras registradas en el sistema</li>
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
                      <li>El producto se ha agregado exitosamente al catálogo</li>
                      <li>Ya está disponible para la venta</li>
                      <li>Puedes verlo en la lista de productos</li>
                    </>
                  ) : modalData.action === 'actualizar' ? (
                    <>
                      <li>Los datos del producto se han actualizado correctamente</li>
                      <li>Los cambios ya están aplicados</li>
                      <li>El producto mantiene su historial de ventas</li>
                    </>
                  ) : (
                    <>
                      <li>El producto se ha eliminado permanentemente del sistema</li>
                      <li>Ya no aparecerá en el catálogo</li>
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
    </div>
  );
}

export default CrudProducts;