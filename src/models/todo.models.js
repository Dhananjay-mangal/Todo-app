import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.types.ObjectId,
        ref:"User",
    },
    subTodos:[
        {
            type:mongoose.Schema.types.ObjectId,
            ref:"SubTodo",
        }
    ]
},{
    timestamps:true
})

export const Todo = mongoose.model("Todo", todoSchema)