import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";

// @desc    Get Current Student's Enrolled Courses
// @route   GET /api/v1/enrollments/my-courses
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate("course")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: enrollments.length, enrollments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Enrollments (Admin)
// @route   GET /api/v1/enrollments
export const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email phone isActive createdAt")
            .populate("course", "title fees level duration")
            .populate("payment", "razorpayPaymentId amount status")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: enrollments.length, enrollments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create Enrollment (Admin manual admission)
// @route   POST /api/v1/enrollments
export const createEnrollmentAdmin = async (req, res) => {
    try {
        const { studentId, courseId, progressPercentage, status } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student user not found" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const existing = await Enrollment.findOne({ student: studentId, course: courseId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Student already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            progressPercentage: progressPercentage || 0,
            status: status || "active",
        });

        // Increment course student count
        await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });

        const populated = await Enrollment.findById(enrollment._id)
            .populate("student", "name email phone")
            .populate("course", "title fees level duration");

        res.status(201).json({ success: true, enrollment: populated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update Enrollment (Admin)
// @route   PATCH /api/v1/enrollments/:id
export const updateEnrollmentAdmin = async (req, res) => {
    try {
        const { status, progressPercentage, certificateIssued } = req.body;
        const updateFields = {};
        if (status !== undefined) updateFields.status = status;
        if (progressPercentage !== undefined) updateFields.progressPercentage = Number(progressPercentage);
        if (certificateIssued !== undefined) {
            updateFields.certificateIssued = Boolean(certificateIssued);
            if (certificateIssued) {
                updateFields.certificateUrl = `/certificates/CERT-${req.params.id}.pdf`;
            }
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        )
            .populate("student", "name email phone")
            .populate("course", "title fees level duration");

        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }

        res.status(200).json({ success: true, enrollment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete Enrollment (Admin)
// @route   DELETE /api/v1/enrollments/:id
export const deleteEnrollmentAdmin = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Lesson Progress (Student)
// @route   PATCH /api/v1/enrollments/:id/progress
export const updateProgress = async (req, res) => {
    try {
        const { lessonId, progressPercentage } = req.body;
        const enrollment = await Enrollment.findOne({
            _id: req.params.id,
            student: req.user._id,
        });

        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }

        if (lessonId) {
            const alreadyDone = enrollment.completedLessons.some(
                (l) => l.lessonId === lessonId
            );
            if (!alreadyDone) {
                enrollment.completedLessons.push({ lessonId, completedAt: new Date() });
            }
        }

        if (progressPercentage !== undefined) {
            enrollment.progressPercentage = progressPercentage;
            if (progressPercentage >= 100) {
                enrollment.status = "completed";
                enrollment.certificateIssued = true;
                enrollment.certificateUrl = `/certificates/CERT-${enrollment._id}.pdf`;
            }
        }

        await enrollment.save();

        res.status(200).json({ success: true, enrollment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
