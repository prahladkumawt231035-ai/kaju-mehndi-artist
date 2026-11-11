import mongoose from "mongoose";
import Enrollment from "./models/Enrollment.js";
import Review from "./models/Review.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kaju_mehndi");
    console.log("Enrollments:", await Enrollment.countDocuments());
    console.log("Reviews:", await Review.countDocuments());
    console.log("Admins:", await User.countDocuments({ role: "admin" }));
    console.log("Students:", await User.countDocuments({ role: "student" }));
    console.log("Customers:", await User.countDocuments({ role: "customer" }));
    console.log("Courses:", await Course.countDocuments());
    process.exit(0);
};

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
