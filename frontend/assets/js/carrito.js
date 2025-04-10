let carrito = [];
let totalCarrito = 0;
let productoActual = null;
 
 // Inicializar botones de productos
 const productosGrid = document.querySelector('.productos-grid');
 if (productosGrid) {
     productosGrid.addEventListener('click', (e) => {
         const target = e.target;
         const productoCard = target.closest('.producto-card');
         
         if (!productoCard) return;
         
         const productoId = productoCard.dataset.producto;
         const producto = productos[productoId];
         
         if (!producto) return;

         if (target.classList.contains('btn-detalles')) {
             e.preventDefault();
             productoActual = producto;
             updateModalContent(producto);
         } else if (target.classList.contains('btn-carrito')) {
             e.preventDefault();
             agregarAlCarrito(producto);
         }
     });
 }

 // Inicializar modal de producto
 const modalProducto = document.getElementById('modal-producto');
 if (modalProducto) {
     // Botón de cerrar
     const closeModalProducto = modalProducto.querySelector('.close-modal');
     if (closeModalProducto) {
         closeModalProducto.addEventListener('click', () => {
             modalProducto.classList.remove('active');
             document.body.style.overflow = '';
             productoActual = null;
         });
     }

     // Cerrar al hacer clic fuera del modal
     modalProducto.addEventListener('click', (e) => {
         if (e.target === modalProducto) {
             modalProducto.classList.remove('active');
             document.body.style.overflow = '';
             productoActual = null;
         }
     });

     // Agregar evento al botón de carrito en el modal
     const btnAgregarModal = document.getElementById('modal-producto-agregar');
     if (btnAgregarModal) {
         btnAgregarModal.addEventListener('click', () => {
             if (productoActual) {
                 agregarAlCarrito(productoActual);
                 modalProducto.classList.remove('active');
                 document.body.style.overflow = '';
                 productoActual = null;
             }
         });
     }
 }

 // Inicializar el carrito
 const carritoIcon = document.querySelector('.carrito');
 const closeCarrito = document.querySelector('.close-carrito');
 const overlay = document.querySelector('.overlay');
 
 if (carritoIcon) {
     carritoIcon.addEventListener('click', (e) => {
         e.preventDefault();
         toggleCarrito();
     });
 }
 
 if (closeCarrito) {
     closeCarrito.addEventListener('click', () => {
         toggleCarrito();
     });
 }
 
 if (overlay) {
     overlay.addEventListener('click', () => {
         toggleCarrito();
     });
 }

 // Inicializar el botón de comprar
 const btnComprar = document.querySelector('.btn-comprar');
 if (btnComprar) {
     btnComprar.addEventListener('click', () => {
         if (carrito.length > 0) {
             // Aquí puedes agregar la lógica para procesar la compra
             alert('¡Gracias por tu compra!');
             carrito = [];
             actualizarContadorCarrito();
             actualizarVistaCarrito();
             toggleCarrito();
         } else {
             alert('El carrito está vacío');
         }
     });
 }

 // Inicializar menú desplegable
 initDropdown();


 
// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarContadorCarrito();
    actualizarVistaCarrito();
}
// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('cont-carrito');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Función para actualizar el total del carrito
function actualizarTotalCarrito() {
    totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para actualizar la vista del carrito
function actualizarVistaCarrito() {
    const carritoContent = document.querySelector('.carrito-content');
    const carritoItems = document.querySelector('.carrito-items');
    const totalPrecio = document.querySelector('.total-precio');
    
    if (!carritoContent || !carritoItems || !totalPrecio) return;

    // Limpiar el contenido actual
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
        totalPrecio.textContent = '$0.00';
        return;
    }

    let total = 0;

    // Agregar cada producto al carrito
    carrito.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}" class="carrito-item-imagen">
            <div class="carrito-item-info">
                <h3 class="carrito-item-titulo">${item.titulo}</h3>
                <p class="carrito-item-precio">$${item.precio.toFixed(2)}</p>
                <div class="carrito-item-cantidad">
                    <button onclick="disminuirCantidad(${index})">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="aumentarCantidad(${index})">+</button>
                </div>
            </div>
            <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carritoItems.appendChild(itemElement);
        total += item.precio * item.cantidad;
    });

    // Actualizar el total
    totalPrecio.textContent = `$${total.toFixed(2)}`;
}

// Función para mostrar/ocultar el carrito
function toggleCarrito() {
    const modalCarrito = document.querySelector('.modal-carrito');
    const overlay = document.querySelector('.overlay');
    
    if (modalCarrito && overlay) {
        modalCarrito.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = modalCarrito.classList.contains('active') ? 'hidden' : '';
    }
}

// Función para actualizar el contenido del modal
function updateModalContent(producto) {
    const modal = document.getElementById('modal-producto');
    if (!modal) return;

    const imagenModal = document.getElementById('modal-producto-img');
    const tituloModal = document.getElementById('modal-producto-titulo');
    const precioModal = document.getElementById('modal-producto-precio');
    const descripcionModal = document.getElementById('modal-producto-descripcion');
    const caracteristicasModal = document.getElementById('modal-producto-caracteristicas');

    if (imagenModal) imagenModal.src = producto.imagen;
    if (tituloModal) tituloModal.textContent = producto.titulo;
    if (precioModal) precioModal.textContent = `$${producto.precio.toFixed(2)}`;
    if (descripcionModal) descripcionModal.textContent = producto.descripcion;
    
    if (caracteristicasModal) {
        caracteristicasModal.innerHTML = '';
        producto.caracteristicas.forEach(caracteristica => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${caracteristica}`;
            caracteristicasModal.appendChild(li);
        });
    }

    // Mostrar el modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si es un producto nuevo, agregarlo al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
    // Actualizar la vista del carrito
    actualizarVistaCarrito();
    // Guardar el carrito en localStorage
    guardarCarritoEnLocalStorage();
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
        actualizarVistaCarrito();
    }
}

// Función para aumentar cantidad
function aumentarCantidad(index) {
    carrito[index].cantidad++;
    actualizarContadorCarrito();
    actualizarVistaCarrito();
}

// Función para disminuir cantidad
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarContadorCarrito();
    actualizarVistaCarrito();
}
