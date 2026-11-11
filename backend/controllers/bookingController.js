import Booking from "../models/Booking.js";
import User from "../models/User.js";

// @desc    Create new booking
// @route   POST /api/v1/bookings
export const createBooking = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            eventType,
            eventDate,
            preferredTime,
            service,
            eventLocation,
            additionalRequirements,
            bookingSource,
        } = req.body;

        if (!fullName || !email || !phone || !eventType || !eventDate || !preferredTime || !service || !eventLocation) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required booking fields",
            });
        }

        let customerId = req.user ? req.user._id : null;
        if (!customerId && email) {
            const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
            if (existingUser) customerId = existingUser._id;
        }

        const booking = await Booking.create({
            customer: customerId,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            eventType,
            eventDate: new Date(eventDate),
            preferredTime,
            service,
            eventLocation,
            additionalRequirements: additionalRequirements || "",
            bookingSource: bookingSource || "website_form",
            status: "pending",
        });

        // WhatsApp direct link generator helper
        const adminWhatsapp = process.env.ADMIN_WHATSAPP || "919244836867";
        const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const waText = encodeURIComponent(
            `🌸 *New Mehndi Booking Received!* 🌸\n\n` +
            `👤 *Client:* ${fullName}\n` +
            `📱 *Phone:* ${phone}\n` +
            `💍 *Event:* ${eventType} on ${formattedDate}\n` +
            `⏰ *Time:* ${preferredTime}\n` +
            `🎨 *Service:* ${service}\n` +
            `📍 *Location:* ${eventLocation}\n` +
            (additionalRequirements ? `📝 *Notes:* ${additionalRequirements}\n` : "") +
            `Booking ID: #${booking._id}`
        );

        res.status(201).json({
            success: true,
            message: "Booking submitted successfully!",
            booking,
            whatsappOrderUrl: `https://wa.me/${adminWhatsapp}?text=${waText}`,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get logged-in user's bookings (Customer)
// @route   GET /api/v1/bookings/my-bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [{ customer: req.user._id }, { email: req.user.email }],
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/v1/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid booking status" });
        }
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
