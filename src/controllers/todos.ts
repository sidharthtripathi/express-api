import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { db } from "../services/db";
export class Todos {
  static async getTodo(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));
      const todo = await db.todo.findFirst({
        where: {
          id,
        },
      });
      if (!todo) return res.status(404).send("No such Todo Exists");
      return res.json(todo);
    } catch (error) {
      if (error instanceof ZodError) return res.status(404).send("Invalid Id!");
    }
  }

  static async getTodos(req: Request, res: Response) {
    try {
      const todos = await db.todo.findMany({});
      return res.json(todos);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
}
