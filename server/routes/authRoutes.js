import express from "express";

import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/profile", authMiddleware, getProfile);

router.patch("/profile", authMiddleware, updateProfile);

export default router;
