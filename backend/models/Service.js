import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Service title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        image: {
            type: String,
            default: "",
        },
        startingPrice: {
            type: Number,
            required: [true, "Starting price is required"],
        },
        duration: {
            type: String,
            default: "2-3 Hours",
        },
        features: [
            {
                type: String,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
