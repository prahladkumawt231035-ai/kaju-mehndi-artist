// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,  
// });

// /**
//  * Generates an auto-branded image URL with Kaju watermark overlay and border
//  */
// export const getBrandedImageUrl = (publicId) => {
//     return cloudinary.url(publicId, {
//         transformation: [
//             { quality: "auto", fetch_format: "auto" },
//             { width: 1200, height: 1200, crop: "limit" },
//             // Subtle watermark overlay
//             {
//                 overlay: {
//                     font_family: "Georgia",
//                     font_size: 24,
//                     text: "Kaju Mehndi Artist • Every Stroke Tells a Story",
//                 },
//                 color: "#FFFFFF",
//                 opacity: 65,
//                 gravity: "south_east",
//                 x: 20,
//                 y: 20,
//             },
//         ],
//     });
// };

// export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export const getBrandedImageUrl = (publicId) => {
    return cloudinary.url(publicId, {
        transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1200, height: 1200, crop: "limit" },
            {
                overlay: {
                    font_family: "Georgia",
                    font_size: 24,
                    text: "Kaju Mehndi Artist • Every Stroke Tells a Story",
                },
                color: "#FFFFFF",
                opacity: 65,
                gravity: "south_east",
                x: 20,
                y: 20,
            },
        ],
    });
};

export default cloudinary;
