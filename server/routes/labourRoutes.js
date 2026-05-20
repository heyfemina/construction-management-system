import express from "express";

import {
  getLabours,
  getLabourActivity,
  addLabour,
  deleteLabour,
  addAttendance,
  addWage,
} from "../controllers/labourController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getLabours
);

router.get(
  "/activity",
  authMiddleware,
  getLabourActivity
);

router.post(
  "/",
  authMiddleware,
  addLabour
);

router.post(
  "/attendance",
  authMiddleware,
  addAttendance
);

router.post(
  "/wages",
  authMiddleware,
  addWage
);

router.delete(
  "/:id",
  authMiddleware,
  deleteLabour
);

export default router;
