import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kaju_mehndi";
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);

        const adminEmail = process.env.ADMIN_EMAIL || "kajumehndi@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "kajal989331";
        const adminName = process.env.ADMIN_NAME || "Kaju Mehndi Admin";
        const adminPhone = process.env.ADMIN_PHONE || "+919244836867";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`⚠️ Admin user already exists with email: ${adminEmail}`);
            console.log(`Role: ${existingAdmin.role}`);
            process.exit(0);
        }

        // Create new Admin
        const newAdmin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            phone: adminPhone,
            role: "admin",
            isActive: true,
        });

        console.log("=========================================");
        console.log("✅ ADMIN USER CREATED SUCCESSFULLY!");
        console.log("=========================================");
        console.log(`👤 Name:     ${newAdmin.name}`);
        console.log(`📧 Email:    ${newAdmin.email}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log(`🛡️ Role:     ${newAdmin.role}`);
        console.log("=========================================");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
