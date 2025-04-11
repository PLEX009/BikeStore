const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conexion = require('./conexion'); 

const app = express();
const puerto = 8080;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------- RUTA PARA REGISTRAR PRODUCTOS     -----------
app.post('/agregarP', (req, res) => {
    const { nombre, descripcion, caracteristicas, precio_unitario, categoria, marca, entradas,salidas,saldo} = req.body;
   
    const sql = `
        INSERT INTO productos ( nombre, descripcion, caracteristicas, precio_unitario, categoria, marca, entradas,salidas,saldo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(sql, [nombre, descripcion, caracteristicas, precio_unitario, categoria, marca,entradas,salidas,saldo], (err, resultado) => {
        if (err) {
            console.error('Error al registrar el producto', err.message);
            res.status(500).json({ error: 'Error al registrar el producto.' });
        } else {
            res.status(200).json({ mensaje: 'Producto registrado correctamente.' });
        }
    });
});

// ----------- INICIAR SERVIDOR -----------
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
