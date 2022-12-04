const mongoose = require('mongoose');

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