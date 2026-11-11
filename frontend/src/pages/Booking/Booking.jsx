import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
    User, Mail, Phone, Calendar, Clock, MapPin,
    MessageSquare, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, AlertCircle, Edit3, LogIn, Lock
} from "lucide-react";
import API from "../../api/axios";
import "./Booking.css";

const WHATSAPP_NUMBER = "919244836867";

const services = [
    "Bridal Mehndi",
    "Engagement Mehndi",
    "Arabic Mehndi",
    "Party Mehndi",
    "Festival Mehndi",
    "Custom Mehndi Designs",
];

const eventTypes = [
    "Wedding",
    "Engagement",
    "Birthday Party",
    "Festival",
    "Baby Shower",
    "Other",
];

const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM",
];

/* ===== BUILD WHATSAPP MESSAGE ===== */
const buildWhatsAppMessage = (data) => {
    return encodeURIComponent(
        `🌸 *New Mehndi Booking Request* 🌸\n\n` +
        `👤 *Name:* ${data.fullName}\n` +
        `📧 *Email:* ${data.email}\n` +
        `📱 *Phone:* ${data.phone}\n\n` +
        `💍 *Event Type:* ${data.eventType}\n` +
        `📅 *Event Date:* ${data.eventDate}\n` +
        `⏰ *Preferred Time:* ${data.preferredTime}\n` +
        `🎨 *Service:* ${data.service}\n` +
        `📍 *Location:* ${data.eventLocation}\n\n` +
        (data.requirements ? `📝 *Additional Requirements:*\n${data.requirements}\n\n` : "") +
        `Please confirm my booking. Thank you! 🙏`
    );
};

/* ===== STEP INDICATOR ===== */
const StepIndicator = ({ currentStep, isAutoFilled, onStepClick }) => (
    <div className="step-indicator">
        {[1, 2, 3].map((stepNum) => {
            const isStepDone = currentStep > stepNum || (stepNum === 1 && isAutoFilled && currentStep >= 2);
            const isClickable = stepNum < currentStep || (stepNum === 1 && isAutoFilled);

            return (
                <div key={stepNum} className="step-item">
                    <motion.div
                        className={`step-circle ${currentStep >= stepNum ? "step-active" : ""} ${isStepDone ? "step-done" : ""}`}
                        animate={{ scale: currentStep === stepNum ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => isClickable && onStepClick(stepNum)}
                        style={{ cursor: isClickable ? "pointer" : "default" }}
                        title={isClickable ? `Click to view Step ${stepNum}` : ""}
                    >
                        {isStepDone ? <CheckCircle2 size={16} /> : stepNum}
                    </motion.div>
                    <span className={`step-label ${currentStep >= stepNum ? "step-label-active" : ""}`}>
                        {stepNum === 1 ? (isAutoFilled ? "Personal (Saved)" : "Personal") : stepNum === 2 ? "Event" : "Review"}
                    </span>
                    {stepNum < 3 && <div className={`step-line ${isStepDone ? "step-line-done" : ""}`} />}
                </div>
            );
        })}
    </div>
);

/* ===== FORM FIELD ===== */
const FormField = ({ label, icon: Icon, error, children }) => (
    <div className="form-field">
        <label className="form-label">
            {Icon && <Icon size={14} />}
            {label}
        </label>
        {children}
        {error && <span className="form-error">{error}</span>}
    </div>
);

/* ===== MAIN BOOKING PAGE ===== */
const Booking = () => {
    // Check if user is logged in
    const authUser = useSelector((state) => state.auth?.user);
    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();
    const currentUser = authUser || storedUser;
    const isLoggedIn = !!currentUser;

    // Logged-in user starts directly on Step 2 (Event Details)
    // New/Guest user starts on Step 1 (Personal Details)
    const [step, setStep] = useState(isLoggedIn ? 2 : 1);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [createdBooking, setCreatedBooking] = useState(null);
    const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState("");
    const [whatsappMode, setWhatsappMode] = useState(true); // default to true so WhatsApp redirect is prioritized

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: currentUser?.name || "",
            email: currentUser?.email || "",
            phone: currentUser?.phone || "",
            eventType: "",
            eventDate: "",
            preferredTime: "",
            service: "",
            eventLocation: "",
            requirements: "",
        },
    });

    // Auto-populate logged-in user details whenever auth state changes
    useEffect(() => {
        if (currentUser) {
            if (currentUser.name) setValue("fullName", currentUser.name);
            if (currentUser.email) setValue("email", currentUser.email);
            if (currentUser.phone) setValue("phone", currentUser.phone);
        }
    }, [currentUser, setValue]);

    /* Validate step fields before moving forward */
    const nextStep = async () => {
        const fieldsToValidate =
            step === 1
                ? ["fullName", "email", "phone"]
                : ["eventType", "eventDate", "preferredTime", "service", "eventLocation"];
        const valid = await trigger(fieldsToValidate);
        if (valid) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setSubmitError("");

        try {
            const payload = {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                eventType: data.eventType,
                eventDate: data.eventDate,
                preferredTime: data.preferredTime,
                service: data.service,
                eventLocation: data.eventLocation,
                additionalRequirements: data.requirements || "",
                bookingSource: "whatsapp_direct",
            };

            const response = await API.post("/bookings", payload);
            const savedBooking = response.data.booking;
            setCreatedBooking(savedBooking);

            // Automatically open WhatsApp with complete booking details!
            const waUrl = response.data.whatsappOrderUrl || `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(data)}`;
            setWhatsappRedirectUrl(waUrl);
            window.open(waUrl, "_blank");

            setSubmitted(true);
        } catch (error) {
            setSubmitError(
                error.response?.data?.message ||
                "Failed to register your booking in the database. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const pageVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
    };

    if (submitted) {
        return (
            <div className="booking-page">
                <motion.div
                    className="booking-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="success-icon">✅</div>
                    <h2>Booking Request Confirmed & Saved!</h2>
                    {createdBooking && (
                        <div style={{
                            margin: "1rem 0",
                            padding: "0.8rem 1.2rem",
                            background: "rgba(184, 154, 112, 0.15)",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            textAlign: "left"
                        }}>
                            <div><strong>Booking Reference ID:</strong> #{createdBooking._id}</div>
                            <div><strong>Service:</strong> {createdBooking.service}</div>
                            <div><strong>Event Date:</strong> {new Date(createdBooking.eventDate).toLocaleDateString()} at {createdBooking.preferredTime}</div>
                            <div><strong>Status:</strong> <span style={{ color: "#8A6D47", fontWeight: "bold" }}>Pending Confirmation</span></div>
                        </div>
                    )}
                    <p>
                        {whatsappMode
                            ? "Your order has been recorded in our system and sent on WhatsApp! Kaju ma'am will confirm your slot shortly."
                            : "Thank you! Your appointment request has been recorded in our database. We'll contact you to confirm the date."}
                    </p>
                    <div className="success-actions">
                        <button className="primary-btn" onClick={() => { setSubmitted(false); setCreatedBooking(null); setStep(isLoggedIn ? 2 : 1); }}>
                            New Booking
                        </button>
                        <Link to="/customer" className="primary-btn" style={{ background: "#70452C", color: "#FFFDF8", textDecoration: "none" }}>
                            My Client Portal
                        </Link>
                        <a
                            href={whatsappRedirectUrl || `https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-confirm-btn"
                        >
                            💬 Chat on WhatsApp to Confirm Slot
                        </a>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            {/* Page Header */}
            <div className="booking-header">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="booking-tag"><Sparkles size={12} /> BOOK YOUR MEHNDI</span>
                    <h1>Book an Appointment</h1>
                    <p>Fill in the details below and we'll confirm your booking</p>
                </motion.div>
            </div>

            {/* WhatsApp Quick Order Banner */}
            <motion.div
                className="wa-quick-banner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {isLoggedIn ? (
                    <>
                        <span>
                            <strong>Logged-in Customer ({currentUser?.name}):</strong> Details bhar ke submit karein, booking direct database aur WhatsApp dono par send hogi!
                        </span>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Namaste%20Kaju%20ma%27am!%20Mai%20${encodeURIComponent(currentUser?.name || "Customer")}%20Mehndi%20booking%20ke%20liye%20inquire%20karna%20chahti%20hu.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-instant-btn"
                        >
                            Chat on WhatsApp →
                        </a>
                    </>
                ) : (
                    <>
                        <span>
                            <strong>Pehle Sign In zaroori hai:</strong> Mehndi booking aur WhatsApp direct appointment ke liye kripya pehle apne account me Sign In karein.
                        </span>
                        <Link to="/login" state={{ from: "/booking" }} className="wa-instant-btn">
                            Sign In to Book →
                        </Link>
                    </>
                )}
            </motion.div>

            {/* Main Booking Container */}
            <div className="booking-container">
                {!isLoggedIn ? (
                    <motion.div
                        className="booking-auth-gate-card"
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="auth-gate-icon-circle">
                            <Lock size={36} />
                        </div>
                        <h2>Please Sign In to Book an Appointment</h2>
                        <p>
                            Namaste! Kaju Mehndi Artist ki appointment book karne aur slot secure karne ke liye kripya pehle apne customer account me Sign In karein. Booking ke baad aapka request Kaju ma'am ke official WhatsApp par directly redirect ho jayega.
                        </p>

                        <div className="auth-gate-perks">
                            <div className="auth-gate-perk-item">
                                <CheckCircle2 size={16} color="#25D366" />
                                <span>Booking direct aapke mobile aur verified account se link hogi</span>
                            </div>
                            <div className="auth-gate-perk-item">
                                <CheckCircle2 size={16} color="#25D366" />
                                <span>Submit karte hi Kaju ma'am ke WhatsApp par automatic redirect</span>
                            </div>
                            <div className="auth-gate-perk-item">
                                <CheckCircle2 size={16} color="#25D366" />
                                <span>Customer dashboard se apni appointment status anytime track karein</span>
                            </div>
                        </div>

                        <div className="auth-gate-actions">
                            <Link to="/login" state={{ from: "/booking" }} className="gate-btn-login">
                                <LogIn size={16} /> Sign In to Book Mehndi →
                            </Link>
                            <Link to="/register" state={{ from: "/booking" }} className="gate-btn-register">
                                New Customer? Register Here
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="booking-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <StepIndicator
                            currentStep={step}
                            isAutoFilled={isLoggedIn}
                            onStepClick={(s) => setStep(s)}
                        />

                    {/* Mode toggle */}
                    <div className="booking-mode-toggle">
                        <button
                            type="button"
                            className={`mode-btn ${!whatsappMode ? "mode-active" : ""}`}
                            onClick={() => setWhatsappMode(false)}
                        >
                            Form Booking
                        </button>
                        <button
                            type="button"
                            className={`mode-btn mode-wa ${whatsappMode ? "mode-active-wa" : ""}`}
                            onClick={() => setWhatsappMode(true)}
                        >
                            WhatsApp Order
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {/* ===== STEP 1: PERSONAL DETAILS ===== */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={pageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="form-step"
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                                        <h3 className="step-heading" style={{ margin: 0 }}>Personal Details</h3>
                                        {isLoggedIn && (
                                            <span style={{ fontSize: "12px", color: "#128C7E", fontWeight: 600 }}>
                                                ✓ Auto-filled from profile
                                            </span>
                                        )}
                                    </div>

                                    {/* Guest Login Suggestion Banner */}
                                    {!isLoggedIn && (
                                        <div className="guest-login-hint">
                                            <LogIn size={15} color="#B89A70" />
                                            <span>Already registered with us?</span>
                                            <Link to="/login" state={{ from: "/booking" }} className="hint-login-link">
                                                Sign in here →
                                            </Link>
                                            <span>to auto-fill your details and track your booking!</span>
                                        </div>
                                    )}

                                    {isLoggedIn && (
                                        <div className="logged-info-note">
                                            <CheckCircle2 size={15} color="#25D366" />
                                            <span>Your contact info is pre-filled from your account. You can review or edit it below:</span>
                                        </div>
                                    )}

                                    <div className="form-grid">
                                        <FormField label="Full Name" icon={User} error={errors.fullName?.message}>
                                            <input
                                                className={`form-input ${errors.fullName ? "input-error" : ""}`}
                                                placeholder="Priya Sharma"
                                                {...register("fullName", {
                                                    required: "Full name is required",
                                                    minLength: { value: 2, message: "Name too short" },
                                                })}
                                            />
                                        </FormField>

                                        <FormField label="Email Address" icon={Mail} error={errors.email?.message}>
                                            <input
                                                className={`form-input ${errors.email ? "input-error" : ""}`}
                                                placeholder="priya@email.com"
                                                type="email"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: "Invalid email address",
                                                    },
                                                })}
                                            />
                                        </FormField>

                                        <FormField label="Mobile Number" icon={Phone} error={errors.phone?.message}>
                                            <input
                                                className={`form-input ${errors.phone ? "input-error" : ""}`}
                                                placeholder="+91 98765 43210"
                                                type="tel"
                                                {...register("phone", {
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[6-9]\d{9}$/,
                                                        message: "Enter valid 10-digit mobile number",
                                                    },
                                                })}
                                            />
                                        </FormField>
                                    </div>
                                </motion.div>
                            )}

                            {/* ===== STEP 2: EVENT DETAILS ===== */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={pageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="form-step"
                                >
                                    {/* Logged-In User Banner */}
                                    {isLoggedIn && (
                                        <div className="logged-user-banner">
                                            <div className="user-info-text">
                                                <span className="badge-prefilled">✓ Logged-in Customer</span>
                                                <p>
                                                    Booking as: <strong>{getValues("fullName") || currentUser?.name}</strong> • <span>{getValues("email") || currentUser?.email}</span>
                                                    {(getValues("phone") || currentUser?.phone) ? ` • ${getValues("phone") || currentUser?.phone}` : ""}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="btn-edit-user-info"
                                            >
                                                <Edit3 size={12} /> Edit Personal Info
                                            </button>
                                        </div>
                                    )}

                                    <h3 className="step-heading">Event Details</h3>

                                    <div className="form-grid">
                                        <FormField label="Event Type" icon={Sparkles} error={errors.eventType?.message}>
                                            <select
                                                className={`form-input ${errors.eventType ? "input-error" : ""}`}
                                                {...register("eventType", { required: "Event type is required" })}
                                            >
                                                <option value="">Select Event Type</option>
                                                {eventTypes.map((e) => (
                                                    <option key={e} value={e}>{e}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Mehndi Service" icon={Sparkles} error={errors.service?.message}>
                                            <select
                                                className={`form-input ${errors.service ? "input-error" : ""}`}
                                                {...register("service", { required: "Service is required" })}
                                            >
                                                <option value="">Select Service</option>
                                                {services.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Event Date" icon={Calendar} error={errors.eventDate?.message}>
                                            <input
                                                type="date"
                                                className={`form-input ${errors.eventDate ? "input-error" : ""}`}
                                                min={new Date().toISOString().split("T")[0]}
                                                {...register("eventDate", { required: "Event date is required" })}
                                            />
                                        </FormField>

                                        <FormField label="Preferred Time" icon={Clock} error={errors.preferredTime?.message}>
                                            <select
                                                className={`form-input ${errors.preferredTime ? "input-error" : ""}`}
                                                {...register("preferredTime", { required: "Preferred time is required" })}
                                            >
                                                <option value="">Select Time Slot</option>
                                                {timeSlots.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <FormField label="Event Location / Venue Address" icon={MapPin} error={errors.eventLocation?.message}>
                                            <input
                                                className={`form-input ${errors.eventLocation ? "input-error" : ""}`}
                                                placeholder="e.g. Hotel Marriott, Indore / Home address"
                                                {...register("eventLocation", { required: "Event venue/location is required" })}
                                            />
                                        </FormField>

                                        <FormField label="Additional Requirements" icon={MessageSquare}>
                                            <textarea
                                                className="form-input form-textarea"
                                                placeholder="Any specific design preferences, number of hands, portrait motifs, etc."
                                                rows={3}
                                                {...register("requirements")}
                                            />
                                        </FormField>
                                    </div>
                                </motion.div>
                            )}

                            {/* ===== STEP 3: REVIEW & SUBMIT ===== */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={pageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="form-step"
                                >
                                    <h3 className="step-heading">Review Your Booking</h3>

                                    <div className="review-grid">
                                        <ReviewItem label="Name" value={getValues("fullName")} />
                                        <ReviewItem label="Email" value={getValues("email")} />
                                        <ReviewItem label="Phone" value={getValues("phone")} />
                                        <ReviewItem label="Event Type" value={getValues("eventType")} />
                                        <ReviewItem label="Service" value={getValues("service")} />
                                        <ReviewItem label="Event Date" value={getValues("eventDate")} />
                                        <ReviewItem label="Time" value={getValues("preferredTime")} />
                                        <ReviewItem label="Location" value={getValues("eventLocation")} />
                                        {getValues("requirements") && (
                                            <ReviewItem label="Requirements" value={getValues("requirements")} />
                                        )}
                                    </div>

                                    {/* WhatsApp mode info */}
                                    {whatsappMode && (
                                        <motion.div
                                            className="wa-info-box"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <div>
                                                <strong>WhatsApp Order:</strong> Clicking "Send on WhatsApp" will record the booking in our database and open WhatsApp with your booking details pre-filled.
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="form-nav">
                            {step > 1 && (
                                <motion.button
                                    type="button"
                                    className="btn-back"
                                    onClick={prevStep}
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <ChevronLeft size={16} /> Back
                                </motion.button>
                            )}

                            {step < 3 ? (
                                <motion.button
                                    type="button"
                                    className="btn-next"
                                    onClick={nextStep}
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Next Step <ChevronRight size={16} />
                                </motion.button>
                            ) : (
                                <>
                                    {submitError && (
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            background: "rgba(220, 53, 69, 0.1)",
                                            color: "#dc3545",
                                            padding: "0.6rem 0.8rem",
                                            borderRadius: "6px",
                                            fontSize: "0.85rem",
                                            width: "100%",
                                            marginBottom: "0.5rem"
                                        }}>
                                            <AlertCircle size={16} />
                                            <span>{submitError}</span>
                                        </div>
                                    )}
                                    <motion.button
                                        type="submit"
                                        className="btn-submit btn-submit-wa"
                                        disabled={submitting}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {submitting ? (
                                            "Saving Booking to Database..."
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Confirm Booking & Send on WhatsApp
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </form>
                </motion.div>
                )}

                {/* Side Info */}
                <motion.div
                    className="booking-info-side"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="info-card">
                        <h4>📞 Direct Contact</h4>
                        <p>Prefer to talk? Call or WhatsApp us directly:</p>
                        {isLoggedIn ? (
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20want%20to%20book%20Mehndi.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wa-direct-btn"
                            >
                                💬 WhatsApp Now
                            </a>
                        ) : (
                            <Link to="/login" state={{ from: "/booking" }} className="wa-direct-btn">
                                🔒 Sign In to WhatsApp
                            </Link>
                        )}
                        <a href="tel:+919244836867" className="call-btn">
                            📱 Call Us
                        </a>
                    </div>

                    <div className="info-card">
                        <h4>✨ What to Expect</h4>
                        <ul className="info-list">
                            <li>✅ Booking confirmation within 24 hrs</li>
                            <li>✅ Design consultation call</li>
                            <li>✅ Natural, skin-safe Mehndi</li>
                            <li>✅ On-time service</li>
                            <li>✅ Beautiful results guaranteed</li>
                        </ul>
                    </div>

                    <div className="info-card highlight-card">
                        <h4>💍 Bridal Special</h4>
                        <p>Book early for wedding season! Premium bridal packages available. Contact for custom pricing.</p>
                        {isLoggedIn ? (
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Kaju!%20I%20want%20to%20enquire%20about%20bridal%20Mehndi%20package.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bridal-wa-btn"
                            >
                                Inquire Bridal Package →
                            </a>
                        ) : (
                            <Link to="/login" state={{ from: "/booking" }} className="bridal-wa-btn">
                                🔒 Sign In to Inquire
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

/* Review item helper */
const ReviewItem = ({ label, value }) => (
    <div className="review-item">
        <span className="review-label">{label}</span>
        <span className="review-value">{value || "—"}</span>
    </div>
);

export default Booking;
