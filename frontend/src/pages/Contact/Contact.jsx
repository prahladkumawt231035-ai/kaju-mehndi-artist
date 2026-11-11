import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../../api/axios";
import "./Contact.css";

const Contact = () => {
    const [formSent, setFormSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");
        try {
            await API.post("/enquiries", formData);
            setFormSent(true);
        } catch (error) {
            setSubmitError(
                error.response?.data?.message ||
                "Failed to send enquiry to database. You can also chat with us directly on WhatsApp."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const waDirectMsg = encodeURIComponent(
        `🌸 *Hello Kaju!* 🌸\n` +
        `Name: ${formData.name || "Customer"}\n` +
        `Subject: ${formData.subject}\n` +
        `Message: ${formData.message || "I would like to inquire about Mehndi services."}\n\n` +
        `Looking forward to hearing from you!`
    );

    return (
        <div className="contact-page">
            {/* Header */}
            <div className="contact-hero">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="contact-tag">✦ CONNECT WITH US ✦</span>
                    <h1>Get In Touch</h1>
                    <p>Have questions about bridal booking or academy classes? We’re always here to help.</p>
                </motion.div>
            </div>

            <div className="contact-main-container">
                <div className="contact-grid">
                    {/* Left: Info Cards */}
                    <motion.div
                        className="contact-info-col"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* WhatsApp Direct Highlight Box */}
                        <div className="contact-wa-card">
                            <div className="wa-icon-circle">
                                <MessageCircle size={28} />
                            </div>
                            <div>
                                <h3>Instant WhatsApp Chat</h3>
                                <p>Get fast replies for bridal dates, price estimates & course admissions.</p>
                                <a
                                    href="https://wa.me/919244836867?text=Hi%20Kaju!%20I%20have%20an%20inquiry."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wa-card-btn"
                                >
                                    Chat with Kaju on WhatsApp →
                                </a>
                            </div>
                        </div>

                        {/* Standard Contact Cards */}
                        <div className="contact-details-box">
                            <div className="contact-row">
                                <div className="c-icon"><Phone size={18} /></div>
                                <div>
                                    <label>Phone / Call</label>
                                    <a href="tel:+919244836867">+91 9244836867</a>
                                </div>
                            </div>

                            <div className="contact-row">
                                <div className="c-icon"><Mail size={18} /></div>
                                <div>
                                    <label>Email Address</label>
                                    <a href="mailto:kajal.kumawat.mehndi@gmail.com">kajal.kumawat.mehndi@gmail.com</a>
                                </div>
                            </div>

                            <div className="contact-row">
                                <div className="c-icon"><MapPin size={18} /></div>
                                <div>
                                    <label>Studio Location</label>
                                    <span>Kaju Mehndi Studio, Bicholi Mardana , Near Indore Bypass Rd</span>
                                </div>
                            </div>

                            <div className="contact-row">
                                <div className="c-icon"><Clock size={18} /></div>
                                <div>
                                    <label>Working Hours</label>
                                    <span>Monday - Sunday: 9:00 AM - 8:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        className="contact-form-col"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="contact-form-box">
                            <h2>Send Us a Message</h2>
                            <p className="form-subtext">Fill in the form and our team will get back to you within 24 hours.</p>

                            {formSent ? (
                                <div className="form-sent-success">
                                    <CheckCircle2 size={40} color="#25D366" />
                                    <h3>Thank You!</h3>
                                    <p>Your message has been received. We will contact you shortly.</p>
                                    <div style={{ marginTop: "16px" }}>
                                        <a
                                            href={`https://wa.me/919244836867?text=${waDirectMsg}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="wa-card-btn"
                                        >
                                            Send Also on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="c-form">
                                    <div className="c-field">
                                        <label>Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Priya Sharma"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="c-row">
                                        <div className="c-field">
                                            <label>Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="priya@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="c-field">
                                            <label>Mobile Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="c-field">
                                        <label>Subject</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        >
                                            <option value="Bridal Booking">Bridal Booking Inquiry</option>
                                            <option value="Academy Course">Academy Course Inquiry</option>
                                            <option value="Event Package">Event / Party Mehndi</option>
                                            <option value="Custom Order">Custom Design Request</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="c-field">
                                        <label>Your Message / Date / Event Location *</label>
                                        <textarea
                                            rows={4}
                                            required
                                            placeholder="Please share your wedding/event date, requirements, or any specific questions..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    {submitError && (
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            color: "#dc3545",
                                            fontSize: "0.85rem",
                                            marginBottom: "0.8rem"
                                        }}>
                                            <AlertCircle size={16} />
                                            <span>{submitError}</span>
                                        </div>
                                    )}

                                    <button type="submit" className="c-submit-btn" disabled={submitting}>
                                        <Send size={15} />
                                        {submitting ? "Submitting to Database..." : "Submit Message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
