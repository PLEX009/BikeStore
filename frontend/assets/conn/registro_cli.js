const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conexion = require('./conexion'); 

const app = express();
const puerto = 5000;

// ----------- MIDDLEWARES -----------
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------- RUTA PARA REGISTRAR USUARIO -----------
app.post('/registrar', (req, res) => {
    const { id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena } = req.body;

    const sql = `
        INSERT INTO usuarios (id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(sql, [id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena], (err, resultado) => {
        if (err) {
            console.error('Error al registrar usuario:', err.message);
            res.status(500).json({ error: '⚠️ Error al registrar usuario.' });
        } else {
            res.status(200).json({ mensaje: '✅ Usuario registrado correctamente.' });
        }
    });
});

// ----------- INICIAR SERVIDOR -----------
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
