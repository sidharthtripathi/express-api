import { Response, Request, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ZodError, z } from "zod";

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let authToken = req.headers["jwt-auth-token"];
    let token = await z.string().parseAsync(authToken);
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    // @ts-ignore
    req.id = user.id;
    // @ts-ignore
    req.username = user.username;
  } catch (error) {
    if (error instanceof ZodError || error instanceof JsonWebTokenError) {
      // @ts-ignore
      req.id = null;
      // @ts-ignore
      req.username = null;
    }
  } finally {
    next();
  }
}
