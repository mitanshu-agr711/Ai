import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/tokengenerator.js";
import { redisClient } from "../utils/redisClient.js";

export const register = async (req: Request, res: Response) => {
  
  try {

    const { name,email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "every field are required" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({name, email, password: hashedPassword });
        createAccessToken(email);
        createRefreshToken(email);

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ error });
  }
};


export const login = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = await createAccessToken(email);
    const refreshToken = await createRefreshToken(email);

    
    await redisClient.set(email, refreshToken, {
      EX: 60 * 60 * 24 * 7,
    });

   
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const logout = async (req: Request, res: Response) => {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.sendStatus(204);

//   try {
//     const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as any;
//     const user = await User.findById(payload.userId);
//     if (user) {
//       user.refreshToken = undefined;
//       await user.save();
//     }
//     res.clearCookie("refreshToken").sendStatus(204);
//   } catch {
//     res.clearCookie("refreshToken").sendStatus(204);
//   }
// };
