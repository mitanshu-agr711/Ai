import jwt, { Secret, SignOptions } from "jsonwebtoken";

const accessSecret: Secret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as string;
if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in the environment variables");
}
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE as string;
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE as string;

export const createAccessToken = (userId: string): string => {
  return jwt.sign({userId}, accessSecret, {
    expiresIn: accessTokenExpire,
  } as SignOptions);
};

export const createRefreshToken = (userId: string): string => {
  
  return jwt.sign({ userId }, refreshSecret, {
    expiresIn: refreshTokenExpire,
  } as SignOptions);
};
