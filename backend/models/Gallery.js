import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["Bridal", "Arabic", "Rajasthani", "Engagement", "Minimal", "Festival", "Videos", "Other"],
            default: "Bridal",
        },
        mediaUrl: {
            type: String,
            required: [true, "Media URL is required"],
        },
        publicId: {
            type: String,
            default: "",
        },
        isVideo: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            default: null,
        },
        hasBrandWatermark: {
            type: Boolean,
            default: true,
        },
        orderCount: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
