import jwt, { SignOptions } from "jsonwebtoken";
import {
  JWT_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from "../config/env";

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
  });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
  });
};

export const verifyAccessToken = (token: string) => jwt.verify(token, JWT_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);
