import express from "express";

import {
  getMaterials,
  getMaterialActivity,
  addMaterial,
  deleteMaterial,
  addMaterialPurchase,
  addMaterialUsage,
} from "../controllers/materialController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getMaterials
);

router.get(
  "/activity",
  authMiddleware,
  getMaterialActivity
);

router.post(
  "/",
  authMiddleware,
  addMaterial
);

router.post(
  "/purchases",
  authMiddleware,
  addMaterialPurchase
);

router.post(
  "/usage",
  authMiddleware,
  addMaterialUsage
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMaterial
);

export default router;
