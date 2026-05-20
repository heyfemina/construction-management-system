import express from "express";

import {
  getVendors,
  getVendorLedger,
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

router.get(
  "/ledger/:id",
  authMiddleware,
  getVendorLedger
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
