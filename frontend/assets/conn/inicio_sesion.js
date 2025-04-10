// -------------------- RUTA PARA INICIO DE SESIÓN --------------------
// Se importa el módulo 'express' para crear el servidor y manejar rutas
const express = require('express');

// Se importa 'body-parser' para poder leer los datos que se envian en el cuerpo de las solicitudes (POST, PUT, etc.)
const bodyParser = require('body-parser');

// Se importa 'cors' para permitir solicitudes de otros dominios (Cross-Origin Resource Sharing)
const cors = require('cors');

// Se importa 'express-session' para manejar las sesiones
const session = require('express-session');

// Se importa el archivo de conexión a la base de datos (suponiendo que hay una conexión configurada en './conexion')
const conexion = require('./conexion'); 

// Se crea una instancia de la aplicacion Express
const app = express();

// Se configura la sesión para manejar las variables de sesión
app.use(session({
  secret: 'mi_secreto', // Una clave secreta para firmar la sesión
  resave: false, // No guarda la sesión si no se ha modificado
  saveUninitialized: true, // Guarda una sesión incluso si no se ha inicializado
  cookie: { secure: false } // Para entornos no seguros (como desarrollo), cambia a true en producción con HTTPS
}));

// Se define el puerto en el que se ejecutará el servidor
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
      if (err) return res.status(500).json({ error: 'Error en el servidor.' });

      if (resultados.length > 0) {
          const usuario = resultados[0];

          let redireccion;
          switch (usuario.id_rol) {
              case 1: redireccion = '../catalogo/catalogo.html'; break;
              case 2:
              case 3: redireccion = '../dashboard/index.html'; break;
              default: return res.status(403).json({ error: 'Rol no autorizado.' });
          }

          res.status(200).json({
              mensaje: '✅ Inicio de sesión exitoso.',
              usuario,  // Se manda el usuario directamente
              redireccion
          });
      } else {
          res.status(401).json({ error: '⚠️ Identificación o contraseña incorrectos.' });
      }
  });
});


// Ruta para obtener los datos del usuario actual (por ejemplo, para mostrar el nombre del usuario en el HTML)
app.get('/usuario', (req, res) => {
  if (req.session.usuario) {
    res.status(200).json(req.session.usuario); // Devuelve los datos del usuario almacenados en la sesión
  } else {
    res.status(401).json({ error: 'No estás logueado.' }); // Si no hay usuario en sesión
  }
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
