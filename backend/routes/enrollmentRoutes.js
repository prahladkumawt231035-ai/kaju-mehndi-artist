import express from "express";
import {
    getMyEnrollments,
    getAllEnrollments,
    createEnrollmentAdmin,
    updateEnrollmentAdmin,
    deleteEnrollmentAdmin,
    updateProgress,
} from "../controllers/enrollmentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student routes
router.get("/my-courses", protect, authorize("student", "admin"), getMyEnrollments);
router.patch("/:id/progress", protect, authorize("student", "admin"), updateProgress);

// Admin routes
router.get("/", protect, authorize("admin"), getAllEnrollments);
router.post("/", protect, authorize("admin"), createEnrollmentAdmin);
router.patch("/:id", protect, authorize("admin"), updateEnrollmentAdmin);
router.delete("/:id", protect, authorize("admin"), deleteEnrollmentAdmin);

export default router;
