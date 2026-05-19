import express from "express";

import {
  getVendors,
  addVendor,
  deleteVendor,
  addVendorPayment,
} from "../controllers/vendorController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getVendors
);

router.post(
  "/",
  authMiddleware,
  addVendor
);

router.post(
  "/payments",
  authMiddleware,
  addVendorPayment
);

router.delete(
  "/:id",
  authMiddleware,
  deleteVendor
);

export default router;
