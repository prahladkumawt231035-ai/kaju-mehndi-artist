import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, MessageSquare, Plus, Sparkles, Star, CheckCircle2, Send } from "lucide-react";
import API from "../../api/axios";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [serviceName, setServiceName] = useState("Bridal Mehndi");
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewError, setReviewError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await API.get("/bookings/my-bookings");
                if (data.bookings && Array.isArray(data.bookings)) {
                    setBookings(data.bookings);
                } else {
                    setBookings([]);
                }
            } catch (error) {
                console.warn("Could not fetch my bookings from API:", error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError("");
        if (!comment.trim() || comment.trim().length < 6) {
            setReviewError("Please write at least 6 characters in your feedback.");
            return;
        }

        setSubmittingReview(true);
        try {
            await API.post("/reviews", {
                type: "service",
                serviceName,
                rating,
                comment: comment.trim(),
            });
            setReviewSuccess(true);
            setComment("");
            setTimeout(() => setReviewSuccess(false), 5000);
        } catch (err) {
            setReviewError(err.response?.data?.message || "Could not submit review. Please try again.");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="customer-page">
            <div className="customer-hero">
                <span className="customer-tag">✦ CLIENT ACCOUNT ✦</span>
                <h1>My Mehndi Portal</h1>
                <p>Track your appointments, advance receipts, and event schedules with Kaju.</p>
            </div>

            <div className="customer-container">
                {/* Stats Summary */}
                <div className="customer-stats">
                    <div className="c-stat-card">
                        <span>Total Bookings</span>
                        <strong>{bookings.length}</strong>
                    </div>
                    <div className="c-stat-card">
                        <span>Upcoming Events</span>
                        <strong>{bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").length} Events</strong>
                    </div>
                    <div className="c-stat-card">
                        <span>Account Status</span>
                        <strong style={{ color: "#25D366" }}>Verified Client</strong>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="customer-card-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h2 style={{ margin: 0 }}>My Bookings & Appointments</h2>
                        <Link
                            to="/booking"
                            className="primary-btn"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.55rem 1rem",
                                fontSize: "0.85rem",
                                textDecoration: "none"
                            }}
                        >
                            <Plus size={14} /> Book New Mehndi
                        </Link>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: "center", padding: "2rem", color: "#70452C" }}>
                            Loading your appointments from database...
                        </p>
                    ) : bookings.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "3rem 1.5rem",
                            background: "#F4EBDD",
                            borderRadius: "14px",
                            border: "1.5px dashed #B89A70",
                            margin: "1rem 0"
                        }}>
                            <Calendar size={44} color="#B89A70" style={{ marginBottom: "12px", opacity: 0.85 }} />
                            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#3D2117", margin: "0 0 8px", fontSize: "1.2rem" }}>
                                Abhi koi booking nahi hai
                            </h3>
                            <p style={{ color: "#70452C", fontSize: "0.9rem", maxWidth: "440px", margin: "0 auto 20px", lineHeight: "1.6" }}>
                                Aapne abhi tak koi Mehndi appointment schedule nahi ki hai. Nayi booking ke liye niche diye gaye button par click karein.
                            </p>
                            <Link
                                to="/booking"
                                className="primary-btn"
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "50px",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <Plus size={16} /> Book Your First Mehndi →
                            </Link>
                        </div>
                    ) : (
                        <div className="customer-bookings-list">
                            {bookings.map((b) => {
                                const formattedDate = new Date(b.eventDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                });
                                const waChatMsg = encodeURIComponent(
                                    `Hi Kaju! I am inquiring about my booking #${b._id || b.id} scheduled for ${formattedDate}.`
                                );

                                return (
                                    <motion.div
                                        key={b._id || b.id}
                                        className="customer-booking-card"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="cb-header">
                                            <div>
                                                <span className="cb-id">Booking #{b._id || b.id}</span>
                                                <h3>{b.service}</h3>
                                            </div>
                                            <span className={`status-badge status-${b.status}`}>
                                                {b.status}
                                            </span>
                                        </div>

                                        <div className="cb-details">
                                            <div className="cb-item">
                                                <Calendar size={15} color="#B89A70" />
                                                <span>Date: <strong>{formattedDate}</strong></span>
                                            </div>
                                            <div className="cb-item">
                                                <Clock size={15} color="#B89A70" />
                                                <span>Time: <strong>{b.preferredTime || b.time}</strong></span>
                                            </div>
                                            <div className="cb-item">
                                                <MapPin size={15} color="#B89A70" />
                                                <span>Location: <strong>{b.eventLocation || b.location}</strong></span>
                                            </div>
                                        </div>

                                        <div className="cb-footer">
                                            <div className="cb-payment-info">
                                                <span>Advance Payment: </span>
                                                {b.advancePaid ? (
                                                    <strong style={{ color: "#128C7E" }}>
                                                        ✓ Paid {b.totalAmount ? `(₹${b.totalAmount})` : ""}
                                                    </strong>
                                                ) : (
                                                    <strong style={{ color: "#e67e22" }}>Pending Advance</strong>
                                                )}
                                            </div>

                                            <a
                                                href={`https://wa.me/919244836867?text=${waChatMsg}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cb-wa-chat"
                                            >
                                                <MessageSquare size={14} />
                                                Chat with Kaju on WhatsApp
                                            </a>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Share Experience / Write a Review Section */}
                <div className="customer-card-box" style={{ marginTop: "2rem" }}>
                    <div style={{ marginBottom: "1.2rem" }}>
                        <span style={{ fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", color: "#B89A70", fontWeight: 700 }}>
                            ✦ CLIENT FEEDBACK ✦
                        </span>
                        <h2 style={{ margin: "4px 0 6px", fontFamily: "'Playfair Display', serif", color: "#3D2117" }}>
                            Rate Your Experience with Kaju
                        </h2>
                        <p style={{ color: "#70452C", fontSize: "0.9rem", margin: 0 }}>
                            Aapka anubhav hamare liye bohot keemti hai. Aapka review website ke home page par display hoga!
                        </p>
                    </div>

                    {reviewSuccess && (
                        <div style={{
                            padding: "12px 18px",
                            background: "#D4EDDA",
                            color: "#155724",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "16px",
                            fontWeight: 600,
                            fontSize: "0.9rem"
                        }}>
                            <CheckCircle2 size={18} />
                            Dhanyawaad! Aapka review safaltapoorvak submit ho gaya hai aur website par live ho gaya hai.
                        </div>
                    )}

                    {reviewError && (
                        <div style={{
                            padding: "12px 18px",
                            background: "#F8D7DA",
                            color: "#721C24",
                            borderRadius: "10px",
                            marginBottom: "16px",
                            fontSize: "0.9rem"
                        }}>
                            {reviewError}
                        </div>
                    )}

                    <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
                            {/* Star Rating Selection */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#3D2117", marginBottom: "6px" }}>
                                    Your Rating:
                                </label>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setRating(s)}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "2px",
                                                color: s <= rating ? "#F1C40F" : "#D1C7BD",
                                                fontSize: "1.5rem",
                                                lineHeight: 1
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span style={{ fontSize: "0.85rem", color: "#70452C", fontWeight: 700, alignSelf: "center", marginLeft: "6px" }}>
                                        {rating} of 5 Stars
                                    </span>
                                </div>
                            </div>

                            {/* Service Type Selection */}
                            <div style={{ minWidth: "220px" }}>
                                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#3D2117", marginBottom: "6px" }}>
                                    Mehndi Service:
                                </label>
                                <select
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1.5px solid #D8C4B6",
                                        background: "#FAF7F2",
                                        color: "#3D2117",
                                        fontSize: "0.9rem",
                                        fontWeight: 500,
                                        outline: "none"
                                    }}
                                >
                                    <option value="Royal Marwari Full-Hand Bridal">Royal Marwari Full-Hand Bridal</option>
                                    <option value="Bridal Mehndi">Bridal Mehndi</option>
                                    <option value="Engagement & Roka Mehndi">Engagement & Roka Mehndi</option>
                                    <option value="Modern Arabic Floral Trail">Modern Arabic Floral Trail</option>
                                    <option value="Baby Shower / Godh Bharai">Baby Shower / Godh Bharai</option>
                                    <option value="Festival & Family Mehndi">Festival & Family Mehndi</option>
                                </select>
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#3D2117", marginBottom: "6px" }}>
                                Share Your Review & Stain Feedback:
                            </label>
                            <textarea
                                rows={3}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="E.g. Kaju di ki design bohot sundar thi, stain bohot dark aaya aur unki speed bhi bohot acchi thi..."
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    border: "1.5px solid #D8C4B6",
                                    background: "#FAF7F2",
                                    color: "#3D2117",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    resize: "vertical",
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="primary-btn"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "9px 22px",
                                    borderRadius: "50px",
                                    fontSize: "0.9rem",
                                    cursor: submittingReview ? "not-allowed" : "pointer",
                                    opacity: submittingReview ? 0.7 : 1
                                }}
                            >
                                <Send size={15} />
                                {submittingReview ? "Submitting Review..." : "Submit Verified Review"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
