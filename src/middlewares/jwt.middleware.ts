import jwt, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

interface JWTPayload {
  id: string;
  email: string;
  role: "student" | "tutor" | "admin";
}

const requireRole = (roles: JwtPayload["role"][]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        throw createHttpError(401, {
          message: "Token not found",
          errors: "Token not found, unauthorized",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JWTPayload;
      if (!roles.includes(decoded.role)) {
        throw createHttpError(403, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default { requireRole };
