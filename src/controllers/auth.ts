import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { db } from "../services/db";
import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
const loginPayload = z.object({
  identifier: z.string(),
  password: z.string(),
});
export async function authUser(req: Request, res: Response) {
  try {
    const { identifier, password } = await loginPayload.parseAsync(req.body);
    const user = await db.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });
    if (!(user && hashSync(user.password, 10)))
      return res.status(400).send("Invalid credentials");
    const token = await jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string
    );
    return res.send(token);
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).send(error.message);
    return res.status(500).send("Internal server error");
  }
}
