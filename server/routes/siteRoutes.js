import express from "express";

import {
  getSites,
  getSingleSite,
  getSiteReport,
  addSite,
  updateSite,
  deleteSite,
} from "../controllers/siteController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getSites
);

router.get(
  "/report/:id",
  authMiddleware,
  getSiteReport
);

router.get(
  "/:id",
  authMiddleware,
  getSingleSite
);

router.post(
  "/",
  authMiddleware,
  addSite
);

router.put(
  "/:id",
  authMiddleware,
  updateSite
);

router.delete(
  "/:id",
  authMiddleware,
  deleteSite
);

export default router;
