import express from "express";
import { User } from "../controllers/users";
import { protectRoute } from "../middlewares/protectRoute";
export const userRouter = express.Router();
userRouter.get("/", User.getUsers);
userRouter.post("/", User.createUser);
userRouter.get("/search", User.searchUsers); // send along with q /users?q=val
userRouter.delete("/:id", protectRoute, User.deleteUser);
userRouter.get("/:id", User.getUser);
