import express from "express";

import {
  getVendors,
  getSingleVendor,
  getVendorLedger,
  addVendor,
  updateVendor,
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

router.get(
  "/:id",
  authMiddleware,
  getSingleVendor
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

router.put(
  "/:id",
  authMiddleware,
  updateVendor
);

router.delete(
  "/:id",
  authMiddleware,
  deleteVendor
);

export default router;
