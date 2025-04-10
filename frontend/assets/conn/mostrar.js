// Función para obtener productos desde el backend
async function obtenerProductos(categoria = 'todas') {
    try {
        const url = new URL('http://localhost:4000/productos');
        if (categoria !== 'todas') {
            url.searchParams.append('categoria', categoria);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta del servidor: ' + response.status);

        const productos = await response.json();
        mostrarProductos(productos);

    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Mostrar productos en el contenedor
function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = '';

    if (!productos || productos.length === 0) {
        productosContainer.innerHTML = '<p>No hay productos disponibles para esta categoría.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-card');
        productoCard.dataset.categoria = producto.categoria;

        const imagenUrl = `../assets/carte/${producto.imagen}.png`;

        productoCard.innerHTML = `
            <div class="producto-imagen">
                <img src="${imagenUrl}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio_unitario}</p>
                <div class="producto-acciones">
                    <a href="#" class="btn-detalles" data-id="${producto.id}">Ver Detalles</a>

                    <button class="btn-carrito">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;

        productosContainer.appendChild(productoCard);
    });
}

// Escuchar clics en botones de categoría
document.querySelectorAll('.categoria-btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
        document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const categoriaSeleccionada = e.currentTarget.dataset.categoria;
        obtenerProductos(categoriaSeleccionada); // Solicita productos filtrados desde el backend
    });
});

// Cargar todos los productos al inicio
document.addEventListener("DOMContentLoaded", () => {
    obtenerProductos();
});
// filtrar por categoria
async function obtenerProductos(categoria = 'todas') {
    try {
        const url = new URL('http://localhost:4000/productos');
        if (categoria !== 'todas') {
            url.searchParams.append('categoria', categoria);
        }

        const response = await fetch(url);
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Mostrar detalles del producto en el modal
function mostrarDetalleProducto(producto) {
    const modal = document.getElementById('modal-detalle');
    const detalleContainer = document.getElementById('producto-detalle-info');

    detalleContainer.innerHTML = `
        <img src="../assets/carte/${producto.imagen}.png" alt="${producto.nombre}" style="max-width: 200px;">
        <h3>${producto.nombre}</h3>
        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
        <p><strong>Características:</strong> ${producto.caracteristicas}</p>
        <p><strong>Marca:</strong> ${producto.marca}</p>
        <p><strong>Precio:</strong> $${producto.precio_unitario}</p>
    `;

    modal.style.display = 'block';
}

// Cerrar el modal
document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('modal-detalle').style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-detalle');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});




function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = '';

    if (!productos || productos.length === 0) {
        productosContainer.innerHTML = '<p>No hay productos disponibles para esta categoría.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-card');
        productoCard.dataset.categoria = producto.categoria;

        const imagenUrl = `../assets/carte/${producto.imagen}.png`;

        productoCard.innerHTML = `
            <div class="producto-imagen">
                <img src="${imagenUrl}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio_unitario}</p>
                <div class="producto-acciones">
                    <a href="#" class="btn-detalles" data-id="${producto.id}">Ver Detalles</a>
                    <button class="btn-carrito">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;

        // Evento para mostrar modal con detalles
        productoCard.querySelector('.btn-detalles').addEventListener('click', (e) => {
            e.preventDefault();
            mostrarDetalleProducto(producto);
        });

        productosContainer.appendChild(productoCard);
    });
}



