//Variables y acceso a la BD local
const mysql = require('mysql2')


const connection= mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '123456789Aa!',
    database: 'bikestore'

})

connection.connect((err)=>{
    if (err) {
        console.error('Error en la conexion', err)
        return;
    }
    console.log('Conexion Exitosa')
})

module.exports = connection;