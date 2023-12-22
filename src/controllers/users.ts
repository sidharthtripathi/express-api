import { ZodError, z } from "zod";
import { db } from "../services/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  address: z
    .object({
      country: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});
export class User {
  static async getUser(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return res.status(404).send("user not found");
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      //   console.log(error);
      if (error instanceof ZodError)
        return res.status(400).send("Invalid parameter");
      return res.status(500).send("Internal server error");
    }
  }

  static async searchUsers(req: Request, res: Response) {
    // caching is needed

    try {
      const query = await z.object({ q: z.string() }).parseAsync(req.query);
      const users = await db.user.findMany({
        where: {
          OR: [
            { name: { contains: query.q } },
            { username: { contains: query.q } },
          ],
        },
      });
      return res.json(users);
    } catch (error) {
      if (error instanceof ZodError) res.status(400).send("Query not provided");
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      });
      return res.json(users);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, username, email, password, address } =
        await userSchema.parseAsync(req.body);
      // check if user already exists
      const user = await db.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      if (user) return res.status(400).send("user already exists");
      const newUser = await db.user.create({
        data: {
          name,
          username,
          email,
          password: await bcrypt.hash(password, 10),
          address: {
            create: {
              city: address?.city,
              county: address?.country,
              state: address?.state,
              zip: address?.zip,
            },
          },
        },
        select: {
          username: true,
          email: true,
          name: true,
        },
      });
      res.status(201).json(newUser);
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).send(err.message);
      return res.status(500).send("Internal server error");
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = await z.number().parseAsync(Number(req.params.id));
      // @ts-ignore
      if (req.id !== id) return res.send(403).send("unAuthorized");
      await db.user.delete({
        where: {
          //@ts-ignore
          id,
        },
      });
      return res.send("user deleted!");
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).send(error.message);
      res.status(400).send("Invalid Request");
    }
  }
}
