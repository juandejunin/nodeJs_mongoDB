const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const { isValidEmail } = require ('../helpers')
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

UserSchema.statics.signup = signup;
//definir el modelo, primero el nombre del modelo luego el schema y finalmete users en plural que sera el nombre de la tabla en la base de datos
mongoose.model('user', UserSchema, 'users');

function signup(userInfo){
    //validaciones
    if(!userInfo.email || !isValidEmail(userInfo.email)) throw new Error('email is invalid');
    if(!userInfo.password) throw new Error('Password is required');
    if(!userInfo.firstName) throw new Error('Firstname is required');
    if(!userInfo.lastName) throw new Error('Lastname is required');

    //validad que no exista ningun usuario con el mismo email
    return this.findOne({email: userInfo.email})//esto esta diciendo que busque un email igual al que nos paso el usuario
        .then(user =>{
            if(user) throw new Error('user already exists')

            //El hash de contraseña es una forma de cifrar las contraseñas a través de una función hash criptográfica. 

            const newUser = {
                email: userInfo.email,
                password: bcrypt.hashSync(userInfo.password,9),
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
            }
            return this.create(newUser);
        })
        .then(userCreated => userCreated);

}