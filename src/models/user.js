const mongoose = require ('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValidEmail } = require ('../helpers');
const { emit } = require('nodemon');
const { isErrored } = require('nodemailer/lib/xoauth2');

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
UserSchema.statics.sendConfirmationEmail = sendConfirmationEmail;
UserSchema.statics.confirmAccount = confirmAccount;
UserSchema.statics.login = login;
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
        .then(userCreated => this.sendConfirmationEmail(userCreated))
        .then(user => user)

}

//funcion para enviar email

function sendConfirmationEmail(user){
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure:false,
        auth:{
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }  
    
    })

    var token =  jwt.sign({email: user.email}, process.env.TOKEN_SECRET);

    //RUTA ENCARGADA DE CONFIRMAR LA CUENTA
    const urlConfirm = `${process.env.APIGATEWAY_URL}/account/confirm/${token}`

    //usando el trasnporter enviamos el email
    return transporter.sendMail({
        from: process.env.MAIL_ADMIN_ADDRESS,
        to: user.email,
        subject: "Please confirm your email",
        html: `<p>Confirm your email <a href="${urlConfirm}">Confirm</a></p>`,

    }).then(()=> user);

}

//definir funcion de confirmAccount

function confirmAccount(token){
    var email = null;

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        email = payload.email;

        
    } catch (error) {
        throw new Error('invalid token');       
        
    }
    return this.findOne({email})
        .then(user =>{
            if (!user) throw new Error('user not found');
            if (user.emailVerified)throw new Error('user already verified');

            user.emailVerified = true;
            return user.save();
        })
}

function login(email, password){
    //primero verificamos que el email es valido. 
    if (!isValidEmail(email)) throw new Error('email is invalid');
    //una vez que sabemos que es valido buscamos un usuario con ese mismo email. El método findOne() busca y devuelve un documento que coincide con los criterios de selección dados. Si varios documentos satisfacen la expresión de consulta dada, este método devolverá el primer documento de acuerdo con el orden natural que refleja el orden de los documentos en el disco. 
    return this.findOne({ email })
        .then(user =>{
            if(!user) throw new Error('incorrect credentials');
            if(!user.emailVerified) throw new Error('user is not confirmed');

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) throw new Error('incorrect credentials');

            const userObject = {
                _id: user._id,
                email: user.email,
                emailVerified: user.emailVerified,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            const access_token = jwt.sign(Object.assign({}, userObject), process.env.TOKEN_SECRET,{
                expiresIn:60*60*4,
            });

            return {
                access_token,
            }
        })


}