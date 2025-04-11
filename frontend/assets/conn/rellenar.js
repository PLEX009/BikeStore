// index.js
const express = require('express');
const cors = require('cors');
const db = require('./conexion'); // conexión a MySQL
const path = require('path');

const app = express();
const PORT = 3000;  // Cambia el puerto a 3000

app.use(cors());
app.use(express.json());

// Servir los archivos estáticos de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener productos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';  // Ajusta la consulta según tu tabla
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener productos:', err.message);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(results);  // Devuelve los productos como JSON
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
