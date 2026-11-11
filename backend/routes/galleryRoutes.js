import express from "express";
import {
    getGallery,
    uploadGalleryMedia,
    deleteGalleryMedia,
} from "../controllers/galleryController.js";
import {
    protect,
    authorize,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public: Get all gallery items
router.get("/", getGallery);

// Admin only: Upload new media (single file named "file")
router.post(
    "/upload",
    protect,
    authorize("admin"),
    (req, res, next) => {
        upload.single("file")(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || "File upload error",
                });
            }
            next();
        });
    },
    uploadGalleryMedia
);

// Admin only: Delete gallery item
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteGalleryMedia
);

export default router;
