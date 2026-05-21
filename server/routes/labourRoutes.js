import express from "express";

import {
  getLabours,
  getLabourActivity,
  getSingleLabour,
  addLabour,
  updateLabour,
  deleteLabour,
  addAttendance,
  addWage,
  addLabourPayment,
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

router.get(
  "/:id",
  authMiddleware,
  getSingleLabour
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

router.post(
  "/payments",
  authMiddleware,
  addLabourPayment
);

router.put(
  "/:id",
  authMiddleware,
  updateLabour
);

router.delete(
  "/:id",
  authMiddleware,
  deleteLabour
);

export default router;
