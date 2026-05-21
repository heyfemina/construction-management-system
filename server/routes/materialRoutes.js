import express from "express";

import {
  getMaterials,
  getMaterialActivity,
  getSingleMaterial,
  addMaterial,
  updateMaterial,
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

router.get(
  "/:id",
  authMiddleware,
  getSingleMaterial
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

router.put(
  "/:id",
  authMiddleware,
  updateMaterial
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMaterial
);

export default router;
