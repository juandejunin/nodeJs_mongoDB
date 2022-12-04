const mongoose = require('mongoose');
// const { updateTodo, deleteTodo } = require('../controllers/todoController');

const todoSchema = mongoose.Schema({
    userId:{
        //el Type.ObjectId es un tipo especial, sirve para crear claves foraneas que estan apuntando a otra coleccion
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title:{
        type: String,
        required:true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    }
})

todoSchema.statics.create = create;
todoSchema.statics.getAll = getAll;
todoSchema.statics.getOne = getOne;
todoSchema.statics.updateTodo = updateTodo;
todoSchema.statics.deleteTodo = deleteTodo;

mongoose.model('todo', todoSchema, 'todos')

//metodos
function create(todoInfo, user){
    if(!todoInfo.title) throw new error('title is required');

    todoInfo.userId = user._id;

    const todo = new this(todoInfo);
    return todo.save();

}

function getAll(user){
    //con el filtro userId: user._id nos retornara solo los todos que pertenescan al usuario logueado
    return this.find({ userId: user._id})

}

function getOne(id, user){
    //funcion nativa 
    return this.findOne({ _id: id, userId: user._id})
        .then(todo =>{
            if (!todo) throw new Error('todo not found')

            return todo;
        })

}

function updateTodo(id, todoInfo = {}, user){
    //crear objeto update y poner en el las actualizaciones
    const update = {};
    if ( todoInfo.title) update.title = todoInfo.title;
    if (todoInfo.description) update.description = todoInfo.description;

    return this.findOne({ _id: id, userId: user._id})
    .then(todo =>{
        if (!todo) throw new Error('todo not found')
        if (Object.keys(update).length == 0) return todo;

        todo.set(update);
        return todo.save();

    })
    
}

function deleteTodo(id, user){

    return this.findOne({ _id: id, userId: user._id})
    .then(todo =>{
        if (!todo) throw new Error('todo not found')
       

        return todo.remove();

        
    })
    
}