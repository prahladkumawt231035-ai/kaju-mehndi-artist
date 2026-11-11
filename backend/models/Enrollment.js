import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
        status: {
            type: String,
            enum: ["active", "completed", "refunded"],
            default: "active",
        },
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        completedLessons: [
            {
                lessonId: String,
                completedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        certificateIssued: {
            type: Boolean,
            default: false,
        },
        certificateUrl: {
            type: String,
            default: "",
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
