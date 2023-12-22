import express from "express";
import { authUser } from "../controllers/auth";
export const authRouter = express.Router();
authRouter.post("/login", authUser);
