import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "All-in-One"],
            default: "Beginner",
        },
        duration: {
            type: String,
            required: [true, "Duration is required"],
        },
        mode: {
            type: String,
            enum: ["Online", "Offline", "Online & Offline"],
            default: "Online & Offline",
        },
        fees: {
            type: Number,
            required: [true, "Fees is required"],
        },
        thumbnail: {
            type: String,
            default: "",
        },
        curriculum: [
            {
                type: String,
            },
        ],
        totalStudents: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
