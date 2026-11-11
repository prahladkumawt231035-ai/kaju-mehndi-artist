import express from "express";
import { getAdminStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);

export default router;
