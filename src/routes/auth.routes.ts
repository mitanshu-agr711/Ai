import express, { Request, Response } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/refresh", refresh);
// router.post("/logout", logout);

export default router;