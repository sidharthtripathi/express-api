import express from "express";
import { Todos } from "../controllers/todos";
export const todosRouter = express.Router();
todosRouter.get("/:id", Todos.getTodo);
todosRouter.get("/", Todos.getTodos);
