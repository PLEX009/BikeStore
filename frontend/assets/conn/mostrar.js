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
                    <a href="#" class="btn-detalles">Ver Detalles</a>
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
