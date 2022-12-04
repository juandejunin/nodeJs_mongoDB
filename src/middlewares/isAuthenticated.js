const jwt = require("jsonwebtoken");

//la funcion de este middleware sera verificar el usuario y comprobar si el token que nos envia es valido.
function isAuthenticated(req,res,next){
    const access_token = req.headers.access_token;
    if (!access_token) return res.status(401).send({ success: false, message: 'user is not authorized'});

    const user = verifyAuthToken(access_token);
    if (!user) return res.status(401).send({success: false, message:'user is not authorized'});

    req.user = user;

    next();
}

function verifyAuthToken(token){
    var user = null;

    try {
        user = jwt.verify(token, process.env.TOKEN_SECRET);        
    } catch  {
        
    }

    return user;
}
module.exports = isAuthenticated