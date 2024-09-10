import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.cookies.token;

  if (!payload) {
    return res.status(401).end({ error: "Token not found" });
  }

  jwt.verify(payload, process.env.JWT_SECRET as string, (err: any) => {
    if (err) {
      return res.status(401).end({ error: "Token is invalid" });
    }
  });

  next();
};

export default verifyToken;
