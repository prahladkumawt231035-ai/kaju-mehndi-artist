
import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const newPassword = "KajuAdmin@2026";

        const admin = await User.findOne({
            email: "kajal.kumawat.mehndi@gmail.com",
        });

        if (!admin) {
            console.log("Admin not found!");
            return;
        }

        // User.js middleware will hash this password automatically
        admin.password = newPassword;

        await admin.save();

        console.log("Admin password reset successfully!");
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

resetAdminPassword();
