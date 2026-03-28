import express from "express"
import cors from "cors"

const app = express()

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

//import routes
import userRouter from "./routes/user.routes.js"
import todoRouter from "./routes/todo.routes.js"


// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/todo",todoRouter)

export { app };
