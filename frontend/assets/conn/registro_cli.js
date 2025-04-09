// Se importa el módulo 'express' para crear el servidor y manejar rutas
const express = require('express');

// Se importa 'body-parser' para poder leer los datos que se envían en el cuerpo de las solicitudes (POST, PUT, etc.)
const bodyParser = require('body-parser');

// Se importa 'cors' para permitir solicitudes de otros dominios (Cross-Origin Resource Sharing)
const cors = require('cors');

// Se importa el archivo de conexión a la base de datos (suponiendo que hay una conexión configurada en './conexion')
const conexion = require('./conexion'); 

// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que se ejecutará el servidor
const puerto = 3000;

// -------------------- MIDDLEWARES --------------------

// Permite solicitudes CORS (de otros dominios)
app.use(cors());

// Configura body-parser para que pueda leer datos codificados en URL (formulario)
app.use(bodyParser.urlencoded({ extended: false }));

// Configura body-parser para que pueda leer datos en formato JSON
app.use(bodyParser.json());

// -------------------- RUTA PARA REGISTRAR USUARIO --------------------

// Define una ruta POST en '/registrar' para registrar un nuevo usuario
app.post('/registrar', (req, res) => {

    // Extrae los datos enviados desde el cliente en el cuerpo de la solicitud
    const { id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena } = req.body;

    // Prepara una consulta SQL para insertar un nuevo usuario en la base de datos
    const sql = `
        INSERT INTO usuarios (id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ejecuta la consulta con los datos recibidos como parámetros para evitar inyecciones SQL
    conexion.query(sql, [id_rol, nom_user, tipo_ident, num_ident, telefono, direccion, email, contrasena], (err, resultado) => {

        // Si hay un error durante la ejecución de la consulta, se maneja aquí
        if (err) {
            console.error('Error al registrar usuario:', err.message); // Muestra el error en consola
            res.status(500).json({ error: 'Error al registrar usuario.' }); // Responde al cliente con error 500
        } else {
            // Si la consulta se ejecuta correctamente, responde con un mensaje de éxito
            res.status(200).json({ mensaje: 'Usuario registrado correctamente.' });
        }
    });
}); 

// -------------------- INICIAR SERVIDOR --------------------

// Inicia el servidor en el puerto definido y muestra un mensaje en consola
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
