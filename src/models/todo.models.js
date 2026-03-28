import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    content:{
        type:String,
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true
})

export const Todo = mongoose.model("Todo", todoSchema)