import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        type: {
            type: String,
            enum: ["booking_advance", "course_enrollment"],
            required: [true, "Payment type is required"],
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        razorpayOrderId: {
            type: String,
            required: [true, "Razorpay Order ID is required"],
            unique: true,
        },
        razorpayPaymentId: {
            type: String,
            default: "",
        },
        razorpaySignature: {
            type: String,
            default: "",
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"], // Amount in INR or paise
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created",
        },
        refundId: {
            type: String,
            default: "",
        },
        refundReason: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
