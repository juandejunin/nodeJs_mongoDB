const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type:String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    }
})
//definir el modelo, primero el nombre del modelo luego el schema y finalmete users en plural que sera el nombre de la tabla en la base de datos
mongoose.model('user', UserSchema, 'users');