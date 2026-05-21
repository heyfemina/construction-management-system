import express from "express";

import {
  getDashboardSummary,
  getFinanceData,
  getPartyLedger,
  addReceivable,
  addExpense,
  addPayment,
} from "../controllers/financeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getFinanceData
);

router.get(
  "/summary",
  authMiddleware,
  getDashboardSummary
);

router.get(
  "/ledger/:clientId",
  authMiddleware,
  getPartyLedger
);

router.post(
  "/receivables",
  authMiddleware,
  addReceivable
);

router.post(
  "/expenses",
  authMiddleware,
  addExpense
);

router.post(
  "/expense",
  authMiddleware,
  addExpense
);

router.post(
  "/payments",
  authMiddleware,
  addPayment
);

router.post(
  "/payment",
  authMiddleware,
  addPayment
);

export default router;
