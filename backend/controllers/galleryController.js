import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all gallery items with filter
// @route   GET /api/v1/gallery
export const getGallery = async (req, res) => {
    try {
        const { category, isVideo } = req.query;
        let query = {};

        if (category && category !== "All Designs") {
            query.category = new RegExp(`^${category}$`, "i");
        }
        if (isVideo !== undefined) {
            query.isVideo = isVideo === "true";
        }

        const items = await Gallery.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin upload new media with auto brand watermark & Cloudinary storage
// @route   POST /api/v1/gallery/upload
export const uploadGalleryMedia = async (req, res) => {
    try {
        const { title, category, price, isVideo, mediaUrl } = req.body;

        let finalMediaUrl = mediaUrl || "";
        let publicId = "";
        const isVid = isVideo === true || isVideo === "true";

        // If file uploaded via Multer (multipart/form-data)
        if (req.file) {
            const fileMime = req.file.mimetype;
            const isFileVideo = fileMime.startsWith("video/");
            const base64Data = req.file.buffer.toString("base64");
            const dataUri = `data:${fileMime};base64,${base64Data}`;

            const uploadRes = await cloudinary.uploader.upload(dataUri, {
                folder: "kaju-mehndi/gallery",
                resource_type: isFileVideo ? "video" : "image",
            });

            finalMediaUrl = uploadRes.secure_url;
            publicId = uploadRes.public_id;
        }

        if (!finalMediaUrl) {
            return res.status(400).json({
                success: false,
                message: "Image or video file is required",
            });
        }

        const galleryItem = await Gallery.create({
            title: title || "Exclusive Mehndi Artistry",
            category: category || "Bridal",
            price: price ? Number(price) : null,
            isVideo: isVid || (req.file ? req.file.mimetype.startsWith("video/") : false),
            mediaUrl: finalMediaUrl,
            publicId,
            hasBrandWatermark: true,
        });

        res.status(201).json({
            success: true,
            message: "Design uploaded and saved to database successfully!",
            item: galleryItem,
        });
    } catch (error) {
        console.error("Gallery Upload Error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to upload gallery media",
        });
    }
};

// @desc    Delete gallery media (Admin)
// @route   DELETE /api/v1/gallery/:id
export const deleteGalleryMedia = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // If publicId exists, remove from Cloudinary
        if (item.publicId) {
            try {
                await cloudinary.uploader.destroy(item.publicId, {
                    resource_type: item.isVideo ? "video" : "image",
                });
            } catch (cldErr) {
                console.warn("Cloudinary delete warning:", cldErr.message);
            }
        }

        await item.deleteOne();
        res.status(200).json({ success: true, message: "Media deleted successfully from database" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
