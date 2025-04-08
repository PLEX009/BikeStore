const express = require('express')
const mysql = require('mysql2');
const cors = require('cors')
const connecion = require('./basedatos')

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

app.get('/usuarios', (req, res) =>{
    connection.query('SELECT * FROM usuarios',(err,results)=>{
        if(err){
            res.status(500).send('Error Database')
            return
        }
        res.json(results)
    })
})

app.listen(port,() =>{
    console.log(`servidor escuchando en ${port}`)
})