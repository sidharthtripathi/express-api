import { NextFunction, Request, Response } from "express";
export async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // @ts-ignore
  if (!(req.id && req.username)) return res.status(401).send("unAuthorized");
  next();
}
