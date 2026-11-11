import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import Gallery from "../models/Gallery.js";
import Enquiry from "../models/Enquiry.js";

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/v1/dashboard/stats
export const getAdminStats = async (req, res) => {
    try {
        const [
            totalCustomers,
            totalStudents,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            totalCourses,
            totalGalleryDesigns,
            recentBookings,
            recentPayments,
            revenueData,
        ] = await Promise.all([
            User.countDocuments({ role: "customer" }),
            User.countDocuments({ role: "student" }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" }),
            Booking.countDocuments({ status: "confirmed" }),
            Booking.countDocuments({ status: "completed" }),
            Course.countDocuments({ isActive: true }),
            Gallery.countDocuments(),
            Booking.find().sort({ createdAt: -1 }).limit(6),
            Payment.find().sort({ createdAt: -1 }).limit(6).populate("user", "name email"),
            Payment.aggregate([
                { $match: { status: "paid" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalCustomers,
                totalStudents,
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                totalCourses,
                totalGalleryDesigns,
                totalRevenue,
            },
            recentBookings,
            recentPayments,
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
