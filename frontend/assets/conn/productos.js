const express = require('express');
const cors = require('cors');
const db = require('./conexion');  // Conexión a la base de datos
const app = express();
const port = 4000;

app.use(cors());
app.use(express.static('public'));
app.use('/conn', express.static('conn'));

// Endpoint para obtener productos, con filtro opcional por categoría
app.get('/productos', (req, res) => {
    const categoria = req.query.categoria;

    let sql = 'SELECT nombre, descripcion, caracteristicas, precio_unitario, categoria, marca, imagen, id_categoria FROM productos';
    const params = [];

    if (categoria && categoria !== 'todas') {
        sql += ' WHERE categoria = ?';
        params.push(categoria);
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta SQL:', err);
            res.status(500).send('Error al obtener los productos');
            return;
        }

        if (result.length === 0) {
            return res.status(200).json([]); // Devolver arreglo vacío si no hay productos
        }

        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
