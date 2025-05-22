import jwt, { Secret} from "jsonwebtoken";
import ms from "ms";
import { redisClient} from './redisClient.js'
import { config } from "dotenv";
config();

const accessSecret: Secret = process.env.ACCESS_TOKEN_SECRET as string;
// console.log("Access secret:", accessSecret);
// console.log("Refresh secret:", process.env.REFRESH_TOKEN_SECRET);
const refreshSecret: Secret = process.env.REFRESH_TOKEN_SECRET as string;
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE as string;
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || '1d';


export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  try {
    const decoded = jwt.verify(token, refreshSecret) as { userId: string };
    const redisToken = await redisClient.get(`refreshToken:${decoded.userId}`);

    if (redisToken !== token) return null;
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

const refreshTokenExpireSec = Math.floor(ms(refreshTokenExpire) / 1000);
if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in the environment variables");
}


export const createAccessToken = (userId: string): string => {
  return jwt.sign({userId}, accessSecret, {
    expiresIn: accessTokenExpire,
  });
};


export const createRefreshToken = async (userId: string): Promise<string> => {
  
  const token = jwt.sign({ userId }, refreshSecret, {
    expiresIn: refreshTokenExpire,
  });

  await redisClient.set(`refreshToken:${userId}`, token, {
    EX: refreshTokenExpireSec,
  });
  return token;
};
