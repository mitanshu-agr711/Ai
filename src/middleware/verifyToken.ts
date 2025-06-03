import { Request, Response, NextFunction } from "express";
import { createAccessToken, createRefreshToken } from "../utils/tokengenerator.js";
import { redisClient } from "../utils/redisClient.js";
import {verifyRefreshToken} from "../utils/tokengenerator.js";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, payload: any) =>{
    if (err) return res.sendStatus(403);
    req.userId = payload.userId;
    next();
  });
};


export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    const sessionId = req.cookies?.sessionId;
    if (!token || !sessionId) return res.status(401).json({ message: "No token or session" });

    
    const payload = await verifyRefreshToken(token);
    if (!payload || payload.sessionId !== sessionId) {
      return res.status(403).json({ message: "Invalid token or session" });
    }

    /
    await redisClient.del(`refreshToken:${payload.userId}:${sessionId}`);

   
    const newAccessToken = createAccessToken(payload.userId);
    const { token: newRefreshToken, sessionId: newSessionId } = await createRefreshToken(payload.userId);

    
    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("sessionId", newSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken: newAccessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


