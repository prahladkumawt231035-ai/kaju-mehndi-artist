import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        type: {
            type: String,
            enum: ["service", "course"],
            default: "service",
        },
        serviceName: {
            type: String,
            default: "Bridal Mehndi",
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            minlength: 6,
        },
        isApproved: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
