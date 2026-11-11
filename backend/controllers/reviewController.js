import Review from "../models/Review.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// @desc    Get all approved reviews (Public)
// @route   GET /api/v1/reviews
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .populate("user", "name avatar role")
            .populate("course", "title")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create review (Authenticated Customer / Student)
// @route   POST /api/v1/reviews
export const createReview = async (req, res) => {
    try {
        const { type, serviceName, course, rating, comment } = req.body;

        if (!comment || comment.trim().length < 6) {
            return res.status(400).json({ success: false, message: "Review comment must be at least 6 characters." });
        }

        const review = await Review.create({
            user: req.user._id,
            type: type || "service",
            serviceName: serviceName || "Bridal Mehndi",
            course: course || null,
            rating: Number(rating) || 5,
            comment: comment.trim(),
            isApproved: true, // auto-approved for verified clients
        });

        const populated = await Review.findById(review._id)
            .populate("user", "name avatar")
            .populate("course", "title");

        res.status(201).json({
            success: true,
            message: "Thank you for your feedback!",
            review: populated,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/v1/reviews/all
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email phone")
            .populate("course", "title")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve/Reject review (Admin)
// @route   PATCH /api/v1/reviews/:id/approve
export const toggleApproveReview = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        )
            .populate("user", "name email phone")
            .populate("course", "title");

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/v1/reviews/:id
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
