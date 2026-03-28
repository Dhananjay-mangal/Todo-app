import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.models.js";

const addTodo = asyncHandler(async (req,res) => {
        // get todo details from frontend
        // validation - not empty
        // create todo object - create entry in db
        // check for todo creation
        // return response to frontend - success, todo details

    const {title,content,completed} = req.body

    const existedTodo = await Todo.findOne({
        $and: [{title},{createdBy: req.user._id}]
    })

    if(existedTodo){
        throw new ApiError(409,"Todo with this title and owner already exists")
    }

    const todo = await Todo.create({
        title,
        content,
        completed,
        createdBy: req.user._id
    })

    if(!todo){
        throw new ApiError(500,"Something went wrong while creating todo")
    }

    return res.status(201).json(
        new ApiResponse(201,todo,"Todo created successfully!!")
    )
})


export { addTodo }