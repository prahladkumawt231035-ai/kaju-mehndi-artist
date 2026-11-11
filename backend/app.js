import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Routes
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();
app.set("trust proxy", 1);
// Security / Middleware
// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (!origin) return callback(null, true);
//             if (
//                 /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
//                 origin === process.env.FRONTEND_URL
//             ) {
//                 return callback(null, true);
//             }
//             callback(new Error("Not allowed by CORS"));
//         },
//         credentials: true,
//     })
// );
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://kaju-mehndi-artist.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("Blocked CORS Origin:", origin);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Mount API Groups
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Health Check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Kaju Mehndi API is running smoothly 🌸",
        database: "kaju_mehndi",
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
