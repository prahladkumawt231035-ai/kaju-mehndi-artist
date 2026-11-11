// import dotenv from "dotenv";
// import app from "./app.js";
// import connectDB from "./config/db.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// // Connect to Database
// connectDB();

// const server = app.listen(PORT, () => {
//     console.log(`🌸 Kaju Mehndi Artist Backend listening on port ${PORT}`);
//     console.log(`✨ Environment: ${process.env.NODE_ENV || "development"}`);
// });

// process.on("unhandledRejection", (err) => {
//     console.error(`Unhandled Rejection: ${err.message}`);
//     server.close(() => process.exit(1));
// });


// *****************************

import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // First connect MongoDB
        await connectDB();

        // Then start Express server
        const server = app.listen(PORT, () => {
            console.log(
                `🌸 Kaju Mehndi Artist Backend running on port ${PORT}`
            );
            console.log(
                `✨ Environment: ${process.env.NODE_ENV || "development"}`
            );
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.error(`Unhandled Rejection: ${err.message}`);

            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {
        console.error("❌ Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
