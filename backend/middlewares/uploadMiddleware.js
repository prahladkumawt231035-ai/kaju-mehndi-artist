import multer from "multer";

// Use memory storage so file is buffered in RAM and directly uploaded to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30 MB max file size
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed!"), false);
        }
    },
});

export default upload;
