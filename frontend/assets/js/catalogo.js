// Función para alternar el menú móvil
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    
    if (navContainer && hamburger) {
        navContainer.classList.toggle('active');
        hamburger.classList.toggle('active');
        body.classList.toggle('nav-open');
    }
}

// Función para inicializar el menú desplegable
function initDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

// Función para buscar productos en la barra 
function buscarProductos(termino) {
    const productos = document.querySelectorAll('.producto-card');
    const terminoBusqueda = termino.toLowerCase().trim();
    let productosEncontrados = 0;
    
    productos.forEach(producto => {
        const titulo = producto.querySelector('.producto-titulo').textContent.toLowerCase();
        
        if (titulo.includes(terminoBusqueda)) {
            producto.style.display = 'block';
            productosEncontrados++;
        } else {
            producto.style.display = 'none';
        }
    });

    // Mostrar mensaje si no hay resultados
    const contenedorProductos = document.querySelector('.productos-grid');
    let mensajeNoResultados = contenedorProductos.querySelector('.no-resultados');
    
    if (productosEncontrados === 0 && terminoBusqueda !== '') {
        if (!mensajeNoResultados) {
            mensajeNoResultados = document.createElement('div');
            mensajeNoResultados.className = 'no-resultados';
            mensajeNoResultados.innerHTML = `
                <p>0 Productos encontrados</p>
            `;
            contenedorProductos.appendChild(mensajeNoResultados);
        }
    } else if (mensajeNoResultados) {
        mensajeNoResultados.remove();
    }
}

// Función para inicializar la búsqueda
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // Buscar en tiempo real mientras se escribe
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            buscarProductos(searchTerm);
        });

        // Buscar al hacer clic en el botón
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value;
            buscarProductos(searchTerm);
        });

        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key == 'Enter') {
                const searchTerm = searchInput.value;
                buscarProductos(searchTerm);
            }
        });
    }
}

// Función para filtrar productos
function filtrarProductos(termino) {
    const productos = document.querySelectorAll('.producto-card');
    const resultados = [];
    
    productos.forEach(producto => {
        const titulo = producto.querySelector('h3').textContent.toLowerCase();
        const descripcion = producto.querySelector('p').textContent.toLowerCase();
        const precio = producto.querySelector('.precio').textContent.toLowerCase();
        
        if (titulo.includes(termino.toLowerCase()) || 
            descripcion.includes(termino.toLowerCase()) || 
            precio.includes(termino.toLowerCase())) {
            resultados.push(producto);
        }
    });
    
    return resultados;
}

// Función para mostrar resultados de búsqueda
function mostrarResultadosBusqueda(resultados) {
    const contenedorProductos = document.querySelector('.productos-grid');
    const contenedorResultados = document.querySelector('.resultados-busqueda');
    
    if (!contenedorProductos || !contenedorResultados) return;

    contenedorProductos.style.display = 'none';
    contenedorResultados.innerHTML = '';
    
    if (resultados.length === 0) {
        contenedorResultados.innerHTML = `
            <div class="no-resultados">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
    } else {
        resultados.forEach(producto => {
            contenedorResultados.appendChild(producto.cloneNode(true));
        });
    }
    
    contenedorResultados.style.display = 'grid';
}

// Variables globales
let carrito = [];
let totalCarrito = 0;
let productoActual = null;

// Datos de los productos
const productos = {
    '0': {
        titulo: 'Bicicleta de Montaña',
        precio: 1000.00,
        imagen: '../assets/img/bici13.png',
        descripcion: 'Bicicleta de montaña de alta calidad, perfecta para terrenos difíciles y aventuras al aire libre.',
        caracteristicas: [
            'Suspensión delantera y trasera',
            'Frenos de disco hidráulicos',
            'Cuadro de aluminio reforzado',
            'Transmisión de 21 velocidades'
        ]
    },
    '1': {
        titulo: 'Bicicleta de Ruta',
        precio: 1500.00,
        imagen: '../assets/img/bici9.png',
        descripcion: 'Bicicleta de ruta diseñada para velocidad y eficiencia.',
        caracteristicas: [
            'Cuadro de fibra de carbono',
            'Frenos de caliper',
            'Transmisión de 18 velocidades',
            'Neumáticos de alta presión'
        ]
    },
    '2': {
        titulo: 'Bicicleta Urbana',
        precio: 800.00,
        imagen: '../assets/img/bici8.png',
        descripcion: 'Bicicleta urbana perfecta para la ciudad.',
        caracteristicas: [
            'Cuadro de acero',
            'Frenos de disco',
            'Transmisión de 7 velocidades',
            'Neumáticos urbanos'
        ]
    },
    '3': {
        titulo: 'Bicicleta Eléctrica',
        precio: 2000.00,
        imagen: '../assets/img/bici7.png',
        descripcion: 'Bicicleta eléctrica con motor de alta potencia y batería de larga duración.',
        caracteristicas: [
            'Motor de 250W',
            'Batería de 36V',
            'Autonomía de 60km',
            'Pantalla LCD'
        ]
    },
    '4': {
        titulo: 'Bicicleta de BMX',
        precio: 600.00,
        imagen: '../assets/img/bici6.png',
        descripcion: 'Bicicleta BMX para trucos y acrobacias.',
        caracteristicas: [
            'Cuadro de acero reforzado',
            'Frenos U-brake',
            'Ruedas de 20 pulgadas',
            'Manillar de doble altura'
        ]
    },
    '5': {
        titulo: 'Bicicleta de Paseo',
        precio: 500.00,
        imagen: '../assets/img/bici5.png',
        descripcion: 'Bicicleta de paseo cómoda y versátil.',
        caracteristicas: [
            'Cuadro de acero',
            'Frenos de tambor',
            'Transmisión de 3 velocidades',
            'Asiento acolchado'
        ]
    },
    '6': {
        titulo: 'Casco de Seguridad',
        precio: 50.00,
        imagen: '../assets/img/casco1.png',
        descripcion: 'Casco de seguridad certificado para ciclismo, con ventilación optimizada y ajuste ergonómico.',
        caracteristicas: [
            'Material: Policarbonato de alta resistencia',
            'Sistema de ventilación con 12 orificios',
            'Ajuste micrométrico',
            'Certificación CE EN1078'
        ]
    },
    '7': {
        titulo: 'Candado de Seguridad',
        precio: 30.00,
        imagen: '../assets/img/candado1.png',
        descripcion: 'Candado de alta seguridad con cable reforzado para proteger tu bicicleta.',
        caracteristicas: [
            'Cable de acero templado de 10mm',
            'Mecanismo de bloqueo de alta seguridad',
            'Resistente al agua y la corrosión',
            'Longitud del cable: 1.2 metros'
        ]
    },
    '8': {
        titulo: 'Kit de Luces LED',
        precio: 25.00,
        imagen: '../assets/img/luces1.png',
        descripcion: 'Kit completo de luces LED para bicicleta con diferentes modos de iluminación.',
        caracteristicas: [
            'Luz delantera de 300 lúmenes',
            'Luz trasera de 50 lúmenes',
            '3 modos de iluminación',
            'Batería recargable USB'
        ]
    },
    '9': {
        titulo: 'Portabidones',
        precio: 15.00,
        imagen: '../assets/img/portabidones1.png',
        descripcion: 'Portabidones universal compatible con la mayoría de marcos de bicicleta.',
        caracteristicas: [
            'Material: Nylon reforzado',
            'Ajuste universal',
            'Sistema de liberación rápida',
            'Peso: 45g'
        ]
    }
};

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

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarContadorCarrito();
    actualizarVistaCarrito();
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Función para mostrar/ocultar el modal Quiénes Somos
function toggleQuienesSomos() {
    const modalQuienesSomos = document.getElementById('modal-quienes-somos');
    const overlay = document.querySelector('.overlay');
    
    if (modalQuienesSomos && overlay) {
        modalQuienesSomos.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = modalQuienesSomos.classList.contains('active') ? 'hidden' : '';
    }
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const categoriaProducto = producto.getAttribute('data-categoria');
        
        if (categoria === 'todas' || categoriaProducto === categoria) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// Función para inicializar el dropdown del navbar
function initNavbarDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownLinks = dropdownContent.querySelectorAll('a');
    
    // Asegurar que el dropdown esté oculto al cargar
    dropdownContent.style.display = 'none';
    
    // Mostrar/ocultar dropdown al hacer hover
    dropdown.addEventListener('mouseenter', () => {
        dropdownContent.style.display = 'block';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdownContent.style.display = 'none';
    });
    
    // Filtrar productos al hacer clic en los enlaces del dropdown
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = link.getAttribute('data-categoria');
            
            // Remover clase active de todos los botones de categoría
            const categoriaBtns = document.querySelectorAll('.categoria-btn');
            categoriaBtns.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón correspondiente
            const btnCorrespondiente = document.querySelector(`.categoria-btn[data-categoria="${categoria}"]`);
            if (btnCorrespondiente) {
                btnCorrespondiente.classList.add('active');
            }
            
            // Filtrar productos
            filtrarPorCategoria(categoria);
            
            // Ocultar dropdown después de hacer clic
            dropdownContent.style.display = 'none';
        });
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el carrito desde localStorage
    cargarCarritoDesdeLocalStorage();
    
    // Inicializar búsqueda
    initSearch();
    
    // Inicializar menú móvil
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                toggleMenu();
            }
        });
    });
    
    // Inicializar modal de "Quiénes Somos"
    const quienesSomosBtn = document.getElementById('quienes-somos-btn');
    const modalQuienesSomos = document.getElementById('modal-quienes-somos');
    const closeModal = document.querySelector('.close-modal');
    
    if (quienesSomosBtn && modalQuienesSomos) {
        quienesSomosBtn.addEventListener('click', () => {
            modalQuienesSomos.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', () => {
            modalQuienesSomos.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modalQuienesSomos.addEventListener('click', (e) => {
            if (e.target === modalQuienesSomos) {
                modalQuienesSomos.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

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

    // Inicializar el modal Quiénes Somos
    const quienesSomosLink = document.querySelector('a[data-modal="quienes-somos"]');
    const closeQuienesSomos = document.querySelector('#modal-quienes-somos .close-modal');
    
    if (quienesSomosLink) {
        quienesSomosLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleQuienesSomos();
        });
    }
    
    if (closeQuienesSomos) {
        closeQuienesSomos.addEventListener('click', () => {
            toggleQuienesSomos();
        });
    }
    
    // Cerrar modal al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            const modalQuienesSomos = document.getElementById('modal-quienes-somos');
            if (modalQuienesSomos && modalQuienesSomos.classList.contains('active')) {
                toggleQuienesSomos();
            }
        });
    }

    // Inicializar filtrado por categorías
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            categoriaBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Filtrar productos
            const categoria = btn.getAttribute('data-categoria');
            filtrarPorCategoria(categoria);
        });
    });

    // Inicializar dropdown del navbar
    initNavbarDropdown();
});
