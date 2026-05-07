import express from "express";
import { isAuthenticatedUser, isAdmin } from "../middleware/auth.middleware.js";
import {
  getAllAnalytics,
  getAnalyticsByDateRange,
  recordAnalytics,
  getAnalyticsSummary,
  deleteAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin routes
router.get("/", isAuthenticatedUser, isAdmin, getAllAnalytics);
router.get("/summary", isAuthenticatedUser, isAdmin, getAnalyticsSummary);
router.get("/range", isAuthenticatedUser, isAdmin, getAnalyticsByDateRange);
router.post("/record", recordAnalytics);
router.delete("/:id", isAuthenticatedUser, isAdmin, deleteAnalytics);

export default router;
