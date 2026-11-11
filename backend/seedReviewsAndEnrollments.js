import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "./models/Review.js";
import Enrollment from "./models/Enrollment.js";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kaju_mehndi");
    console.log("Connected to MongoDB.");

    // Find sample users & courses
    const customers = await User.find({ role: "customer" });
    const students = await User.find({ role: "student" });
    const courses = await Course.find();

    console.log(`Found ${customers.length} customers, ${students.length} students, ${courses.length} courses.`);

    // 1. Seed Reviews if none exist
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && customers.length > 0) {
        console.log("Seeding verified client reviews...");
        const sampleReviews = [
            {
                user: customers[0]._id,
                type: "service",
                serviceName: "Royal Marwari Full-Hand Bridal",
                rating: 5,
                comment: "My wedding bridal mehndi was so dark, rich and intricate! Everyone in the family was mesmerized. Thank you Kaju for making my special day truly unforgettable.",
                isApproved: true,
            },
            {
                user: customers[1]?._id || customers[0]._id,
                type: "service",
                serviceName: "Luxury Engagement Mehndi",
                rating: 5,
                comment: "Kaju di's speed and neatness is beyond words. The fine lines and neat shading stayed dark for over 2 weeks! Highly recommended for all Indore brides.",
                isApproved: true,
            },
            {
                user: students[0]?._id || customers[0]._id,
                type: "course",
                course: courses[0]?._id || null,
                serviceName: "Academy Course",
                rating: 5,
                comment: "Kaju ma'am ne bohot achhe se cone grip aur Rajasthani figures sikhaye. Ab mai khud confident hoke bridal orders le rahi hoon. Best academy!",
                isApproved: true,
            },
            {
                user: customers[2]?._id || customers[0]._id,
                type: "service",
                serviceName: "Modern Arabic Trail & Floral",
                rating: 5,
                comment: "Punctual, professional and extremely talented artist. She customized the design exactly as shown in my Pinterest reference image.",
                isApproved: true,
            },
        ];

        await Review.insertMany(sampleReviews);
        console.log("Seeded 4 realistic reviews!");
    } else {
        console.log(`Reviews already exist: ${reviewCount}`);
    }

    // 2. Ensure students are enrolled in courses
    if (students.length > 0 && courses.length > 0) {
        const student1 = students[0];
        const student2 = students[1] || students[0];

        const existing1 = await Enrollment.findOne({ student: student1._id });
        if (!existing1) {
            await Enrollment.create({
                student: student1._id,
                course: courses[0]._id,
                progressPercentage: 45,
                completedLessons: [
                    { lessonId: "L1", completedAt: new Date() },
                    { lessonId: "L2", completedAt: new Date() },
                    { lessonId: "L3", completedAt: new Date() },
                ],
                status: "active",
                certificateIssued: false,
            });
            console.log(`Enrolled student ${student1.name} into ${courses[0].title}`);
        }

        if (students[1]) {
            const existing2 = await Enrollment.findOne({ student: student2._id });
            if (!existing2) {
                await Enrollment.create({
                    student: student2._id,
                    course: courses[1]?._id || courses[0]._id,
                    progressPercentage: 80,
                    completedLessons: [
                        { lessonId: "L1", completedAt: new Date() },
                        { lessonId: "L2", completedAt: new Date() },
                        { lessonId: "L3", completedAt: new Date() },
                        { lessonId: "L4", completedAt: new Date() },
                    ],
                    status: "active",
                    certificateIssued: false,
                });
                console.log(`Enrolled student ${student2.name} into ${courses[1]?.title}`);
            }
        }
    }

    console.log("Total Enrollments now:", await Enrollment.countDocuments());
    console.log("Total Reviews now:", await Review.countDocuments());
    process.exit(0);
};

seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
