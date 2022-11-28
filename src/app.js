//requerir las dependencias, require nos permite importar las dependencias
//dependencias de las variables de entorno
require('dotenv').config();
const express = require('express');
//
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB')


//esto crea una instancia de la app
const app = express();
//
const PORT = process.env.PORT
// const PORT = 3000

connectDB();

//es una funcion que nos permite defnir midelware que se van a usar antes de las rutas
app.use(bodyParser.json());
//Definiendo las rutas tipo get
app.get('/',(req,res)=>{
    res.send({message:"hola mercurio"});
});
//definir el puerto donde sel servidor esta escuchando
app.listen(PORT, ()=> console.log(`App listening on ${PORT} `));