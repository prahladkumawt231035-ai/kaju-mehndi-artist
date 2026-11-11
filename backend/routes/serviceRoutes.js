import express from "express";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "../controllers/serviceController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Admin Only
router.post("/", protect, authorize("admin"), createService);
router.put("/:id", protect, authorize("admin"), updateService);
router.delete("/:id", protect, authorize("admin"), deleteService);

export default router;
