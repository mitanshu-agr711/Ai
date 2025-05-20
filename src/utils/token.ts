import jwt, { Secret } from "jsonwebtoken";

const accessSecret: Secret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET!;

export const createAccessToken = (userId: string): string => {
  return jwt.sign(userId, accessSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  });
};

export const createRefreshToken = (userId: string): string => {
  return jwt.sign(userId, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
  });
};
