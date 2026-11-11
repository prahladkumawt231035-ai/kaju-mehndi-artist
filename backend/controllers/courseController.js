import Course from "../models/Course.js";

// @desc    Get all active courses
// @route   GET /api/v1/courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/v1/courses/:id
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create course (Admin)
// @route   POST /api/v1/courses
export const createCourse = async (req, res) => {
    try {
        const { title, description, level, duration, mode, fees, thumbnail, curriculum } = req.body;
        const course = await Course.create({
            title,
            description,
            level: level || "Beginner",
            duration,
            mode: mode || "Online & Offline",
            fees: Number(fees),
            thumbnail: thumbnail || "",
            curriculum: Array.isArray(curriculum) ? curriculum : [],
        });
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update course (Admin)
// @route   PUT /api/v1/courses/:id
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete course (Admin)
// @route   DELETE /api/v1/courses/:id
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
