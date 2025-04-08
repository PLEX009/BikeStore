// Variables globales
const mainImages = document.querySelectorAll('.main-image img');
const totalImages = mainImages.length;
const sidebarImages = [
    'assets/img/bici1main.jpg',
    'assets/img/bici2main.jpg',
    'assets/img/bici3main.jpg',
    'assets/img/bici4main.jpg',
    'assets/img/bici5main.jpg',
];
const mainImage = document.querySelector('.main-image');
let currentImageIndex = 0;
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalCarrito = 0;

// Datos de los productos
const productos = {
    'bicicleta-montana': {
        titulo: 'Bicicleta de Montaña',
        precio: 1000.00,
        imagen: 'assets/img/bici3.png',
        descripcion: 'Bicicleta de montaña de alta calidad, perfecta para terrenos difíciles y aventuras al aire libre.',
        caracteristicas: [
            'Suspensión delantera y trasera',
            'Frenos de disco hidráulicos',
            'Cuadro de aluminio reforzado',
            'Transmisión de 21 velocidades'
        ]
    },
    'bicicleta-carretera': {
        titulo: 'Bicicleta de Carretera',
        precio: 1200.00,
        imagen: 'assets/img/bici15.png',
        descripcion: 'Bicicleta de carretera diseñada para velocidad y eficiencia.',
        caracteristicas: [
            'Cuadro de fibra de carbono',
            'Frenos de caliper',
            'Transmisión de 18 velocidades',
            'Neumáticos de alta presión'
        ]
    },
    'bicicleta-electrica': {
        titulo: 'Bicicleta Eléctrica',
        precio: 1500.00,
        imagen: 'assets/img/bici8.png',
        descripcion: 'Bicicleta eléctrica con motor de alta potencia y batería de larga duración.',
        caracteristicas: [
            'Motor de 250W',
            'Batería de 36V',
            'Autonomía de 60km',
            'Pantalla LCD'
        ]
    },
    'bicicleta-urbana': {
        titulo: 'Bicicleta Urbana',
        precio: 800.00,
        imagen: 'assets/img/bici13.png',
        descripcion: 'Bicicleta urbana versátil y cómoda, diseñada para la ciudad.',
        caracteristicas: [
            'Cuadro de acero',
            'Frenos V-Brake',
            'Transmisión de 7 velocidades',
            'Guardabarros'
        ]
    }
};

// Funciones de navegación
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    
    navContainer.classList.toggle('active');
    hamburger.classList.toggle('active');
    body.classList.toggle('nav-open');
}

function initUsuarioButton() {
    const usuarioButton = document.querySelector('.usuarios');
    
    if (usuarioButton) {
        usuarioButton.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }
}

// Funciones de modales
function initModal() {
    const modalTrigger = document.querySelector('[data-modal="quienes-somos"]');
    const modal = document.getElementById('modal-quienes-somos');
    
    if (modalTrigger && modal) {
        const closeButton = modal.querySelector('.close-modal');
        
        modalTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function initProductoModal() {
    const modal = document.getElementById('modal-producto');
    const detallesButtons = document.querySelectorAll('.btn-detalles');
    
    if (modal && detallesButtons.length > 0) {
        const closeButton = modal.querySelector('.close-modal');
        
        detallesButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productoCard = button.closest('.producto-card');
                const productoId = productoCard.dataset.producto;
                const producto = productos[productoId];
                
                if (producto) {
                    updateModalContent(modal, producto);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        const btnAgregarModal = document.getElementById('modal-producto-agregar');
        if (btnAgregarModal) {
            btnAgregarModal.addEventListener('click', (e) => {
                e.preventDefault();
                const titulo = document.getElementById('modal-producto-titulo').textContent;
                const precio = parseFloat(document.getElementById('modal-producto-precio').textContent.replace('$', ''));
                const imagen = document.getElementById('modal-producto-img').src;
                
                const producto = {
                    titulo: titulo,
                    precio: precio,
                    imagen: imagen,
                    cantidad: 1
                };
                
                agregarAlCarrito(producto);
                mostrarNotificacion('Producto agregado al carrito');
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
}

function updateModalContent(modal, producto) {
    document.getElementById('modal-producto-img').src = producto.imagen;
    document.getElementById('modal-producto-titulo').textContent = producto.titulo;
    document.getElementById('modal-producto-precio').textContent = `$${producto.precio.toFixed(2)}`;
    document.getElementById('modal-producto-descripcion').textContent = producto.descripcion;
    
    const caracteristicasList = document.getElementById('modal-producto-caracteristicas');
    caracteristicasList.innerHTML = '';
    producto.caracteristicas.forEach(caracteristica => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${caracteristica}`;
        caracteristicasList.appendChild(li);
    });
}

// Funciones de carrusel
function changeMainImage() {
    mainImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    mainImages[currentImageIndex].classList.add('active');
}

function changeSidebarImage() {
    currentImageIndex = (currentImageIndex + 1) % sidebarImages.length;
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = sidebarImages[currentImageIndex];
        mainImage.style.opacity = '1';
    }, 500);
}

function initMainImageCarousel() {
    if (mainImages.length > 0) {
        mainImages[0].classList.add('active');
        setInterval(changeMainImage, 5000);
    }
    
    if (mainImage) {
        setInterval(changeSidebarImage, 5000);
    }
    
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 40
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 50
            }
        }
    });
}

// Funciones del Carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('cont-carrito');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function actualizarTotalCarrito() {
    const totalPrecio = document.querySelector('.total-precio');
    if (totalPrecio) {
        totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        totalPrecio.textContent = `$${totalCarrito.toFixed(2)}`;
    }
}

function actualizarVistaCarrito() {
    const carritoItems = document.querySelector('.carrito-items');
    const totalPrecio = document.querySelector('.total-precio');
    
    if (!carritoItems || !totalPrecio) return;

    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
        totalPrecio.textContent = '$0.00';
        return;
    }

    let total = 0;

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

    totalPrecio.textContent = `$${total.toFixed(2)}`;
}

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            titulo: producto.titulo,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    actualizarTotalCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    actualizarTotalCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function aumentarCantidad(index) {
    carrito[index].cantidad++;
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    actualizarTotalCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    actualizarTotalCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function toggleCarritoModal() {
    const modal = document.querySelector('.modal-carrito');
    const overlay = document.querySelector('.overlay');
    
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        actualizarVistaCarrito();
        actualizarTotalCarrito();
    }
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);

    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 2000);
}

// Inicialización del Carrito
function initCarrito() {
    const botonesCarrito = document.querySelectorAll('.btn-carrito');
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const card = boton.closest('.producto-card');
            const productoId = card.getAttribute('data-producto');
            const producto = productos[productoId];
            
            if (producto) {
                agregarAlCarrito(producto);
                mostrarNotificacion('Producto agregado al carrito');
            }
        });
    });

    const carritoNav = document.querySelector('.carrito');
    if (carritoNav) {
        carritoNav.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCarritoModal();
        });
    }

    const closeCarrito = document.querySelector('.close-carrito');
    if (closeCarrito) {
        closeCarrito.addEventListener('click', toggleCarritoModal);
    }

    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleCarritoModal);
    }

    const btnComprar = document.querySelector('.btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            if (carrito.length > 0) {
                alert('Procediendo al pago...');
            } else {
                alert('El carrito está vacío');
            }
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initProductoModal();
    initMainImageCarousel();
    initCarrito();
    actualizarContadorCarrito();
});




