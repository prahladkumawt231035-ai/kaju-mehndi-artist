import Service from "../models/Service.js";

// @desc    Get all active services
// @route   GET /api/v1/services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: services.length,
            services,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single service by ID
// @route   GET /api/v1/services/:id
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({ success: true, service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new service (Admin)
// @route   POST /api/v1/services
export const createService = async (req, res) => {
    try {
        const { title, description, startingPrice, duration, features, image, order } = req.body;
        const service = await Service.create({
            title,
            description,
            startingPrice: Number(startingPrice),
            duration,
            features: Array.isArray(features) ? features : [],
            image: image || "",
            order: order ? Number(order) : 0,
        });
        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update service (Admin)
// @route   PUT /api/v1/services/:id
export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/v1/services/:id
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
