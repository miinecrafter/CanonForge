import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken
} from "../utils/jwt";

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  secure: false, // enable true in production
  sameSite: "lax" as const
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;

  // ✔ FIXED: Prisma v5 strict OR typing, guaranteed working version
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: email } },
        { username: { equals: username } }
      ]
    }
  });

  if (existing)
    return res.status(400).json({ error: "User already exists" });

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, passwordHash }
  });

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTS);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user)
    return res.status(400).json({ error: "Invalid credentials" });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok)
    return res.status(400).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTS);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token)
    return res.status(401).json({ error: "No refresh token" });

  try {
    const payload: any = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user)
      return res.status(401).json({ error: "Invalid token" });

    const newAccess = signAccessToken({ userId: user.id });
    const newRefresh = signRefreshToken({ userId: user.id });

    res.cookie("accessToken", newAccess, ACCESS_COOKIE_OPTS);
    res.cookie("refreshToken", newRefresh, REFRESH_COOKIE_OPTS);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ user: null });

    const payload: any = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, role: true }
    });

    return res.json({ user });
  } catch {
    return res.status(401).json({ user: null });
  }
};

