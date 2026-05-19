import express from "express";

import {
  getProfile,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/profile", authMiddleware, getProfile);

export default router;
