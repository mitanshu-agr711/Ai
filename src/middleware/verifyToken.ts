import { Request, Response, NextFunction } from "express";
import { createAccessToken, createRefreshToken } from "../utils/tokengenerator.js";
import { redisClient } from "../utils/redisClient.js";
import {verifyRefreshToken} from "../utils/tokengenerator.js";

import jwt from "jsonwebtoken";

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

export const refreshAccessToken = async (req: Request, res: Response) =>{
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No token" });

    const payload = verifyRefreshToken(token); 
    if (!payload) return res.status(403).json({ message: "Invalid token" });

    const redisToken = await redisClient.get(payload.email);
    if (redisToken !== token)
      return res.status(403).json({ message: "Token mismatch" });

    const newAccessToken = createAccessToken(payload.email);
    const newRefreshToken = await createRefreshToken(payload.email);

   
    await redisClient.set(payload.email, newRefreshToken, {
      EX: 60 * 60 * 24 * 7,
    });


    res
      .cookie("refreshToken", newRefreshToken, {
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

