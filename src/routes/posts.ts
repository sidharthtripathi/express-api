import express from "express";
import { Post } from "../controllers/posts";
import { protectRoute } from "../middlewares/protectRoute";
export const postsRouter = express.Router();

postsRouter.get("/", Post.getPosts);
postsRouter.post("/", protectRoute, Post.createPost);
postsRouter.get("/:id", Post.getPost);
postsRouter.delete("/:id", protectRoute, Post.deletePost);
postsRouter.get("/:id/comments", Post.getComments);
