const getModelByName = require('../db/getModelByName')

module.exports.signup = function(req, res){
    //si no nos llega el objeto esperado devolvemos un error porque no hay usuario que crear
    if(!req.body.user) return res.status(200).send({success: false, error:'user info not found'});
    //si nos llega el objeto 
    const User = getModelByName('user');
    try {
        User.signup(req.body.user)
        .then(()=>{
            res.status(200).send({success: true, message:' User created succesfully'});
        }).catch(error => res.status(200).send({success: false, error: error.message}))
        
    } catch (error) {
        res.status(500).send({success:false, error: error.message});
    }    
}

//nueva funcion confirmAccount

module.exports.confirmAccount = function(req,res){
    const User = getModelByName('user');

    try {
        User.confirmAccount(req.params.token)
        .then(()=>{
            res.status(200).send({success:true ,message:' user confirmed succesfully '});
        }).catch(error => res.status(200).send({success: false, error: error.message}))
        
    } catch (error) {
        res.status(500).send({ success:false, error: error.message})
        
    }

}


module.exports.login = function(req,res){
    if(!req.body.email) return res.status(200).send({success: false, error: 'email is not provided'})
    if(!req.body.password) return res.status(200).send({success: false, error: 'password is not provided'})

    const User = getModelByName('user');

    try {
        User.login(req.body.email, req.body.password)
        .then(data =>{
            res.status(200).send({success: true, data});
        }).catch(error => res.status(200).send({success: false, error: error.message}))
        
    } catch (error) {
        res.status(200).send({success: false, error: error.message})        
    }
}