const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789Aa!',
    database: 'bikestore'
});

conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos.');
});

module.exports = conexion;   
