// Importa el modulo mysql2 para conectarse a la base de datos MySQL
import mysql from 'mysql2';
// Importa dotenv para manejar variables de entorno
import dotenv from 'dotenv';
// Carga las variables de entorno desde el archivo .env ubicado en src/backend/.env
dotenv.config({ path: 'src/backend/.env' });

// Crea una conexion a la base de datos MySQL usando las variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Host de la base de datos
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASS, // Contraseña del usuario
  database: process.env.DB_NAME, // Nombre de la base de datos
});

// Intenta conectar a la base de datos y muestra un mensaje en consola segun el resultado
db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conexion a MySQL exitosa');
});

// Exporta la conexion para usarla en otros archivos del backend
export default db;
