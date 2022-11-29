//requerir las dependencias, require nos permite importar las dependencias
//dependencias de las variables de entorno
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB')
const userRoutes = require('./routes/userRouters')


//esto crea una instancia de la app
const app = express();
//
const PORT = process.env.PORT

connectDB();

//es una funcion que nos permite defnir midelware que se van a usar antes de las rutas
app.use(bodyParser.json());
//Definiendo las rutas
app.use('/account', userRoutes);
//definir el puerto donde sel servidor esta escuchando
app.listen(PORT, ()=> console.log(`App listening on ${PORT} `));