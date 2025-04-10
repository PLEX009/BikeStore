// -------------------- RUTA PARA INICIO DE SESIÓN --------------------
// Se importa el módulo 'express' para crear el servidor y manejar rutas
const express = require('express');

// Se importa 'body-parser' para poder leer los datos que se envian en el cuerpo de las solicitudes (POST, PUT, etc.)
const bodyParser = require('body-parser');

// Se importa 'cors' para permitir solicitudes de otros dominios (Cross-Origin Resource Sharing)
const cors = require('cors');

// Se importa el archivo de conexión a la base de datos (suponiendo que hay una conexión configurada en './conexion')
const conexion = require('./conexion'); 

// Se crea una instancia de la aplicacion Express
const app = express();

// Se define el puerto en el que se ejecutara el servidor
// Permite solicitudes CORS (de otros dominios)
app.use(cors());

// Configura body-parser para que pueda leer datos codificados en URL (formulario)
app.use(bodyParser.urlencoded({ extended: false }));

// Configura body-parser para que pueda leer datos en formato JSON
app.use(bodyParser.json());
const puerto = 3000;

app.post('/login', (req, res) => {
    const { num_ident, contrasena } = req.body;
  
    const sql = 'SELECT * FROM usuarios WHERE num_ident = ? AND contrasena = ?';
  
    conexion.query(sql, [num_ident, contrasena], (err, resultados) => {
      if (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).json({ error: 'Error en el servidor.' });
      } else if (resultados.length > 0) {
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', usuario: resultados[0] });
      } else {
        res.status(401).json({ error: 'identificacion o contraseña incorrectos.' });
      }
    });
  });
  
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
