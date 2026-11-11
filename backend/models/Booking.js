import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        eventType: {
            type: String,
            required: [true, "Event type is required"],
            enum: ["Wedding", "Engagement", "Birthday Party", "Festival", "Baby Shower", "Other"],
        },
        eventDate: {
            type: Date,
            required: [true, "Event date is required"],
        },
        preferredTime: {
            type: String,
            required: [true, "Preferred time is required"],
        },
        service: {
            type: String,
            required: [true, "Mehndi service is required"],
        },
        eventLocation: {
            type: String,
            required: [true, "Event location is required"],
        },
        additionalRequirements: {
            type: String,
            default: "",
        },
        bookingSource: {
            type: String,
            enum: ["website_form", "whatsapp_direct"],
            default: "website_form",
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        advancePaid: {
            type: Boolean,
            default: false,
        },
        razorpayPaymentId: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
