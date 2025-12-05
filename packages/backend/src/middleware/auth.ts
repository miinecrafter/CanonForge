import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import prisma from "../prisma/client";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ error: "Unauthorized Error 1" });
    const payload: any = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }});
    if (!user) return res.status(401).json({ error: "Unauthorized Error 2" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized Error 3" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized Error 4" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
