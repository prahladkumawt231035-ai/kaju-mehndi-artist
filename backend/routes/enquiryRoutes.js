import express from "express";
import {
    createEnquiry,
    getAllEnquiries,
    updateEnquiry,
    deleteEnquiry,
} from "../controllers/enquiryController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", createEnquiry);

// Admin Only
router.get("/", protect, authorize("admin"), getAllEnquiries);
router.patch("/:id", protect, authorize("admin"), updateEnquiry);
router.delete("/:id", protect, authorize("admin"), deleteEnquiry);

export default router;
