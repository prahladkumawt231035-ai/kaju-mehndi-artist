import Enquiry from "../models/Enquiry.js";

// @desc    Submit new enquiry from Contact page
// @route   POST /api/v1/enquiries
export const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required",
            });
        }

        const enquiry = await Enquiry.create({
            name,
            email,
            phone: phone || "",
            subject: subject || "General Inquiry",
            message,
        });

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully! We will get in touch soon.",
            enquiry,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/v1/enquiries
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enquiries.length,
            enquiries,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update enquiry status or admin notes (Admin)
// @route   PATCH /api/v1/enquiries/:id
export const updateEnquiry = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
            { new: true }
        );
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        res.status(200).json({ success: true, enquiry });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/v1/enquiries/:id
export const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found" });
        }
        res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
