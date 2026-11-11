import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import Booking from "../models/Booking.js";
import Enrollment from "../models/Enrollment.js";

// @desc    Create Razorpay Order (For Course or Booking Advance)
// @route   POST /api/v1/payments/create-order
export const createPaymentOrder = async (req, res) => {
    try {
        const { type, refId, amount: requestedAmount } = req.body;
        let finalAmount = 0; // In INR

        if (type === "course_enrollment") {
            const course = await Course.findById(refId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }
            finalAmount = course.fees;
        } else if (type === "booking_advance") {
            finalAmount = requestedAmount || 1000; // Configurable advance amount
        } else {
            return res.status(400).json({ success: false, message: "Invalid payment type" });
        }

        // Create Razorpay order (amount in paise: finalAmount * 100)
        const options = {
            amount: finalAmount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
                userId: req.user?._id?.toString() || "guest",
                type,
                refId,
            },
        };

        const rzpOrder = await razorpay.orders.create(options);

        // Record payment in DB
        const paymentRecord = await Payment.create({
            user: req.user?._id,
            type,
            course: type === "course_enrollment" ? refId : null,
            booking: type === "booking_advance" ? refId : null,
            razorpayOrderId: rzpOrder.id,
            amount: finalAmount,
            currency: "INR",
            status: "created",
        });

        res.status(200).json({
            success: true,
            orderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            paymentId: paymentRecord._id,
        });
    } catch (error) {
        console.error("Payment Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/v1/payments/verify
export const verifyPaymentSignature = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            type,
            refId,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "failed" }
            );
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed!",
            });
        }

        // Update payment status to 'paid'
        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "paid",
            },
            { new: true }
        );

        // Activate corresponding business action
        if (type === "course_enrollment" && req.user) {
            // Activate student enrollment
            await Enrollment.findOneAndUpdate(
                { student: req.user._id, course: refId },
                {
                    student: req.user._id,
                    course: refId,
                    payment: payment?._id,
                    status: "active",
                },
                { upsert: true, new: true }
            );

            // Increment course student count
            await Course.findByIdAndUpdate(refId, { $inc: { totalStudents: 1 } });
        } else if (type === "booking_advance" && refId) {
            // Mark booking advance as paid
            await Booking.findByIdAndUpdate(refId, {
                advancePaid: true,
                razorpayPaymentId: razorpay_payment_id,
                status: "confirmed",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully!",
            payment,
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Current User's Payments
// @route   GET /api/v1/payments/my-payments
export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate("course", "title thumbnail")
            .populate("booking", "eventType eventDate service")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: payments.length, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin: Get all payments
// @route   GET /api/v1/payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email phone")
            .populate("course", "title fees")
            .populate("booking", "eventType eventDate service fullName phone")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: payments.length, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin: Process Refund
// @route   POST /api/v1/payments/:id/refund
export const processRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment || payment.status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Valid completed payment required for refund",
            });
        }

        // Razorpay refund API call
        if (payment.razorpayPaymentId) {
            const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
                amount: payment.amount * 100,
                notes: { reason: reason || "Customer request" },
            });
            payment.refundId = refund.id;
        }

        payment.status = "refunded";
        payment.refundReason = reason || "Admin refund";
        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment refunded successfully!",
            payment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
