import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.models.js";

const addTodo = asyncHandler(async (req, res) => {
    // get todo details from frontend
    // validation - not empty
    // create todo object - create entry in db
    // check for todo creation
    // return response to frontend - success, todo details

    const { title, content, completed } = req.body

    const existedTodo = await Todo.findOne({
        $and: [{ title }, { createdBy: req.user._id }]
    })

    if (existedTodo) {
        throw new ApiError(409, "Todo with this title and owner already exists")
    }

    const todo = await Todo.create({
        title,
        content,
        completed,
        createdBy: req.user._id
    })

    if (!todo) {
        throw new ApiError(500, "Something went wrong while creating todo")
    }

    return res.status(201).json(
        new ApiResponse(201, todo, "Todo created successfully!!")
    )
})

const deleteTodo = asyncHandler(async (req, res) => {
    // get todo id from frontend
    // validation - not empty, valid id
    // find the todo in db using id
    // check if todo exists
    // delete the todo from db
    // return response to frontend - success, deleted todo details

    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "Todo id is required")
    }

    const todo = await Todo.findOne({
        $and: [{ _id: id }, { createdBy: req.user._id }]
    })

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    await Todo.findByIdAndDelete(id)

    return res.status(200).json(
        new ApiResponse(200, {}, "Todo deleted successfully!!")
    )
})

const updateTodo = asyncHandler(async (req, res) => {
    // get todo id and updated details from frontend
    // validation - not empty, valid id
    // find the todo in db using id
    // check if todo exists
    // update the todo in db with new details
    // return response to frontend - success, updated todo details

    const { id } = req.params
    const { content, title, completed } = req.body

    if (!id) {
        throw new ApiError(400, "Todo id is required")
    }

    const todo = await Todo.findOne({
        $and: [{ _id: id }, { createdBy: req.user._id }]
    })

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    if (title !== undefined) todo.title = title
    if (content !== undefined) todo.content = content
    if (completed !== undefined) todo.completed = completed

    const updatedTodo = await todo.save({ validateBeforeSave: false })

    if (!updatedTodo) {
        throw new ApiError(500, "Something went wrong while updating todo")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedTodo, "Todo updated successfully!!")
    )
})

const getAllTodos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", completed = "", sortType = "desc" } = req.query

    const todos = await Todo.aggregate([
        {
            $match: {
                createdBy: req.user._id,
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                completed: 1,
                createdAt: 1
            }
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit),
        },
        {
            $limit: parseInt(limit),
        }
    ])
    if (todos.length === 0) {
        throw new ApiError(404, "No todos found")
    }
    res.status(200).json(new ApiResponse(200, todos, "todos fetched successfully"))
})

const searchTodo = asyncHandler(async (req, res) => {
    const searchTodos = asyncHandler(async (req, res) => {

        let { search = "", page = 1, limit = 10, sortType = "desc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const matchStage = {
            createdBy: req.user._id
        };

        if (search.trim() !== "") {
            matchStage.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        const todos = await Todo.aggregate([
            {
                $match: matchStage
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    completed: 1,
                    createdAt: 1
                }
            },
            {
                $sort: {
                    createdAt: sortType === "asc" ? 1 : -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        if (todos.length === 0) {
            throw new ApiError(404, "No matching todos found");
        }

        return res.status(200).json(
            new ApiResponse(200, todos, "Search results fetched successfully")
        );
    });
})

export { addTodo, deleteTodo, updateTodo, getAllTodos, searchTodo }