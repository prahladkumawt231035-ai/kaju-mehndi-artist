import cloudinary from "./config/cloudinary.js";

const testUpload = async () => {
    try {
        const result = await cloudinary.uploader.upload(
            "C:/Users/prahlad kumawat/Downloads/Bridal Mehndi Portraits on Satin.png",
            {
                folder: "kaju-mehndi",
            }
        );

        console.log("Image Uploaded Successfully!");
        console.log("Public ID:", result.public_id);
        console.log("Image URL:", result.secure_url);

    } catch (error) {
        console.log("Upload Failed:", error);
    }
};

testUpload();