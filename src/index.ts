import express from "express";
import { userRouter } from "./routes/users";
import { todosRouter } from "./routes/todos";
import { postsRouter } from "./routes/posts";
import { authRouter } from "./routes/auth";
import { verifyUser } from "./middlewares/verifyUser";


const app = express();
app.use(express.json());
app.use(verifyUser);
app.use("/users", userRouter);
app.use("/todos", todosRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("hello from express");
});
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`🚀 server listening at http://localhost:${port}`);
});
