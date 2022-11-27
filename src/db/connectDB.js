//aca definiremos una funcion que nos va hacer la conexion con mongoDB
//importo las dependencias
const mongoose = require('mongoose')

//creando la funcion
function connectDB(){
    const URI = 'mongodb+srv://juandejunin:4nQLmOLEoKkFhLJF@cluster0.k30iuzc.mongodb.net/productos'
    mongoose.connect(URI,{useNewUrlParser:true, useUnifiedTopology:true})
    //como es una promesa colocamos .then donde definiremos dos funciones, la primera el callbakc de succes que se llamara cuando se hace la funcion correctamente
    .then(
        ()=>{
            console.log('la base de datos se conecto correctamente')
        },
        (err)=>{
            console.log('error de conexion', err)

        }
    )

}

//exportacion
module.exports = connectDB;