import express from "express";

import {
  getReports,
  exportPDF,
  exportExcel,
} from "../controllers/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getReports
);

router.get(
  "/export/pdf",
  authMiddleware,
  exportPDF
);

router.get(
  "/export/excel",
  authMiddleware,
  exportExcel
);

export default router;