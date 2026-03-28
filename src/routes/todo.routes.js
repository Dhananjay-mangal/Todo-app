import Router from 'express';
import { addTodo } from '../controllers/todo.controllers.js'; 
import { VerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/addTodo").post(VerifyJWT,addTodo)
// router.route("/deleteTodo").post(deleteTodo)
// router.route("/updateTodo").post(updateTodo)
// router.route("/getAllTodos").post(getAllTodos)
// router.route("/searchTodo").post(searchTodo)

export default router;