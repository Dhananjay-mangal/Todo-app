import Router from 'express';
import { addTodo, deleteTodo, updateTodo, getAllTodos, searchTodo } from '../controllers/todo.controllers.js'; 
import { VerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/addTodo").post(VerifyJWT,addTodo)
router.route("/deleteTodo/:id").post(VerifyJWT,deleteTodo)
router.route("/updateTodo/:id").post(VerifyJWT,updateTodo)
router.route("/getAllTodos").get(VerifyJWT,getAllTodos)
router.route("/searchTodo").get(VerifyJWT,searchTodo)

export default router;