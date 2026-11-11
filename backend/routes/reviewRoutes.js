import express from "express";
import {
    getApprovedReviews,
    createReview,
    getAllReviews,
    toggleApproveReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getApprovedReviews);

// Protected (Customer or Student)
router.post("/", protect, createReview);

// Admin Only
router.get("/all", protect, authorize("admin"), getAllReviews);
router.patch("/:id/approve", protect, authorize("admin"), toggleApproveReview);
router.delete("/:id", protect, authorize("admin"), deleteReview);

export default router;
