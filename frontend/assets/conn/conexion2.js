const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789Aa!',
    database: 'bikestore'
});

// Función para conectar a la base de datos
function conectarDB() {
    connection.connect((error) => {
        if (error) {
            console.error('Error en la conexión:', error);
            setTimeout(conectarDB, 2000); // Reintentar conexión cada 2 segundos
        } else {
            console.log('Conexión exitosa a la base de datos MySQL');
        }
    });

    connection.on('error', (error) => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Conexión perdida. Reconectando...');
            conectarDB();
        } else {
            console.error('Error en la conexión:', error);
        }
    });
}

// Iniciar la conexión
conectarDB();

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    connection.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Ruta para obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM productos WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Ruta para crear un nuevo producto
app.post('/api/productos', (req, res) => {
    const { titulo, precio, imagen, descripcion, caracteristicas } = req.body;
    connection.query(
        'INSERT INTO productos (titulo, precio, imagen, descripcion, caracteristicas) VALUES (?, ?, ?, ?, ?)',
        [titulo, precio, imagen, descripcion, caracteristicas],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json({ id: results.insertId, ...req.body });
        }
    );
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    const { titulo, precio, imagen, descripcion, caracteristicas } = req.body;
    connection.query(
        'UPDATE productos SET titulo = ?, precio = ?, imagen = ?, descripcion = ?, caracteristicas = ? WHERE id = ?',
        [titulo, precio, imagen, descripcion, caracteristicas, id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json({ id, ...req.body });
        }
    );
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM productos WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
