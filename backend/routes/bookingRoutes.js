import express from "express";
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
} from "../controllers/bookingController.js";
import {
    protect,
    authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public booking (or authenticated)
router.post("/", createBooking);

// Logged-in Customer/User bookings
router.get("/my-bookings", protect, getMyBookings);

// Admin only
router.get("/", protect, authorize("admin"), getAllBookings);
router.patch("/:id/status", protect, authorize("admin"), updateBookingStatus);

export default router;
