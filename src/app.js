//requerir las dependencias, require nos permite importar las dependencias
//dependencias de las variables de entorno
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB')
const userRoutes = require('./routes/userRouters');
const { isAuthenticated } = require('./middlewares')
const todoRouters = require('./routes/todoRouters')

//esto crea una instancia de la app
const app = express();
//definir la variable PORT usando el puerto que tenemos guardado de forma protegida en .env
const PORT = process.env.PORT

connectDB();

//bodyparser nos permite acceder a la infotmacion de una peticion 
app.use(bodyParser.json());
//Definiendo las rutas
app.use('/account', userRoutes);
app.use('/todos', todoRouters);
//definir el puerto donde sel servidor esta escuchando
app.listen(PORT, ()=> console.log(`App listening on ${PORT} `));