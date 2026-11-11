import express from "express";
import {
    createPaymentOrder,
    verifyPaymentSignature,
    getMyPayments,
    getAllPayments,
    processRefund,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { isRazorpayEnabled } from "../config/razorpay.js";
const router = express.Router();
// Temporarily disable payment APIs until Razorpay is configured
router.use((req, res, next) => {
    if (!isRazorpayEnabled) {
        return res.status(503).json({
            success: false,
            message: "Payment services are temporarily unavailable.",
        });
    }

    next();
});

router.get("/", protect, authorize("admin"), getAllPayments);
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPaymentSignature);
router.get("/my-payments", protect, getMyPayments);
router.post("/:id/refund", protect, authorize("admin"), processRefund);

export default router;
