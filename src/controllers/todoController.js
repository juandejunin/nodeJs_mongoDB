const getModelByName = require('../db/getModelByName');

module.exports.create = function(req,res){
    if (!req.body.todo) return res.status(200).send({ success:false, error: 'todo info not found'});

    const Todo = getModelByName('todo');

    try {
        Todo.create(req.body.todo, req.user)
        .then((todo)=>{
            res.status(200).send({success:true, data:{todo} })
        }).catch(error => res.status(200).send({success:false, error: error.messagge}));
        
    } catch (error) {
        res.status(500).send({success: false, error: error.messagge})
    }
}


module.exports.getTodos = function(req,res){    
    const Todo = getModelByName('todo');

    Todo.getAll(req.user)
        .then(todos =>{
            res.status(200).send({ success:true, data: {todos} })
        }).catch(error => res.status(200).send({ success: false, error: error.messagge}))
}

module.exports.getTodo = function(req,res){    
    const Todo = getModelByName('todo');

    Todo.getOne(req.params.id, req.user)
        .then(todo =>{
            res.status(200).send({ success:true, data: {todo} })
        }).catch(error => res.status(200).send({ success: false, error: error.messagge}))
}
