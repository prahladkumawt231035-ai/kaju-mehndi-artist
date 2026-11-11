import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Course from "../models/Course.js";
import Booking from "../models/Booking.js";
import Gallery from "../models/Gallery.js";
import Enrollment from "../models/Enrollment.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kaju_mehndi";

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected Successfully to database: kaju_mehndi");

        // 1. Seed Admin
        const adminEmail = process.env.ADMIN_EMAIL || "kajal.kumawat.mehndi@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456"; // Uses .env ADMIN_PASSWORD

        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            adminUser = await User.create({
                name: "Kaju Ma'am (Admin)",
                email: adminEmail,
                phone: "+91 9244836867",
                password: adminPassword,
                role: "admin",
                isActive: true,
            });
            console.log(`✅ Admin Created: ${adminEmail}`);
        } else {
            adminUser.role = "admin";
            adminUser.isActive = true;
            await adminUser.save();
            console.log(`ℹ️ Admin Account already present: ${adminEmail}`);
        }

        // 2. Seed Demo Customer
        const customerEmail = "priya@example.com";
        let customerUser = await User.findOne({ email: customerEmail });
        if (!customerUser) {
            customerUser = await User.create({
                name: "Priya Sharma",
                email: customerEmail,
                phone: "+91 9876543210",
                password: "Customer@123",
                role: "customer",
                isActive: true,
            });
            console.log(`✅ Demo Customer Created: ${customerEmail}`);
        }

        // 3. Seed Demo Student
        const studentEmail = "ananya@example.com";
        let studentUser = await User.findOne({ email: studentEmail });
        if (!studentUser) {
            studentUser = await User.create({
                name: "Ananya Rathore",
                email: studentEmail,
                phone: "+91 9822211223",
                password: "Student@123",
                role: "student",
                isActive: true,
            });
            console.log(`✅ Demo Student Created: ${studentEmail}`);
        }

        // 4. Seed Services
        const serviceCount = await Service.countDocuments();
        if (serviceCount === 0) {
            const defaultServices = [
                {
                    title: "Royal Bridal Mehndi",
                    description: "Complete full-hand bridal artwork with traditional bride-groom portraits, elephant figures, and intricate jaal patterns extending up to elbows and feet.",
                    startingPrice: 5100,
                    duration: "4 - 6 Hours",
                    features: ["Dulha-Dulhan portraiture", "Full forearm & feet coverage", "Organic dark-stain henna", "Complimentary aftercare kit"],
                    order: 1,
                },
                {
                    title: "Engagement & Sangeet Mehndi",
                    description: "Graceful contemporary Mehndi tailored for engagements, roka ceremonies, and sangeet nights, balancing modern negative spaces with floral motifs.",
                    startingPrice: 2500,
                    duration: "2 - 3 Hours",
                    features: ["Elbow-length wrist designs", "Negative floral shading", "Lotus & peacock centerpieces", "Quick stain formula"],
                    order: 2,
                },
                {
                    title: "Modern Arabic & Indo-Arabic",
                    description: "Flowing diagonal bel patterns, bold outlines, and exquisite botanical shading that accentuates natural hand silhouettes.",
                    startingPrice: 1500,
                    duration: "1 - 2 Hours",
                    features: ["Bold leafy vines & bels", "Intricate fingertip details", "Arabic shading style", "Perfect for modern celebrations"],
                    order: 3,
                },
                {
                    title: "Party & Bridesmaids Mehndi",
                    description: "Speedy yet gorgeous Mehndi packages crafted specifically for bridesmaids, family members, and festive guest groups.",
                    startingPrice: 800,
                    duration: "30 - 45 Mins / Hand",
                    features: ["Front & back palm designs", "Mandala or floral style", "Quick drying cones", "Discount on group bookings"],
                    order: 4,
                },
                {
                    title: "Festival & Karwa Chauth Mehndi",
                    description: "Traditional festival Mehndi celebrating Teej, Karwa Chauth, Diwali, and Raksha Bandhan with cultural authenticity.",
                    startingPrice: 1200,
                    duration: "1 - 2 Hours",
                    features: ["Round traditional mandala", "Finger filigree & cuff work", "Aromatic organic henna", "Long-lasting rich stain"],
                    order: 5,
                },
                {
                    title: "Custom & Rajasthani Heritage Mehndi",
                    description: "Royal Marwari storytelling patterns incorporating folk musicians, doli, kalash, and personalized love story dates.",
                    startingPrice: 3500,
                    duration: "3 - 4 Hours",
                    features: ["Custom couple hashtags / names", "Palace architecture borders", "Rajasthani heritage jaal", "Premium photo-ready design"],
                    order: 6,
                },
            ];

            await Service.insertMany(defaultServices);
            console.log(`✅ 6 Core Services Seeded`);
        }

        // 5. Seed Courses
        let bridalCourse;
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            const defaultCourses = [
                {
                    title: "Basic Mehndi Foundation Course",
                    description: "Learn the fundamentals of Mehndi from scratch — henna paste making, cone rolling, pressure control, and basic lines, dots, and teardrops.",
                    level: "Beginner",
                    duration: "2 Weeks",
                    mode: "Online & Offline",
                    fees: 1999,
                    curriculum: [
                        "Organic Henna Powder & Essential Oils Science",
                        "Secret Paste Recipe for Dark Maroon Stain",
                        "Precision Cone Rolling & Sizing",
                        "Basic Strokes: Lines, Spirals, Checks & Leaves",
                        "Simple Mandala Composition & Fingertip Cuffs",
                    ],
                },
                {
                    title: "Arabic & Indo-Western Specialization",
                    description: "Master modern floral bel, shaded roses, negative space fill, and bold Arabic composition styles for high-paying party clients.",
                    level: "Intermediate",
                    duration: "3 Weeks",
                    mode: "Online & Offline",
                    fees: 2999,
                    curriculum: [
                        "Bold vs Fine Line Contrast Principles",
                        "Exotic Arabic Leaves, Vines & Bel Construction",
                        "Negative Floral Grid Fillers & Mandalas",
                        "Wrist Band & Jewelry Cuff Patterns",
                        "Speed Training for Fast Client Application",
                    ],
                },
                {
                    title: "Professional Bridal Mehndi Artistry Masterclass",
                    description: "Comprehensive bridal specialization: Dulha-Dulhan portrait sketching, Marwari jaal, elephant & peacock figure drawing, and symmetry mastery.",
                    level: "Advanced",
                    duration: "6 Weeks",
                    mode: "Online & Offline",
                    fees: 5999,
                    curriculum: [
                        "Bridal Figure Anatomy: Groom & Bride Portraits",
                        "Traditional Doli, Kalash & Elephant Figures",
                        "Elbow-to-Fingertip Seamless Composition Flow",
                        "Bridal Feet Mehndi Geometry & Symmetry",
                        "Professional Bridal Client Consultation & Pricing Strategy",
                    ],
                },
                {
                    title: "Master Artist Complete Diploma & Business Incubator",
                    description: "The complete all-in-one professional diploma including all styles, client management, bridal photography, social media marketing, and studio setup.",
                    level: "All-in-One",
                    duration: "12 Weeks",
                    mode: "Online & Offline",
                    fees: 9999,
                    curriculum: [
                        "Full Beginner, Arabic & Bridal Master Curriculum",
                        "Organic Henna Cone Manufacturing & Retailing",
                        "DSLR & Mobile Photography / Reel Making for Instagram",
                        "Client Contracts, Advance Bookings & Negotiation",
                        "Government Certified Academy Completion Diploma",
                    ],
                },
            ];

            const createdCourses = await Course.insertMany(defaultCourses);
            bridalCourse = createdCourses[2];
            console.log(`✅ 4 Academy Courses Seeded`);
        } else {
            bridalCourse = await Course.findOne({ level: "Advanced" });
        }

        // 6. Seed Sample Bookings
        const bookingCount = await Booking.countDocuments();
        if (bookingCount === 0) {
            await Booking.insertMany([
                {
                    customer: customerUser ? customerUser._id : null,
                    fullName: "Priya Sharma",
                    email: "priya@example.com",
                    phone: "+91 9876543210",
                    eventType: "Wedding",
                    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    preferredTime: "10:00 AM",
                    service: "Royal Bridal Mehndi",
                    eventLocation: "Civil Lines, Indore",
                    additionalRequirements: "Dulha-Dulhan portrait on palms and date hashtag 'PriKunal2026'.",
                    status: "confirmed",
                    totalAmount: 5100,
                    advancePaid: true,
                },
                {
                    fullName: "Ritu Verma",
                    email: "ritu.verma@example.com",
                    phone: "+91 9777788899",
                    eventType: "Engagement",
                    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    preferredTime: "2:00 PM",
                    service: "Engagement & Sangeet Mehndi",
                    eventLocation: "Bicholi Mardana, Indore",
                    additionalRequirements: "Backhand leafy arabic bel with matching sister designs.",
                    status: "pending",
                    totalAmount: 2500,
                    advancePaid: false,
                },
            ]);
            console.log(`✅ Sample Bookings Seeded`);
        }

        // 7. Seed Student Enrollment
        if (studentUser && bridalCourse) {
            const enrollmentCount = await Enrollment.countDocuments({ student: studentUser._id });
            if (enrollmentCount === 0) {
                await Enrollment.create({
                    student: studentUser._id,
                    course: bridalCourse._id,
                    status: "active",
                    progressPercentage: 45,
                    completedLessons: [
                        { lessonId: "L1", completedAt: new Date() },
                        { lessonId: "L2", completedAt: new Date() },
                        { lessonId: "L3", completedAt: new Date() },
                    ],
                });
                console.log(`✅ Demo Enrollment Seeded for ${studentEmail}`);
            }
        }

        // 8. Seed Gallery Items
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0) {
            await Gallery.insertMany([
                {
                    title: "Royal Marwari Full-Hand Bridal",
                    category: "Bridal",
                    mediaUrl: "/assets/bridal-mehndi.jpg",
                    price: 5100,
                    hasBrandWatermark: true,
                },
                {
                    title: "Exquisite Arabic Palm Trail",
                    category: "Arabic",
                    mediaUrl: "/assets/arabic-mehndi.jpg",
                    price: 1500,
                    hasBrandWatermark: true,
                },
                {
                    title: "Traditional Rajasthani Jaal",
                    category: "Rajasthani",
                    mediaUrl: "/assets/rajasthani-mehndi.jpg",
                    price: 3500,
                    hasBrandWatermark: true,
                },
                {
                    title: "Modern Minimal Wrist Ring Cuff",
                    category: "Minimal",
                    mediaUrl: "/assets/kaju-design-ref.jpg",
                    price: 800,
                    hasBrandWatermark: true,
                },
            ]);
            console.log(`✅ Initial Gallery Items Seeded`);
        }

        console.log("\n==============================================");
        console.log("🌸 KAJU MEHNDI DATABASE SEEDING COMPLETED 🌸");
        console.log("Database: kaju_mehndi");
        console.log("Admin Account:   kajal.kumawat.mehndi@gmail.com / Admin@123456");
        console.log("Customer Account: priya@example.com / Customer@123");
        console.log("Student Account:  ananya@example.com / Student@123");
        console.log("==============================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
