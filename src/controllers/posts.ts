import { ZodError, z } from "zod";
import { Request, Response } from "express";
import { db } from "../services/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const createPostSchema = z.object({
  title: z.string(),
  body: z.string(),
});
export class Post {
  static async getPost(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));
      const post = await db.post.findFirst({
        where: {
          id,
        },
      });
      if (!post) return res.status(404).send("No such post Exist");
      return res.json(post);
    } catch (error) {
      if (error instanceof ZodError)
        return res.status(400).send("Invalid Request");
      return res.status(500).send("Internal server error");
    }
  }

  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await db.post.findMany({});
      return res.json(posts);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));

      // check if post exist
      const comments = await db.post.findUnique({
        where: {
          id,
        },
        select: {
          comments: true,
        },
      });
      if (!comments) return res.status(404).send("No such post exist");
      return res.json(comments);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const { title, body } = await createPostSchema.parseAsync(req.body);
      const newpost = await db.post.create({
        data: {
          title,
          body,
          // @ts-ignore
          userId: req.id,
        },
      });
      return res.json(newpost);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).send(error.message);
      return res.status(500).send("Internal server error");
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));
      await db.post.delete({
        where: {
          id,
          // @ts-ignore
          userId: req.id,
        },
      });
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof ZodError) res.sendStatus(400);
      else if (error instanceof PrismaClientKnownRequestError)
        return res.status(400).send("Unauthorized or Invalid Request");
      return res.sendStatus(500);
    }
  }
}
